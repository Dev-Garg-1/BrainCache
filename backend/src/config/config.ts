// in this file the types of all these will be inferenced from env.d.ts file created inside the src folder

const MONGODB_URI= process.env.MONGODB_URI;
const DB_NAME= process.env.DB_NAME;

const ACCESS_TOKEN_SECRET= process.env.ACCESS_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

const CORS_ORIGIN = process.env.CORS_ORIGIN
const PORT = process.env.PORT

export {
    MONGODB_URI,
    DB_NAME,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
    CORS_ORIGIN,
    PORT
}