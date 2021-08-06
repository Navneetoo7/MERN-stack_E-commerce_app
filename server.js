const express = require("express");
const app = express();
const connectToDB = require("./config/db");
const PORT = process.env.PORT || 5000;

connectToDB();

app.use("/api/users", require("./routes/userApi"));
app.use("/api/products", require("./routes/productApi"))


app.get("/", (req, res)=>{
    res.send("my app is up");
})

app.listen(PORT, ()=>{
    console.log(`server is listening at port ${PORT}`);
})