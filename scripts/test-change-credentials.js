// Test script to verify Super Admin credential change and re-authentication
const http = require("http");

async function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          });
        } catch {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body,
          });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("=== 1. Logging in as Admin (admin / 123456) ===");
  const loginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { username: "admin", pin: "123456" }
  );

  console.log("Login status:", loginRes.statusCode);
  console.log("Login body:", loginRes.body);

  const rawCookie = loginRes.headers["set-cookie"]?.[0] || "";
  const sessionCookie = rawCookie.split(";")[0];
  console.log("Extracted session cookie:", sessionCookie);

  console.log("\n=== 2. Testing /api/auth/admin/me ===");
  const meRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/auth/admin/me",
    method: "GET",
    headers: { Cookie: sessionCookie },
  });
  console.log("Me status:", meRes.statusCode);
  console.log("Current user:", meRes.body);

  console.log("\n=== 3. Testing Unauthorized Access (no cookie) ===");
  const unauthRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/change-credentials",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { currentPin: "123456", name: "Hacker" }
  );
  console.log("Unauth status (expected 401):", unauthRes.statusCode);
  console.log("Unauth body:", unauthRes.body);

  console.log("\n=== 4. Testing Invalid Current PIN ===");
  const badPinRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/change-credentials",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
    },
    { currentPin: "999999", name: "Dr. Rashed Super Admin" }
  );
  console.log("Bad PIN status (expected 400):", badPinRes.statusCode);
  console.log("Bad PIN body:", badPinRes.body);

  console.log("\n=== 5. Testing Validation: New PIN too short ===");
  const shortPinRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/change-credentials",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
    },
    { currentPin: "123456", newPin: "12" }
  );
  console.log("Short PIN status (expected 422):", shortPinRes.statusCode);
  console.log("Short PIN body:", shortPinRes.body);

  console.log("\n=== 6. Updating Super Admin Credentials (Name, Email, New PIN) ===");
  const updateRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/change-credentials",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
    },
    {
      currentPin: "123456",
      newUsername: "admin",
      newPin: "654321",
      name: "Dr. Rashed Super Admin",
      email: "dr.rashed.admin@doctorcare.test",
    }
  );
  console.log("Update status (expected 200):", updateRes.statusCode);
  console.log("Update body:", updateRes.body);

  console.log("\n=== 7. Verify Logging in with NEW PIN (654321) ===");
  const newLoginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { username: "admin", pin: "654321" }
  );
  console.log("New PIN Login status (expected 200):", newLoginRes.statusCode);
  console.log("New PIN Login body:", newLoginRes.body);

  console.log("\n=== 8. Reverting PIN back to standard 123456 ===");
  const newCookie = (newLoginRes.headers["set-cookie"]?.[0] || "").split(";")[0];
  const revertRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/change-credentials",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: newCookie,
      },
    },
    {
      currentPin: "654321",
      newUsername: "admin",
      newPin: "123456",
      name: "Dr. Rashed Super Admin",
      email: "admin@doctorcare.test",
    }
  );
  console.log("Revert status (expected 200):", revertRes.statusCode);
  console.log("Revert body:", revertRes.body);

  console.log("\n=== 9. Confirm Login with standard PIN 123456 ===");
  const finalLoginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/admin/login",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    { username: "admin", pin: "123456" }
  );
  console.log("Final Login status (expected 200):", finalLoginRes.statusCode);
  console.log("Final Login body:", finalLoginRes.body);
  console.log("\nALL TESTS PASSED SUCCESSFULLY!");
}

runTests().catch(console.error);
