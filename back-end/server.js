const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationUnitRoutes = require("./routes/donationUnitRoutes");
const eventRoutes = require("./routes/eventRoutes");
const newsRoutes = require('./routes/newsRoutes');
const faqRoutes = require('./routes/faqRoutes');

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

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    if (!collectionNames.includes("events")) {
      await mongoose.connection.db.createCollection("events");
      console.log("Created events collection");
    }

    if (!collectionNames.includes("donationunits")) {
      await mongoose.connection.db.createCollection("donationunits");
      console.log("Created donationunits collection");
    }

    if (!collectionNames.includes("appointments")) {
      await mongoose.connection.db.createCollection("appointments");
      console.log("Created appointments collection");
    }

    if (!collectionNames.includes("news")) {
      await mongoose.connection.db.createCollection("news");
      console.log("Created news collection");
    }

    if (!collectionNames.includes("faqs")) {
      await mongoose.connection.db.createCollection("faqs");
      console.log("Created faqs collection");
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
app.use('/api/news', newsRoutes);
app.use('/api/faq', faqRoutes);

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
