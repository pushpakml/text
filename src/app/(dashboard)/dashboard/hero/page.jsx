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
  Image as ImageIcon,
  X,
} from "lucide-react";

export default function HeroPage() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // ========================================
  // FETCH HEROES
  // ========================================

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "/api/hero"
      );

      const heroData =
        response.data?.hero;

      if (Array.isArray(heroData)) {
        setHeroes(heroData);
      } else if (heroData) {
        setHeroes([heroData]);
      } else {
        setHeroes([]);
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load heroes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // ========================================
  // OPEN ADD FORM
  // ========================================

  const handleAdd = () => {
    setEditingId(null);

    reset({
      title: "",
      description: "",
    });

    setShowForm(true);
    setError("");
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const handleEdit = async (id) => {
    try {
      setSaving(true);
      setError("");

      const response = await axios.get(
        `/api/hero/${id}`
      );

      const hero =
        response.data?.hero;

      if (!hero) {
        setError("Hero not found.");
        return;
      }

      setEditingId(hero._id);

      reset({
        title: hero.title || "",
        description:
          hero.description || "",
      });

      setShowForm(true);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load hero."
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
          `/api/hero/${editingId}`,
          {
            title: data.title,
            description:
              data.description,
          }
        );

        alert(
          "Hero updated successfully!"
        );
      } else {
        // CREATE

        await axios.post(
          "/api/hero",
          {
            title: data.title,
            description:
              data.description,
          }
        );

        alert(
          "Hero created successfully!"
        );
      }

      await fetchHeroes();

      closeForm();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this hero?"
      );

    if (!confirmed) return;

    try {
      setDeleting(id);
      setError("");

      await axios.delete(
        `/api/hero/${id}`
      );

      setHeroes((prev) =>
        prev.filter(
          (hero) =>
            hero._id !== id
        )
      );

      alert(
        "Hero deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete hero."
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
    });
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={25}
            className="animate-spin text-blue-600"
          />

          Loading heroes...
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="mx-auto max-w-6xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hero Section
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your website hero content.
            </p>
          </div>

          <div className="flex gap-3">

            {/* REFRESH */}

            <button
              onClick={fetchHeroes}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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

            {/* ADD */}

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={19} />

              Add Hero
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
        {/* HERO TABLE */}
        {/* ================================= */}

        {heroes.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">

            <div className="mb-4 flex justify-center">

              <div className="rounded-full bg-gray-100 p-4">

                <ImageIcon
                  size={32}
                  className="text-gray-400"
                />

              </div>

            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              No Hero Found
            </h2>

            <p className="mb-6 mt-2 text-gray-500">
              You haven't created a hero section yet.
            </p>

            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
            >
              <Plus size={18} />

              Create Hero
            </button>

          </div>

        ) : (

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b px-6 py-5">

              <h2 className="font-semibold text-gray-900">
                Hero Content
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {heroes.length}{" "}
                {heroes.length === 1
                  ? "hero"
                  : "heroes"}
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      #
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Title
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Description
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-100">

                  {heroes.map(
                    (hero, index) => (

                      <tr
                        key={hero._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-5 text-gray-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5">

                          <p className="font-semibold text-gray-900">
                            {hero.title ||
                              "No title"}
                          </p>

                        </td>

                        <td className="max-w-xl px-6 py-5">

                          <p className="line-clamp-2 text-gray-500">
                            {hero.description ||
                              "No description"}
                          </p>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-2">

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                handleEdit(
                                  hero._id
                                )
                              }
                              disabled={
                                saving
                              }
                              className="rounded-lg bg-blue-50 p-2.5 text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                              title="Edit"
                            >
                              <Pencil
                                size={18}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                handleDelete(
                                  hero._id
                                )
                              }
                              disabled={
                                deleting ===
                                hero._id
                              }
                              className="rounded-lg bg-red-50 p-2.5 text-red-600 hover:bg-red-100 disabled:opacity-50"
                              title="Delete"
                            >

                              {deleting ===
                              hero._id ? (
                                <Loader2
                                  size={18}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={18}
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

          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  {editingId
                    ? "Edit Hero"
                    : "Add Hero"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingId
                    ? "Update your hero content."
                    : "Create new hero content."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
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
                  Hero Title
                </label>

                <input
                  type="text"
                  placeholder="Enter hero title"
                  {...register(
                    "title",
                    {
                      required:
                        "Title is required",
                    }
                  )}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      errors.title
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
                  placeholder="Enter hero description"
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

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {saving && (
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {editingId
                    ? "Update Hero"
                    : "Create Hero"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}