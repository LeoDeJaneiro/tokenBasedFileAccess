const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieSession = require("cookie-session");
require("dotenv").config();

const db = require("./utils/db");
require("./utils/passport");

const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const tokenRouter = require("./routes/token");
const documentRouter = require("./routes/document");

const app = express();
db.connect(process.env.MONGO_CONNECTION);

app.use((err, req, res, next) => {
  return res.status(500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  });
});

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_HOST,
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
    secret: process.env.SESSION_SECRET,
  })
);
// app.use(
//   cookieSession({
//     name: "tuto-session",
//     keys: ["key1", "key2"],
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/document", documentRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("err: ", err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
