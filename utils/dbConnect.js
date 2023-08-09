const mongoose = require("mongoose")

const dbConnect = () =>{
    const connectionParams = { useNewURlParser: true }
    mongoose.connect(process.env.DB,connectionParams)

    mongoose.connection.on("connected",()=>{
        console.log("connected to database successfully")

    })

    mongoose.connection.on("error",(error)=>{
        console.log("database connection failed" + error);

    })
    mongoose.connection.on("disconnected",()=>{
        console.log("database connection disconnected");

    })
}

module.exports =  dbConnect;