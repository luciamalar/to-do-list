import { Request, Response } from "express";
import listService from "../services/listService";
import itemService from "../services/itemService";
import ApiError from "../error/apiError";
import { List } from "../entity/List";
import { Item } from "../entity/Item";

const NAMESPACE = "Item";

async function canEdit(username: string, id: number, type: string) {

    try {
        const lists = await listService.getListsOfUser(username);
        const item = await itemService.getItemById(id);

        if (!item && type === 'item') {
            throw ApiError.badRequest("Item does not exist");
        }

        if (type === 'item') {
            for (let i = 0; i < lists.length; i++) {
                if ((await item.list).id === lists[i].id)
                    return true;
            }
            return false;
        } else if (type === 'list') {
            for (let i = 0; i < lists.length; i++) {
                if (lists[i].id === id)
                    return true;
            }
            return false;
        } else {
            throw ApiError.badRequest("Incorrect type value. Must be item or list")
        }
    } catch (err) {
        throw err;
    }
}

const createItem = async (req: Request, res: Response) => {

    const { listId, title, description, deadline, status } = await req.body;

    const canCreate = await canEdit(req.body.username, listId, "list");
    if (!canCreate) {
        throw ApiError.badRequest("User has to be owner of list to create item of the list");
    } else {
        let list: List = await listService.getListById(listId);
        let item: Item = await itemService.createListItem(title, description, deadline, status, list);
        let newItem: Item[] = await itemService.assignItemtoList(item, list);

        if (newItem) {
            return res.json({
                message: `Item: ${item.title} attached to list: ${list.title}`,
                itemId: item.id
            })
        } else {
            throw ApiError.internalServerError("Could not attach item to list");
        }
    }
}

const updateItem = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { title, description, deadline, status } = await req.body;

    const canUpdate = await canEdit(req.body.username, Number(id), "item");

    if (!canUpdate) {
        throw ApiError.badRequest("User has to be owner of list to update item of the list");
    } else {
        const item = await itemService.updateItem(Number(id), title, description, deadline, status);
        if (item) {
            return res.json({
                message: "Item updated",
                item: item
            })
        } else {
            throw ApiError.internalServerError("Could not update item");
        }
    }

}

export default { createItem, updateItem };