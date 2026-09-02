"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Save,
    Loader2,
    RefreshCw,
    BookOpen,
    ImagePlus,
    X,
} from "lucide-react";

const EMPTY = {
    title: "",
    description: "",
    description1: "",
};

export default function AboutPage() {
    const [aboutId, setAboutId] = useState(null);
    const [hasContent, setHasContent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [currentImage, setCurrentImage] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: EMPTY,
    });

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const fetchAbout = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.get("/api/about");
            const about = response.data.about?.[0];

            if (about) {
                setAboutId(about._id);
                setHasContent(true);
                setCurrentImage(about.image || "");
                reset({
                    title: about.title || "",
                    description: about.description || "",
                    description1: about.description1 || "",
                });
            } else {
                setAboutId(null);
                setHasContent(false);
                setCurrentImage("");
                reset(EMPTY);
            }

            clearFile();
        } catch (err) {
            console.error("Fetch About Error:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load About content."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    const clearFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(null);
        setPreviewUrl("");
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];

        if (!selected) {
            clearFile();
            return;
        }

        if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(selected.type)) {
            setError("Only JPG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        if (selected.size > 3 * 1024 * 1024) {
            setError("Image must be smaller than 3MB.");
            e.target.value = "";
            return;
        }

        setError("");

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    };

    const onSubmit = async (values) => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("description1", values.description1);

            if (file) {
                formData.append("image", file);
            }

            const response = aboutId
                ? await axios.put(`/api/about/${aboutId}`, formData)
                : await axios.post("/api/about", formData);

            const saved = response.data.about;

            if (!aboutId && saved?._id) {
                setAboutId(saved._id);
                setHasContent(true);
            }

            if (saved?.image !== undefined) {
                setCurrentImage(saved.image || "");
            }

            clearFile();
            setSuccess(
                aboutId
                    ? "About section updated successfully!"
                    : "About section created successfully!"
            );
        } catch (err) {
            console.error("Save About Error:", err);
            setError(
                err.response?.data?.message ||
                "Something went wrong while saving."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 size={22} className="animate-spin" />
                    Loading About content...
                </div>
            </div>
        );
    }

    const shownImage = previewUrl || currentImage;

    return (
        <div className="mx-auto max-w-5xl">

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            About
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {hasContent
                                ? "Edit the About section of Texas Academy"
                                : "No About content yet — fill the form to create it"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={fetchAbout}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
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

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
                <div className="border-b border-gray-100 px-7 py-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        About Content
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Make changes to the content displayed on your website.
                    </p>
                </div>

                <div className="space-y-6 p-7">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Image
                        </label>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:w-64">
                                {shownImage ? (
                                    <img
                                        src={shownImage}
                                        alt="About preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <ImagePlus size={32} className="text-gray-300" />
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <input
                                    id="image-input"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={handleFileChange}
                                    className="block w-full cursor-pointer rounded-xl border border-gray-200 text-sm text-gray-600
                                               file:mr-4 file:cursor-pointer file:rounded-l-xl file:border-0
                                               file:bg-blue-900 file:px-5 file:py-3 file:text-sm
                                               file:font-semibold file:text-white hover:file:bg-blue-800"
                                />

                                <p className="text-xs text-gray-400">
                                    JPG, PNG or WEBP — max 3MB.
                                    {currentImage && !file
                                        ? " A new upload will replace the current image."
                                        : ""}
                                </p>

                                {file && (
                                    <button
                                        type="button"
                                        onClick={clearFile}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                    >
                                        <X size={14} />
                                        Cancel new image
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. About Texas Academy"
                            {...register("title", {
                                required: "Title is required",
                            })}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
                            Description (paragraph 1)
                        </label>
                        <textarea
                            id="description"
                            rows={6}
                            {...register("description", {
                                required: "Description is required",
                            })}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description1" className="mb-2 block text-sm font-semibold text-gray-700">
                            Description (paragraph 2)
                        </label>
                        <textarea
                            id="description1"
                            rows={6}
                            {...register("description1")}
                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 leading-7 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                </div>

                <div className="flex justify-end border-t border-gray-100 px-7 py-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {aboutId ? "Save Changes" : "Create About Section"}
                            </>
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}
