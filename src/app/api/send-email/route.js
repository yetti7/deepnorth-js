import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, media, title, author, mediaLink } = await request.json();

    if (!name || !media || !title || !mediaLink) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1️⃣ Store Request in deepnorth-requests
    const dbResponse = await fetch("http://localhost:3001/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, media, title, author, mediaLink }),
    });

    if (!dbResponse.ok) {
      console.error("Error storing request in deepnorth-requests:", await dbResponse.text());
      return new Response(JSON.stringify({ error: "Error saving request to database" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Send Email Notification
    const msg = {
      to: "requests@deepnorth.app",
      from: "requests@deepnorth.app",
      subject: `New Request Submission - ${title}`,
      html: `
        <strong>New Request:</strong><br>
        Name: ${name}<br>
        Media: ${media}<br>
        Title: ${title}<br>
        Author: ${author || "N/A"}<br>
        Media Link: <a href="${mediaLink}" target="_blank">${mediaLink}</a>
      `,
    };

    await sgMail.send(msg);
    return new Response(JSON.stringify({ message: "Request submitted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("SendGrid API error:", error);
    return new Response(JSON.stringify({ error: "Error sending email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
