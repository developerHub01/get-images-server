const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const puppeteer = require("puppeteer-core");
app.use(express.json());

console.log(process.env.BROWSERLESS_ACCESS_TOKEN);

app.get("/", async (req, res) => {
  res.send("GET IMAGES ===================");
});
app.get("/health", async (req, res) => {
  res.send("server running successfully");
});

app.get("/fetchData", async (req, res) => {
  const { url } = req.query;

  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_ACCESS_TOKEN}`,
    });
    const page = await browser.newPage();
    await page.goto(url);

    let images = await page.$$eval("img", (element) =>
      element
        .map((item) => item.src)
        .filter((item) => {
          const imgSrcArr = item?.split(".");
          if (
            ["jpg", "png", "gif", "bmp"].includes(
              imgSrcArr[imgSrcArr?.length - 1]
            )
          )
            return item;
        })
    );
    images = [...new Set(images)];
    await browser.close();
    res.json({ data: images });
  } catch (error) {
    console.error(error);
    return null;
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
