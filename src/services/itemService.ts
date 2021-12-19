import { getRepository } from "typeorm";
import { Item } from "../entity/Item";
import { List } from "../entity/List";
import ApiError from "../error/apiError";
import listService from "./listService";

const NAMESPACE = "Item";

////////////////////////////////////////////////////////////////////////////////
// Service to assign given item to given list
////////////////////////////////////////////////////////////////////////////////
const assignItemtoList = async (item: Item, list: List) => {
    const listRepo = getRepository(List);

    // Push item to lists items array
    (await list.items).push(item);

    try {
        list = await listRepo.save(list);
        return list.items;
    } catch (err) {
        throw ApiError.internalServerError(`Error while assigning item: ${item.title} to list: ${list.title}`);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Service to get all items of provided list
////////////////////////////////////////////////////////////////////////////////
const getItemsOfList = async (listId: number) => {

    const listRepo = getRepository(List);
    let list: List;
    try {
        list = await listRepo.findOne({ where: { id: listId } });
        if (list) {
            return list.items;
        } else {
            throw ApiError.notFound(`No list found of id: ${listId}.`);
        }
    } catch (err) {
        throw ApiError.notFound(`No items found for list: ${list.title}.`);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Service to create new item of a list
////////////////////////////////////////////////////////////////////////////////
const createListItem = async (title: string, description: string, deadline: Date, status: string, list: List) => {
    const itemRepo = getRepository(Item);

    let item = new Item();

    // Assign provided properties to new created item 
    item.title = title,
        item.description = description,
        item.deadline = deadline,
        item.status = status,
        item.list = Promise.resolve(list);

    return await itemRepo.save(item).catch((err) => {
        throw ApiError.internalServerError(err.message);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Service to get item by its id
////////////////////////////////////////////////////////////////////////////////
const getItemById = async (itemId: number) => {
    const itemRepo = getRepository(Item);

    return await itemRepo.findOne({ where: { id: itemId } }).catch((err) => {
        throw ApiError.notFound(`No item found of id: ${itemId}.`);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Service to get all items of provided list
////////////////////////////////////////////////////////////////////////////////
const getAllItemsOfList = async (listId: number) => {
    const listRepo = getRepository(List);

    let list: List;
    try {
        list = await listRepo.findOne({ where: { id: listId } });
        if (list) {
            return list.items
        } else {
            throw ApiError.notFound(`No list found of id: ${listId}.`);
        }
    } catch (err) {
        throw ApiError.notFound(`No items found.`);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Service to update item with provided properties
////////////////////////////////////////////////////////////////////////////////
const updateItem = async (itemId: number, title: string, description: string, deadline: Date, status: string) => {
    const itemRepo = getRepository(Item);

    let item: Item = await getItemById(itemId);

    if (!item) {
        throw ApiError.badRequest("Item does not exist");
    }

    // Update all properties of given item
    item.title = title,
        item.description = description,
        item.deadline = deadline,
        item.status = status

    return await itemRepo.save(item).catch((err) => {
        throw ApiError.internalServerError(err.message);
    });
}

////////////////////////////////////////////////////////////////////////////////
// Check if a user can edit an entity of type item
////////////////////////////////////////////////////////////////////////////////
async function canEdit(username: string, itemId: number) {

    const lists = await listService.getListsOfUser(username);
    const item = await itemService.getItemById(itemId);
            
    // if item does not exist, return error
    if (!item) {
        throw ApiError.badRequest("Item does not exist");
    }

    // iterate thru the users lists and check, if the parent list of the item we 
    // are looking for is among them
    for (let i = 0; i < lists.length; i++) {
        if ((await item.list).id === lists[i].id)
            return true;
    }
    return false;
}


const itemService = {
    createListItem,
    assignItemtoList,
    updateItem,
    getItemsOfList,
    getItemById,
    getAllItemsOfList,
    canEdit
}

export default itemService;