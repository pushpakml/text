"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Save,
    Loader2,
    RefreshCw,
    School,
    Plus,
} from "lucide-react";

const EMPTY = {
    title: "",
    description: "",
    title1: "",
    description1: "",
    title2: "",
    description2: "",
    title3: "",
    description3: "",
    title4: "",
    description4: "",
    title5: "",
    description5: "",
};

export default function FacilitiesPage() {
    const [facilityId, setFacilityId] = useState(null);
    const [hasContent, setHasContent] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: EMPTY,
    });

    const applyFacility = (facilityData) => {
        reset({
            title: facilityData.title || "",
            description: facilityData.description || "",
            title1: facilityData.title1 || "",
            description1: facilityData.description1 || "",
            title2: facilityData.title2 || "",
            description2: facilityData.description2 || "",
            title3: facilityData.title3 || "",
            description3: facilityData.description3 || "",
            title4: facilityData.title4 || "",
            description4: facilityData.description4 || "",
            title5: facilityData.title5 || "",
            description5: facilityData.description5 || "",
        });
    };

    const fetchFacility = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.get("/api/facility");
            const data = response.data.facility;
            const facilityData = data?.[0];

            if (facilityData) {
                setFacilityId(facilityData._id);
                setHasContent(true);
                applyFacility(facilityData);
            } else {
                setFacilityId(null);
                setHasContent(false);
                reset(EMPTY);
            }
        } catch (err) {
            console.error("FETCH FACILITY ERROR:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load facilities."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacility();
    }, []);

    const onSubmit = async (data) => {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (facilityId) {
                await axios.put(`/api/facility/${facilityId}`, data);
                setSuccess("All facilities updated successfully!");
            } else {
                const response = await axios.post("/api/facility", data);
                if (response.data.facility?._id) {
                    setFacilityId(response.data.facility._id);
                    setHasContent(true);
                }
                setSuccess("Facilities created successfully!");
            }
        } catch (err) {
            console.error("SAVE FACILITY ERROR:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to save facilities."
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
                    Loading facilities...
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl">

            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-900">
                        <School size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Facilities
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {hasContent
                                ? "Edit the six facilities displayed on your website"
                                : "No facilities yet — fill the form to create them"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={fetchFacility}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <FacilityCard number="01" name="Hostel" register={register} titleField="title" descriptionField="description" />

                <FacilityCard number="02" name="Classroom" register={register} titleField="title1" descriptionField="description1" />

                <FacilityCard number="03" name="Computer Lab" register={register} titleField="title2" descriptionField="description2" />

                <FacilityCard number="04" name="Digital Hall" register={register} titleField="title3" descriptionField="description3" />

                <FacilityCard number="05" name="Playground" register={register} titleField="title4" descriptionField="description4" />

                <FacilityCard number="06" name="Library" register={register} titleField="title5" descriptionField="description5" />

                <div className="sticky bottom-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-blue-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800 disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                {facilityId ? <Save size={18} /> : <Plus size={18} />}
                                {facilityId ? "Save All Changes" : "Create Facilities"}
                            </>
                        )}
                    </button>
                </div>

            </form>

        </div>
    );
}


function FacilityCard({
    number,
    name,
    register,
    titleField,
    descriptionField,
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            <div className="flex items-center gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-sm font-bold text-white">
                    {number}
                </div>
                <div>
                    <h2 className="font-bold text-gray-800">
                        {name}
                    </h2>
                    <p className="text-xs text-gray-400">
                        Edit facility information
                    </p>
                </div>
            </div>

            <div className="space-y-5 p-6">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        {...register(titleField)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Description
                    </label>
                    <textarea
                        rows={5}
                        {...register(descriptionField)}
                        className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 leading-7 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

        </div>
    );
}
