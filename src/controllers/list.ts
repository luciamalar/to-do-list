import { Request, Response } from "express";
import itemService from "../services/itemService";
import listService from "../services/listService";
import userService from "../services/userService";
import { List } from "../entity/List";
import { Item } from "../entity/Item";
import { User } from "../entity/User";
import ApiError from "../error/apiError";

const NAMESPACE = "List";

/////////////////////////////////////////////////////////////////////////
// Creates new list with given properties
////////////////////////////////////////////////////////////////////////
const createList = async (req: Request, res: Response) => {

    const title = await req.body.title;

    // Get logged in user
    const user: User = await userService.getUser(req.body.username);

    // Create new list
    const list: List = await listService.createList(title, user);

    // Assign new list to logged in user
    const newList: List = await listService.assignListToUser(user, list);

    if (newList) {
        return res.json({
            message: `List: ${newList.title} created and assigned to user: ${user.username}`,
            listId: newList.id
        });
    } else {
        throw ApiError.internalServerError("Could not attach list to user");
    }
}


/////////////////////////////////////////////////////////////////////////////////
// Gets list with all its items
/////////////////////////////////////////////////////////////////////////////////
const showListWithItems = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Gets list from provided id
    const list: List = await listService.getListById(Number(id));

    // Gets all its items
    const items: Item[] = await itemService.getAllItemsOfList(Number(id));

    return res.json({
        message: "List found",
        list: list,
        items: items
    })

}
////////////////////////////////////////////////////////////////////////////////////
// Shares list to another user
///////////////////////////////////////////////////////////////////////////////////
const shareList = async (req: Request, res: Response) => {
    const { userId } = await req.body;
    const { id } = req.params;

    // Check if logged in user is owner of provided list
    const canShare = await listService.canEdit(req.body.username, Number(id));

    if (canShare) {
        // Share list to another user
        const list = await listService.shareList(Number(id), Number(userId));
        if (list) {
            return res.json({
                message: `List was successfully shared to user`
            })
        }
    } else {
        throw ApiError.badRequest("User has to be owner of list to share it");
    }
}

export default {
    createList,
    showListWithItems,
    shareList
}