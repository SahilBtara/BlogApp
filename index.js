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
  saveBlog(req.body.title, req.body.body);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  var id = req.query.topic;
  listOfBlogs[id].deleted = true;
  res.redirect("/");
});

app.get("/view", (req, res) => {
  var id = req.query.topic;
  console.log("Give me blog ", id);
  console.log(listOfBlogs);
  res.render("view.ejs", {
    id: id,
    title: listOfBlogs[id].title,
    body: listOfBlogs[id].body,
  });
});

app.post("/edit", (req, res) => {
  var id = req.query.topic;
  console.log("Edit blog ", id);
  res.render("edit.ejs", {
    id: id,
    title: listOfBlogs[id].title,
    body: listOfBlogs[id].body,
  });
});

app.post("/update", (req, res) => {
  const id = req.query.topic;
  updateBlog(id, req.body.title, req.body.body);
  res.redirect("/");
});

function saveBlog(title, body) {
  const currentBlogId = blogId++;
  listOfBlogs.push({
    id: currentBlogId,
    title: title,
    body: body,
    deleted: false,
  });
  const fileName = currentBlogId + ".json";
  const writeStream = fs.createWriteStream(
    "public/resources/blogs/" + fileName
  );
  console.log("Saved file ", fileName);
  // Write the object to the stream.
  writeStream.write(
    JSON.stringify({ id: currentBlogId, title: title, body: body })
  );

  // Close the stream.
  writeStream.end();
}

function updateBlog(id, title, body) {
  const fileName = id + ".json";
  // Need to update to only keep the id and title in this array
  listOfBlogs[id] = {
    id: id,
    title: title,
    body: body,
    deleted: false,
  };
  const filePath = "public/resources/blogs/" + fileName;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("error");
    } else {
      console.log("File deleted successfully");
    }
  });
  const writeStream = fs.createWriteStream(filePath);
  console.log("Updated file ", fileName);
  // Write the object to the stream.
  writeStream.write(JSON.stringify({ id: id, title: title, body: body }));

  // Close the stream.
  writeStream.end();
}
