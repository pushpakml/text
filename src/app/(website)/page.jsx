"use client"
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


function page() {
  const [hero, setHero] = useState([null]);
  const [about, setAbout] = useState([null]);
  const [facility, setFacilities] = useState([null]);

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [sendingContact, setSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState(null);

  const handleContactChange = (field, value) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      setSendingContact(true);
      setContactStatus(null);

      await axios.post("/api/contact", contactForm);

      setContactStatus({
        type: "success",
        text: "Message sent successfully! We will get back to you soon.",
      });
      setContactForm({ name: "", phone: "", email: "", message: "" });
    } catch (err) {
      setContactStatus({
        type: "error",
        text:
          err.response?.data?.message ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setSendingContact(false);
    }
  };


  const fetchData = async () => {
    try {
      const [heroRes, aboutRes, facilityRes] = await Promise.allSettled([
        axios.get("/api/hero"),
        axios.get("/api/about"),
        axios.get("/api/facility"),
      ]);

      if (heroRes.status === "fulfilled") {
        setHero(heroRes.value.data.hero?.[0] || null);
      }
      if (aboutRes.status === "fulfilled") {
        setAbout(aboutRes.value.data.about?.[0] || null);
      }
      if (facilityRes.status === "fulfilled") {
        setFacilities(facilityRes.value.data.facility?.[0] || null);
      }
    } catch (error) {
      console.log("failed to fetch hero", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/photo/bg1.svg')",
          }}
        />
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <p className="inline-block mb-5 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md 
            border border-white/20 text-yellow-300 text-sm sm:text-base">
            🎓 {hero?.sub_title}
          </p>
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-7xl 
             font-black tracking-tight text-white leading-tight">
            <span className="bg-linear-to-r from-purple-400 via-pink-500 to-yellow-400 
                   bg-clip-text text-transparent">
              {hero?.span}
            </span>
            {" "}
            {hero?.span1}
            <br />
            {hero?.span2} <span className="bg-linear-to-r from-violet-400 via-green-500 to-red-500 bg-clip-text text-transparent">
              {hero?.span3}
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-gray-200 
            text-lg sm:text-xl md:text-2xl leading-relaxed">
            {hero?.description}
          </p>
          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
            <a href="#about" className="px-8 py-4 rounded-full bg-yellow-500 
                 hover:bg-yellow-600 transition duration-300
                 text-white font-semibold text-lg shadow-lg shadow-yellow-500/30">
              {hero?.button1} →
            </a>
            <a href="#contact" className="px-8 py-4 rounded-full border border-white/40
                 hover:bg-white hover:text-black transition duration-300
                 text-white font-semibold text-lg">
              {hero?.button2}
            </a>
          </div>
          {/* Stats */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 
                  rounded-xl p-5 text-white">
              <h3 className="text-3xl font-bold text-yellow-400">
                {hero?.counternumber}
              </h3>
              <p className="text-gray-300">
                {hero?.countertext}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 
                  rounded-xl p-5 text-white">
              <h3 className="text-3xl font-bold text-purple-400">
                {hero?.counternumber1}
              </h3>
              <p className="text-gray-300">
                {hero?.countertext1}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 
                  rounded-xl p-5 text-white">
              <h3 className="text-3xl font-bold text-cyan-400">
                {hero?.counternumber2}
              </h3>
              <p className="text-gray-300">
                {hero?.countertext2}
              </p>
            </div>
            
          </div>
        </div>
      </section>

      <section className="py-16 bg-white" id='about'>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img src={about?.image || "/texas/IMG-20251114-WA0012.jpg"} className="rounded-3xl shadow-xl w-full h-[400px] object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-950 mb-5">
              {about?.title}
            </h1>
            <p className="text-gray-700 leading-8 text-lg">
              {about?.description}
            </p>
            <p className="text-gray-700 leading-8 text-lg mt-4">
              {about?.description1}
            </p>
            <button className='py-2'>
              <a href="#facility" className="mt-6 bg-blue-950 text-white px-7 py-3 rounded-full">
                Learn More
              </a>
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100" id='facility'>
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-950">
              Our Facilities
            </h1>
            <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
              Texas Academy provides a safe, comfortable, and modern environment
              where students can learn, grow, and excel.
            </p>
          </div>
          {/* Facilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hostel */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/hostel.jpg" className="w-full h-64 object-cover" alt="Affordable Hostel" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {facility?.title}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description}
                </p>
              </div>
            </div>
            {/* Classroom */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/classroom.jpg" className="w-full h-64 object-cover" alt="Classroom" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  Neat &amp; {facility?.title1}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description1}
                </p>
              </div>
            </div>
            {/* Computer Lab */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/computerlab.jpeg" className="w-full h-64 object-cover " alt="Computer Lab" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {facility?.title2}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description2}
                </p>
              </div>
            </div>
            {/* Digital Hall */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/digitalhall.jpg" className="w-full h-64 object-cover" alt="Digital Hall" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {facility?.title3}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description3}
                </p>
              </div>
            </div>
            {/* Playground */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/playground.jpg" className="w-full h-64 object-cover" alt="Playground" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {facility?.title4}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description4}
                </p>
              </div>
            </div>
            {/* Library */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <img src="texas/clay.jpg" className="w-full h-64 object-cover" alt="Library" />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-blue-900">
                  {facility?.title5}
                </h2>
                <p className="text-gray-600 mt-3">
                  {facility?.description5}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-blue-950">
              Meet Our Teachers
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our experienced and passionate educators are dedicated to
              helping every student learn, grow, and achieve success.
            </p>
          </div>
          {/* Teachers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Principal */}

            {/* Teacher */}
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center p-6">
              <img src="texas/Ramkrishna.jpg" className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-green-200" />
              <h2 className="text-2xl font-bold text-blue-950 mt-5">
                Ramkrishna Aacharya
              </h2>
              <p className="text-green-700 font-semibold">
                Nepali Teacher
              </p>
              <p className="text-gray-500 mt-2">
                15+ Years of Experience
              </p>
            </div>


            {/* Teacher */}

            {/* Teacher Without Photo */}
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center p-6">
              <img src="texas/Mukesh.jpg" className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-red-200" />

              <h2 className="text-2xl font-bold text-blue-950 mt-5">
                Mukesh Shah
              </h2>
              <p className="text-blue-700 font-semibold">
                Mathematics Teacher
              </p>
              <p className="text-gray-500 mt-2">
                15+ Years of Experience
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center p-6">
              <img src="texas/nagitamiss.jpeg" className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-blue-200" />
              <h2 className="text-2xl font-bold text-blue-950 mt-5">
                Nagita Singh
              </h2>
              <p className="text-amber-600 font-semibold">
                ClassTeacher of: UKG 'A'
              </p>
              <p className="text-gray-500 mt-2">
                10+ Years of Experience
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 text-center p-6">
              <img src="texas/Subodh.jpg" className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-red-200" />
              <h2 className="text-2xl font-bold text-blue-950 mt-5">
                Shambhu Yadav
              </h2>
              <p className="text-red-700 font-semibold">
                Science Teacher
              </p>
              <p className="text-gray-500 mt-2">
                7+ Years of Experience
              </p>
            </div>
          </div>

          {/* Button */}
          <div className="text-center mt-14">
            <a href="/teachers" className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-full font-semibold transition">
              View All Teachers
            </a>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section Heading */}
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-2">
              Our Memories
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              School <span className="text-blue-600">Gallery</span>
            </h2>

            <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>

            <p className="text-gray-600 max-w-2xl mx-auto mt-5">
              Take a look at some of the memorable moments, activities,
              celebrations, and achievements of our students and teachers.
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Image 1 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/IMG-20251114-WA0011.jpg"
                alt="School activity"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">School Activities</h3>
              </div>
            </div>

            {/* Image 2 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/std prize take (3).jpg"
                alt="Students receiving prizes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">Student Achievements</h3>
              </div>
            </div>

            {/* Image 3 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/group divide (3).jpg"
                alt="Students group activity"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">Student Activities</h3>
              </div>
            </div>

            {/* Image 4 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/quiz time (2).jpg"
                alt="Quiz competition"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">Quiz Competition</h3>
              </div>
            </div>

            {/* Image 5 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/IMG-20251114-WA0039.jpg"
                alt="School event"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">School Events</h3>
              </div>
            </div>

            {/* Image 6 */}
            <div className="group relative overflow-hidden rounded-2xl shadow-md h-72">
              <img
                src="/texas/teachers grp (2).jpg"
                alt="Teachers group"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold">Our Teachers</h3>
              </div>
            </div>

          </div>

          {/* Bottom Button */}
          <div className="text-center mt-12">
            <button className="px-7 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl">
              <Link href={"https://www.facebook.com/teksasa.ekedemi/photos"}>
                View More Photos
              </Link>
            </button>
          </div>

        </div>
      </section>


      

      <section className="py-16 bg-linear-to-br from-violet-900/80 via-white to-amber-500/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold text-blue-950">
              Why Choose Us
            </h1>
            <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
              At Texas Academy, we focus on creating a positive learning
              environment where students can gain knowledge, build confidence,
              and develop skills for the future.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-100 p-8 rounded-2xl text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                🧑‍🏫
              </div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                Experienced Teachers
              </h2>
              <p className="text-gray-600">
                Our dedicated teachers guide students with effective
                teaching methods and personal attention.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                📚
              </div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                Quality Education
              </h2>
              <p className="text-gray-600">
                We provide a balanced education that focuses on academic
                growth and practical learning.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                🏫
              </div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                Modern Facilities
              </h2>
              <p className="text-gray-600">
                A comfortable learning environment with facilities that
                support students' overall development.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-2xl text-center hover:shadow-xl transition">
              <div className="text-4xl mb-4">
                🎨
              </div>
              <h2 className="text-xl font-bold text-blue-950 mb-3">
                Extra Activities
              </h2>
              <p className="text-gray-600">
                Students get opportunities to explore sports, creativity,
                teamwork, and leadership skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-center font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-amber-600 mb-12">
            Events
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <a href="#">
                <img className="w-full h-72 object-cover hover:scale-105 transition duration-300" src="texas/shrawan15-3.jpg" alt="Shrawan 15 Program" />
                <h2 className="text-center text-xl font-semibold py-4 text-blue-900">
                  Shrawan 15 Program
                </h2>
              </a>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <a href="#">
                <img className="w-full h-72 object-cover hover:scale-105 transition duration-300" src="texas/asar5.jpg" alt="Ashar 15 Program" />
                <h2 className="text-center text-xl font-semibold py-4 text-blue-900">
                  Ashar 15 Program
                </h2>
              </a>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <a href="#">
                <img className="w-full h-72 object-cover hover:scale-105 transition duration-300" src="texas/art1.jpg" alt="Shaping Clay Program" />
                <h2 className="text-center text-xl font-semibold py-4 text-blue-900">
                  Shaping Clay Program
                </h2>
              </a>
            </div>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <a href="#">
                <img className="w-full h-72 object-cover hover:scale-105 transition duration-300" src="texas/teac4.jpg" alt="Teacher's Day Program" />
                <h2 className="text-center text-xl font-semibold py-4 text-blue-900">
                  Teacher's Day Program
                </h2>
              </a>
            </div>
          </div>
          <div className='py-3'>
            <h1 className='text-blue-950 py-2 px-10  text-2xl font-semibold hover:text-amber-500 '>
              <Link href={"https://www.facebook.com/teksasa.ekedemi"}>
                Click on this for more events
              </Link>
            </h1>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-950">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              What Parents Say
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
              The trust and satisfaction of our parents inspire us to provide
              the best education every day.
            </p>
          </div>
          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
              <div className="text-5xl text-blue-900 mb-4">❝</div>
              <p className="text-gray-700 leading-7 italic">
                Texas Academy has provided my child with an excellent learning
                environment. The teachers are caring, supportive, and always
                encourage students to achieve their best.
              </p>
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-xl text-blue-950">
                  Mr. Ramesh Jha
                </h3>
                <p className="text-gray-500">
                  Father of Nitesh Jha
                </p>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
              <div className="text-5xl text-blue-900 mb-4">❝</div>
              <p className="text-gray-700 leading-7 italic">
                I have seen a remarkable improvement in my daughter's
                confidence and academic performance. Thank you to all the
                teachers for their dedication.
              </p>
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-xl text-blue-950">
                  Mrs. Sunita Yadav
                </h3>
                <p className="text-gray-500">
                  Mother of Anisha Yadav
                </p>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition">
              <div className="text-5xl text-blue-900 mb-4">❝</div>
              <p className="text-gray-700 leading-7 italic">
                The school provides quality education along with discipline,
                extracurricular activities, and a safe environment for every
                child. I'll fully recommend this this Schol.
              </p>
              <div className="mt-6 border-t pt-4">
                <h3 className="font-bold text-xl text-blue-950">
                  Mr. Rajesh Shrestha
                </h3>
                <p className="text-gray-500">
                  Uncle of Ritesh Shrestha
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="py-20 bg-gray-100" id='message'>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Photo */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative">
                <img src="texas/owner.jpg" alt="School Principal" className="w-80 h-80 object-cover rounded-full border-8 border-white shadow-2xl" />
                {/* Decorative Circle */}
                <div className="absolute -z-10 -top-5 -left-5 w-80 h-80 rounded-full bg-blue-200" />
              </div>
            </div>
            {/* Message */}
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                Owner's Message
              </h2>
              <p className="text-lg text-gray-700 leading-9 text-justify">
                Our school is not just a place to teach students; it is a place
                where teachers also continue to learn from students. Education
                is a journey of mutual growth, respect, and inspiration. We
                proudly call this institution our second home, where every
                student is encouraged to dream big, develop confidence, and
                achieve excellence.
              </p>
              <h4 className="mt-8 text-xl font-semibold text-blue-900">
                — Sunil Yadav
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100" id='message'>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Photo */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative">
                <img src="texas/santoshsir.jpg" alt="School Principal" className="w-80 h-80 object-cover rounded-full border-8 border-white shadow-2xl" />
                {/* Decorative Circle */}
                <div className="absolute -z-10 -top-5 -left-5 w-80 h-80 rounded-full bg-blue-200" />
              </div>
            </div>
            {/* Message */}
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                Managing Director's Message
              </h2>
              <p className="text-lg text-gray-700 leading-9 text-justify">
                We believe every student has unique potential waiting to be discovered.
                Our aim is to provide the right guidance, opportunities,
                and encouragement to help them grow into confident individuals
                who are ready to face the future with knowledge, purpose, and determination.
              </p>
              <h4 className="mt-8 text-xl font-semibold text-blue-900">
                — Santosh Shrestha
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100" id='message'>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
            {/* Photo */}
            <div className="lg:w-1/3 flex justify-center">
              <div className="relative">
                <img src="texas/principal.jpg" alt="School Principal" className="w-80 h-80 object-cover rounded-full border-8 border-white shadow-2xl" />
                {/* Decorative Circle */}
                <div className="absolute -z-10 -top-5 -left-5 w-80 h-80 rounded-full bg-blue-200" />
              </div>
            </div>
            {/* Message */}
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">
                Principal's Message
              </h2>
              <p className="text-lg text-gray-700 leading-9 text-justify">
                At our school, we focus on helping students discover their strengths
                and turn their ambitions into meaningful achievements.
                With dedicated teachers, strong values, and a positive environment,
                we aim to prepare our students not only for examinations,
                but for the opportunities and responsibilities that lie ahead.
              </p>
              <h4 className="mt-8 text-xl font-semibold text-blue-900">
                — Prashant Mishra
              </h4>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-20" id='contact'>
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-950">
              Get In Touch
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Have questions? Send us a message or visit our school.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-bold text-blue-950 mb-6">
                Write Your Message
              </h2>

              {contactStatus && (
                <div
                  className={`mb-5 rounded-xl px-4 py-3 text-sm ${
                    contactStatus.type === "success"
                      ? "border border-green-200 bg-green-50 text-green-700"
                      : "border border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {contactStatus.text}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input type="text" required placeholder="Enter your full name" value={contactForm.name} onChange={(e) => handleContactChange("name", e.target.value)} className="w-full border text-blue-900 border-gray-300 rounded-xl px-4 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-900" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Contact Number
                  </label>
                  <input type="tel" placeholder="Enter your contact number" value={contactForm.phone} onChange={(e) => handleContactChange("phone", e.target.value)} className="w-full border text-blue-900 border-gray-300 rounded-xl px-4 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-900" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input type="email" required placeholder="Enter your email address" value={contactForm.email} onChange={(e) => handleContactChange("email", e.target.value)} className="w-full border text-blue-900 border-gray-300 rounded-xl px-4 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-900" />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Message
                  </label>
                  <textarea rows={5} required placeholder="Write your message..." value={contactForm.message} onChange={(e) => handleContactChange("message", e.target.value)} className="w-full border text-blue-900 border-gray-300 rounded-xl px-4 py-3 
                  focus:outline-none focus:ring-2 focus:ring-blue-900" />
                </div>
                <button
                  type="submit"
                  disabled={sendingContact}
                  className="w-full bg-blue-950 text-white py-4 rounded-xl 
              font-semibold text-lg hover:bg-blue-800 transition duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingContact ? "Sending..." : "Send Message →"}
                </button>
              </form>
            </div>
            {/* Map + Details */}
            <div className="space-y-6 items-center text-center justify-center">
              {/* Google Map */}
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <iframe className="w-full h-[420px]" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.0675179206464!2d85.46092647573036!3d26.996413876597366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ec85c3913a2159%3A0x673ad2f200a2695f!2sTexas%20Academy%20Sarlahi!5e0!3m2!1sen!2snp!4v1786088950151!5m2!1sen!2snp" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}

export default page
