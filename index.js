const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let chrome = {};
let puppeteer;
let options = {};

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
  options = {
    args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
    defaultViewPort: chrome.defaultViewPort,
    executablePath: await chrome.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  };
} else {
  puppeteer = require("puppeteer");
}

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

    console.log(images);
    res.send(images);
  } catch (error) {
    console.error(error);
    return null;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
