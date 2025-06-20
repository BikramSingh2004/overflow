"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { account, databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import QuestionForm from "@/components/QuestionForm";

export default function AskPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Ask a Public Question</h1>
      <QuestionForm />
    </div>
  );
}
