import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";

const PORT = process.env.PORT || 8080;

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log("App is running on PORT: ",PORT);
    })
})
.catch((error)=>{
    console.error(error);
})

