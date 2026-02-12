const express = require("express")
const app = express()
const db = require("./config/mongodb-connection")
const userRoutes = require("./routes/login-signup")
const bugRoutes = require("./routes/bug")
const cors = require("cors")
const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
require('dotenv').config();


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes );
app.use("/bug", bugRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});