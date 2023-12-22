const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const PORT = 3000;
const ogs = require("open-graph-scraper");
const { getLinkPreview, getPreviewFromContent } = require("link-preview-js");
const metascraper = require("metascraper")([
  require("metascraper-title")(),
  require("metascraper-description")(),
  require("metascraper-url")(),
  require("metascraper-image")(),
]);

app.use(express.json());
app.use(cors());

app.post("/instagram", async (req, res) => {
  const url = req.body.url;
  console.log(url);
  if (!url) return res.json({ message: "Not found url" });

  // Method 1 Using linkpreviewjs but not working if the page is not fully loaded it return waiting or something not worked with medium
  // try {
  //   const data = await getLinkPreview(url, {
  //     imagesPropertyType: "og",
  //     Connection: "keep-alive",
  //     Accept: `text/plain,text/html`,
  //     "User-Agent": `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`,
  //     "Accept-Encoding": ` gzip,deflate,br`,
  //   }).then((data) => res.send(data));
  // } catch (error) {
  //   res.status(201).json({ error: error.message });
  // }

  // Method 2 to get all the html
  // try {
  //   const data =await axios.get(url);
  //   console.log(data.data)
  //   return res.send(data.data);
  // } catch (error) {
  //   res.status(201).json({ error: error.message });
  // }

  // Method 3 using openGraphScraper Not worked with medium
  // try {
  //   const options = {
  //     url: url,
  //     fetchOptions: {
  //       headers: {
  //         "user-agent": `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`,
  //       },
  //     },
  //     timeout: 1,
  //   };
  //   const data = await ogs(options);
  //   console.log(data);
  //   console.log("this is")
  //   res.send(data);
  // } catch (error) {
  //   return res.status(201).json({ error: error.message });
  // }

  // Method 4 using metascrapper working well
  try {
    const response = await axios.get(url);
    const metadata = await metascraper({ html: response.data, url });
    console.log("Title:", metadata.title);
    console.log("Description:", metadata.description);
    console.log("URL:", metadata.url);
    console.log("Image:", metadata.image);
    return res.send(metadata);
  } catch (error) {
    console.log("Error fetching metadata:", error.message);
    return res.status(201).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
