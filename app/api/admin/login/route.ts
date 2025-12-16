import { NextResponse } from "next/server";
import { fetchAdminRecord, ensureAdminDocument } from "@/app/lib/adminStore";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const password = typeof body?.password === "string" ? body.password : null;

    if (!password) {
      return NextResponse.json({ success: false, message: "Password is required." }, { status: 400 });
    }

    let admin = await fetchAdminRecord();
    if (!admin) {
      await ensureAdminDocument();
      admin = await fetchAdminRecord();
    }

    if (!admin || !admin.password) {
      return NextResponse.json(
        { success: false, message: "Admin credentials are not configured." },
        { status: 500 }
      );
    }

    if (password !== admin.password) {
      return NextResponse.json({ success: false, message: "Invalid password." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ success: false, message: "Unable to verify credentials." }, { status: 500 });
  }
}
