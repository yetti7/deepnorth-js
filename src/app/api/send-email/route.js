// app/api/send-email/route.js

export const runtime = "edge"; // Using Edge runtime

export async function POST(request) {
  const { name, media, title, author, mediaLink, image } = await request.json();

  // Prepare request data
  const requestData = {
    name,
    media,
    title,
    author,
    mediaLink,
    image,
  };

  // 1️⃣ Send the request to deepnorth-requests API (Database Storage)
  try {
    const dbResponse = await fetch("http://localhost:3001/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!dbResponse.ok) {
      console.error("Error storing request in deepnorth-requests:", await dbResponse.text());
      return new Response("Error saving request to database", { status: 500 });
    }
  } catch (error) {
    console.error("Failed to send request to deepnorth-requests:", error);
    return new Response("Error communicating with request management system", { status: 500 });
  }

  // 2️⃣ Send an email via SendGrid (Notification)
  const msg = {
    to: "requests@deepnorth.app", // Recipient email
    from: "requests@deepnorth.app", // Sender email
    subject: "New Request Submission",
    text: `Request from ${name}, Title: ${title}, Author: ${author}, Media: ${media}`,
    html: `
      <strong>New Request:</strong><br>
      Name: ${name}<br>
      Media: ${media}<br>
      Title: ${title}<br>
      Author: ${author}<br>
      Media Link: <a href="${mediaLink}" target="_blank">${mediaLink}</a><br>
      Image: ${image ? image : "No Image Provided"}
    `,
  };

  const sendGridAPI = "https://api.sendgrid.com/v3/mail/send";

  try {
    const emailResponse = await fetch(sendGridAPI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
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
          { type: "text/plain", value: msg.text },
          { type: "text/html", value: msg.html },
        ],
      }),
    });

    if (emailResponse.ok) {
      return new Response("Request submitted successfully", { status: 200 });
    } else {
      console.error("SendGrid API error:", await emailResponse.text());
      return new Response("Error sending email", { status: 500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Error sending email", { status: 500 });
  }
}