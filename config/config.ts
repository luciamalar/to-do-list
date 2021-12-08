import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT: number = parseInt(process.env.SERVER_PORT) || 5000;
const SERVER_DBURI = process.env.SERVER_DBURI || "mysql://localhost:3306/to_do_list"
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
const SERVER_TOKEN_SECRET = process.env.SERVER_TOKEN_SECRET || "superencryptedsecret";

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    dbUri: SERVER_DBURI,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
}

const config = {
    server: SERVER
}

export default config;