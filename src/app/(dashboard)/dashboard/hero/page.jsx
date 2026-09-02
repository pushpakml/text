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

const EMPTY_HERO = {
  sub_title: "",
  span: "",
  span1: "",
  span2: "",
  span3: "",
  description: "",
  button1: "",
  button2: "",
  button3: "",
  counternumber: "",
  countertext: "",
  counternumber1: "",
  countertext1: "",
  counternumber2: "",
  countertext2: "",
};

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

function Field({ label, name, register, placeholder }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        {...register(name)}
        className={inputClass}
      />
    </div>
  );
}

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

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/hero");
      const heroData = response.data?.hero;

      setHeroes(Array.isArray(heroData) ? heroData : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load heroes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    reset(EMPTY_HERO);
    setShowForm(true);
    setError("");
  };

  const handleEdit = async (id) => {
    try {
      setSaving(true);
      setError("");

      const response = await axios.get(`/api/hero/${id}`);
      const hero = response.data?.hero;

      if (!hero) {
        setError("Hero not found.");
        return;
      }

      setEditingId(hero._id);

      const values = {};
      Object.keys(EMPTY_HERO).forEach((key) => {
        values[key] = hero[key] || "";
      });

      reset(values);
      setShowForm(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load hero."
      );
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await axios.put(`/api/hero/${editingId}`, data);
        alert("Hero updated successfully!");
      } else {
        await axios.post("/api/hero", data);
        alert("Hero created successfully!");
      }

      await fetchHeroes();
      closeForm();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero?")) return;

    try {
      setDeleting(id);
      setError("");

      await axios.delete(`/api/hero/${id}`);
      setHeroes((prev) => prev.filter((hero) => hero._id !== id));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to delete hero."
      );
    } finally {
      setDeleting(null);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset(EMPTY_HERO);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 size={25} className="animate-spin text-blue-600" />
          Loading heroes...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

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
            <button
              onClick={fetchHeroes}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={19} />
              Add Hero
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {heroes.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gray-100 p-4">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              No Hero Found
            </h2>
            <p className="mb-6 mt-2 text-gray-500">
              You haven&apos;t created a hero section yet.
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
          <div className="space-y-6">

            {heroes.map((hero, index) => (
              <div
                key={hero._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <h2 className="font-semibold text-gray-900">
                    Hero #{index + 1}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hero._id)}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hero._id)}
                      disabled={deleting === hero._id}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {deleting === hero._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 px-6 py-5 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Badge</p>
                    <p className="mt-1 text-gray-800">{hero.sub_title || "—"}</p>
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Headline</p>
                    <p className="mt-1 font-medium text-gray-800">
                      {[hero.span, hero.span1, hero.span2, hero.span3]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </p>
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Description</p>
                    <p className="mt-1 text-gray-800">{hero.description || "—"}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Buttons</p>
                    <p className="mt-1 text-gray-800">
                      {[hero.button1, hero.button2, hero.button3]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Stat 1</p>
                    <p className="mt-1 text-gray-800">
                      {hero.counternumber || hero.countertext
                        ? `${hero.counternumber || ""} ${hero.countertext || ""}`.trim()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Stat 2</p>
                    <p className="mt-1 text-gray-800">
                      {hero.counternumber1 || hero.countertext1
                        ? `${hero.counternumber1 || ""} ${hero.countertext1 || ""}`.trim()
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Stat 3</p>
                    <p className="mt-1 text-gray-800">
                      {hero.counternumber2 || hero.countertext2
                        ? `${hero.counternumber2 || ""} ${hero.countertext2 || ""}`.trim()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Hero" : "Add Hero"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  All fields are optional — fill what you need.
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

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 p-6"
            >

              <section className="space-y-4">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Badge &amp; Headline
                </h3>

                <Field
                  label="Badge Text (small text above headline)"
                  name="sub_title"
                  register={register}
                  placeholder="e.g. Welcome to Texas Academy"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="Span (word 1)" name="span" register={register} placeholder="Shaping" />
                  <Field label="Span 1 (word 2)" name="span1" register={register} placeholder="Bright" />
                  <Field label="Span 2 (word 3)" name="span2" register={register} placeholder="Futures" />
                  <Field label="Span 3 (highlighted)" name="span3" register={register} placeholder="Together" />
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Buttons
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Button 1" name="button1" register={register} placeholder="Get Started" />
                  <Field label="Button 2" name="button2" register={register} placeholder="Learn More" />
                  <Field label="Button 3" name="button3" register={register} placeholder="Contact Us" />
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="border-b pb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                  Stats
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Stat 1 Number" name="counternumber" register={register} placeholder="500+" />
                  <Field label="Stat 1 Label" name="countertext" register={register} placeholder="Students" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Stat 2 Number" name="counternumber1" register={register} placeholder="50+" />
                  <Field label="Stat 2 Label" name="countertext1" register={register} placeholder="Teachers" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Stat 3 Number" name="counternumber2" register={register} placeholder="20+" />
                  <Field label="Stat 3 Label" name="countertext2" register={register} placeholder="Years" />
                </div>
              </section>

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
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  {editingId ? "Update Hero" : "Create Hero"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
