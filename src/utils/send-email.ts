import { addDataAndFileToRequest, type PayloadRequest, type SendEmailOptions } from 'payload';
import validateCaptcha from './validate-captcha';

const allowedOrigins = [
  'https://nanotest.eu',
  'https://www.nanotest.eu',
  'http://localhost:3301',
  'http://localhost:3000',
  'https://p-r7tphp.project.space',
];

function getClientIP(req: PayloadRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}

function validateOrigin(req: PayloadRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  const checkUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return allowedOrigins.some((allowed) => {
        try {
          const allowedUrl = new URL(allowed);
          return urlObj.hostname === allowedUrl.hostname;
        } catch {
          // If allowed is not a valid URL (e.g., localhost:3301), do string comparison
          return url.startsWith(allowed);
        }
      });
    } catch {
      return false;
    }
  };

  return checkUrl(origin) || checkUrl(referer);
}

export const sendEmailEndpoint = async (req: PayloadRequest): Promise<Response> => {
  try {
    await addDataAndFileToRequest(req);
    const body = await req.json?.();

    // Validate origin/referer
    if (!validateOrigin(req)) {
      const ip = getClientIP(req);
      console.warn(`Blocked email attempt from invalid origin. IP: ${ip}`);
      return new Response(JSON.stringify({ error: 'Invalid origin' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Validate captcha token
    const token = (body as { token?: string })?.token;
    if (!token) {
      const ip = getClientIP(req);
      console.warn(`Blocked email attempt: missing captcha token. IP: ${ip}`);
      return new Response(JSON.stringify({ error: 'Captcha token missing' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Validate the captcha token
    const captchaResponse = await validateCaptcha({
      ...req,
      data: { token },
    } as PayloadRequest);

    if (captchaResponse.status !== 200) {
      const ip = getClientIP(req);
      console.warn(`Blocked email attempt: captcha validation failed. IP: ${ip}`);
      return captchaResponse;
    }

    await req.payload.sendEmail(body as SendEmailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
