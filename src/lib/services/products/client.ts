// Client-only methods - for React components
// React hooks imports

import { api } from "@/../convex/_generated/api";
import { BaseClientService } from "@/lib/services/base/client";
// Import types directly from Convex entities
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
} from "@/../convex/entities/products";
import type { ListProductsParams } from "./server";

export const productsClient = {
  useList(params: ListProductsParams) {
    return BaseClientService.usePaginatedQueryWithBase(
      api.entities.products.listProducts,
      params,
      { tenantId: params.tenantId, operation: "products.list" }
    );
  },

  useGet(productId: string, tenantId: string) {
    return BaseClientService.useQueryWithBase(
      api.entities.products.getProduct,
      { productId, tenantId },
      { tenantId, operation: "products.get" }
    );
  },

  useCreate(tenantId: string) {
    return BaseClientService.useMutationWithBase(
      api.entities.products.createProduct,
      { tenantId, operation: "products.create" }
    );
  },

  useUpdate(tenantId: string) {
    return BaseClientService.useMutationWithBase(
      api.entities.products.updateProduct,
      { tenantId, operation: "products.update" }
    );
  },

  useDelete(tenantId: string) {
    return BaseClientService.useMutationWithBase(
      api.entities.products.deleteProduct,
      { tenantId, operation: "products.delete" }
    );
  },
};
