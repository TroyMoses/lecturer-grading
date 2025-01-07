'use client'

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function LecturerDashboard() {
  const { toast } = useToast();
  const { user } = useUser();
  const lecturer = useQuery(api.lecturers.getLecturer, { userId: user?.id ?? "" });
  const createLecturer = useMutation(api.lecturers.createLecturer);
  const updateLecturer = useMutation(api.lecturers.updateLecturer);
  const subjects = useQuery(api.subjects.getAllSubjects);

  console.log("Subjects: ", subjects);

  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    experience: "",
    publications: "",
    subjects: [],
  });

  const [currentSemester, setCurrentSemester] = useState({ year: 1, semester: 1 });

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

  useEffect(() => {
    // In a real application, you would fetch the current semester and year from the server
    // For now, we'll just set it manually
    setCurrentSemester({ year: 1, semester: 2 });
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, subjects: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (lecturer) {
        await updateLecturer({
          id: lecturer._id,
          ...formData,
        });
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        await createLecturer({
          ...formData,
          userId: user?.id ?? "",
        });
        toast({
          title: "Profile Created",
          description: "Your profile has been successfully created.",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Lecturer Dashboard</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Current Academic Period</AlertTitle>
          <AlertDescription>
            Year {currentSemester.year}, Semester {currentSemester.semester}
          </AlertDescription>
        </Alert>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Lecturer Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Select
                  value={formData.qualification}
                  onValueChange={(value) => handleInputChange("qualification", value)}
                >
                  <SelectTrigger id="qualification">
                    <SelectValue placeholder="Select Qualification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Degree">Degree</SelectItem>
                    <SelectItem value="Masters">Masters</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleInputChange("experience", value)}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5 years">0-5 years</SelectItem>
                    <SelectItem value="6-10 years">6-10 years</SelectItem>
                    <SelectItem value="Above 10 years">Above 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publications">Publications</Label>
                <Select
                  value={formData.publications}
                  onValueChange={(value) => handleInputChange("publications", value)}
                >
                  <SelectTrigger id="publications">
                    <SelectValue placeholder="Select Publications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="4-6">4-6</SelectItem>
                    <SelectItem value="Above 7">Above 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjects">Subjects (Choose up to 5 in order of priority)</Label>
                <Select
                  value={formData.subjects}
                  onValueChange={handleSubjectChange}
                  multiple
                >
                  <SelectTrigger id="subjects">
                    <SelectValue placeholder="Select Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects?.filter(subject => subject.year === currentSemester.year && subject.semester === currentSemester.semester).map((subject) => (
                      <SelectItem key={subject._id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects</p>
              </div>
              <Button type="submit">Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

