"use client";

import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LecturerDashboard() {
  const { toast } = useToast();
  const { user } = useUser();
  const lecturer = useQuery(api.lecturers.getLecturer, {
    userId: user?.id ?? "",
  });
  const createLecturer = useMutation(api.lecturers.createLecturer);
  const updateLecturer = useMutation(api.lecturers.updateLecturer);
  const subjects = useQuery(api.subjects.getAllSubjects, {});

  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    experience: "",
    publications: "",
    subjects: [] as string[],
  });

  const [currentSemester, setCurrentSemester] = useState({
    year: 1,
    semester: 1,
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

  useEffect(() => {
    // In a real application, you would fetch the current semester and year from the server
    // For now, we'll just set it manually
    setCurrentSemester({ year: 1, semester: 1 });
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //   if (lecturer) {
      //     // Payload for update: exclude userId
      //     const updatePayload = {
      //       _id: lecturer._id,
      //       name: formData.name,
      //       qualification: formData.qualification,
      //       experience: formData.experience,
      //       publications: formData.publications,
      //       subjects: formData.subjects,
      //     };

      //     console.log("Update Payload:", updatePayload);
      //     const response = await updateLecturer(updatePayload);
      //     console.log("Update Response:", response);

      //     toast({
      //       title: "Profile Updated",
      //       description: "Your profile has been successfully updated.",
      //       variant: "success",
      //     });
      //   } else {
      //     // Payload for create: include userId
      //     const createPayload = {
      //       ...formData,
      //       userId: user?.id ?? "",
      //     };

      //     console.log("Create Payload:", createPayload);
      //     const response = await createLecturer(createPayload);
      //     console.log("Create Response:", response);

      //     toast({
      //       title: "Profile Created",
      //       description: "Your profile has been successfully created.",
      //       variant: "success",
      //     });
      //   }

      // Reset the form after successful submission

      const createPayload = {
        ...formData,
        userId: user?.id ?? "",
      };

      await createLecturer(createPayload);

      toast({
        title: "Profile Created",
        description: "Your profile has been successfully created.",
        variant: "success",
      });

      setFormData({
        name: "",
        qualification: "",
        experience: "",
        publications: "",
        subjects: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Check console for details.",
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
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user?.firstName}!
        </h2>
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
                  onValueChange={(value) =>
                    handleInputChange("qualification", value)
                  }
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
                  onValueChange={(value) =>
                    handleInputChange("experience", value)
                  }
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-5 years">0-5 years</SelectItem>
                    <SelectItem value="6-10 years">6-10 years</SelectItem>
                    <SelectItem value="Above 10 years">
                      Above 10 years
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="publications">Publications</Label>
                <Select
                  value={formData.publications}
                  onValueChange={(value) =>
                    handleInputChange("publications", value)
                  }
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
                <Label htmlFor="subjects">
                  Subjects (Choose up to 5 in order of priority)
                </Label>
                <div className="space-y-1">
                  {subjects
                    ?.filter(
                      (subject) =>
                        subject.year === currentSemester.year &&
                        subject.semester === currentSemester.semester
                    )
                    .map((subject) => (
                      <div
                        key={subject._id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`subject-${subject._id}`}
                          value={subject.name}
                          checked={formData.subjects.includes(subject.name)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                              if (e.target.checked) {
                                // Add subject
                                return {
                                  ...prev,
                                  subjects: [...prev.subjects, value].slice(
                                    0,
                                    5
                                  ), // Limit to 5
                                };
                              } else {
                                // Remove subject
                                return {
                                  ...prev,
                                  subjects: prev.subjects.filter(
                                    (subj) => subj !== value
                                  ),
                                };
                              }
                            });
                          }}
                        />
                        <label htmlFor={`subject-${subject._id}`}>
                          {subject.name}
                        </label>
                      </div>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select up to 5 subjects.
                </p>
              </div>

              <Button type="submit">Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
