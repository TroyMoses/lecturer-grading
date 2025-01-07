import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createSubject = mutation({
  args: {
    name: v.string(),
    year: v.number(),
    semester: v.number(),
    department: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("subjects", args);
  },
});

export const getAllSubjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("subjects").collect();
  },
});

export const assignSubject = mutation({
  args: {
    lecturerId: v.id("lecturers"),
    subjectId: v.id("subjects"),
  },
  handler: async (ctx, args) => {
    const lecturer = await ctx.db.get(args.lecturerId);
    if (!lecturer) {
      throw new Error("Lecturer not found");
    }
    const subject = await ctx.db.get(args.subjectId);
    if (!subject) {
      throw new Error("Subject not found");
    }
    
    // Check if the subject is already assigned to the lecturer
    if (lecturer.subjects.includes(subject.name)) {
      throw new Error("Subject already assigned to this lecturer");
    }
    
    // Add the subject to the lecturer's subjects array
    await ctx.db.patch(args.lecturerId, {
      subjects: [...lecturer.subjects, subject.name],
    });
    
    return { success: true, message: `${subject.name} assigned to ${lecturer.name}` };
  },
});

