"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Save,
    Loader2,
    Images,
    RefreshCw,
    Upload,
} from "lucide-react";

export default function GalleryPage() {
    const [gallery, setGallery] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // GET GALLERY
    // ==========================================

    const fetchGallery = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("/api/gallery");

            setGallery(response.data.gallery || []);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load gallery."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    // ==========================================
    // SELECT IMAGE
    // ==========================================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);

        const imagePreview = URL.createObjectURL(file);

        setPreview(imagePreview);
    };

    // ==========================================
    // RESET
    // ==========================================

    const resetForm = () => {
        setImage(null);
        setPreview("");
        setTitle("");
        setDescription("");
        setEditingId(null);
        setShowForm(false);
    };

    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (item) => {
        setEditingId(item._id);

        setPreview(item.image);
        setImage(null);

        setTitle(item.title || "");
        setDescription(item.description || "");

        setShowForm(true);
    };

    // ==========================================
    // SAVE
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);

            // New image selected
            if (image) {
                formData.append("image", image);
            }

            // ======================================
            // CREATE
            // ======================================

            if (!editingId) {

                if (!image) {
                    setError("Please select an image.");
                    setSaving(false);
                    return;
                }

                await axios.post(
                    "/api/gallery",
                    formData
                );

                setSuccess(
                    "Gallery image added successfully."
                );

            }

            // ======================================
            // UPDATE
            // ======================================

            else {

                await axios.put(
                    `/api/gallery/${editingId}`,
                    formData
                );

                setSuccess(
                    "Gallery image updated successfully."
                );
            }

            resetForm();

            await fetchGallery();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save gallery image."
            );

        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // DELETE
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) return;

        try {

            await axios.delete(
                `/api/gallery/${id}`
            );

            setSuccess(
                "Gallery image deleted successfully."
            );

            await fetchGallery();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to delete image."
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="flex min-h-[60vh]
                            items-center justify-center">

                <div className="flex items-center
                                gap-3 text-gray-500">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    Loading gallery...

                </div>

            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl">

            {/* =====================================
                HEADER
            ====================================== */}

            <div className="mb-8 flex items-center
                            justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12
                                    items-center justify-center
                                    rounded-xl bg-blue-100
                                    text-blue-900">

                        <Images size={24} />

                    </div>

                    <div>

                        <h1 className="text-2xl font-bold
                                       text-gray-800">

                            Gallery

                        </h1>

                        <p className="mt-1 text-sm
                                      text-gray-500">

                            Manage your school gallery

                        </p>

                    </div>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={fetchGallery}
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

                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2
                                   rounded-xl bg-blue-900
                                   px-5 py-2.5 text-sm
                                   font-semibold text-white
                                   hover:bg-blue-800"
                    >

                        <Plus size={18} />

                        Add Image

                    </button>

                </div>

            </div>

            {/* =====================================
                SUCCESS
            ====================================== */}

            {success && (
                <div className="mb-6 rounded-xl
                                border border-green-200
                                bg-green-50 px-5 py-4
                                text-sm text-green-700">

                    {success}

                </div>
            )}

            {/* =====================================
                ERROR
            ====================================== */}

            {error && (
                <div className="mb-6 rounded-xl
                                border border-red-200
                                bg-red-50 px-5 py-4
                                text-sm text-red-600">

                    {error}

                </div>
            )}

            {/* =====================================
                FORM
            ====================================== */}

            {showForm && (

                <div className="mb-8 rounded-2xl
                                border border-gray-200
                                bg-white p-7 shadow-sm">

                    <div className="mb-6 flex
                                    items-center
                                    justify-between">

                        <div>

                            <h2 className="text-xl font-bold
                                           text-gray-800">

                                {editingId
                                    ? "Edit Gallery Image"
                                    : "Add Gallery Image"}

                            </h2>

                            <p className="mt-1 text-sm
                                          text-gray-500">

                                Select an image directly
                                from your device.

                            </p>

                        </div>

                        <button
                            onClick={resetForm}
                            className="rounded-lg p-2
                                       text-gray-400
                                       hover:bg-gray-100"
                        >

                            <X size={20} />

                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* IMAGE */}

                        <div>

                            <label className="mb-2 block
                                               text-sm font-semibold
                                               text-gray-700">

                                Image

                            </label>

                            <label
                                className="flex min-h-48
                                           cursor-pointer
                                           flex-col items-center
                                           justify-center
                                           rounded-2xl border-2
                                           border-dashed
                                           border-gray-300
                                           bg-gray-50
                                           transition
                                           hover:border-blue-400
                                           hover:bg-blue-50"
                            >

                                {preview ? (

                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-56 w-full
                                                   rounded-xl
                                                   object-contain
                                                   p-3"
                                    />

                                ) : (

                                    <>

                                        <Upload
                                            size={35}
                                            className="mb-3
                                                       text-gray-400"
                                        />

                                        <p className="text-sm
                                                      font-semibold
                                                      text-gray-600">

                                            Click to choose
                                            an image

                                        </p>

                                        <p className="mt-1 text-xs
                                                      text-gray-400">

                                            JPG, JPEG, PNG, WEBP

                                        </p>

                                    </>

                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                            </label>

                        </div>

                        {/* TITLE */}

                        <div>

                            <label className="mb-2 block
                                               text-sm font-semibold
                                               text-gray-700">

                                Title

                            </label>

                            <input
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="School Activities"
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

                            <label className="mb-2 block
                                               text-sm font-semibold
                                               text-gray-700">

                                Description

                            </label>

                            <textarea
                                rows={4}
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="School activities..."
                                className="w-full resize-none
                                           rounded-xl
                                           border border-gray-200
                                           px-4 py-3
                                           text-gray-800
                                           outline-none
                                           focus:border-blue-500"
                            />

                        </div>

                        {/* BUTTONS */}

                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-xl border
                                           border-gray-200
                                           px-5 py-3 text-sm
                                           font-medium
                                           text-gray-600
                                           hover:bg-gray-50"
                            >

                                Cancel

                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center
                                           gap-2 rounded-xl
                                           bg-blue-900 px-6 py-3
                                           text-sm font-semibold
                                           text-white
                                           hover:bg-blue-800
                                           disabled:opacity-60"
                            >

                                {saving ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Uploading...

                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />

                                        Save

                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* =====================================
                GALLERY
            ====================================== */}

            {gallery.length === 0 ? (

                <div className="rounded-2xl
                                border border-gray-200
                                bg-white py-20
                                text-center">

                    <Images
                        size={45}
                        className="mx-auto mb-4
                                   text-gray-300"
                    />

                    <h2 className="font-semibold
                                   text-gray-700">

                        No gallery images

                    </h2>

                    <p className="mt-1 text-sm
                                  text-gray-400">

                        Add your first image.

                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 gap-6
                                sm:grid-cols-2 lg:grid-cols-3">

                    {gallery.map((item) => (

                        <div
                            key={item._id}
                            className="overflow-hidden
                                       rounded-2xl border
                                       border-gray-200
                                       bg-white shadow-sm"
                        >

                            <div className="h-64">

                                <img
                                    src={item.image}
                                    alt={item.title || "Gallery"}
                                    className="h-full w-full
                                               object-cover"
                                />

                            </div>

                            <div className="p-5">

                                <h3 className="text-lg font-bold
                                               text-gray-800">

                                    {item.title || "Untitled"}

                                </h3>

                                {item.description && (
                                    <p className="mt-2 text-sm
                                                  leading-6
                                                  text-gray-500">

                                        {item.description}

                                    </p>
                                )}

                                <div className="mt-5 flex gap-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(item)
                                        }
                                        className="flex flex-1
                                                   items-center
                                                   justify-center
                                                   gap-2 rounded-xl
                                                   border
                                                   border-gray-200
                                                   py-2.5 text-sm
                                                   font-medium
                                                   text-gray-600
                                                   hover:bg-blue-50"
                                    >

                                        <Pencil size={16} />

                                        Edit

                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(item._id)
                                        }
                                        className="flex items-center
                                                   justify-center
                                                   rounded-xl
                                                   border
                                                   border-red-100
                                                   px-4 py-2.5
                                                   text-red-500
                                                   hover:bg-red-50"
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}