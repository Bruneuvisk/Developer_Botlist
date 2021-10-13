const mongoose = require("mongoose");
const c = require("colors");
const config = require("../Json/config.json")

module.exports = {
  start() {
    try {
      mongoose.connect(config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(c.green(`[DataBase] - Conectado ao Banco de Dados Mongoose.`));
    } catch (err) {
      if (err) return console.log(c.red(`[DataBase] - ERROR:`, +err));
    }
  },
};