import { type ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { DEFAULT_ADMIN } from "./defaultAdmin";

export type AdminRecord = {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const collectionName = "admins";

export type PublicAdminRecord = Omit<AdminRecord, "password">;

export async function ensureAdminDocument() {
  const db = await getDb();
  const admin = (await db.collection<AdminRecord>(collectionName).findOne({})) as AdminRecord | null;
  if (admin) {
    return admin;
  }

  const defaultRecord: AdminRecord = {
    name: DEFAULT_ADMIN.name,
    email: DEFAULT_ADMIN.email,
    password: DEFAULT_ADMIN.password,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const insertResult = await db.collection<AdminRecord>(collectionName).insertOne(defaultRecord);
  return {
    ...defaultRecord,
    _id: insertResult.insertedId,
  };
}

export async function upsertAdminRecord(record: { name: string; email: string; password: string }) {
  const db = await getDb();
  await db.collection<AdminRecord>(collectionName).updateOne(
    {},
    {
      $set: {
        name: record.name,
        email: record.email.toLowerCase(),
        password: record.password,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );
}

export async function fetchAdminRecord() {
  const db = await getDb();
  return db.collection<AdminRecord>(collectionName).findOne({});
}

const sanitizeAdminRecord = (record: AdminRecord | null): PublicAdminRecord | null => {
  if (!record) return null;
  const { password: _password, ...rest } = record;
  return rest;
};

export async function listAdminRecords() {
  const db = await getDb();
  const records = await db.collection<AdminRecord>(collectionName).find({}).sort({ createdAt: 1 }).toArray();
  return records.map((record) => sanitizeAdminRecord(record)).filter((record): record is PublicAdminRecord => Boolean(record));
}

export async function upsertAdminByEmail(record: { name: string; email: string; password: string }) {
  const db = await getDb();
  const email = record.email.toLowerCase();
  await db.collection<AdminRecord>(collectionName).updateOne(
    { email },
    {
      $set: {
        name: record.name,
        email,
        password: record.password,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  const updated = await db.collection<AdminRecord>(collectionName).findOne({ email });
  return sanitizeAdminRecord(updated);
}
