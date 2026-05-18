const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});