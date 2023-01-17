const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const allNews = [
  {
    name: "chelseanews",
    adress: "https://chelseanews.com/",
    base: "https://chelseanews.com/",
  },
  {
    name: "chelseaofficialnews",
    adress: "https://www.chelseafc.com/en/news/latest-news",
    base: "https://www.chelseafc.com/en",
  },
  {
    name: "chelseanewsnow",
    adress: "https://www.newsnow.co.uk/h/Sport/Football/Premier+League/Chelsea",
    base: "https://www.newsnow.co.uk/h/",
  },
];

const articles = [];

allNews.forEach((item) => {
  axios.get(item.adress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("Chelsea")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url,
        source: item.name,
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Welcome to my chelsea news api");
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:articleId", (req, res) => {
  const articleId = req.params.articleId;

  const articleAdress = allNews.filter(
    (article) => article.name == articleId
  )[0].adress;

  axios
    .get(articleAdress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticle = [];

      $('a:contains("Chelsea")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticle.push({
          title,
          url,
          source: articleId,
        });
      });
      res.json(specificArticle);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server runnning on port ${PORT}`));
