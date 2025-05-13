const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Your Twilio credentials (keep them safe in env in production)
const accountSid = "YourTwlioID";
const authToken = "Password";
const client = new twilio(accountSid, authToken);

const twilioPhoneNumber = "TwlioNum"; // Your Twilio number

app.post("/send-sms", async (req, res) => {
  const { to, body } = req.body;

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to, 
    });

    res.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error("Twilio Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ SMS backend running on http://IP:${port}`);
});

//VIT_MG: 172.20.130.25
