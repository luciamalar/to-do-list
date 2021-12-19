import { getRepository } from "typeorm";
import { List } from "../entity/List";
import { User } from "../entity/User";
import userService from "./userService";
import ApiError from "../error/apiError";

const NAMESPACE = "List";


//////////////////////////////////////////////////////////////////////////////////
// Service to create new list
/////////////////////////////////////////////////////////////////////////////////
const createList = async (title: string, user: User) => {
    const listRepo = getRepository(List);
    const foundlist: List = await listRepo.findOne({ where: { title: title } });

    //check if list with that title already exists
    if (foundlist) {
        throw ApiError.badRequest(`List with this title already exists`);
    }

    let list: List = new List();

    // assign given properties to new created list
    list.title = title;
    list.author = Promise.resolve(user);

    return list;
}

////////////////////////////////////////////////////////////////////////////////////
// Service to assign list to user
////////////////////////////////////////////////////////////////////////////////////
const assignListToUser = async (user: User, list: List) => {
    const userRepo = getRepository(User);

    // Push given list to users lists array
    (await user.lists).push(list);

    await userRepo.save(user).catch((err) => {
        throw ApiError.internalServerError(`Error while assigning list: ${list.title} to user: ${user.username}`);
    });

    return list;

}

////////////////////////////////////////////////////////////////////////////////
// Service to get list by id
////////////////////////////////////////////////////////////////////////////////
const getListById = async (listId: number) => {
    const listRepo = getRepository(List);

    const list: List = await listRepo.findOne({ where: { id: listId } });
    if (list) {
        return list;
    }
    else {
        throw ApiError.notFound(`No list found of id: ${listId}.`);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Service to get all list of one user
////////////////////////////////////////////////////////////////////////////////
const getListsOfUser = async (username: string) => {

    const userRepo = getRepository(User);

    const user: User = await userRepo.findOne({ where: { username: username } });
    if (user) {
        return user.lists;
    } else {
        throw ApiError.notFound(`No lists found for user: ${username}.`);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Service to share list to another user
////////////////////////////////////////////////////////////////////////////////
const shareList = async (listId: number, userId: number) => {

    // Get user to whom we want to share list
    const user: User = await userService.getUserById(userId);

    // Get list to share
    const list: List = await listService.getListById(listId);

    return assignListToUser(user, list).catch((err) => { throw err; });
}

////////////////////////////////////////////////////////////////////////////////
// Check if a user can edit an entity of type in list
////////////////////////////////////////////////////////////////////////////////
async function canEdit(username: string, listId: number) {

    const lists = await listService.getListsOfUser(username);

    // if item does not exist, return error
    if (!lists) {
        throw ApiError.badRequest("Item does not exist");
    }

    // iterate thru the users lists and check, if the list we are looking for is among them
    for (let i = 0; i < lists.length; i++) {
        if (lists[i].id === listId)
            return true;
    }
    return false;
}

const listService = {
    createList,
    assignListToUser,
    getListById,
    getListsOfUser,
    shareList,
    canEdit
}

export default listService;