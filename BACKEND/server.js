const express = require("express")
const app = express()
const db = require("./config/mongodb-connection")
const userRoutes = require("./routes/login-signup")
const bugRoutes = require("./routes/bug")
const cors = require("cors")


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
];

const PORT = process.env.PORT || 3000;


app.use("/user", userRoutes );
app.use("/bug", bugRoutes );

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});