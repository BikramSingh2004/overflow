import { Client, Account, Databases } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !project) {
  throw new Error("Appwrite environment variables are not set correctly.");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(project);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
