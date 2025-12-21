import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function assertEnv() {
  const hasUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const hasPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const missing: string[] = [];
  if (!hasUser) missing.push("SMTP_USER or EMAIL_USER");
  if (!hasPass) missing.push("SMTP_PASS or EMAIL_PASS");
  if (missing.length > 0) {
    throw new Error(`Missing email configuration for: ${missing.join(", ")}`);
  }
}

// Debug endpoint to verify mail configuration (does NOT expose secrets)
export async function GET() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_SMTP_HOST || "smtp.gmail.com";
  const port = process.env.SMTP_PORT
    ? Number(process.env.SMTP_PORT)
    : process.env.EMAIL_SMTP_PORT
    ? Number(process.env.EMAIL_SMTP_PORT)
    : 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;

  const userSet = Boolean(process.env.SMTP_USER || process.env.EMAIL_USER);
  const passSet = Boolean(process.env.SMTP_PASS || process.env.EMAIL_PASS);
  const fromAddress = (process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER) as string | undefined;
  const toAddress =
    process.env.TO_EMAIL || process.env.EMAIL_TO || (process.env.SMTP_USER || process.env.EMAIL_USER || undefined);
  const fromName = process.env.FROM_NAME || process.env.EMAIL_FROM_NAME || "The Happy Safar";

  let verified = false;
  let verifyError: string | undefined;
  try {
    if (transporter) {
      await transporter.verify();
      verified = true;
    }
  } catch (err) {
    verifyError = (err as Error).message;
  }

  return NextResponse.json({
    ok: Boolean(transporter),
    host,
    port,
    secure,
    userSet,
    passSet,
    fromAddressSet: Boolean(fromAddress),
    toAddressSet: Boolean(toAddress),
    fromName,
    verified,
    verifyError,
  });
}

type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  selectedPackage?: string;
  source?: string;
};

const CONCIERGE_NUMBER = "+919251147383";

const transporter = (() => {
  try {
    assertEnv();

    const host = process.env.SMTP_HOST || process.env.EMAIL_SMTP_HOST || "smtp.gmail.com";
    const port = process.env.SMTP_PORT
      ? Number(process.env.SMTP_PORT)
      : process.env.EMAIL_SMTP_PORT
      ? Number(process.env.EMAIL_SMTP_PORT)
      : 465;
    const secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  } catch (error) {
    console.error("Failed to initialise mail transporter", error);
    return null;
  }
})();

function validatePayload(payload: Partial<EnquiryPayload>): payload is EnquiryPayload {
  return Boolean(
    payload &&
      typeof payload.name === "string" &&
      payload.name.trim() !== "" &&
      typeof payload.email === "string" &&
      payload.email.trim() !== "" &&
      typeof payload.message === "string" &&
      payload.message.trim() !== ""
  );
}

export async function POST(request: NextRequest) {
  if (!transporter) {
    return NextResponse.json({ message: "Email transport not configured" }, { status: 500 });
  }

  let payload: Partial<EnquiryPayload>;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  if (!validatePayload(payload)) {
    return NextResponse.json({ message: "Missing required enquiry fields" }, { status: 400 });
  }

  const { name, email, phone, message, selectedPackage, source } = payload;
  const messageHtml = message.replace(/\n/g, "<br/>");
  const sanitizedPhoneHref = phone ? phone.replace(/[^+\d]/g, "") : null;

  const configuredRecipient = process.env.TO_EMAIL || process.env.EMAIL_TO;
  const fallbackRecipient = "thehappysafar@gmail.com";
  const transportUser = process.env.SMTP_USER || process.env.EMAIL_USER;

  const adminRecipients = [configuredRecipient, transportUser, fallbackRecipient]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.trim())
    .filter(Boolean);

  const uniqueAdminRecipients = Array.from(new Set(adminRecipients));

  const toAddress = uniqueAdminRecipients.length > 0 ? uniqueAdminRecipients : [fallbackRecipient];
  const fromAddress = (process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER) as string;
  const fromName = process.env.FROM_NAME || process.env.EMAIL_FROM_NAME || "The Happy Safar";

  try {
    const adminHtml = `
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0f172a;padding:32px 0;margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr>
          <td align="center">
            <table width="640" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 24px 60px rgba(15,23,42,0.25);">
              <tr>
                <td style="padding:14px 24px;background:#0b1220;border-bottom:1px solid rgba(248,250,252,0.08);">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                    <tr>
                      <td align="left" style="color:rgba(248,250,252,0.65);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;font-weight:600;">New enquiry alert</td>
                      <td align="right" style="color:#f97316;font-size:14px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">The Happy Safar</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 32px;background:linear-gradient(135deg,#0f172a 10%,#1e293b 70%,#0f172a 100%);color:#f8fafc;">
                  <p style="margin:0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#fbbf24;font-weight:600;">Source: ${source ?? "Unknown"}</p>
                  <h1 style="margin:18px 0 10px;font-size:28px;line-height:1.3;font-weight:700;color:#f8fafc;">New enquiry from ${name}</h1>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(248,250,252,0.78);">${selectedPackage ? `Interested in <strong style=\"color:#facc15;\">${selectedPackage}</strong>.` : "Package not specified."}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 32px;background:#ffffff;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:22px;border:1px solid rgba(15,23,42,0.08);border-radius:18px;background:linear-gradient(135deg,rgba(255,247,237,0.95),rgba(255,255,255,0.98));">
                        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;font-size:14px;color:#1f2937;">
                          <tr>
                            <td style="padding:0 0 12px;font-weight:600;color:#0f172a;">Name</td>
                            <td style="padding:0 0 12px;color:#475569;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 12px;font-weight:600;color:#0f172a;">Email</td>
                            <td style="padding:0 0 12px;color:#475569;"><a href="mailto:${email}" style="color:#0f172a;font-weight:600;text-decoration:none;">${email}</a></td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 12px;font-weight:600;color:#0f172a;">Phone</td>
                            <td style="padding:0 0 12px;color:#475569;">${phone ?? "Not provided"}</td>
                          </tr>
                          <tr>
                            <td style="padding:0 0 12px;font-weight:600;color:#0f172a;">Package</td>
                            <td style="padding:0 0 12px;color:#475569;">${selectedPackage ?? "Not specified"}</td>
                          </tr>
                          <tr>
                            <td style="padding:16px 0 6px;font-weight:600;color:#0f172a;vertical-align:top;">Message</td>
                            <td style="padding:16px 0 6px;color:#475569;line-height:1.7;">${messageHtml}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 32px 32px;background:#ffffff;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td>
                        <a href="mailto:${email}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:linear-gradient(135deg,#f97316,#fb923c);color:#ffffff;font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Reply to client</a>
                      </td>
                      <td style="width:16px;">&nbsp;</td>
                      <td>
                        <a href="${sanitizedPhoneHref ? `tel:${sanitizedPhoneHref}` : `tel:${CONCIERGE_NUMBER}`}" style="display:inline-block;padding:12px 24px;border-radius:999px;border:1px solid rgba(15,23,42,0.2);color:#0f172a;font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">${sanitizedPhoneHref ? "Call customer" : "Call concierge"}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 28px;background:#0f172a;color:rgba(248,250,252,0.72);font-size:12px;letter-spacing:0.16em;text-transform:uppercase;text-align:center;">The Happy Safar CRM Snapshot</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    // 1) Send the enquiry to the business inbox
    await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: toAddress,
      subject: `New enquiry from ${name}${selectedPackage ? ` • ${selectedPackage}` : ""}`,
      replyTo: email,
      text: `Source: ${source ?? "unknown"}
Name: ${name}
Email: ${email}
Phone: ${phone ?? "not provided"}
Package: ${selectedPackage ?? "not specified"}

Message:
${message.trim()}
`,
      html: adminHtml,
    });

    // 2) Send an acknowledgement to the customer (best-effort)
    try {
      const ackHtml = `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0f172a;padding:32px 0;margin:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 28px 60px rgba(15,23,42,0.22);">
                <tr>
                  <td style="padding:14px 24px;background:#0b1220;border-bottom:1px solid rgba(248,250,252,0.08);">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                      <tr>
                        <td align="left" style="color:rgba(248,250,252,0.65);font-size:11px;letter-spacing:0.28em;text-transform:uppercase;font-weight:600;">Bespoke Rajasthan Journeys</td>
                        <td align="right" style="color:#f97316;font-size:14px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">The Happy Safar</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;background:linear-gradient(135deg,#0f172a 15%,#1e293b 65%,#0f172a 100%);color:#f8fafc;">
                    <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#f97316;font-weight:600;">The Happy Safar</p>
                    <h1 style="margin:16px 0 8px;font-size:26px;line-height:1.3;font-weight:700;color:#f8fafc;">Thank you for your enquiry</h1>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(248,250,252,0.78);">Hi ${name},<br/>We’re excited to start planning your Rajasthan escape. Our concierge team will review your wishlist and get back to you very soon.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 32px 8px;background:#ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding:16px 20px;border:1px solid rgba(249,115,22,0.18);border-radius:16px;background:linear-gradient(135deg,rgba(255,247,237,0.9),rgba(255,255,255,0.95));">
                          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#f97316;font-weight:700;">Enquiry summary</p>
                          ${selectedPackage ? `<p style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0f172a;">Package: <span style="font-weight:700;color:#1f2937;">${selectedPackage}</span></p>` : ""}
                          ${phone ? `<p style=\"margin:0 0 10px;font-size:14px;color:#475569;\">Phone: <span style=\"font-weight:600;color:#0f172a;\">${phone}</span></p>` : ""}
                          <div style="margin-top:16px;">
                            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#1f2937;">Your message</p>
                            <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">${messageHtml}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 32px 32px;background:#ffffff;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding:20px;border:1px solid rgba(15,23,42,0.08);border-radius:16px;background:#f8fafc;">
                          <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#0f172a;">What happens next?</p>
                          <ul style="margin:0 0 16px;padding-left:18px;color:#475569;font-size:14px;line-height:1.7;">
                            <li>Our planners fine-tune the perfect route and experiences for your crew.</li>
                            <li>We’ll share upgrades, hotel ideas, and logistics that match your vibe.</li>
                            <li>Ready for revisions? Just reply to this email or call us anytime.</li>
                          </ul>
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <a href="tel:${CONCIERGE_NUMBER}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:linear-gradient(135deg,#f97316,#fb923c);color:#ffffff;font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Call our planners</a>
                              </td>
                              <td style="width:16px;">&nbsp;</td>
                              <td>
                                <a href="mailto:info@thehappysafar.com" style="display:inline-block;padding:12px 24px;border-radius:999px;border:1px solid rgba(15,23,42,0.2);color:#0f172a;font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Reply by email</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px;background:#0f172a;color:rgba(248,250,252,0.72);font-size:12px;line-height:1.6;text-align:center;">
                    <p style="margin:0;color:rgba(248,250,252,0.8);">The Happy Safar &bull; Bespoke Rajasthan Journeys</p>
                    <div style="margin:14px 0 0;">
                      <a href="https://wa.me/919251147383" style="display:inline-block;padding:12px 24px;border-radius:999px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#ffffff;font-weight:600;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;">Chat on WhatsApp</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;

      const thanksLines = [
        `Hi ${name},`,
        "Thank you for your enquiry to The Happy Safar.",
        "Our planners will review your request and get back to you very soon.",
        selectedPackage ? `Package: ${selectedPackage}` : undefined,
        phone ? `Phone: ${phone}` : undefined,
        "Your message:",
        message.trim(),
        "— The Happy Safar Concierge",
      ]
        .filter(Boolean)
        .join("\n");

      await transporter.sendMail({
        from: `${fromName} <${fromAddress}>`,
        to: email,
        subject: "Thanks for your enquiry — The Happy Safar",
        text: thanksLines,
        html: ackHtml,
      });
    } catch (ackError) {
      console.warn("Failed to send acknowledgement email", ackError);
      // Do not fail the request if ack mail fails
    }

    return NextResponse.json({ message: "Enquiry sent" });
  } catch (error) {
    console.error("Failed to send enquiry email", error);
    return NextResponse.json({ message: "Failed to send enquiry" }, { status: 500 });
  }
}
