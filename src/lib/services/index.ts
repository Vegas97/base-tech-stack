// Export all services from a single entry point
export { productsServer, productsClient } from "@/lib/services/products";

// Re-export types for convenience
export type { Doc } from "@/../convex/_generated/dataModel";
export type { ConvexHttpClient } from "convex/browser";

// Service utilities
export { default as BaseService } from "@/lib/services/base";
