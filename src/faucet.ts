import * as puppeteer from "puppeteer";

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
      timeout: 30000,
    });
  }

  {
    console.log("----- Faucet画面 -----");
    const pages = await browser.pages();
    const page = pages[pages.length - 1];
    await page.waitForTimeout(500);
    await page.type(process.env.SELECTOR_ADDRESS!, process.env.ADDRESS!);
    await page.click(process.env.SELECTOR_FAUCET_BUTTON!);
    await page.waitForTimeout(5000);
  }

  await browser.close();

  console.log("---------- Faucet補充完了 ----------");
};
