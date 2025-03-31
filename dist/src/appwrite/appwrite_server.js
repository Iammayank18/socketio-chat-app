"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRooms = exports.getMessages = exports.storeMessage = exports.createRoom = exports.getUserById = exports.getUserByEmail = exports.createUserInDb = exports.database = void 0;
const node_appwrite_1 = require("node-appwrite");
const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERCOLLECTIONID,
    apiKey: process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
    chatCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID,
    roomCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CHATROOMID,
};
console.log(appwriteConfig);
const client = new node_appwrite_1.Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.appwriteConfig);
exports.database = new node_appwrite_1.Databases(client);
const createUserInDb = async (doc, email, avatar, password) => {
    try {
        const db = await exports.database.createDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, node_appwrite_1.ID.unique(), {
            accountId: doc.$id,
            email: email,
            avatar: avatar,
            password: password,
        });
        return db;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.createUserInDb = createUserInDb;
const getUserByEmail = async (email) => {
    try {
        const getUser = await exports.database.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, "", [node_appwrite_1.Query.equal("email", email)]);
        return getUser;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (id) => {
    try {
        const getUser = await exports.database.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, id);
        return getUser;
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.getUserById = getUserById;
const createRoom = async ({ room, user }) => {
    try {
        await exports.database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASEID, process.env.NEXT_PUBLIC_APPWRITE_CHATROOMID, node_appwrite_1.ID.unique(), { name: room, user });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createRoom = createRoom;
const storeMessage = async ({ room, user, message }) => {
    try {
        await exports.database.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASEID, process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID, node_appwrite_1.ID.unique(), { room, message, user });
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.storeMessage = storeMessage;
const getMessages = async ({ room }) => {
    try {
        return await exports.database.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASEID, process.env.NEXT_PUBLIC_APPWRITE_CHATCOLLECTIONID, "", [node_appwrite_1.Query.equal("room", room)]);
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getMessages = getMessages;
const getRooms = async () => {
    try {
        return await exports.database.getDocument(appwriteConfig.databaseId, appwriteConfig.roomCollectionId, "");
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.getRooms = getRooms;
