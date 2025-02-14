export const runtime = 'edge'; // Use Edge runtime

export async function POST(request) {
  const requestData = await request.json();

  // ✅ Step 1: Check if this is a status update
  if (requestData.id && requestData.status) {
    try {
      const statusToUpdate = requestData.status.trim() !== "" ? requestData.status : "Pending"; // Default to Pending
      const updateResponse = await fetch("https://api.deepnorth.app/api/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestData.id, status: statusToUpdate }),
      });
  
      if (!updateResponse.ok) {
        console.error("Error updating status:", await updateResponse.text());
        return new Response(JSON.stringify({ error: "Failed to update request status" }), { status: 500 });
      }
  
      return new Response(JSON.stringify({ message: "Request status updated successfully" }), { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      });
  
    } catch (error) {
      console.error("Error updating request status:", error);
      return new Response(JSON.stringify({ error: "Database error while updating status" }), { status: 500 });
    }
  }

  // ✅ Step 2: Handle new request submissions (Existing logic)
  const { name, media, title, author, mediaLink } = requestData;

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