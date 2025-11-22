import dotenv from "dotenv"
import {app} from "./app.js"
import connectDB from "./db/index.js"
import { PORT } from "./config/config.js"

dotenv.config({
    path: "./env"
})

connectDB()
.then(() => {
    app.listen(PORT || 8000, () => {
        console.log(`Server is running at port: ${PORT}`)
    })
})
.catch((err) => {
    console.log("mongodb connection failed: ", err);
})