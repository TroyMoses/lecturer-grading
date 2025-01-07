'use client'

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";

export default function LecturerDashboard() {
  const { user } = useUser();
  const lecturer = useQuery(api.lecturers.getLecturer, { userId: user?.id ?? "" });
  const createLecturer = useMutation(api.lecturers.createLecturer);
  const updateLecturer = useMutation(api.lecturers.updateLecturer);

  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    experience: "",
    publications: "",
    subjects: ["", "", "", "", ""],
  });

  useEffect(() => {
    if (lecturer) {
      setFormData({
        name: lecturer.name,
        qualification: lecturer.qualification,
        experience: lecturer.experience,
        publications: lecturer.publications,
        subjects: lecturer.subjects,
      });
    }
  }, [lecturer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newSubjects = [...prev.subjects];
      newSubjects[index] = value;
      return { ...prev, subjects: newSubjects };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lecturer) {
      await updateLecturer({
        id: lecturer._id,
        ...formData,
      });
    } else {
      await createLecturer({
        ...formData,
        userId: user?.id ?? "",
      });
    }
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Lecturer Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qualification">
              Qualification
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Qualification</option>
              <option value="Certificate">Certificate</option>
              <option value="Degree">Degree</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
              Experience
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Experience</option>
              <option value="0-5 years">0-5 years</option>
              <option value="6-10 years">6-10 years</option>
              <option value="Above 10 years">Above 10 years</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="publications">
              Publications
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="publications"
              name="publications"
              value={formData.publications}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Publications</option>
              <option value="1-3">1-3</option>
              <option value="4-6">4-6</option>
              <option value="Above 7">Above 7</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Subjects (Choose 5 in order of priority)</label>
            {formData.subjects.map((subject, index) => (
              <input
                key={index}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                type="text"
                placeholder={`Subject ${index + 1}`}
                value={subject}
                onChange={(e) => handleSubjectChange(index, e.target.value)}
                required
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Profile
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

