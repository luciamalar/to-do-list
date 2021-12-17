import { getRepository } from "typeorm";
import { List } from "../entity/List";
import { User } from "../entity/User";
import userService from "./userService";
import ApiError from "../error/apiError";

const NAMESPACE = "List";

const createList = async (title: string, user: User) => {
    const listRepo = getRepository(List);
    const foundlist: List = await listRepo.findOne({ where: { title: title } });

    //check if list with that title already exists
    if (foundlist) {
        throw ApiError.badRequest(`List with this title already exists`);
    }

    let list: List = new List();

    list.title = title;
    list.author = Promise.resolve(user);

    return list;
}

const assignListToUser = async (user: User, list: List) => {
    const userRepo = getRepository(User);

    (await user.lists).push(list);

    try {
        await userRepo.save(user);
    } catch {
        throw ApiError.internalServerError(`Error while assigning list: ${list.title} to user: ${user.username}`);
    }

    return list;

}

const getListById = async (listId: number) => {
    const listRepo = getRepository(List);
    try {
        const list: List = await listRepo.findOne({ where: { id: listId } });
        if (list)
            return list;
        else
            throw ApiError.notFound(`No list found of id: ${listId}.`)
    } catch (err) {
        throw err;
    }
}

const getListsOfUser = async (username: string) => {

    const userRepo = getRepository(User);
    try {
        const user: User = await userRepo.findOne({ where: { username: username } });
        return user.lists;

    } catch (err) {
        throw ApiError.notFound(`No lists found for user: ${username}.`);
    }
}

const shareList = async (listId: number, userId: number) => {
    const user: User = await userService.getUserById(userId);
    const list: List = await listService.getListById(listId);

    return assignListToUser(user, list).catch((err) => { throw err; });
}

const listService = {
    createList,
    assignListToUser,
    getListById,
    getListsOfUser,
    shareList
}

export default listService;