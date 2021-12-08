import express, { Application, Request, Response, NextFunction, response } from 'express';
import log from './utils/logging';
import "reflect-metadata";
import { createConnection } from "typeorm";
import config from '../config/config';
import user_controller from './controllers/user';
import list_controller from './controllers/list';
import item_controller from './controllers/item'
import { body, validationResult } from 'express-validator';
import { checkJwt } from "./middleware/authorization";
import apiErrorHandler from './error/api-error-handler';
import ApiError from './error/apiError';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const NAMESPACE = "app";

createConnection().then(async connection => {
    log.info(NAMESPACE, "Database connected");

}).catch(error => log.error("Could not connect to database: ", error));

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "ToDoList",
            version: "1.0.0",
            description: "A simple Express ToDoList API"
        },
        servers: [{
            url: "http://localhost:5000"
        }]
    },
    apis: ['**/*.ts']
}

const specs = swaggerJSDoc(options)

const port = config.server.port;
const host = config.server.hostname;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.listen(port, host, () => {
    log.info(NAMESPACE, `App running at http://${host}:${port}`);
});

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          required:
 *              - username
 *              - password
 *          properties:
 *              id: 
 *                  type: number
 *                  description : The auto-generated id of the user
 *              username:
 *                  type: string
 *                  description: The users username
 *              password:
 *                  type: string
 *                  description: The users password          
 *          example:
 *              username: Fero123
 *              password: d5fE_dwe
 * 
 *      List:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              id: 
 *                  type: number
 *                  description : The auto-generated id of the list
 *              title:
 *                  type: string
 *                  description: The list title  
 *              author:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *              items:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Item'
 *          example:
 *              title: My List
 *      Item:
 *          type: object
 *          required:
 *              - title
 *          properties:
 *              id: 
 *                  type: number
 *                  description : The auto-generated id of the item
 *              title:
 *                  type: string
 *                  description: The item title
 *              description:
 *                  type: string
 *                  description: The item description
 *              deadline:
 *                  type: date
 *                  description: The item deadline
 *              status:
 *                  type: string
 *                  enum: [active, done, cancelled]
 *                  description: The enmu types for status of item
 *              list:
 *                  type: object  
 *                  $ref: '#/components/schemas/List'
 *          example:
 *              title: Make project
 *              description: Make school project
 *              deadline: 2021-12-30
 *              status: active
 */

/**
 * @swagger
 * tags: 
 *  - name: User
 *    description: The user managing API
 *  - name: List
 *    description: The list managing API  
 *  - name: Item
 *    description: The item managing API 
 */

/**
 * @swagger
 * /register:
 *      post:
 *          summary: Registers new user
 *          tags: [User]
 *          requestBody:
 *              description: The user to create
 *              required: true
 *              content:
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              list:
 *                                  type: object
 *                                  $ref: '#/components/schemas/List' 
 *          responses:
 *              200: 
 *                  description: New registered user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User'                               
 */

app.post('/register',
    body('id').isEmpty(),
    body('username').isString().withMessage('username is not valid'),
    body('password').isLength({ min: 3 }).withMessage('password must have at least 3 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    user_controller.register
);

/**
 * @swagger
 * /login:
 *      post:
 *          summary: Login user
 *          tags: [User]
 *          requestBody:
 *              description: Login fields
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          responses:
 *              200: 
 *                  description: User logged in
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties: 
 *                                  message:
 *                                      type: string
 *                                  token:
 *                                      type: string
 *                                      description: Generated token
 *              400:
 *                  description: incorrect password 
 *                                                             
 */

app.post('/login',
    body('id').isEmpty(),
    body('username').isString().withMessage('username is not valid'),
    body('password').isLength({ min: 3 }).withMessage('password must have at least 3 characters'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    user_controller.login
);

/**
 * @swagger
 * /create_list:
 *      post:
 *          summary: Create new list
 *          tags: [List]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: New list properties
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/List'
 *          responses:
 *              200: 
 *                  description: New list created
  *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  list:
 *                                      type: object
 *                                      $ref: '#/components/schemas/List' 
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/create_list', checkJwt,
    body('id').isEmpty(),
    body('title').notEmpty().isString().withMessage('title is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    list_controller.createList
);

/**
 * @swagger
 * /create_item:
 *      post:
 *          summary: Create new item of a list
 *          tags: [Item]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: New item properties
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              itemId: 
 *                                  type: number
 *                              title:
 *                                  type: string
 *                                  description: The item title
 *                              description:
 *                                  type: string
 *                                  description: The item description
 *                              deadline:
 *                                  type: date
 *                                  description: The item deadline
 *                              status:
 *                                  type: string
 *                                  enum: [active, done, cancelled]
 *                                  description: The enmu types for status of item
 *                          example:
 *                              listId: 1
 *                              title: Make project
 *                              description: Make school project
 *                              deadline: 2021-12-30
 *                              status: active
 *          responses:
 *              200: 
 *                  description: New item created
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  item:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Item' 
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/create_item', checkJwt,
    body('listId').notEmpty().isNumeric(),
    body('title').notEmpty().isString().withMessage('title is not valid'),
    body('description').isString().withMessage('description is not valid'),
    body('deadline').isDate().withMessage('deadline is not valid'),
    body('status').isString().withMessage('status is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    item_controller.createItem
);

/**
 * @swagger
 * /activate:
 *      post:
 *          summary: Set item status to active
 *          tags: [Item]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: Item id
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              itemId: 
 *                                  type: number
 *          responses:
 *              200: 
 *                  description: Status of item set to active
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  item:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Item'  
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/activate', checkJwt,
    body('itemId').notEmpty().isNumeric().withMessage('listId is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    item_controller.activate
);

/**
 * @swagger
 * /cancel:
 *      post:
 *          summary: Set item status to canceled
 *          tags: [Item]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: Item id
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              itemId: 
 *                                  type: number
 *          responses:
 *              200: 
 *                  description: Status of item set to canceled
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  item:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Item' 
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/cancel', checkJwt,
    body('itemId').notEmpty().isNumeric().withMessage('listId is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    item_controller.cancel
);

/**
 * @swagger
 * /done:
 *      post:
 *          summary: Set item status to done
 *          tags: [Item]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: Item id
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              itemId: 
 *                                  type: number
 *          responses:
 *              200: 
 *                  description: Status of item set to done
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  item:
 *                                      type: object
 *                                      $ref: '#/components/schemas/Item'  
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/done', checkJwt,
    body('itemId').notEmpty().isNumeric().withMessage('listId is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    item_controller.done
);

/**
 * @swagger
 * /show_list:
 *      post:
 *          summary: Show list with its items
 *          tags: [List]
 *          requestBody:
 *              description: List id
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              listId: 
 *                                  type: number
 *          responses:
 *              200: 
 *                  description: List found
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                  list:
 *                                      type: object
 *                                      $ref: '#/components/schemas/List'  
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/show_list',
    body('listId').notEmpty().withMessage('listId is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    list_controller.showListWithItems
);

/**
 * @swagger
 * /share_list:
 *      post:
 *          summary: Share list to another user
 *          tags: [List]
 *          parameters:
 *              - in: header
 *                name: auth
 *                schema:
 *                  type: string
 *          requestBody:
 *              description: Required properties
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties: 
 *                              listId: 
 *                                  type: number 
 *                              userId: 
 *                                  type: number
 *          responses:
 *              200: 
 *                  description: List shared successfully. 
 *              400:
 *                  description: Something went wrong 
 *                                                             
 */

app.post('/share_list', checkJwt,
    body('listId').notEmpty().withMessage('listId is not valid'),
    body('userId').notEmpty().withMessage('userId is not valid'),
    (req: Request, res: Response, next: NextFunction) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw ApiError.badRequest(errors.array());
        } else {
            next();
        }
    },
    list_controller.shareList
);

app.use(apiErrorHandler);
