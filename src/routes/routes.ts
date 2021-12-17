import express, { Request, Response, NextFunction } from 'express';
import "reflect-metadata";
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import user_controller from '../controllers/user';
import list_controller from '../controllers/list';
import item_controller from '../controllers/item';
import { checkJwt } from "../middleware/authorization";
import {
    expressValidator, loginValidator, registerValidator, createListValidator,
    createItemValidator, flagItemValidator, showListValidator, shareListValidator
} from '../middleware/validator';

const loadRoutes = async (app: express.Application) => {

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

    const specs = swaggerJSDoc(options);

    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

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
     * /auth/register:
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
     *                          $ref: '#/components/schemas/User' 
     *          responses:
     *              200: 
     *                  description: New registered user
     *                  content:
     *                      application/json:
     *                          schema:
     *                              type: object
     *                              properties: 
     *                                  message:
     *                                      type: string                          
     */

    app.post('/auth/register',
        registerValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            user_controller.register(req, res, next).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /auth/login:
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

    app.post('/auth/login',
        loginValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            user_controller.login(req, res).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /list:
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

    app.post('/list',
        checkJwt,
        createListValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            list_controller.createList(req, res).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /item:
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

    app.post('/item',
        checkJwt,
        createItemValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            item_controller.createItem(req, res).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /item/{id}/update/:
     *      put:
     *          summary: Updates provided item
     *          tags: [Item]
     *          parameters:
     *              - in: header
     *                name: auth
     *                schema:
     *                  type: string
     *              - in: path
     *                name: id
     *                required: true
     *                schema:
     *                  type: number
     *          requestBody:
     *              description: Item properties to update
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          $ref: '#/components/schemas/Item'
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

    app.put('/item/:id/update',
        checkJwt,
        flagItemValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            item_controller.updateItem(req, res).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /list/{id}:
     *      get:
     *          summary: Show list with its items
     *          tags: [List]
     *          parameters:
     *              - in: path
     *                name: id
     *                required: true
     *                schema:
     *                  type: number
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

    app.get('/list/:id',
        showListValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            list_controller.showListWithItems(req, res).catch((err) => {
                next(err);
            })
        }
    );

    /**
     * @swagger
     * /list/{id}/share:
     *      post:
     *          summary: Share list to another user
     *          tags: [List]
     *          parameters:
     *              - in: header
     *                name: auth
     *                schema:
     *                  type: string
     *              - in: path
     *                name: id
     *                required: true
     *                schema:
     *                  type: number
     *          requestBody:
     *              description: Required properties
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties: 
     *                              userId: 
     *                                  type: number
     *          responses:
     *              200: 
     *                  description: List shared successfully. 
     *              400:
     *                  description: Something went wrong 
     *                                                             
     */

    app.post('/list/:id/share',
        checkJwt,
        shareListValidator,
        expressValidator,
        async (req: Request, res: Response, next: NextFunction) => {
            list_controller.shareList(req, res).catch((err) => {
                next(err);
            })
        }
    );
};

export default loadRoutes;