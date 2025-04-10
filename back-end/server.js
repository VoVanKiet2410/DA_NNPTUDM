const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationUnitRoutes = require("./routes/donationUnitRoutes");
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/blood-donation";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Kiểm tra và tạo collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    // Tạo collection events nếu chưa tồn tại
    if (!collectionNames.includes("events")) {
      await mongoose.connection.db.createCollection("events");
      console.log("Created events collection");
    }

    // Tạo collection donationunits nếu chưa tồn tại
    if (!collectionNames.includes("donationunits")) {
      await mongoose.connection.db.createCollection("donationunits");
      console.log("Created donationunits collection");
    }

    // Tạo collection appointments nếu chưa tồn tại
    if (!collectionNames.includes("appointments")) {
      await mongoose.connection.db.createCollection("appointments");
      console.log("Created appointments collection");
    }
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/donation-units", donationUnitRoutes);
app.use("/api/events", eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: "Lỗi server",
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
