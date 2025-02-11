export const runtime = 'edge'; // Use Edge runtime

export async function POST(request) {
  const { name, media, title, author, mediaLink } = await request.json();

  if (!name || !media || !title || !mediaLink) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 1️⃣ Store the Request in deepnorth-requests
  try {
    const dbResponse = await fetch("https://api.deepnorth.app/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, media, title, author, mediaLink }),
    });

    if (!dbResponse.ok) {
      console.error("Error saving request to database:", await dbResponse.text());
      return new Response(JSON.stringify({ error: "Error saving request to database" }), { 
        status: 500 
      });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return new Response(JSON.stringify({ error: "Error connecting to database" }), { 
      status: 500 
    });
  }

  // 2️⃣ Prepare SendGrid Email
  const msg = {
    to: 'requests@deepnorth.app',
    from: 'requests@deepnorth.app',
    subject: 'New Request Submission',
    text: `Request from ${name}, Title: ${title}, Author: ${author || "N/A"}, Media: ${media}`,
    html: `
      <strong>Details:</strong><br>
      Name: ${name}<br>
      Media: ${media}<br>
      Title: ${title}<br>
      Author: ${author || "N/A"}<br>
      Media Link: <a href="${mediaLink}" target="_blank">${mediaLink}</a>
    `,
  };

  const sendGridAPI = 'https://api.sendgrid.com/v3/mail/send';

  // 3️⃣ Send the Email via SendGrid
  try {
    const emailResponse = await fetch(sendGridAPI, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          { to: [{ email: msg.to }], subject: msg.subject }
        ],
        from: { email: msg.from },
        content: [
          { type: 'text/plain', value: msg.text },
          { type: 'text/html', value: msg.html }
        ],
      }),
    });

    if (!emailResponse.ok) {
      console.error('SendGrid API error:', await emailResponse.text());
      return new Response(JSON.stringify({ error: "Error sending email" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Request saved and email sent successfully" }), { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (emailError) {
    console.error('Error sending email:', emailError);
    return new Response(JSON.stringify({ error: "Error sending email" }), { status: 500 });
  }
}
