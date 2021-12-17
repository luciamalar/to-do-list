import { getRepository } from "typeorm";
import { Item } from "../entity/Item";
import { List } from "../entity/List";
import ApiError from "../error/apiError";

const NAMESPACE = "Item";

const assignItemtoList = async (item: Item, list: List) => {
    const listRepo = getRepository(List);

    (await list.items).push(item);

    try {
        list = await listRepo.save(list);
        return list.items;
    } catch (err) {
        throw ApiError.internalServerError(`Error while assigning item: ${item.title} to list: ${list.title}`);

    }
}

const getItemsOfList = async (listId: number) => {

    const listRepo = getRepository(List);
    let list: List;
    try {
        list = await listRepo.findOne({ where: { id: listId } });
        return list.items;
    } catch (err) {
        throw ApiError.notFound(`No items found for list: ${list.title}.`);
    }
}

const createListItem = async (title: string, description: string, deadline: Date, status: string, list: List) => {
    const itemRepo = getRepository(Item);

    let item = new Item();

    item.title = title,
        item.description = description,
        item.deadline = deadline,
        item.status = status,
        item.list = Promise.resolve(list);

    try {
        item = await itemRepo.save(item);
        return item;
    } catch (err) {
        throw ApiError.internalServerError("Error while creating new list");
    }
}

const getItemById = async (itemId: number) => {
    const itemRepo = getRepository(Item);

    return await itemRepo.findOne({ where: { id: itemId } }).catch((err) => {
        throw ApiError.notFound(`No item found of id: ${itemId}.`);
    });
}

const getAllItemsOfList = async (listId: number) => {
    const listRepo = getRepository(List);

    let list: List;
    try {
        list = await listRepo.findOne({ where: { id: listId } });
        return list.items
    } catch (err) {
        throw ApiError.notFound(`No items found}.`);
    }
}

const updateItem = async (itemId: number, title: string, description: string, deadline: Date, status: string) => {
    const itemRepo = getRepository(Item);

    let item: Item = await getItemById(itemId);

    if (!item) {
        throw ApiError.badRequest("Item does not exist");
    }

    item.title = title,
        item.description = description,
        item.deadline = deadline,
        item.status = status

    return await itemRepo.save(item).catch((err) => {
        throw ApiError.internalServerError(err.message);
    });
}


const itemService = {
    createListItem,
    assignItemtoList,
    updateItem,
    getItemsOfList,
    getItemById,
    getAllItemsOfList
}

export default itemService;