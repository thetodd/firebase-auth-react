var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var admin = require("firebase-admin");

// Do not forget to add your own firebase admin credentials in the root directory!
var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function checkAuth(req, res, next) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then((decodedToken) => {
        req.userObject = decodedToken;
        next();
      })
      .catch(() => {
        res.status(403).send("Unauthorized");
      });
  } else {
    res.status(403).send("Unauthorized");
  }
}

app.use("/", checkAuth);

app.get("/", (req, res) => {
  res.json({
    message: `Hello ${req.userObject.email ?? "World"}!`,
  });
});

module.exports = app;
