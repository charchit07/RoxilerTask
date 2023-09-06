const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
       dateOfSale: Date,
        title: String,
        description: String,
        price: Number,
        image:String,
        category:String,
        sold: Boolean,
        month:String
}, {
  _id:false,
  versionKey: false,
});

const TransactionModel = mongoose.model("transaction", TransactionSchema);

module.exports = {
  TransactionModel
};
