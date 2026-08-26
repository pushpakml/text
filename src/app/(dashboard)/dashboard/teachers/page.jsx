"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Users,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
} from "lucide-react";

export default function TeachersPage() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Image states
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // =====================================================
    // FETCH TEACHERS
    // =====================================================

    const fetchTeachers = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "/api/teacher"
            );

            console.log("GET TEACHERS:", response.data);

            setTeachers(
                response.data.teachers || []
            );
        } catch (error) {
            console.error(
                "Fetch teachers error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load teachers"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTeachers();
    }, []);

    // =====================================================
    // ADD TEACHER
    // =====================================================

    const handleAdd = () => {
        setEditingId(null);

        setSelectedImage(null);
        setPreview(null);

        reset({
            name: "",
            subject: "",
            experience: "",
        });

        setShowForm(true);
    };

    // =====================================================
    // EDIT TEACHER
    // =====================================================

    const handleEdit = async (id) => {
        try {
            setLoading(true);

            const response = await axios.get(
                `/api/teacher/${id}`
            );

            console.log(
                "GET SINGLE TEACHER:",
                response.data
            );

            const teacher =
                response.data.teacher;

            if (!teacher) {
                alert("Teacher not found");
                return;
            }

            setEditingId(teacher._id);

            reset({
                name: teacher.name || "",
                subject: teacher.subject || "",
                experience:
                    teacher.experience || "",
            });

            // Existing image
            setSelectedImage(null);

            setPreview(
                teacher.image || null
            );

            setShowForm(true);
        } catch (error) {
            console.error(
                "Get teacher error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load teacher"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // IMAGE SELECT
    // =====================================================

    const handleImageChange = (event) => {
        const file =
            event.target.files?.[0];

        console.log("Selected file:", file);

        if (!file) {
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {
            alert(
                "Please select a valid image file."
            );

            event.target.value = "";
            setSelectedImage(null);
            return;
        }

        // Check image size
        if (file.size > 5 * 1024 * 1024) {
            alert(
                "Image must be smaller than 5MB."
            );

            event.target.value = "";
            setSelectedImage(null);
            return;
        }

        // Save actual File object
        setSelectedImage(file);

        // Create preview
        const imageUrl =
            URL.createObjectURL(file);

        setPreview(imageUrl);

        console.log(
            "Image selected successfully:",
            file.name
        );
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // =============================================
            // CREATE FORMDATA
            // =============================================

            const formData = new FormData();

            formData.append(
                "name",
                data.name.trim()
            );

            formData.append(
                "subject",
                data.subject.trim()
            );

            formData.append(
                "experience",
                data.experience.trim()
            );

            // =============================================
            // ADD IMAGE
            // =============================================

            if (selectedImage) {
                formData.append(
                    "image",
                    selectedImage
                );
            }

            // Debug FormData
            console.log(
                "========== FORM DATA =========="
            );

            for (const [
                key,
                value,
            ] of formData.entries()) {
                console.log(
                    key,
                    value
                );
            }

            console.log(
                "==============================="
            );

            // =============================================
            // UPDATE
            // =============================================

            if (editingId) {
                const response =
                    await axios.put(
                        `/api/teacher/${editingId}`,
                        formData
                    );

                console.log(
                    "UPDATE RESPONSE:",
                    response.data
                );

                alert(
                    "Teacher updated successfully"
                );
            }

            // =============================================
            // CREATE
            // =============================================

            else {
                const response =
                    await axios.post(
                        "/api/teacher",
                        formData
                    );

                console.log(
                    "CREATE RESPONSE:",
                    response.data
                );

                alert(
                    "Teacher created successfully"
                );
            }

            // Refresh list
            await fetchTeachers();

            closeForm();
        } catch (error) {
            console.error(
                "Submit teacher error:",
                error
            );

            console.log(
                "API ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this teacher?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await axios.delete(
                `/api/teacher/${id}`
            );

            setTeachers((prev) =>
                prev.filter(
                    (teacher) =>
                        teacher._id !== id
                )
            );

            alert(
                "Teacher deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete error:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete teacher"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);

        setSelectedImage(null);
        setPreview(null);

        reset({
            name: "",
            subject: "",
            experience: "",
        });
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Teachers
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage all teachers
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={fetchTeachers}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>

                    <button
                        type="button"
                        onClick={handleAdd}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Plus size={20} />

                        Add Teacher
                    </button>

                </div>

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                <div className="border-b px-6 py-5">

                    <div className="flex items-center gap-3">

                        <Users
                            size={20}
                            className="text-blue-600"
                        />

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Teacher List
                            </h2>

                            <p className="text-sm text-gray-500">
                                {teachers.length} teachers
                            </p>

                        </div>

                    </div>

                </div>

                {/* LOADING */}

                {loading &&
                teachers.length === 0 ? (

                    <div className="flex justify-center p-10">

                        <Loader2
                            className="animate-spin text-blue-600"
                            size={30}
                        />

                    </div>

                ) : teachers.length === 0 ? (

                    <div className="p-12 text-center">

                        <Users
                            size={45}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 font-semibold text-gray-700">
                            No teachers found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Add your first teacher.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">

                                    <th className="px-6 py-4">
                                        Teacher
                                    </th>

                                    <th className="px-6 py-4">
                                        Subject
                                    </th>

                                    <th className="px-6 py-4">
                                        Experience
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {teachers.map(
                                    (teacher) => (

                                        <tr
                                            key={
                                                teacher._id
                                            }
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >

                                            {/* TEACHER */}

                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    {teacher.image ? (

                                                        <img
                                                            src={
                                                                teacher.image
                                                            }
                                                            alt={
                                                                teacher.name ||
                                                                "Teacher"
                                                            }
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">

                                                            <Users
                                                                size={20}
                                                            />

                                                        </div>

                                                    )}

                                                    <div>

                                                        <p className="font-semibold text-gray-900">
                                                            {
                                                                teacher.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400">
                                                            Teacher
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* SUBJECT */}

                                            <td className="px-6 py-4">

                                                <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                                                    {
                                                        teacher.subject
                                                    }
                                                </span>

                                            </td>

                                            {/* EXPERIENCE */}

                                            <td className="px-6 py-4 text-gray-600">

                                                {
                                                    teacher.experience
                                                }

                                            </td>

                                            {/* ACTIONS */}

                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                teacher._id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                                                    >
                                                        <Pencil
                                                            size={18}
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                teacher._id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <Trash2
                                                            size={18}
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* =================================================
                FORM MODAL
            ================================================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">

                        {/* HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingId
                                        ? "Edit Teacher"
                                        : "Add Teacher"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Fill in teacher information
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={loading}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                                <X size={22} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit(
                                onSubmit
                            )}
                            className="space-y-5 p-6"
                        >

                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Teacher Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter teacher name"
                                    {...register(
                                        "name",
                                        {
                                            required:
                                                "Teacher name is required",
                                        }
                                    )}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors
                                                .name
                                                .message
                                        }
                                    </p>
                                )}

                            </div>

                            {/* SUBJECT */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Subject
                                </label>

                                <input
                                    type="text"
                                    placeholder="Mathematics"
                                    {...register(
                                        "subject",
                                        {
                                            required:
                                                "Subject is required",
                                        }
                                    )}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors
                                                .subject
                                                .message
                                        }
                                    </p>
                                )}

                            </div>

                            {/* EXPERIENCE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Experience
                                </label>

                                <input
                                    type="text"
                                    placeholder="5 Years"
                                    {...register(
                                        "experience",
                                        {
                                            required:
                                                "Experience is required",
                                        }
                                    )}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.experience && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {
                                            errors
                                                .experience
                                                .message
                                        }
                                    </p>
                                )}

                            </div>

                            {/* =================================================
                                IMAGE
                            ================================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Teacher Image
                                </label>

                                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5">

                                    <label
                                        htmlFor="teacher-image"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 px-5 py-8 transition hover:border-blue-400 hover:bg-blue-50"
                                    >

                                        <ImageIcon
                                            size={40}
                                            className="text-gray-400"
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-700">
                                            Click to choose image
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            JPG, PNG or WEBP — Max 5MB
                                        </p>

                                    </label>

                                    <input
                                        id="teacher-image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="hidden"
                                    />

                                    {/* PREVIEW */}

                                    {preview ? (

                                        <div className="mt-5 flex flex-col items-center">

                                            <img
                                                src={preview}
                                                alt="Teacher preview"
                                                className="h-40 w-40 rounded-2xl object-cover shadow-md"
                                            />

                                            {selectedImage && (
                                                <p className="mt-2 text-xs text-gray-500">
                                                    {
                                                        selectedImage.name
                                                    }
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(
                                                        null
                                                    );
                                                    setPreview(
                                                        null
                                                    );
                                                }}
                                                disabled={
                                                    loading
                                                }
                                                className="mt-3 text-sm font-medium text-red-500 hover:text-red-600"
                                            >
                                                Remove image
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="mt-5 flex flex-col items-center text-gray-400">

                                            <Users
                                                size={40}
                                            />

                                            <p className="mt-2 text-sm">
                                                No image selected
                                            </p>

                                        </div>

                                    )}

                                </div>

                                {editingId && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Select a new image only if you want to replace the existing image.
                                    </p>
                                )}

                            </div>

                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={loading}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {loading && (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    )}

                                    {editingId
                                        ? "Update Teacher"
                                        : "Add Teacher"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}