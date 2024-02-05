import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
var blogId = 0;
var listOfBlogs = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

app.get("/", (req, res) => {
  res.render("index.ejs", { fs: fs, list: listOfBlogs });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/create", (req, res) => {
  saveBlog(req.body.title, req.body.body, (filePath) => {
    // Redirect to '/' only after the blog is saved.
    res.redirect("/");
  });
});

function saveBlog(title, body, callback) {
  console.log(listOfBlogs);
  const currentBlogId = blogId++;
  listOfBlogs.push({ id: currentBlogId, title: title, body: body });
  const fileName = currentBlogId + ".json";
  const filePath = "public/resources/blogs/" + fileName;

  const writeStream = fs.createWriteStream(filePath);
  console.log("Saved file ", fileName);

  // Write the object to the stream.
  writeStream.write(JSON.stringify({ title: title, body: body }));

  // Close the stream.
  writeStream.end(() => {
    // Call the callback function after the stream is closed.
    callback(filePath);
  });
  console.log(listOfBlogs);
  console.log(blogId);
}
