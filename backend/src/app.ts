import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { CORS_ORIGIN } from "./config/config.js";

const app = express();

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use(cookieParser());



// routes import
import userRouter from "./routes/user.routes.js"
import contentRouter from "./routes/content.routes.js"


// routes 
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/content', contentRouter);

export {app}