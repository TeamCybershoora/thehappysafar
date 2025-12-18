import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const requiredEnv = ["EMAIL_USER", "EMAIL_PASS"] as const;

function assertEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing email configuration for: ${missing.join(", ")}`);
  }
}

type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  selectedPackage?: string;
  source?: string;
};

const transporter = (() => {
  try {
    assertEnv();

    const host = process.env.EMAIL_SMTP_HOST || "smtp.gmail.com";
    const port = process.env.EMAIL_SMTP_PORT ? Number(process.env.EMAIL_SMTP_PORT) : 465;

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
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

  const toAddress = process.env.EMAIL_TO || "thehappysafar@gmail.com";

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Source:</strong> ${source ?? "unknown"}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone ?? "not provided"}</p>
        <p><strong>Selected package:</strong> ${selectedPackage ?? "not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ message: "Enquiry sent" });
  } catch (error) {
    console.error("Failed to send enquiry email", error);
    return NextResponse.json({ message: "Failed to send enquiry" }, { status: 500 });
  }
}
