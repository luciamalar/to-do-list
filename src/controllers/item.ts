import { Request, Response } from "express";
import listService from "../services/listService";
import itemService from "../services/itemService";
import ApiError from "../error/apiError";
import { List } from "../entity/List";
import { Item } from "../entity/Item";

const NAMESPACE = "Item";

//////////////////////////////////////////////////////////////////////////////////////
// Creates new item of given list
/////////////////////////////////////////////////////////////////////////////////////
const createItem = async (req: Request, res: Response) => {

    const { listId, title, description, deadline, status } = await req.body;

    // Checks if user is owner of list we want to create item to
    const canCreate = await listService.canEdit(req.body.username, listId);

    if (canCreate) {

        // Get list to which we want to create new item
        let list: List = await listService.getListById(listId);

        // Create new item
        let item: Item = await itemService.createListItem(title, description, deadline, status, list);

        // Attach new created item to given list
        let newItem: Item[] = await itemService.assignItemtoList(item, list);

        if (newItem) {
            return res.json({
                message: `Item: ${item.title} attached to list: ${list.title}`,
                itemId: item.id
            })
        } else {
            throw ApiError.internalServerError("Could not attach item to list");
        }
    } else {
        throw ApiError.badRequest("User has to be owner of list to create item of the list");
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////
// Updates item with provided properties
////////////////////////////////////////////////////////////////////////////////////////////
const updateItem = async (req: Request, res: Response) => {

    const { id } = req.params;
    const { title, description, deadline, status } = await req.body;

    // Checks if user is owner the list to which given item belongs
    const canUpdate = await itemService.canEdit(req.body.username, Number(id));

    if (canUpdate) {

        // Update item with given properties
        const item = await itemService.updateItem(Number(id), title, description, deadline, status);
        if (item) {
            return res.json({
                message: "Item updated",
                item: item
            })
        } else {
            throw ApiError.internalServerError("Could not update item");
        }
    } else {
        throw ApiError.badRequest("User has to be owner of list to update item of the list");
    }

}

export default { createItem, updateItem };