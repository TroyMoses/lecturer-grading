import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
  lecturers: defineTable({
    name: v.string(),
    qualification: v.string(),
    experience: v.string(),
    publications: v.string(),
    subjects: v.array(v.string()),
    averageWeight: v.number(),
    userId: v.string(),
  }),
  subjects: defineTable({
    name: v.string(),
    year: v.number(),
    semester: v.number(),
    department: v.string(),
  }),
});
