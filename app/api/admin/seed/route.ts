import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/mongodb";

export async function POST(request: Request) {
  try {
    const seedToken = process.env.ADMIN_SEED_TOKEN;
    if (!seedToken) {
      return NextResponse.json(
        { success: false, message: "ADMIN_SEED_TOKEN is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const providedToken = typeof body?.token === "string" ? body.token : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (providedToken !== seedToken) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const db = await getDb();

    await db.collection("admins").updateOne(
      {},
      {
        $set: {
          name,
          email,
          password,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Admin credentials saved.",
      admin: { name, email },
    });
  } catch (error) {
    console.error("Admin seed error:", error);
    return NextResponse.json({ success: false, message: "Unable to seed admin credentials." }, { status: 500 });
  }
}
