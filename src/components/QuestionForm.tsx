"use client";

import RTE from "@/components/RTE";
import Meteors from "@/components/magicui/meteors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/utils";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "relative flex w-full flex-col space-y-2 overflow-hidden rounded-xl border border-white/20 bg-slate-950 p-4",
                className
            )}
        >
            <Meteors number={30} />
            {children}
        </div>
    );
};

const QuestionForm = ({ question }: { question?: Models.Document }) => {
    const { user } = useAuthStore();
    const [tag, setTag] = React.useState("");
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: "", // default empty
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        if (user?.$id) {
            setFormData(prev => ({ ...prev, authorId: user.$id }));
        }
    }, [user]);

    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS;
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
            if (Date.now() > end) return;
            Confetti({ particleCount: 2, angle: 60, spread: 55, startVelocity: 60, origin: { x: 0, y: 0.5 }, colors });
            Confetti({ particleCount: 2, angle: 120, spread: 55, startVelocity: 60, origin: { x: 1, y: 0.5 }, colors });
            requestAnimationFrame(frame);
        };
        frame();
    };

    const create = async () => {
        if (!formData.attachment) throw new Error("Please upload an image");

        const storageResponse = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),
            formData.attachment
        );

        const response = await databases.createDocument(db, questionCollection, ID.unique(), {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: storageResponse.$id,
        });

        loadConfetti();

        return response;
    };

    const update = async () => {
        if (!question) throw new Error("Please provide a question");

        const attachmentId = await (async () => {
            if (!formData.attachment) return question?.attachmentId as string;

            await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

            const file = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );

            return file.$id;
        })();

        const response = await databases.updateDocument(db, questionCollection, question.$id, {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: attachmentId,
        });

        return response;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = question ? await update() : await create();
            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
        } catch (error: any) {
            setError(() => error.message);
        }

        setLoading(false);
    };

    if (!user) {
        return (
            <div className="text-center py-10 text-red-500 font-semibold">
                Please login to ask or update a question.
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={submit}>
            {error && (
                <LabelInputContainer>
                    <div className="text-center text-red-500">{error}</div>
                </LabelInputContainer>
            )}
            <LabelInputContainer>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. How to find index in R?"
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="content">Details</Label>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="image">Image</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setFormData(prev => ({ ...prev, attachment: file }));
                    }}
                />
            </LabelInputContainer>
            <LabelInputContainer>
                <Label htmlFor="tag">Tags</Label>
                <div className="flex gap-2">
                    <Input
                        id="tag"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                        placeholder="e.g. javascript"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (tag.trim()) {
                                setFormData(prev => ({
                                    ...prev,
                                    tags: new Set([...Array.from(prev.tags), tag.trim()]),
                                }));
                                setTag("");
                            }
                        }}
                        className="rounded bg-slate-700 px-4 py-2 text-white text-sm"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {Array.from(formData.tags).map((tag, index) => (
                        <span key={index} className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                            {tag}
                            <button
                                type="button"
                                onClick={() =>
                                    setFormData(prev => ({
                                        ...prev,
                                        tags: new Set(Array.from(prev.tags).filter(t => t !== tag)),
                                    }))
                                }
                            >
                                <IconX size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            </LabelInputContainer>
            <button
                type="submit"
                disabled={loading}
                className="rounded bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
            >
                {question ? "Update Question" : "Post Question"}
            </button>
        </form>
    );
};

export default QuestionForm;
