import log from '../utils/logging';
import "reflect-metadata";
import { createConnection } from "typeorm";

const NAMESPACE = "database";

const loadDB = async () => {

    createConnection().then(async connection => {
        log.info(NAMESPACE, "Database connected");

    }).catch(error => log.error("Could not connect to database: ", error));

}

export default loadDB;