import { NextResponse, type NextRequest } from "next/server";
import { listAdminRecords, upsertAdminByEmail } from "@/app/lib/adminStore";

const TOKEN_HEADER = "x-admin-token";

type ClientAdmin = {
  id?: string;
  name: string;
  email: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function authorize(request: NextRequest) {
  const seedToken = process.env.ADMIN_SEED_TOKEN;
  if (!seedToken) {
    return NextResponse.json(
      { success: false, message: "ADMIN_SEED_TOKEN is not configured on the server." },
      { status: 500 }
    );
  }

  const providedToken = request.headers.get(TOKEN_HEADER);
  if (!providedToken || providedToken !== seedToken) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  return null;
}

const toClientAdmin = (admin: { _id?: unknown; name: string; email: string; createdAt?: Date; updatedAt?: Date }): ClientAdmin => {
  const id = typeof admin._id === "object" && admin._id !== null && "toString" in admin._id ? String(admin._id) : undefined;

  return {
    id,
    name: admin.name,
    email: admin.email,
    createdAt: admin.createdAt ?? null,
    updatedAt: admin.updatedAt ?? null,
  };
};

export async function GET(request: NextRequest) {
  const authError = authorize(request);
  if (authError) return authError;

  try {
    const admins = await listAdminRecords();
    return NextResponse.json({ success: true, admins: admins.map(toClientAdmin) });
  } catch (error) {
    console.error("Admin records fetch error:", error);
    return NextResponse.json({ success: false, message: "Unable to load admin records." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = authorize(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const updated = await upsertAdminByEmail({ name, email, password });
    return NextResponse.json({ success: true, admin: updated ? toClientAdmin(updated) : null });
  } catch (error) {
    console.error("Admin record upsert error:", error);
    return NextResponse.json({ success: false, message: "Unable to save admin record." }, { status: 500 });
  }
}
