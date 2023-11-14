const mongoose = require("mongoose");

// Using the MONGODB_URI environment variable for the MongoDB connection string
const mongoDBUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoDBUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    // Log the error if the connection fails
    console.error("MongoDB connection error:", error);
  });

// Event listener for successful connection
mongoose.connection.on("connected", () => {
  console.log("Mongoose connection successfully opened to MongoDB");
});

// Optional: Add event listeners for other connection events for better monitoring
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection disconnected");
});

// Optional: Handle Node.js process termination to close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed due to application termination");
    process.exit(0);
  });
});
