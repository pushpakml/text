"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Save,
    Loader2,
    MessageSquare,
    RefreshCw,
} from "lucide-react";

export default function MessagePage() {
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD MESSAGES
    // ==========================================

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/message");

            setMessages(response.data.messages || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load messages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // ==========================================
    // CHANGE FIELD
    // ==========================================

    const handleChange = (id, field, value) => {
        setMessages((current) =>
            current.map((item) =>
                item._id === id
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };

    // ==========================================
    // SAVE
    // ==========================================

    const handleSave = async (message) => {
        try {
            setSavingId(message._id);

            setError("");
            setSuccess("");

            await axios.put(
                `/api/message/${message._id}`,
                {
                    title: message.title,
                    description: message.description,
                    name: message.name,
                    image: message.image,
                }
            );

            setSuccess(
                `${message.title} updated successfully.`
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update message."
            );
        } finally {
            setSavingId(null);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="flex items-center gap-3 text-gray-500">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    Loading messages...

                </div>

            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">

            {/* HEADER */}

            <div className="mb-8 flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div
                        className="flex h-12 w-12 items-center
                                   justify-center rounded-xl
                                   bg-blue-100 text-blue-900"
                    >
                        <MessageSquare size={24} />
                    </div>

                    <div>

                        <h1 className="text-2xl font-bold text-gray-800">
                            Messages
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage Owner, Managing Director and Principal messages
                        </p>

                    </div>

                </div>

                <button
                    onClick={fetchMessages}
                    className="flex items-center gap-2
                               rounded-xl border
                               border-gray-200 bg-white
                               px-4 py-2.5 text-sm
                               font-medium text-gray-600
                               hover:bg-gray-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>

            {/* SUCCESS */}

            {success && (
                <div
                    className="mb-6 rounded-xl border
                               border-green-200 bg-green-50
                               px-5 py-4 text-sm text-green-700"
                >
                    {success}
                </div>
            )}

            {/* ERROR */}

            {error && (
                <div
                    className="mb-6 rounded-xl border
                               border-red-200 bg-red-50
                               px-5 py-4 text-sm text-red-600"
                >
                    {error}
                </div>
            )}

            {/* MESSAGES */}

            <div className="space-y-8">

                {messages.map((message, index) => (

                    <div
                        key={message._id}
                        className="rounded-2xl border
                                   border-gray-200 bg-white
                                   p-7 shadow-sm"
                    >

                        {/* CARD HEADER */}

                        <div className="mb-7 flex items-center gap-4">

                            <div
                                className="flex h-10 w-10
                                           items-center justify-center
                                           rounded-full bg-blue-900
                                           text-sm font-bold
                                           text-white"
                            >
                                {index + 1}
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-gray-800">
                                    {message.type === "owner"
                                        ? "Owner's Message"
                                        : message.type === "managing-director"
                                        ? "Managing Director's Message"
                                        : "Principal's Message"}
                                </h2>

                                <p className="text-sm text-gray-400">
                                    Edit this message below
                                </p>

                            </div>

                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">

                            {/* IMAGE */}

                            <div>

                                <label
                                    className="mb-2 block text-sm
                                               font-semibold text-gray-700"
                                >
                                    Image
                                </label>

                                <div
                                    className="overflow-hidden
                                               rounded-2xl border
                                               border-gray-200"
                                >
                                    <img
                                        src={message.image}
                                        alt={message.name}
                                        className="h-64 w-full
                                                   object-cover"
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={message.image || ""}
                                    onChange={(e) =>
                                        handleChange(
                                            message._id,
                                            "image",
                                            e.target.value
                                        )
                                    }
                                    className="mt-3 w-full rounded-xl
                                               border border-gray-200
                                               px-4 py-3 text-sm
                                               outline-none
                                               focus:border-blue-500"
                                    placeholder="/texas/owner.jpg"
                                />

                            </div>

                            {/* FORM */}

                            <div className="space-y-5 lg:col-span-2">

                                {/* TITLE */}

                                <div>

                                    <label
                                        className="mb-2 block
                                                   text-sm font-semibold
                                                   text-gray-700"
                                    >
                                        Heading
                                    </label>

                                    <input
                                        type="text"
                                        value={message.title || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                message._id,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl
                                                   border border-gray-200
                                                   px-4 py-3
                                                   text-gray-800
                                                   outline-none
                                                   focus:border-blue-500"
                                    />

                                </div>

                                {/* DESCRIPTION */}

                                <div>

                                    <label
                                        className="mb-2 block
                                                   text-sm font-semibold
                                                   text-gray-700"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        rows={8}
                                        value={message.description || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                message._id,
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className="w-full resize-none
                                                   rounded-xl
                                                   border border-gray-200
                                                   px-4 py-3
                                                   leading-7
                                                   text-gray-800
                                                   outline-none
                                                   focus:border-blue-500"
                                    />

                                </div>

                                {/* NAME */}

                                <div>

                                    <label
                                        className="mb-2 block
                                                   text-sm font-semibold
                                                   text-gray-700"
                                    >
                                        Person's Name
                                    </label>

                                    <input
                                        type="text"
                                        value={message.name || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                message._id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl
                                                   border border-gray-200
                                                   px-4 py-3
                                                   text-gray-800
                                                   outline-none
                                                   focus:border-blue-500"
                                    />

                                </div>

                                {/* SAVE */}

                                <div className="flex justify-end">

                                    <button
                                        onClick={() =>
                                            handleSave(message)
                                        }
                                        disabled={
                                            savingId === message._id
                                        }
                                        className="flex items-center
                                                   gap-2 rounded-xl
                                                   bg-blue-900 px-6
                                                   py-3 text-sm
                                                   font-semibold
                                                   text-white
                                                   hover:bg-blue-800
                                                   disabled:opacity-60"
                                    >

                                        {savingId === message._id ? (
                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Save Changes
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}