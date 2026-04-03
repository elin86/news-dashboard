import { sendLineMessage } from "./delivery/sendLine.js";

async function main() {
  await sendLineMessage("Hello from your news bot 🚀");
  console.log("LINE test message sent");
}

main().catch((err) => {
  console.error("LINE test failed:", err);
});