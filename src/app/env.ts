
 const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  throw new Error("Missing Appwrite environment variables!");
}

const env = {
  appwrite: {
    endpoint,
    projectId,
  },
};

export default env;
