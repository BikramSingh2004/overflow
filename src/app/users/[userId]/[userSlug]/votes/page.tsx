import Pagination from "@/components/Pagination";
import QuestionCard from "@/components/QuestionCard";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";

// ✅ Enable server-side runtime for Appwrite SDK
export const runtime = "nodejs";

// ✅ Props typed according to Next.js App Router (no Promise)
export default async function Page({
  params,
  searchParams,
}: {
  params: { userId: string; userSlug: string };
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page || "1");

  const queries = [
    Query.equal("authorId", params.userId),
    Query.orderDesc("$createdAt"),
    Query.offset((page - 1) * 25),
    Query.limit(25),
  ];

  const questions = await databases.listDocuments(db, questionCollection, queries);

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, votes] = await Promise.all([
        users.get<UserPrefs>(ques.authorId),
        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),
        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: votes.total,
        author: {
          $id: author.$id,
          reputation: author.prefs.reputation,
          name: author.name,
        },
      };
    })
  );

  return (
    <div className="px-4">
      <div className="mb-4">
        <p>{questions.total} questions</p>
      </div>
      <div className="mb-4 max-w-3xl space-y-6">
        {questions.documents.map((ques) => (
          <QuestionCard key={ques.$id} ques={ques} />
        ))}
      </div>
      <Pagination total={questions.total} limit={25} />
    </div>
  );
}
