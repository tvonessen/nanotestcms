import { addDataAndFileToRequest, type PayloadRequest } from 'payload';

const RECAPTCHA_SCORE_THRESHOLD = 0.5;

function getClientIP(req: PayloadRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

export default async function validateCaptcha(req: PayloadRequest) {
  await addDataAndFileToRequest(req);

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const token = (req.data as { token?: string })?.token;

  // Validate that secret key is configured
  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not configured!');
    return new Response(
      JSON.stringify({ error: 'Server misconfiguration: reCAPTCHA not configured' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  if (!token) {
    const ip = getClientIP(req);
    console.warn(`Blocked captcha validation: missing token. IP: ${ip}`);
    return new Response(JSON.stringify({ error: 'No captcha token provided' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      const ip = getClientIP(req);
      console.warn(`reCAPTCHA validation failed for token ${token.substring(0, 8)}...`, {
        errorCodes: data['error-codes'],
        score: data.score,
        ip,
      });
      return new Response(
        JSON.stringify({ error: 'Captcha validation failed', codes: data['error-codes'] }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Validate the score threshold
    const score = data.score;
    if (score === undefined || score < RECAPTCHA_SCORE_THRESHOLD) {
      const ip = getClientIP(req);
      console.warn(`reCAPTCHA score too low: ${score}. IP: ${ip}`);
      return new Response(JSON.stringify({ error: 'Captcha score too low', score }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ message: 'Captcha validated successfully', score }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to validate captcha:', error);
    return new Response(JSON.stringify({ error: 'Failed to validate captcha' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
