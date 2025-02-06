// app/api/send-email/route.js

export const runtime = 'edge'; // Specify that this route uses Edge runtime

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
  const { name, media, title, author, mediaLink, image } = await request.json();

  try {
    // Construct the email
    const msg = {
      to: 'requests@deepnorth.app',      // Recipient email
      from: 'requests@deepnorth.app',    // Sender email
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

    // Send email via SendGrid
    await sgMail.send(msg);

    // Return success response
    return new Response('Email sent successfully', { status: 200 });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response('Error sending email', { status: 500 });
  }
}