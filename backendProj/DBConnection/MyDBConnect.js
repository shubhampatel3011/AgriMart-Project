const { default: mongoose } = require("mongoose");

const ConnectionString = "mongodb://localhost:27017/AgriMart";

const MyCon = async () => {
    await mongoose.connect(ConnectionString)
    .then(console.log("Successfully Connected the DataBase."))
    // .catch(console.log("Database not connected."))
};

module.exports = MyCon;