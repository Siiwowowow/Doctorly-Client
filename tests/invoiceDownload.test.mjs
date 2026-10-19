import assert from "node:assert/strict";
import { mock, test } from "node:test";

const values = new Map();
const cookieStore = {
  get: name => values.has(name) ? { value: values.get(name) } : undefined,
  set: (name, value) => values.set(name, value),
};
mock.module("next/headers", { namedExports: { cookies: async () => cookieStore } });
process.env.NEXT_PUBLIC_API_BASE_URL = "https://main-backend.example.test/api/v1";
process.env.INVOICE_API_BASE_URL = "https://invoice-backend.example.test/api/v1";
const { GET } = await import("../src/app/api/payments/invoice/[paymentId]/route.ts");
const download = () => GET(new Request("http://localhost/api/payments/invoice/payment-1"), {
  params: Promise.resolve({ paymentId: "payment-1" }),
});
const signIn = () => {
  values.clear();
  values.set("accessToken", "test-access");
  values.set("better-auth.session_token", "test-session");
  values.set("refreshToken", "test-refresh");
};

test("download forwards login cookies server-side and returns a private PDF attachment", async t => {
  signIn();
  t.mock.method(globalThis, "fetch", async (url, init) => {
    assert.equal(String(url), "https://invoice-backend.example.test/api/v1/payments/invoice/payment-1?format=pdf&download=true");
    assert.match(init.headers.Cookie, /accessToken=test-access/);
    assert.match(init.headers.Cookie, /better-auth.session_token=test-session/);
    assert.equal(init.cache, "no-store");
    return new Response("%PDF-test", { headers: { "Content-Type": "application/pdf" } });
  });
  const response = await download();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.match(response.headers.get("content-disposition"), /attachment;.*\.pdf/);
  assert.equal(await response.text(), "%PDF-test");
});

test("expired access tokens refresh before retrying the download without exposing tokens", async t => {
  signIn();
  let attempts = 0;
  t.mock.method(globalThis, "fetch", async (url, init) => {
    if (String(url).endsWith("/auth/refresh-token")) {
      return Response.json({ data: { accessToken: "fresh-access", refreshToken: "fresh-refresh", token: "fresh-session" } });
    }
    if (++attempts === 1) return Response.json({ message: "Expired" }, { status: 401 });
    assert.match(init.headers.Cookie, /accessToken=fresh-access/);
    assert.match(init.headers.Cookie, /better-auth.session_token=fresh-session/);
    return new Response("%PDF-refreshed", { headers: { "Content-Type": "application/pdf" } });
  });
  const response = await download();
  assert.equal(response.status, 200);
  assert.equal(values.get("accessToken"), "fresh-access");
  assert.equal(await response.text(), "%PDF-refreshed");
});

test("unauthorized, forbidden, unpaid, and missing invoices preserve backend error statuses", async t => {
  for (const status of [401, 403, 400, 404]) {
    await t.test(`HTTP ${status}`, async sub => {
      values.clear();
      sub.mock.method(globalThis, "fetch", async () => Response.json({ message: "Invoice unavailable" }, { status }));
      const response = await download();
      assert.equal(response.status, status);
      assert.match(response.headers.get("content-type"), /application\/json/);
      assert.ok((await response.json()).message);
    });
  }
});

test("HTML responses and backend failures never become fake PDF downloads", async t => {
  values.clear();
  t.mock.method(globalThis, "fetch", async () => new Response("<html>Login</html>", { headers: { "Content-Type": "text/html" } }));
  const response = await download();
  assert.equal(response.status, 502);
  assert.match(response.headers.get("content-type"), /application\/json/);
});
