mongoose = require("mongoose");

const config = () => {
  //   mongoose.set("useNewUrlParser", true);
  //   mongoose.set("useFindAndModify", false);
  //   mongoose.set("useCreateIndex", true);
  //   mongoose.set("useUnifiedTopology", true);
};

module.exports = {
  connect: (DB_URL) => {
    mongoose.connect(DB_URL);
    config();
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error: " + DB_URL + err.message);
      process.exit();
    });
  },

  close: () => {
    mongoose.connection.close();
  },
};
