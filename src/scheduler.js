import cron from "node-cron";
import { exec } from "child_process";

console.log("Scheduler started...");

// 發送時間
cron.schedule("0 7,15,23 * * *", () => {
  console.log("Running scheduled news job...");

  exec("node src/main.js", (err, stdout, stderr) => {
    if (err) {
      console.error("Job failed:", err);
      return;
    }

    if (stderr) {
      console.error(stderr);
    }

    console.log(stdout);
  });
}, {
  timezone: "Asia/Taipei"
});