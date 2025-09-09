// Combined export for components that need both client and server
// This is optional - prefer importing directly from client.ts or server.ts

export { productsServer } from "./server";
export { productsClient } from "./client";

// Re-export types from Convex entities and server
export type { 
  CreateProductInput, 
  UpdateProductInput,
  ProductFilters 
} from "@/../convex/entities/products";
export type { ListProductsParams } from "./server";
