import e, { NextFunction, Request, Response } from "express";
import itemService from "../services/itemService";
import listService from "../services/listService";
import userService from "../services/userService";
import { List } from "../entity/List";
import { Item } from "../entity/Item";
import ApiError from "../error/apiError";
import { User } from "../entity/User";

const NAMESPACE = "List";

const createList = async (req: Request, res: Response, next: NextFunction) => {

    const title = await req.body.title;

    try {
        let user: User = await userService.getUser(req.body.username);
        let list: List = await listService.createList(title, user);
        let newList: List = await listService.assignListToUser(user, list);

        if (newList) {
            return res.json({
                message: `List: ${newList.title} created and assigned to user: ${user.username}`,
                listId: newList.id
            });
        } else {
            throw ApiError.internalServerError("Could not attach list to user");
        }

    } catch (err) {
        next(err);
    }
}

const showListWithItems = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {

        const list: List = await listService.getListById(Number(id));
        const items: Item[] = await itemService.getAllItemsOfList(Number(id));
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
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].id === listId)
                return true;
        }
        return false;
    } catch (err) {
        throw ApiError.internalServerError(err);
    }
}

const shareList = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = await req.body;
    const { id } = req.params;

    try {
        const canShare = await canEdit(req.body.username, Number(id));

        if (!canShare) {
            next(ApiError.badRequest("User has to be owner of list to share it"));
            return;
        } else {
            const user = await listService.shareList(Number(id), Number(userId));
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