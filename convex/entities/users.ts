import { query, mutation } from "@/../convex/_generated/server";
import { v, Infer } from "convex/values";
import { Doc, Id } from "@/../convex/_generated/dataModel";

// User type based on schema
export type User = Doc<"users">;

// Type-safe field accessors for Users entity
export const UserFields = {
  _id: "_id",
  _creationTime: "_creationTime",
  clerkId: "clerkId",
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  imageUrl: "imageUrl",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isActive: "isActive",
} as const satisfies Record<keyof Doc<"users">, string>;

// Validator constants for reuse across functions and services
export const userFiltersValidator = v.object({
  search: v.optional(v.string()),
});

export const createUserInputValidator = v.object({
  clerkId: v.string(),
  email: v.string(),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
});

export const updateUserInputValidator = v.object({
  email: v.optional(v.string()),
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
});

// Types derived from validators
export type UserFilters = Infer<typeof userFiltersValidator>;
export type CreateUserInput = Infer<typeof createUserInputValidator>;
export type UpdateUserInput = Infer<typeof updateUserInputValidator>;

// Validation helpers
export type ValidUserField = keyof Doc<"users">;
