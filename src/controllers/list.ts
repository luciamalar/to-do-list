import e, { NextFunction, Request, Response } from "express";
import itemService from "../services/itemService";
import listService from "../services/listService";
import userService from "../services/userService";
import { List } from "../entity/List";
import { User } from "../entity/User";
import { Item } from "../entity/Item";
import ApiError from "../error/apiError";

const NAMESPACE = "List";

const createList = async (req: Request, res: Response, next: NextFunction) => {

    const title = await req.body.title;
    try {
        userService.getUser(req.body.username).then((user) => {
            listService.createList(title, user).then((list) => {
                listService.assignListToUser(user, list).then((response) => {
                    if (response) {
                        return res.json({
                            message: `List: ${list.title} created and assigned to user: ${user.username}`
                        });
                    } else {
                        throw ApiError.internalServerError("Could not attach list to user");
                    }
                }).catch((err) => {
                    throw err;
                })
            }).catch((err) => {
                throw err;
            });
        }).catch((err) => {
            throw err;
        });
    } catch (err) {
        next(err);
    }
}
const showListWithItems = async (req: Request, res: Response, next: NextFunction) => {
    const listId = await req.body.listId;

    try {

        const list: List = await listService.getListById(listId);
        const items: Item[] = await itemService.getAllItemsOfList(listId);
        return res.json({
            message: "List found",
            list: list,
            items: items
        })

    } catch (err) {
        next(err);
    }

}

async function canEdit(username: string, listId: number) {

    try {
        const lists = await listService.getListsOfUser(username);

        for (var i = 0; i < lists.length; i++) {
            if (lists[i].id == listId)
                return true;
        }
        return false;
    } catch (err) {
        throw ApiError.internalServerError(err);
    }
}

const shareList = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, listId } = await req.body;

    try {
        const canShare = canEdit(req.body.username, listId);

        if (!canShare) {
            next(ApiError.badRequest("User has to be owner of list to share it"));
            return;
        } else {
            const user = await listService.shareList(listId, userId);
            if (user) {
                return res.json({
                    message: `List was successfully shared to user`
                })
            }
        }
    } catch (err) {
        next(err);
    }
}

export default {
    createList,
    showListWithItems,
    shareList
}