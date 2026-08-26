"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    RefreshCw,
    CalendarDays,
    X,
} from "lucide-react";

export default function EventPage() {

    const [events, setEvents] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();


    // ========================================
    // GET ALL EVENTS
    // ========================================

    const fetchEvents = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    "/api/event"
                );

            setEvents(
                response.data?.events || []
            );

        } catch (error) {

            console.error(
                "FETCH EVENTS:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Failed to load events."
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        fetchEvents();

    }, []);


    // ========================================
    // OPEN ADD FORM
    // ========================================

    const handleAdd = () => {

        setEditingId(null);

        reset({
            title: "",
            description: "",
            date: "",
        });

        setError("");

        setShowForm(true);
    };


    // ========================================
    // EDIT EVENT
    // ========================================

    const handleEdit = async (id) => {

        try {

            setSaving(true);
            setError("");

            const response =
                await axios.get(
                    `/api/event/${id}`
                );

            const event =
                response.data?.event;

            if (!event) {

                setError(
                    "Event not found."
                );

                return;
            }

            setEditingId(event._id);

            reset({
                title:
                    event.title || "",

                description:
                    event.description ||
                    "",

                date: event.date
                    ? new Date(event.date)
                        .toISOString()
                        .split("T")[0]
                    : "",
            });

            setShowForm(true);

        } catch (error) {

            console.error(
                "EDIT EVENT:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Failed to load event."
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // CREATE / UPDATE
    // ========================================

    const onSubmit = async (data) => {

        try {

            setSaving(true);
            setError("");

            if (editingId) {

                // UPDATE

                await axios.put(
                    `/api/event/${editingId}`,
                    {
                        title:
                            data.title,

                        description:
                            data.description,

                        date:
                            data.date,
                    }
                );

                alert(
                    "Event updated successfully!"
                );

            } else {

                // CREATE

                await axios.post(
                    "/api/event",
                    {
                        title:
                            data.title,

                        description:
                            data.description,

                        date:
                            data.date,
                    }
                );

                alert(
                    "Event created successfully!"
                );
            }


            // REFRESH TABLE

            await fetchEvents();

            // CLOSE MODAL

            closeForm();

        } catch (error) {

            console.error(
                "SAVE EVENT:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Something went wrong."
            );

        } finally {

            setSaving(false);

        }

    };


    // ========================================
    // DELETE EVENT
    // ========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmed) return;


        try {

            setDeleting(id);
            setError("");

            await axios.delete(
                `/api/event/${id}`
            );


            setEvents((prev) =>
                prev.filter(
                    (event) =>
                        event._id !== id
                )
            );

            alert(
                "Event deleted successfully!"
            );

        } catch (error) {

            console.error(
                "DELETE EVENT:",
                error
            );

            setError(
                error.response?.data
                    ?.message ||
                "Failed to delete event."
            );

        } finally {

            setDeleting(null);

        }

    };


    // ========================================
    // CLOSE FORM
    // ========================================

    const closeForm = () => {

        setShowForm(false);

        setEditingId(null);

        reset({
            title: "",
            description: "",
            date: "",
        });

    };


    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (

            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <div className="flex items-center gap-3 text-gray-600">

                    <Loader2
                        size={25}
                        className="animate-spin text-blue-600"
                    />

                    Loading events...

                </div>

            </div>

        );

    }


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="min-h-screen bg-gray-100 p-6 md:p-10">

            <div className="max-w-7xl mx-auto">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Events
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Manage all your school events.
                        </p>

                    </div>


                    <div className="flex gap-3">

                        {/* REFRESH */}

                        <button
                            onClick={
                                fetchEvents
                            }
                            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50"
                        >

                            <RefreshCw
                                size={18}
                            />

                            Refresh

                        </button>


                        {/* ADD */}

                        <button
                            onClick={
                                handleAdd
                            }
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >

                            <Plus size={19} />

                            Add Event

                        </button>

                    </div>

                </div>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">

                        {error}

                    </div>

                )}


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {events.length === 0 ? (

                    <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">

                        <div className="mb-4 flex justify-center">

                            <div className="rounded-full bg-gray-100 p-4">

                                <CalendarDays
                                    size={35}
                                    className="text-gray-400"
                                />

                            </div>

                        </div>


                        <h2 className="text-xl font-semibold text-gray-800">
                            No Events Found
                        </h2>


                        <p className="mt-2 mb-6 text-gray-500">
                            You haven't created any events yet.
                        </p>


                        <button
                            onClick={
                                handleAdd
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        >

                            <Plus size={18} />

                            Create Event

                        </button>

                    </div>

                ) : (


                    /* ================================= */
                    /* TABLE */
                    /* ================================= */

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b px-6 py-5">

                            <div className="flex items-center gap-3">

                                <CalendarDays
                                    size={22}
                                    className="text-blue-600"
                                />

                                <div>

                                    <h2 className="font-semibold text-gray-900">
                                        Event List
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {events.length}{" "}
                                        {events.length ===
                                        1
                                            ? "event"
                                            : "events"}
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            #
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Event
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Description
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Date
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-gray-100">

                                    {events.map(
                                        (
                                            event,
                                            index
                                        ) => (

                                            <tr
                                                key={
                                                    event._id
                                                }
                                                className="hover:bg-gray-50"
                                            >

                                                {/* NUMBER */}

                                                <td className="px-6 py-5 text-gray-500">
                                                    {index +
                                                        1}
                                                </td>


                                                {/* TITLE */}

                                                <td className="px-6 py-5">

                                                    <p className="font-semibold text-gray-900">
                                                        {event.title ||
                                                            "No title"}
                                                    </p>

                                                </td>


                                                {/* DESCRIPTION */}

                                                <td className="max-w-md px-6 py-5">

                                                    <p className="line-clamp-2 text-gray-500">
                                                        {event.description ||
                                                            "No description"}
                                                    </p>

                                                </td>


                                                {/* DATE */}

                                                <td className="px-6 py-5">

                                                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">

                                                        {event.date
                                                            ? new Date(
                                                                  event.date
                                                              ).toLocaleDateString(
                                                                  "en-US",
                                                                  {
                                                                      year: "numeric",
                                                                      month: "short",
                                                                      day: "numeric",
                                                                  }
                                                              )
                                                            : "No date"}

                                                    </span>

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end gap-2">

                                                        {/* EDIT */}

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    event._id
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                                                            title="Edit Event"
                                                        >

                                                            <Pencil
                                                                size={
                                                                    18
                                                                }
                                                            />

                                                        </button>


                                                        {/* DELETE */}

                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    event._id
                                                                )
                                                            }
                                                            disabled={
                                                                deleting ===
                                                                event._id
                                                            }
                                                            className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                            title="Delete Event"
                                                        >

                                                            {deleting ===
                                                            event._id ? (

                                                                <Loader2
                                                                    size={
                                                                        18
                                                                    }
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <Trash2
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                            )}

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}

            </div>


            {/* ================================= */}
            {/* FORM MODAL */}
            {/* ================================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">

                                    {editingId
                                        ? "Edit Event"
                                        : "Add Event"}

                                </h2>

                                <p className="mt-1 text-sm text-gray-500">

                                    {editingId
                                        ? "Update event information."
                                        : "Add a new event."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    closeForm
                                }
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
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

                            {/* TITLE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Event Title
                                </label>

                                <input
                                    type="text"
                                    placeholder="Annual Sports Day"
                                    {...register(
                                        "title",
                                        {
                                            required:
                                                "Event title is required",
                                        }
                                    )}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.title && (

                                    <p className="mt-1 text-sm text-red-500">

                                        {
                                            errors
                                                .title
                                                .message
                                        }

                                    </p>

                                )}

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    rows={5}
                                    placeholder="Enter event description..."
                                    {...register(
                                        "description",
                                        {
                                            required:
                                                "Description is required",
                                        }
                                    )}
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.description && (

                                    <p className="mt-1 text-sm text-red-500">

                                        {
                                            errors
                                                .description
                                                .message
                                        }

                                    </p>

                                )}

                            </div>


                            {/* DATE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Event Date
                                </label>

                                <input
                                    type="date"
                                    {...register(
                                        "date",
                                        {
                                            required:
                                                "Event date is required",
                                        }
                                    )}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                {errors.date && (

                                    <p className="mt-1 text-sm text-red-500">

                                        {
                                            errors
                                                .date
                                                .message
                                        }

                                    </p>

                                )}

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={
                                        saving
                                    }
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {saving && (

                                        <Loader2
                                            size={
                                                18
                                            }
                                            className="animate-spin"
                                        />

                                    )}

                                    {editingId
                                        ? "Update Event"
                                        : "Create Event"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}