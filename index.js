const express = require("express");
const bodyParser = require("body-parser");

let articles = [
  { id: 0, author: "Mack", body: "Post 1" },
  { id: 1, author: "Jack", body: "Post 2" },
  { id: 2, author: "Zack", body: "Post 3" },
];

const hello = (req, res) => res.send({ hello: "world" });

const getArticles = (req, res) => res.send(articles);

// TODO: get the correct article by using the id
const getArticle = (req, res) => {
  const id = parseInt(req.params.id, 10); // Convert the id from string to number

  // Find the article with the specified id
  const article = articles.find((a) => a.id === id);

  // If article is found, send it, otherwise send a 404 status with an error message
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ error: "Article not found." });
  }
};

const addArticle = (req, res) => {
  // Extract the article data from the request body
  const { author, body } = req.body;

  // Ensure both author and body are provided
  if (!author || !body) {
    return res
      .status(400)
      .send({ error: "Both author and body are required." });
  }

  // Assign a new id to the article
  const newId =
    articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 0;

  // Create a new article object
  const newArticle = {
    id: newId,
    author,
    body,
  };

  // Push the new article onto the articles array
  articles.push(newArticle);

  // Return the updated list of articles
  res.send(articles);
};

const app = express();
app.use(bodyParser.json());
app.get("/", hello);
app.get("/articles", getArticles);
app.get("/articles/:id", getArticle);
app.post("/article", addArticle);

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addr = server.address();
  console.log(`Server listening at http://${addr.address}:${addr.port}`);
});
