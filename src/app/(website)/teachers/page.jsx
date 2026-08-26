"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Loader2 } from "lucide-react";

export default function Page() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeachers = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "/api/teacher"
            );

            setTeachers(
                response.data.teachers || []
            );
        } catch (error) {
            console.error(
                "Failed to fetch teachers:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <section className="min-h-screen bg-gradient-to-br from-violet-100 via-amber-50 to-red-100 px-5 py-16 md:px-10 lg:px-16">

            {/* ================= HEADER ================= */}

            <div className="mx-auto mb-12 max-w-4xl text-center">

                <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                    Our Faculty
                </span>

                <h1 className="mt-4 font-serif text-4xl font-bold text-blue-950 md:text-5xl">
                    Our Teaching Staff
                </h1>

                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-blue-600" />

                <p className="mx-auto mt-5 max-w-2xl text-gray-600">
                    Meet our dedicated team of teachers who
                    inspire, guide and support our students
                    throughout their learning journey.
                </p>

            </div>


            {/* ================= LOADING ================= */}

            {loading && (

                <div className="flex min-h-[300px] items-center justify-center">

                    <div className="flex flex-col items-center">

                        <Loader2
                            size={40}
                            className="animate-spin text-blue-600"
                        />

                        <p className="mt-3 text-gray-500">
                            Loading our teachers...
                        </p>

                    </div>

                </div>

            )}


            {/* ================= EMPTY ================= */}

            {!loading &&
                teachers.length === 0 && (

                    <div className="mx-auto max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

                            <Users
                                size={35}
                                className="text-blue-600"
                            />

                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-800">
                            No teachers found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Teacher information will appear
                            here once it is added.
                        </p>

                    </div>

                )}


            {/* ================= TEACHER GRID ================= */}

            {!loading &&
                teachers.length > 0 && (

                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                        {teachers.map(
                            (teacher) => (

                                <div
                                    key={
                                        teacher._id
                                    }
                                    className="group overflow-hidden rounded-3xl bg-white p-5 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >

                                    {/* IMAGE */}

                                    <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-4 border-blue-100 bg-gray-100 shadow-sm">

                                        {teacher.image ? (

                                            <img
                                                src={
                                                    teacher.image
                                                }
                                                alt={
                                                    teacher.name
                                                }
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                        ) : (

                                            <div className="flex h-full w-full items-center justify-center">

                                                <Users
                                                    size={70}
                                                    className="text-gray-300"
                                                />

                                            </div>

                                        )}

                                    </div>


                                    {/* INFO */}

                                    <div className="mt-5">

                                        <h2 className="text-xl font-bold text-blue-950">
                                            {
                                                teacher.name
                                            }
                                        </h2>

                                        <p className="mt-2 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                                            {
                                                teacher.subject
                                            }
                                        </p>

                                        {teacher.experience && (

                                            <p className="mt-3 text-sm text-gray-500">
                                                <span className="font-semibold text-gray-700">
                                                    Experience:
                                                </span>{" "}
                                                {
                                                    teacher.experience
                                                }
                                            </p>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

        </section>
    );
}