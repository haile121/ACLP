import { loadBackendEnv } from "./loadBackendEnv";

loadBackendEnv();

async function main() {
  const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
  console.log(
    "Secret key loaded:",
    secretKey ? "Yes (length: " + secretKey.length + ")" : "No",
  );

  const payload = {
    amount: "1000",
    currency: "ETB",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    tx_ref: "test-ref-" + Date.now(),
    callback_url: "http://localhost:4000/api/payment/chapa/verify?tx_ref=test",
    return_url: "http://localhost:4000/api/payment/chapa/verify?tx_ref=test",
    customization: {
      title: "Unlock ACLP Course",
      description: "Pay to unlock full access to the course chapters",
    },
  };

  const response = await fetch(
    `https://api.chapa.co/v1/transaction/initialize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const text = await response.text();
  console.log("Response status:", response.status);
  console.log("Response body:", text);
}

main().catch(console.error);
