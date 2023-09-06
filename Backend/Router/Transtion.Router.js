const express = require("express");
const axios = require("axios");
const { TransactionModel } = require("../Model/Tranction.Model");

const transactionRouter = express.Router();


transactionRouter.get('/initialize-database', async (req, res) => {
  try {
    const response = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );

    // Loop through the response data
    const updatedData = response.data.map(item => {
      // Convert the dateOfSale to a JavaScript Date object
      const dateOfSale = new Date(item.dateOfSale);

      // Extract the month name from the date dynamically
      const monthName = dateOfSale.toLocaleString('default', { month: 'long' });
        console.log(monthName)
      // Create a new key "saleMonth" to store the month name
      item['month'] = monthName;
      return item;
    });
    console.log(updatedData);

    // Clear existing data and insert the updated data into the database
    await TransactionModel.deleteMany({});
    await TransactionModel.insertMany(updatedData);

    res.json({ message: 'Database initialized with seed data' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error initializing the database' });
  }
});

// Add a debouncing function
// function debounce(func, wait) {
//   let timeout;
//   return function (...args) {
//     const context = this;
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(context, args), wait);
//   };
// }

// Your route handler with debouncing for the search query
// transactionRouter.get("/transactions", async (req, res) => {
//   const { page = 1, perPage = 10, search = "", month } = req.query;
//   console.log(month);

//   try {
//     // Define a debounced function for fetching transactions
//     const debouncedFetchTransactions = debounce(async () => {
//       const totalRecords = await TransactionModel.countDocuments();
//       const transactions = await TransactionModel.find({month})
//         .skip((page - 1) * perPage)
//         .limit(Number(perPage));


      
//       res.json({
//         totalRecords,
//         transactions,
//       });
//     }, 300); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

//     // Call the debounced function
//     debouncedFetchTransactions();
//   } catch (error) {
//     console.error("Error fetching transactions:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Your route handler with debouncing for the search query

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Your route handler with debouncing for the search query
transactionRouter.get("/transactions", async (req, res) => {
  const { page = 1, perPage = 10, search = "", month } = req.query;

  try {
    // Define a debounced function for fetching transactions
    const debouncedFetchTransactions = debounce(async () => {
      const totalRecords = await TransactionModel.countDocuments();
      const transactions = await TransactionModel.find({
        $and: [
          { title: { $regex: `${search}`, $options: "i" } },
          { description: { $regex: `${search}`, $options: "i" } },
          { description: { $regex: `${search}`, $options: "i" } },
          // Add a condition to filter by month if the "month" parameter is provided
          month ? { "month": month } : {}, // Adjust the field name as needed
        ],
      })
        .skip((page - 1) * perPage)
        .limit(Number(perPage));

      res.json({
        totalRecords,
        transactions,
      });
    }, 300); // Adjust the debounce delay as needed (e.g., 300 milliseconds)

    // Call the debounced function
    debouncedFetchTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

transactionRouter.get("/statistics", async (req, res) => {
  const { month } = req.query;

  try {
    const selectedMonth = new Date(month);
    const startOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    );

    const totalSaleAmount = await TransactionModel.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$price",
          },
        },
      },
    ]);

    const totalSoldItems = await TransactionModel.countDocuments({
      dateOfSale: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const totalNotSoldItems = await TransactionModel.countDocuments({
      dateOfSale: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      "title": "",
    });

    res.json({
      totalSaleAmount:
        totalSaleAmount.length > 0 ? totalSaleAmount[0].totalAmount : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  transactionRouter,
};
