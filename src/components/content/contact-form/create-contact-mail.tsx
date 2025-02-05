import type { ContactFormFields } from './contact-form';

export default function createContactMail(contactFormData: ContactFormFields, to: string) {
  return {
    to,
    from: `${contactFormData.name}<${contactFormData.email}>`,
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
                <h1 style="color: #333333;">${contactFormData.subject}</h1>
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
              <td style="padding-top: 20px;">${contactFormData.message}</td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
}
