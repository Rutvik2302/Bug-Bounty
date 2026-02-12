const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`${process.env.MONGODB_STRING}/bugBounty`).then(()=>{
    console.log("connect");
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose.connection;