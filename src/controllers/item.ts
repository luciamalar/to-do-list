import { NextFunction, Request, Response } from "express";
import logging from '../utils/logging';
import listService from "../services/listService";
import itemService from "../services/itemService";
import ApiError from "../error/apiError";

const NAMESPACE = "Item";

async function canEdit(username: string, id: number, type: string) {

    try {
        const lists = await listService.getListsOfUser(username);
        const item = await itemService.getItemById(id);

        if (type == 'item') {
            for (var i = 0; i < lists.length; i++) {
                if ((await item.list).id == lists[i].id)
                    return true;
            }
            return false;
        } else if (type == 'list') {
            for (var i = 0; i < lists.length; i++) {
                if (lists[i].id == id)
                    return true;
            }
            return false;
        } else {
            throw ApiError.badRequest("Incorrect type value. Can be item or list")
        }
    } catch (err) {
        throw ApiError.internalServerError(err);
    }
}

const createItem = async (req: Request, res: Response, next: NextFunction) => {

    const { listId, title, description, deadline, status } = await req.body;

    try {
        const canCreate = await canEdit(req.body.username, listId, "list");
        if (!canCreate) {
            next(ApiError.badRequest("User has to be owner of list to create item of the list"));
            return;
        } else {
            listService.getListById(listId).then((list) => {
                itemService.createListItem(title, description, deadline, status, list).then((item) => {
                    itemService.assignItemtoList(item, list).then((response) => {
                        if (response) {
                            return res.json({
                                message: `Item: ${item.title} attached to list: ${list.title}`
                            })
                        } else {
                            throw ApiError.internalServerError("Could not attach item to list");
                        }
                    }).catch((err) => {
                        throw err;
                    });
                }).catch((err) => {
                    throw err;
                });
            }).catch((err) => {
                throw err;
            })
        }

    } catch (err) {
        next(err);
    }
}

const activate = async (req: Request, res: Response, next: NextFunction) => {

    const { itemId, title, description, deadline, status } = await req.body;

    try {
        const canUpdate = await canEdit(req.body.username, itemId, "item");

        if (!canUpdate) {
            next(ApiError.badRequest("User has to be owner of list to update item of the list"));
            return;
        } else {
            const item = await itemService.updateItem(itemId, 'active');
            if (item) {
                return res.json({
                    message: "Status set to 'active'",
                    item: item
                })
            } else {
                throw ApiError.internalServerError("Could not update item");
            }
        }
    } catch (err) {
        next(err);
    }
}

const cancel = async (req: Request, res: Response, next: NextFunction) => {

    const { itemId, title, description, deadline, status } = await req.body;

    try {
        const canUpdate = await canEdit(req.body.username, itemId, "item");

        if (!canUpdate) {
            next(ApiError.badRequest("User has to be owner of list to update item of the list"));
            return;
        } else {
            const item = await itemService.updateItem(itemId, 'cancelled');
            if (item) {
                return res.json({
                    message: "Status set to 'cancelled'",
                    item: item
                })
            } else {
                throw ApiError.internalServerError("Could not update item");
            }
        }
    } catch (err) {
        next(err);
    }
}

const done = async (req: Request, res: Response, next: NextFunction) => {

    const { itemId, title, description, deadline, status } = await req.body;

    try {
        const canUpdate = await canEdit(req.body.username, itemId, "item");

        if (!canUpdate) {
            next(ApiError.badRequest("User has to be owner of list to update item of the list"));
            return;
        } else {
            const item = await itemService.updateItem(itemId, 'done');
            if (item) {
                return res.json({
                    message: "Status set to 'done'",
                    item: item
                })
            } else {
                throw ApiError.internalServerError("Could not update item");
            }
        }
    } catch (err) {
        next(err);
    }
}

export default { createItem, activate, cancel, done };