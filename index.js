const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const chrome = require("chrome-aws-lambda");
app.use(express.json());
const chrome = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

const options = {
  args: [
    ...chrome.args,
    "--hide-scrollbars",
    "--disable-web-security",
    "--font-render-hinting=none",
  ],
  defaultViewport: chrome.defaultViewport,
  executablePath: await chrome.executablePath,
  headless: true,
  ignoreHTTPSErrors: true,
};

app.get("/", async (req, res) => {
  res.send("GET IMAGES ===================");
});
app.get("/health", async (req, res) => {
  res.send("server running successfully");
});

app.get("/fetchData", async (req, res) => {
  const { url } = req.query;

  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(url);

    let images = await page.$$eval("img", (element) =>
      element.map((item) => item.src)
    );
    images = [...new Set(images)];
    await browser.close();
    res.send(images);
  } catch (error) {
    console.error(error);
    return null;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
