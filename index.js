const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const puppeteer = require("puppeteer");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/fetchData", async (req, res) => {
  const { url } = req.query;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  let images = await page.$$eval("img", (element) =>
    element.map((item) => item.src)
  );
  images = [...new Set(images)];
  await browser.close();

  console.log(images);
  res.send(images);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
