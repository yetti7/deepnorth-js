// app/api/send-email/route.js

export const runtime = 'edge'; // Specify that this route uses Edge runtime

export async function POST(request) {
  const { name, media, title, author, mediaLink, image } = await request.json();

  const msg = {
    to: 'requests@deepnorth.app', // Recipient email
    from: 'requests@deepnorth.app', // Sender email
    subject: 'New Request Submission',
    text: `Request from ${name}, Title: ${title}, Author: ${author}, Media: ${media}`,
    html: `
      <strong>Details:</strong><br>
      Name: ${name}<br>
      Media: ${media}<br>
      Title: ${title}<br>
      Author: ${author}<br>
      Media Link: ${mediaLink}<br>
      Image: ${image}
    `,
  };

  const sendGridAPI = 'https://api.sendgrid.com/v3/mail/send';

  try {
    const response = await fetch(sendGridAPI, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: msg.to }],
            subject: msg.subject,
          },
        ],
        from: { email: msg.from },
        content: [
          { type: 'text/plain', value: msg.text },
          { type: 'text/html', value: msg.html },
        ],
      }),
    });

    if (response.ok) {
      return new Response('Email sent successfully', { status: 200 });
    } else {
      console.error('SendGrid API error:', await response.text());
      return new Response('Error sending email', { status: 500 });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response('Error sending email', { status: 500 });
  }
}