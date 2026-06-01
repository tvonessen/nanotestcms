import { addDataAndFileToRequest, type PayloadRequest } from 'payload';

export default async function validateCaptcha(req: PayloadRequest) {
  await addDataAndFileToRequest(req);

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const token = (req.data as { token?: string })?.token;

  if (!token) {
    return new Response(JSON.stringify({ error: 'No captcha token provided' }), { status: 400 });
  }

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();

    if (!data.success) {
      return new Response(JSON.stringify({ error: 'Captcha validation failed', codes: data['error-codes'] }), {
        status: 403,
      });
    }

    return new Response(JSON.stringify({ message: 'Captcha validated successfully' }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to validate captcha' }), {
      status: 500,
    });
  }
}
