'use client'

import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { PlusCircle } from 'lucide-react';
import { Id } from "../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const lecturers = useQuery(api.lecturers.getAllLecturers,{});
  const subjects = useQuery(api.subjects.getAllSubjects, {});
  const createSubjects = useMutation(api.subjects.createSubjects);
  const assignSubject = useMutation(api.subjects.assignSubject);

  const [newSubjects, setNewSubjects] = useState({
    year: "1",
    semester: "1",
    department: "",
    subjects: [""],
  });

  const handleInputChange = (name: string, value: string) => {
    setNewSubjects((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index: number, value: string) => {
    setNewSubjects((prev) => {
      const newSubjectList = [...prev.subjects];
      newSubjectList[index] = value;
      return { ...prev, subjects: newSubjectList };
    });
  };

  const addSubjectField = () => {
    setNewSubjects((prev) => ({ ...prev, subjects: [...prev.subjects, ""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSubjects({
        ...newSubjects,
        year: parseInt(newSubjects.year),
        semester: parseInt(newSubjects.semester),
      });
      setNewSubjects({ year: "1", semester: "1", department: "", subjects: [""] });
      toast({
        title: "Subjects Added",
        description: "The subjects have been successfully added.",
        variant: "default",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subjects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssign = async (lecturerId: Id<"lecturers">, subjectId: Id<"subjects">) => {
    try {
      await assignSubject({ lecturerId, subjectId });
      toast({
        title: "Subject Assigned",
        description: "The subject has been successfully assigned to the lecturer.",
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Subject Management</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={newSubjects.year}
                    onValueChange={(value) => handleInputChange("year", value)}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={newSubjects.semester}
                    onValueChange={(value) => handleInputChange("semester", value)}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newSubjects.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                {newSubjects.subjects.map((subject, index) => (
                  <Input
                    key={index}
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder={`Subject ${index + 1}`}
                    required
                  />
                ))}
                <Button type="button" variant="outline" onClick={addSubjectField}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Subject
                </Button>
              </div>
              <Button type="submit">Add Subjects</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lecturer Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Publications</TableHead>
                  <TableHead>Average Weight</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lecturers?.map((lecturer) => (
                  <TableRow key={lecturer._id}>
                    <TableCell>{lecturer.name}</TableCell>
                    <TableCell>{lecturer.qualification}</TableCell>
                    <TableCell>{lecturer.experience}</TableCell>
                    <TableCell>{lecturer.publications}</TableCell>
                    <TableCell>{lecturer.averageWeight.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select onValueChange={(value) => handleAssign(lecturer._id, value as Id<"subjects">)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects?.map((subject) => (
                            <SelectItem key={subject._id} value={subject._id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

