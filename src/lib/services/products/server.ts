// Server-only methods - for API routes and server actions
// NO React imports here

import { api } from "@/../convex/_generated/api";
import { BaseServerService } from "@/lib/services/base/server";
// Import types directly from Convex entities
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "@/../convex/entities/products";

// Define ListProductsParams based on the listProducts query
export interface ListProductsParams {
  tenantId: string;
  filters?: ProductFilters;
  sortBy?: "createdAt" | "relevance";
  paginationOpts?: { numItems: number; cursor?: string };
}

export const productsServer = {
  async list(params: ListProductsParams) {
    return BaseServerService.executeQuery(
      api.entities.products.listProducts,
      params,
      { tenantId: params.tenantId, operation: "products.list" }
    );
  },

  async get(productId: string, tenantId: string) {
    return BaseServerService.executeQuery(
      api.entities.products.getProduct,
      { productId, tenantId },
      { tenantId, operation: "products.get" }
    );
  },

  async create(data: CreateProductInput) {
    return BaseServerService.executeMutation(
      api.entities.products.createProduct,
      data,
      { tenantId: data.tenantId, operation: "products.create" }
    );
  },

  async update(
    productId: string,
    tenantId: string,
    updates: UpdateProductInput
  ) {
    return BaseServerService.executeMutation(
      api.entities.products.updateProduct,
      { productId, tenantId, updates },
      { tenantId, operation: "products.update" }
    );
  },

  async delete(productId: string, tenantId: string) {
    return BaseServerService.executeMutation(
      api.entities.products.deleteProduct,
      { productId, tenantId },
      { tenantId, operation: "products.delete" }
    );
  },

  // Batch operations
  async createMultiple(products: CreateProductInput[]) {
    if (products.length === 0) return [];

    const tenantId = products[0].tenantId;

    // Sequential execution for now
    const results = [];
    for (const product of products) {
      results.push(
        await BaseServerService.executeMutation(
          api.entities.products.createProduct,
          product,
          { tenantId, operation: "products.bulkCreate" }
        )
      );
    }
    return results;
  },
};
