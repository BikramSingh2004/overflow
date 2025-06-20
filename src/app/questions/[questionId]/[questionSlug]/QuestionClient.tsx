"use client";

import React from "react";
import VoteButtons from "@/components/VoteButtons";
import Answers from "@/components/Answers";
import Comments from "@/components/Comments";
import { Models } from "appwrite";

const QuestionClient = ({
  question,
  answers,
}: {
  question: Models.Document;
  answers?: Models.DocumentList<Models.Document>; // optional for safety
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="flex items-start gap-4">
        <VoteButtons
          type="question"
          id={question?.$id}
          upvotes={question?.upvotesDocuments ?? { documents: [], total: 0 }}
          downvotes={question?.downvotesDocuments ?? { documents: [], total: 0 }}
        />
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-4">{question?.title}</h1>
          <p className="text-gray-700 mb-4">{question?.content}</p>
          <div className="text-sm text-gray-500 mb-4">
            Tags:{" "}
            {question?.tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-block bg-gray-800 text-white px-2 py-0.5 rounded mr-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Comments
        comments={question?.comments ?? { documents: [], total: 0 }}
        type="question"
        typeId={question?.$id}
        className="mt-8"
      />

      <div className="mt-10">
        <Answers
          answers={answers ?? { documents: [], total: 0 }}
          questionId={question?.$id}
        />
      </div>
    </div>
  );
};

export default QuestionClient;
