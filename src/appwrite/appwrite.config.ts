import { Client, Account, Databases, ID, Query, Storage } from "appwrite";

import { AccountResult } from "./appwrite.types";
import { encryptPassword, getErrorMessage } from "../functions/helper.function";

interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  userCollectionId: string;
  bucketId: string;
}

const appwriteConfig: AppwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTID,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASEID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERCOLLECTIONID,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKETID,
};

console.log(appwriteConfig);

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export const createUser = async (payload: {
  email: string;
  password: string;
  file: File;
}) => {
  const { email, password, file } = payload;

  try {
    const uploadDocument = await uploadFile(email, file);
    const fileRes = await getFile(uploadDocument.$id);

    console.log(fileRes);

    const newAccount = await account.create(
      ID.unique(),
      email.toLowerCase(),
      password,
      email.toLowerCase()
    );
    if (!newAccount) {
      throw new Error("Account creation failed");
    }

    // const getInitials = avatars.getInitials(email);

    const encryptedPassword = await encryptPassword(password);

    const createDb = await createUserInDb(
      newAccount,
      email.toLowerCase(),
      fileRes.href as unknown as URL,
      encryptedPassword
    );

    if (!createDb) {
      throw new Error("Failed to create user in database");
    }

    await signin({ email, password });

    return createDb;
  } catch (e: any) {
    throw new Error(getErrorMessage(e) || "An unknown error occurred");
  }
};

export const signin = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session);
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const logoutUser = async () => {
  return await account.deleteSession("current");
};

export const updatePassword = async (password: string, oldPassword: string) => {
  try {
    return await account.updatePassword(password, oldPassword);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAccount = async (): Promise<AccountResult> => {
  try {
    const currentAccount: any = await account.get();

    const currentDbUser: any = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      "",
      [Query.equal("accountId", currentAccount.$id)]
    );

    return { session: currentAccount, db: currentDbUser };
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createUserInDb = async (
  doc: { $id: string },
  email: string,
  avatar: URL,
  password: string
) => {
  try {
    const db = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      ID.unique(),
      {
        accountId: doc.$id,
        email: email,
        avatar: avatar,
        password: password,
      }
    );
    return db;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const updateUser = async (data: any) => {
  try {
    const currentUser = await getAccount();
    const updateRes = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      currentUser.db.documents[0].$id,
      data
    );
    return updateRes;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const emailOtp = async () => {
  try {
    const currentUser = await getAccount();
    return await account.createEmailToken(
      currentUser.session.$id,
      currentUser.session.email,
      true
    );
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const getUser = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      "",
      [Query.equal("email", email)]
    );
    return getUser.documents[0];
  } catch (e: any) {
    throw new Error(e);
  }
};

export const getUserById = async (id: string) => {
  try {
    const getUser = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      id
    );
    return getUser;
  } catch (e: any) {
    throw new Error(e);
  }
};

export const uploadFile = async (fileId: string, file: File) => {
  const fid = fileId.replace("@", "_").replace(".", "");
  try {
    return await storage.createFile(appwriteConfig.bucketId, fid, file);
  } catch (error) {
    throw new Error(error);
  }
};

export const getFile = async (fileId: string) => {
  try {
    return await storage.getFileView(appwriteConfig.bucketId, fileId);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllFiles = async () => {
  try {
    return await storage.listFiles(appwriteConfig.bucketId);
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllUsers = async () => {
  try {
    return await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId
    );
  } catch (error) {
    throw new Error(error);
  }
};
