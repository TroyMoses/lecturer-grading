'use client'

import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminDashboard() {
  const lecturers = useQuery(api.lecturers.getAllLecturers);
  const subjects = useQuery(api.subjects.getAllSubjects);
  const createSubject = useMutation(api.subjects.createSubject);
  const assignSubject = useMutation(api.subjects.assignSubject);

  const [newSubject, setNewSubject] = useState({
    name: "",
    year: 1,
    semester: 1,
    department: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({ ...prev, [name]: name === "year" || name === "semester" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSubject(newSubject);
    setNewSubject({ name: "", year: 1, semester: 1, department: "" });
    alert("Subject added successfully!");
  };

  const handleAssign = async (lecturerId: Id<"lecturers">, subjectId: Id<"subjects">) => {
    await assignSubject({ lecturerId, subjectId });
    alert("Subject assigned successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Subject Management</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Subject Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={newSubject.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="year">
              Year
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="year"
              name="year"
              value={newSubject.year}
              onChange={handleInputChange}
              required
            >
              <option value={1}>Year 1</option>
              <option value={2}>Year 2</option>
              <option value={3}>Year 3</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="semester">
              Semester
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="semester"
              name="semester"
              value={newSubject.semester}
              onChange={handleInputChange}
              required
            >
              <option value={1}>Semester 1</option>
              <option value={2}>Semester 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
              Department
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="department"
              type="text"
              name="department"
              value={newSubject.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Subject
            </button>
          </div>
        </form>

        <h2 className="text-xl font-semibold mb-4">Lecturer Management</h2>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Qualification</th>
                <th className="px-4 py-2">Experience</th>
                <th className="px-4 py-2">Publications</th>
                <th className="px-4 py-2">Average Weight</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers?.map((lecturer) => (
                <tr key={lecturer._id}>
                  <td className="border px-4 py-2">{lecturer.name}</td>
                  <td className="border px-4 py-2">{lecturer.qualification}</td>
                  <td className="border px-4 py-2">{lecturer.experience}</td>
                  <td className="border px-4 py-2">{lecturer.publications}</td>
                  <td className="border px-4 py-2">{lecturer.averageWeight.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    <select title="Assign Subject"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      onChange={(e) => handleAssign(lecturer._id, e.target.value)}
                    >
                      <option value="">Assign Subject</option>
                      {subjects?.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

