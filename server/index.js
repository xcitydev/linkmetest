const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const cors = require("cors"); // Import CORS

const app = express();
const PORT = 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3001", // Adjust this to your frontend's URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
); // Enable CORS
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
