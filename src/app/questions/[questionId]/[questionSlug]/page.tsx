export const runtime = "nodejs"; // ✅ Important if using Appwrite

import { db, questionCollection, answerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { notFound } from "next/navigation";
import { Models } from "appwrite";
import { Query } from "node-appwrite";
import QuestionClient from "./QuestionClient";

export default async function QuestionPage({
  params,
}: {
  params: { questionId: string; questionSlug: string };
}) {
  const { questionId } = params;

  try {
    const question = await databases.getDocument<Models.Document>(
      db,
      questionCollection,
      questionId
    );

    const answers = await databases.listDocuments(db, answerCollection, [
      Query.equal("questionId", questionId),
      Query.orderDesc("$createdAt"),
    ]);

    return (
      <QuestionClient
        question={question}
        answers={answers}
      />
    );
  } catch (err) {
    console.error("Failed to load question:", err);
    return notFound();
  }
}
