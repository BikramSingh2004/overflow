import { Client, Account, Avatars, Databases, Storage } from "appwrite";
// import env  from "./app/env";
import  env  from '../../app/env';


console.log("Appwrite endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);


const client = new Client()
 .setEndpoint(env.appwrite.endpoint) // Your API
 .setProject (env.appwrite.projectId); // Your project ID

const databases = new Databases (client);
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client)

export{ client, databases, account, avatars, storage}