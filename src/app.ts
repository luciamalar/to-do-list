import express from 'express';
import log from './utils/logging';
import "reflect-metadata";

import config from '../config/config';
import loadDB from './loaders/database';
import loadExpress from './loaders/express';
import loadErrorHandler from './loaders/error';

const NAMESPACE = "app";

const startServer = async () => {

    const app = express();

    await loadDB();
    await loadExpress(app);
    await loadErrorHandler(app);

    app.listen(config.server.port, config.server.hostname, () => {
        log.info(NAMESPACE, `App running at http://${config.server.hostname}:${config.server.port}`);
    });
}

startServer();
