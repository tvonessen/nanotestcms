import { addDataAndFileToRequest, type PayloadRequest } from 'payload';

export default async function validateCaptcha(req: PayloadRequest) {
  await addDataAndFileToRequest(req);

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const body = await req.json?.();
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${body.token}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to validate captcha');
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
