import type { ContactFormFields } from './contact-form';

export default function createContactMail({
  contactFormData,
  to,
  bcc,
  siteUrl,
}: { contactFormData: ContactFormFields; to: string; bcc?: string; siteUrl?: string }) {
  return {
    to: to,
    bcc: bcc,
    from: 'Nanotest Contact Form <do-not-reply@nanotest.eu>',
    subject: contactFormData.subject,
    html: `
      <html>
        <body style="margin:0; padding:0;">
          <table
            width="100%"
            cellpadding="20"
            style="max-width:600px;margin:auto;font-family:Arial,sans-serif;border:1px solid #ddd;"
          >
            <tr>
              <td>
                <h3 style="color: #00a984;">Contact Form Submission</h3><br />
                ${siteUrl ? `<h5>From: <code>${siteUrl}</code></h5>` : ''}
              </td>
            </tr>
            <tr>
              <td>
                <table cellpadding="5" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td width="30%" style="font-weight: bold;">Company:</td>
                    <td>${contactFormData.company}</td>
                  </tr>
                  <tr>
                    <td width="30%" style="font-weight: bold;">Name:</td>
                    <td>${contactFormData.name}</td>
                  </tr>
                  <tr>
                    <td width="30%" style="font-weight: bold;">Email:</td>
                    <td>${contactFormData.email}</td>
                  </tr>
                  <tr>
                    <td width="30%" style="font-weight: bold;">Phone:</td>
                    <td>${contactFormData.phone}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px;">
                <h3><b>Subject: </b> <span style="font-weight: normal;">${contactFormData.subject}</span></h3>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px;">
                <b>Message:</b><br />
                <p>${contactFormData.message}</p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
}
