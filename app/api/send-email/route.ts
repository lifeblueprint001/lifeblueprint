import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      birthDate,
      birthTime,
      birthPlace,
      report,
    } = body;

    console.log("SEND-EMAIL BODY:", {
      fullName,
      email,
      birthDate,
      birthTime,
      birthPlace,
      hasReport: !!report,
    });

    const adminResult = await resend.emails.send({
      from: "Life Blueprint <onboarding@resend.dev>",
      to: ["lifeblueprint001@gmail.com"],
      subject: "New Life Blueprint submission",
      html: `
        <h1>New submission</h1>
        <p><strong>Full name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date of birth:</strong> ${birthDate}</p>
        <p><strong>Time of birth:</strong> ${birthTime}</p>
        <p><strong>Place of birth:</strong> ${birthPlace}</p>
      `,
    });

    console.log("ADMIN EMAIL RESULT:", adminResult);

    let userResult = null;

    if (report) {
      userResult = await resend.emails.send({
        from: "Life Blueprint <onboarding@resend.dev>",
        to: [email],
        subject: "Your Life Blueprint Report",
        html: `
          <h1>Your Life Blueprint Report</h1>
          <p>Hi ${fullName},</p>
          <p>Your personalized report is ready:</p>
          <div style="white-space: pre-wrap; line-height: 1.6;">
            ${report}
          </div>
          <p style="margin-top:20px;">Thank you for your trust.</p>
        `,
      });

      console.log("USER EMAIL RESULT:", userResult);
    }

    return Response.json({
      success: true,
      adminResult,
      userResult,
    });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}