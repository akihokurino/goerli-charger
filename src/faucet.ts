import S3 from "aws-sdk/clients/s3";
import fs from "fs";
import * as puppeteer from "puppeteer";

const s3Cli = new S3();

export const run = async () => {
  console.log("---------- Faucet補充開始 ----------");

  const browser = await puppeteer.launch({
    headless: process.env.LOCAL === undefined,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "-–disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
    ],
  });

  {
    console.log("----- ログイン画面 -----");
    const page = await browser.newPage();
    await page.goto(process.env.URL!);
    await page.waitForTimeout(500);
    await page.type(process.env.SELECTOR_EMAIL!, process.env.EMAIL!);
    await page.type(process.env.SELECTOR_PASSWORD!, process.env.PASSWORD!);
    await page.click(process.env.SELECTOR_LOGIN_BUTTON!);
    await page.waitForSelector(process.env.SELECTOR_FAUCET_BUTTON!, {
      timeout: 10000,
    });
  }

  {
    console.log("----- Faucet画面 -----");
    const pages = await browser.pages();
    const page = pages[pages.length - 1];
    await page.waitForTimeout(500);
    await page.type(process.env.SELECTOR_ADDRESS!, process.env.ADDRESS!);
    await page.click(process.env.SELECTOR_FAUCET_BUTTON!);
    try {
      await page.waitForSelector(process.env.SELECTOR_ALERT!, {
        timeout: 5000,
      });
      await page.waitForTimeout(5000);
      console.log(
        "---------- Faucetエラー（24時間に1度しか補充できません） ----------"
      );
    } catch (error) {
      console.log("---------- Faucet補充完了 ----------");
    }
    await page.screenshot({ path: "/tmp/result.jpg" });
  }

  const now = new Date();
  now.setTime(now.getTime() + 1000 * 60 * 60 * 9);
  const fileStream = fs.createReadStream("/tmp/result.jpg");
  await s3Cli
    .putObject({
      Bucket: "goerli-charger-userdata",
      Key: `log/${now.toISOString()}.jpg`,
      Body: fileStream,
      ContentType: "image/jpeg",
    })
    .promise();

  console.log("---------- ログアップロード完了 ----------");

  await browser.close();
};
