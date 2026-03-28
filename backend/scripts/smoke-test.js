/**
 * Integration smoke: register → login → directory → me (requires MONGO_URI + JWT secrets).
 * Run from backend folder: npm run smoke
 */
import "dotenv/config";
import mongoose from "mongoose";

const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:8000";

async function jsonFetch(path, opts = {}) {
  const res = await fetch(`${base}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  return { res, body };
}

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI required");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.disconnect();

  const email = `smoke_${Date.now()}@example.com`;
  const password = "Smoke@1234";

  const reg = await jsonFetch("/api/auth/register/student", {
    method: "POST",
    body: JSON.stringify({
      firstName: "Smoke",
      lastName: "User",
      email,
      password,
      phone: "000",
      department: "CSE",
      expectedGradYear: 2027,
    }),
  });

  if (!reg.res.ok) {
    console.error("Register failed", reg.res.status, reg.body);
    process.exit(1);
  }

  const accessToken = reg.body?.data?.accessToken;
  if (!accessToken) {
    console.error("No accessToken in register response", reg.body);
    process.exit(1);
  }

  const me = await jsonFetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!me.res.ok) {
    console.error("/me failed", me.res.status, me.body);
    process.exit(1);
  }

  const dir = await jsonFetch("/api/directory");
  if (!dir.res.ok) {
    console.error("Directory failed", dir.res.status, dir.body);
    process.exit(1);
  }

  console.log("Smoke OK:", { email, directoryCount: Array.isArray(dir.body?.data) ? dir.body.data.length : "?" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
