import { query, mutation } from "@/../convex/_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v, Infer } from "convex/values";
import { Doc, Id } from "@/../convex/_generated/dataModel";
import { PaginationResult } from "convex/server";

// Product type based on schema
export type Product = Doc<"products">;

// Type-safe field accessors for Products entity
export const ProductFields = {
  _id: "_id",
  _creationTime: "_creationTime",
  name: "name",
  price: "price",
  cost: "cost",
  description: "description",
  category: "category",
  internalNotes: "internalNotes",
  tenantId: "tenantId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isActive: "isActive",
} as const satisfies Record<keyof Doc<"products">, string>;

// Validator constants for reuse across functions and services
export const productFiltersValidator = v.object({
  category: v.optional(v.string()),
  minPrice: v.optional(v.number()),
  maxPrice: v.optional(v.number()),
});

// Export filter keys dynamically
export const productFilterKeys = Object.keys(
  productFiltersValidator.fields
) as (keyof ProductFilters)[];

// Define available indexes (must match schema.ts)
export const productIndexes = {
  by_tenant_active: ["tenantId", "isActive"],
  // Add more as defined in schema: by_tenant_price, by_tenant_category
} as const;

// Map sortable fields to indexes
export const productSortableFields = {
  _creationTime: null, // No index needed
  // price: "by_tenant_price", // Only if index exists
  // category: "by_tenant_category", // Only if index exists
} as const;

// Generic sort validator
export const sortValidator = v.object({
  field: v.optional(v.string()),
  direction: v.optional(v.union(v.literal("asc"), v.literal("desc")))
});

export const createProductInputValidator = v.object({
  name: v.string(),
  description: v.string(),
  price: v.optional(v.number()),
  category: v.string(),
  cost: v.optional(v.number()),
  internalNotes: v.optional(v.string()),
  tenantId: v.string(),
});

export const updateProductInputValidator = v.object({
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  price: v.optional(v.number()),
  category: v.optional(v.string()),
  cost: v.optional(v.number()),
  internalNotes: v.optional(v.string()),
});

// Types derived from validators
export type ProductFilters = Infer<typeof productFiltersValidator>;
export type CreateProductInput = Infer<typeof createProductInputValidator>;
export type UpdateProductInput = Infer<typeof updateProductInputValidator>;
export type SortParams = Infer<typeof sortValidator>;

// Validation helpers
export type ValidProductField = keyof Doc<"products">;

// Unified list function with filters and sorting
export const listProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    tenantId: v.string(),
    filters: v.optional(productFiltersValidator),
    sort: v.optional(sortValidator),
  },
  handler: async (ctx, args) => {
    const { tenantId, filters = {}, sort = {} } = args;
    
    // Determine sort field and direction
    const sortField = sort.field || "_creationTime";
    const sortDirection = sort.direction || "desc";
    
    // Check if field is sortable
    const indexName = productSortableFields[sortField as keyof typeof productSortableFields];
    
    // For now, always use the standard index since we don't have other indexes defined
    // When you add more indexes in schema.ts, you can implement index-based sorting
    let query = ctx.db
      .query("products")
      .withIndex("by_tenant_active", (q) =>
        q.eq("tenantId", tenantId).eq("isActive", true)
      );

    // Apply filters (Convex handles type conversion)
    if (filters.category) {
      query = query.filter((q) =>
        q.eq(q.field(ProductFields.category), filters.category)
      );
    }

    if (filters.minPrice !== undefined) {
      query = query.filter((q) =>
        q.gte(q.field(ProductFields.price), filters.minPrice!)
      );
    }

    if (filters.maxPrice !== undefined) {
      query = query.filter((q) =>
        q.lte(q.field(ProductFields.price), filters.maxPrice!)
      );
    }

    // Apply ordering
    const orderedQuery = query.order(sortDirection);

    // Always use Convex's built-in pagination
    return await orderedQuery.paginate(args.paginationOpts);
  },
});

export const getProduct = query({
  args: {
    productId: v.id("products"),
    tenantId: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);

    if (!product || product.tenantId !== args.tenantId || !product.isActive) {
      return null;
    }

    return product;
  },
});

// Mutations
export const createProduct = mutation({
  args: createProductInputValidator,
  handler: async (ctx, args) => {
    const now = Date.now();

    const productId = await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      price: args.price,
      category: args.category,
      cost: args.cost,
      internalNotes: args.internalNotes,
      tenantId: args.tenantId,
      createdAt: now,
      updatedAt: now,
      isActive: true,
    });

    return productId;
  },
});

export const updateProduct = mutation({
  args: {
    productId: v.id("products"),
    tenantId: v.string(),
    updates: updateProductInputValidator,
  },
  handler: async (ctx, args) => {
    const { productId, tenantId, updates } = args;

    // Get existing product
    const existingProduct = await ctx.db.get(productId);
    if (
      !existingProduct ||
      existingProduct.tenantId !== tenantId ||
      !existingProduct.isActive
    ) {
      throw new Error("Product not found");
    }

    // Update the product
    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

export const deleteProduct = mutation({
  args: {
    productId: v.id("products"),
    tenantId: v.string(),
  },
  handler: async (ctx, args) => {
    const { productId, tenantId } = args;

    // Get existing product
    const existingProduct = await ctx.db.get(productId);
    if (
      !existingProduct ||
      existingProduct.tenantId !== tenantId ||
      !existingProduct.isActive
    ) {
      throw new Error("Product not found");
    }

    // Soft delete by setting isActive to false
    await ctx.db.patch(productId, {
      isActive: false,
      updatedAt: Date.now(),
    });

    return productId;
  },
});
