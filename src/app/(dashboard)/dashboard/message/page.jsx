"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Save,
    Loader2,
    MessageSquare,
    RefreshCw,
    Trash2,
    Plus,
    X,
} from "lucide-react";

const TYPE_OPTIONS = [
    { value: "owner", label: "Owner" },
    { value: "managing-director", label: "Managing Director" },
    { value: "principal", label: "Principal" },
];

function typeLabel(type) {
    if (type === "owner") return "Owner's Message";
    if (type === "managing-director")
        return "Managing Director's Message";
    return `${type}'s Message`;
}

export default function MessagePage() {
    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [adding, setAdding] = useState(false);

    const [newMessage, setNewMessage] = useState({
        type: "owner",
        title: "",
        description: "",
        name: "",
        image: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/message");

            setMessages(response.data.messages || []);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load messages."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

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

    const handleSave = async (msg) => {
        try {
            setSavingId(msg._id);

            setError("");
            setSuccess("");

            await axios.put(`/api/message/${msg._id}`, {
                title: msg.title,
                description: msg.description,
                name: msg.name,
                image: msg.image,
            });

            setSuccess(`${typeLabel(msg.type)} updated successfully.`);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update message."
            );
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?"))
            return;

        try {
            setDeletingId(id);
            setError("");
            setSuccess("");

            await axios.delete(`/api/message/${id}`);

            setMessages((prev) => prev.filter((m) => m._id !== id));
            setSuccess("Message deleted successfully.");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete message."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleNewChange = (field, value) => {
        setNewMessage((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAdd = async () => {
        try {
            setAdding(true);
            setError("");
            setSuccess("");

            await axios.post("/api/message", newMessage);

            setShowAddForm(false);
            setNewMessage({
                type: "owner",
                title: "",
                description: "",
                name: "",
                image: "",
            });

            await fetchMessages();
            setSuccess("Message created successfully.");
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to create message."
            );
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 size={22} className="animate-spin" />
                    Loading messages...
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Messages
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage Owner, Managing Director and Principal
                            messages
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchMessages}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
                    >
                        <Plus size={17} />
                        Add Message
                    </button>
                </div>
            </div>

            {success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                    {success}
                </div>
            )}

            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {messages.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        No Messages Found
                    </h2>
                    <p className="mb-6 mt-2 text-gray-500">
                        Add the Owner, Managing Director or Principal message.
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Message
                    </button>
                </div>
            ) : (
                <div className="space-y-8">

                    {messages.map((msg, index) => (
                        <div
                            key={msg._id}
                            className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"
                        >

                            <div className="mb-7 flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {typeLabel(msg.type)}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Edit this message below
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    disabled={deletingId === msg._id}
                                    className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                                >
                                    {deletingId === msg._id ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    Delete
                                </button>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-3">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Image
                                    </label>

                                    {msg.image && (
                                        <div className="overflow-hidden rounded-2xl border border-gray-200">
                                            <img
                                                src={msg.image}
                                                alt={msg.name}
                                                className="h-64 w-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <input
                                        type="text"
                                        value={msg.image || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                msg._id,
                                                "image",
                                                e.target.value
                                            )
                                        }
                                        className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                        placeholder="/texas/owner.jpg"
                                    />
                                    <p className="mt-1.5 text-xs text-gray-400">
                                        Path inside /public or full https URL.
                                    </p>
                                </div>

                                <div className="space-y-5 lg:col-span-2">

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Heading
                                        </label>
                                        <input
                                            type="text"
                                            value={msg.title || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    msg._id,
                                                    "title",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Message
                                        </label>
                                        <textarea
                                            rows={8}
                                            value={msg.description || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    msg._id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 text-gray-800 outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Person's Name
                                        </label>
                                        <input
                                            type="text"
                                            value={msg.name || ""}
                                            onChange={(e) =>
                                                handleChange(
                                                    msg._id,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleSave(msg)}
                                            disabled={
                                                savingId === msg._id
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                                        >
                                            {savingId === msg._id ? (
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
            )}

            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
                    <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Add Message
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Each type can only exist once.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAdd();
                            }}
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Type
                                </label>
                                <select
                                    value={newMessage.type}
                                    onChange={(e) =>
                                        handleNewChange("type", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    {TYPE_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Heading
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. A Message From Our Founder"
                                    value={newMessage.title}
                                    onChange={(e) =>
                                        handleNewChange("title", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    rows={6}
                                    required
                                    value={newMessage.description}
                                    onChange={(e) =>
                                        handleNewChange("description", e.target.value)
                                    }
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Person's Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Sunil Yadav"
                                    value={newMessage.name}
                                    onChange={(e) =>
                                        handleNewChange("name", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Image path (optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="/texas/owner.jpg"
                                    value={newMessage.image}
                                    onChange={(e) =>
                                        handleNewChange("image", e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-5">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    disabled={adding}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {adding && (
                                        <Loader2 size={18} className="animate-spin" />
                                    )}
                                    Create Message
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}
