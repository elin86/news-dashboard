import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function sendLineMessage(text) {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const userId = process.env.LINE_USER_ID;

  if (!token) {
    throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN");
  }

  if (!userId) {
    throw new Error("Missing LINE_USER_ID");
  }

  await axios.post(
    "https://api.line.me/v2/bot/message/push",
    {
      to: userId,
      messages: [
        {
          type: "text",
          text
        }
      ]
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }
  );
}
