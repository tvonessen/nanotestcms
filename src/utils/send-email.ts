import { addDataAndFileToRequest, type PayloadRequest, type SendEmailOptions } from 'payload';

export const sendEmailEndpoint = async (req: PayloadRequest): Promise<Response> => {
  try {
    await addDataAndFileToRequest(req);
    const body = await req.json?.();

    await req.payload.sendEmail(body as SendEmailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
