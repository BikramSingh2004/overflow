import { db, questionCollection, answerCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { notFound } from "next/navigation";
import { Models } from "appwrite";
import { Query } from "node-appwrite";
import QuestionClient from "./QuestionClient"; // 👈 Client Component

// ✅ No need to type params as Promise
type Props = {
  params: {
    questionId: string;
    questionSlug: string;
  };
};


// ✅ Await props at the top level
// export default async function QuestionPage(props: Promise<Props>) {
//   const { params } = await props;
// export default async function QuestionPageActual({ params }: Props) {
//
export default async function QuestionPage(props: Promise<Props>) {
  const { params } = await props;

  try {
    const question = await databases.getDocument<Models.Document>(
      db,
      questionCollection,
      params.questionId
    );

    const answers = await databases.listDocuments(db, answerCollection, [
      Query.equal("questionId", params.questionId),
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
