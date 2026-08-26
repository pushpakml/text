"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Save,
    Loader2,
    RefreshCw,
    BookOpen,
} from "lucide-react";

export default function AboutPage() {
    const aboutId = "6a7ae0cb5f5b57855543adb1";

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: "",
            description: "",
        },
    });

    // =========================
    // FETCH EXISTING ABOUT
    // =========================
    const fetchAbout = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.get(
                `/api/about/${aboutId}`
            );

            console.log("ABOUT RESPONSE:", response.data);

            if (response.data.success && response.data.about) {
                reset({
                    title: response.data.about.title || "",
                    description:
                        response.data.about.description || "",
                });
            } else {
                setError("About content was not found.");
            }

        } catch (error) {
            console.error("Fetch About Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load About content."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    // =========================
    // UPDATE ABOUT
    // =========================
    const onSubmit = async (data) => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            console.log("Updating About:", data);

            const response = await axios.put(
                `/api/about/${aboutId}`,
                data
            );

            console.log("UPDATE RESPONSE:", response.data);

            if (response.data.success) {
                setSuccess("About section updated successfully!");

                // Update form with latest database data
                if (response.data.about) {
                    reset({
                        title: response.data.about.title || "",
                        description:
                            response.data.about.description || "",
                    });
                }
            } else {
                setError("Failed to update About section.");
            }

        } catch (error) {
            console.error("Update About Error:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong while updating."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <Loader2
                        size={22}
                        className="animate-spin"
                    />
                    Loading About content...
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center
                                    justify-center rounded-xl
                                    bg-blue-100 text-blue-900">
                        <BookOpen size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            About
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Edit the About section of Texas Academy
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={fetchAbout}
                    className="flex items-center gap-2 rounded-xl
                               border border-gray-200 bg-white
                               px-4 py-2.5 text-sm font-medium
                               text-gray-600 transition
                               hover:bg-gray-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>

            </div>

            {/* Success */}
            {success && (
                <div className="mb-6 rounded-xl border
                                border-green-200 bg-green-50
                                px-5 py-4 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border
                                border-red-200 bg-red-50
                                px-5 py-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-gray-200
                           bg-white shadow-sm"
            >

                {/* Form Header */}
                <div className="border-b border-gray-100 px-7 py-6">

                    <h2 className="text-lg font-semibold text-gray-800">
                        About Content
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Make changes to the content displayed on
                        your website.
                    </p>

                </div>

                {/* Fields */}
                <div className="space-y-6 p-7">

                    {/* Title */}
                    <div>

                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm
                                       font-semibold text-gray-700"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            type="text"
                            {...register("title", {
                                required: "Title is required",
                            })}
                            className="w-full rounded-xl border
                                       border-gray-200 px-4 py-3
                                       text-gray-800 outline-none
                                       transition
                                       focus:border-blue-500
                                       focus:ring-2
                                       focus:ring-blue-100"
                        />

                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}

                    </div>

                    {/* Description */}
                    <div>

                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm
                                       font-semibold text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            rows={10}
                            {...register("description", {
                                required:
                                    "Description is required",
                            })}
                            className="w-full resize-none rounded-xl
                                       border border-gray-200 px-4 py-3
                                       leading-7 text-gray-800
                                       outline-none transition
                                       focus:border-blue-500
                                       focus:ring-2
                                       focus:ring-blue-100"
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end border-t
                                border-gray-100 px-7 py-5">

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2
                                   rounded-xl bg-blue-900
                                   px-6 py-3 text-sm font-semibold
                                   text-white transition
                                   hover:bg-blue-800
                                   disabled:cursor-not-allowed
                                   disabled:opacity-60"
                    >

                        {saving ? (
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

            </form>

        </div>
    );
}