import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllLecturers = query({
  handler: async (ctx) => {
    return await ctx.db.query("lecturers").collect();
  },
});

export const getLecturer = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lecturers")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

export const createLecturer = mutation({
  args: {
    name: v.string(),
    qualification: v.string(),
    experience: v.string(),
    publications: v.string(),
    subjects: v.array(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const averageWeight = calculateAverageWeight(args.qualification, args.experience, args.publications);
    return await ctx.db.insert("lecturers", { ...args, averageWeight });
  },
});

export const updateLecturer = mutation({
  args: {
    id: v.id("lecturers"),
    name: v.string(),
    qualification: v.string(),
    experience: v.string(),
    publications: v.string(),
    subjects: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const averageWeight = calculateAverageWeight(args.qualification, args.experience, args.publications);
    return await ctx.db.patch(args.id, { ...args, averageWeight });
  },
});

function calculateAverageWeight(qualification: string, experience: string, publications: string): number {
  const qualificationWeights = {
    "Certificate": 5 * 2,
    "Degree": 5 * 3,
    "Masters": 5 * 4,
    "PhD": 5 * 5
  };

  const experienceWeights = {
    "0-5 years": 4 * 3,
    "6-10 years": 4 * 4,
    "Above 10 years": 4 * 5
  };

  const publicationWeights = {
    "1-3": 3 * 3,
    "4-6": 3 * 4,
    "Above 7": 3 * 5
  };

  const qualificationWeight = qualificationWeights[qualification as keyof typeof qualificationWeights] || 0;
  const experienceWeight = experienceWeights[experience as keyof typeof experienceWeights] || 0;
  const publicationWeight = publicationWeights[publications as keyof typeof publicationWeights] || 0;

  return (qualificationWeight + experienceWeight + publicationWeight) / 12;
}

