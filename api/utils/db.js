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
    //Log an error if we fail to connect
    mongoose.connection.on("error", (err) => {
      console.error(err.message);
      console.log("Mongoose connection error: " + DB_URL);

      process.exit();
    });
  },

  //close the connection
  close: () => {
    mongoose.connection.close();
  },
};