import { query } from "../../db/connection";

const CHAPA_URL = "https://api.chapa.co/v1";

export async function initializePayment(
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  txRef: string,
  callbackUrl: string,
  returnUrl: string,
) {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) throw new Error("CHAPA_SECRET_KEY not set in env");

  const payload = {
    amount: "1000",
    currency: "ETB",
    email,
    first_name: firstName,
    last_name: lastName,
    tx_ref: txRef,
    callback_url: callbackUrl,
    return_url: returnUrl,
    "customization[title]": "Course Unlock",
    "customization[description]": "Premium access",
  };

  const response = await fetch(`${CHAPA_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (data.status !== "success") {
    throw new Error(data.message || "Failed to initialize payment");
  }

  // Update payment reference in DB pending verification
  await query("UPDATE users SET payment_reference = ? WHERE id = ?", [
    txRef,
    userId,
  ]);

  return data.data; // { checkout_url: string }
}

export async function verifyPayment(txRef: string) {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  if (!secretKey) throw new Error("CHAPA_SECRET_KEY not set in env");

  const response = await fetch(`${CHAPA_URL}/transaction/verify/${txRef}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const data = await response.json();

  if (
    data.status === "success" &&
    data.data &&
    data.data.status === "success"
  ) {
    await query(
      "UPDATE users SET is_premium = true WHERE payment_reference = ?",
      [txRef],
    );
    return true;
  }
  return false;
}
