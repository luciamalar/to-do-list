import express from 'express';
import loadRoutes from '../routes/routes';

const loadExpress = async function (app: express.Application) {

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    await loadRoutes(app);

};


export default loadExpress;