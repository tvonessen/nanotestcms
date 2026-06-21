import { addDataAndFileToRequest, type PayloadRequest, type SendEmailOptions } from 'payload';
import validateCaptcha from './validate-captcha';

function getClientIP(req: PayloadRequest): string {
  return (
    req.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers?.get('x-real-ip') ||
    req.headers?.get('cf-connecting-ip') ||
    'unknown'
  );
}

export const sendEmailEndpoint = async (req: PayloadRequest): Promise<Response> => {
  try {
    await addDataAndFileToRequest(req);
    const body = await req.json?.();

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
