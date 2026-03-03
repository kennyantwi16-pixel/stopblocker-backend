const express = require("express");
const crypto = require("crypto");
const app = express();

app.use(express.json());

const PAYSTACK_SECRET = "YOUR_SECRET_KEY";

// Webhook Endpoint
app.post("/paystack-webhook", (req, res) => {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(JSON.stringify(req.body))
    .digest("hex");

  // Verify it's really from Paystack
  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const email = event.data.customer.email;

    console.log("Payment successful from:", email);

    // 🔥 HERE: mark this user as premium in your database
    // Example: save email + plan = premium

  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Server running"));
