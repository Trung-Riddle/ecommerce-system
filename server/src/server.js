require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./config/db");
const initWebRoutes = require("./routes");
const cors = require("cors");
const { initSocket } = require("./services/socket");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URI,
    methods: ["POST", "PUT", "DELETE", "GET"],
  })
);
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
initSocket(server);
initWebRoutes(app);

const PORT = process.env.PORT || 3107;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
