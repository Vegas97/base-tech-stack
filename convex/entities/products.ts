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
  search: v.optional(v.string()),
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

// Validation helpers
export type ValidProductField = keyof Doc<"products">;

// Unified list/search function with filters and sorting
export const listProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    tenantId: v.string(),
    filters: v.optional(productFiltersValidator),
    sortBy: v.optional(v.union(v.literal("createdAt"), v.literal("relevance"))),
  },
  handler: async (ctx, args) => {
    const { tenantId, filters = {}, sortBy = "createdAt" } = args;

    let query = ctx.db
      .query("products")
      .withIndex("by_tenant_active", (q) =>
        q.eq("tenantId", tenantId).eq("isActive", true)
      );

    // Apply filters before pagination for better performance
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

    let baseQuery = query.order("desc");

    // Handle search with relevance sorting or regular listing
    if (filters.search) {
      // For search, collect and filter in memory for text matching
      const allProducts = await baseQuery.collect();
      const searchTerm = filters.search.toLowerCase();
      let filteredProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
      );

      // Apply relevance sorting when search is used
      if (sortBy === "relevance" || (filters.search && !sortBy)) {
        filteredProducts.sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(searchTerm);
          const bNameMatch = b.name.toLowerCase().includes(searchTerm);

          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;

          return b.createdAt - a.createdAt;
        });
      }

      // Manual pagination for search results
      const { numItems, cursor } = args.paginationOpts;
      const startIndex = cursor ? parseInt(cursor) : 0;
      const endIndex = startIndex + numItems;
      const page = filteredProducts.slice(startIndex, endIndex);

      return {
        page,
        isDone: endIndex >= filteredProducts.length,
        continueCursor:
          endIndex < filteredProducts.length ? endIndex.toString() : undefined,
      };
    }

    // Standard Convex pagination for non-search queries
    return await baseQuery.paginate(args.paginationOpts);
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
