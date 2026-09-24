const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LeaveFlow API is running"
    });
});

module.exports = app;