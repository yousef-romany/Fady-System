const express = require("express");
const app = express();
let path = require("path");
const publicPath = path.join(__dirname, "./views");
const db = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicPath));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.listen(process.env.port || 3000);
console.log("Web Server is listening at port " + (process.env.port || 3000));
app.set("view options", { layout: "index.ejs" });
const cors = require("cors");
app.use(cors());
const engine = require("ejs-blocks");
app.engine("ejs", engine);
//------------------------------------------------------------------------------------------------------------------------
/* 
  sql connection 
// */
let connection = db.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "fady",
  password: "root",
  insecureAuth: true,
  multipleStatements: true,
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

//------------------------------------------------------------------------------------------------------------------------

app.get("/", (request, response) => {
  response.render("pages-sign-in");
});
app.get("/notification-page", (request, response) => {
  response.render("notification-page");
});

app.get("/pages-sign-in", (request, response) => {
  response.render("pages-sign-in");
});
app.get("/pages-profile", (request, response) => {
  response.send("<a href='/index'>Back</a>");
});

app.get("/charts-chartjs", function (request, response) {
  response.render("charts-chartjs");
});

// start login authontacition
require("./routes/login/login")(app, connection);
// end login authontacition
// Start index
require("./routes/index")(app, connection);
// end index

// start employers
require("./routes/Employers/Employers")(app, connection,upload);
// end employers

// start storage1 , storage2
require("./routes/storage/storage")(app, connection);
// end storage1 , storage2

// start order
require("./routes/order/order")(app, connection, upload);
// end order

// start setting
require("./routes/setting/setting")(app, connection);
// end setting

// start start
require("./routes/start/start")(app, connection);
// end start

// start mix
require("./routes/mix/mix")(app, connection);
// end mix

// start notification
require("./routes/notification/notification")(app, connection);
// end notification

// start accounts
require("./routes/accounts/accounts")(app, connection);
// end accounts