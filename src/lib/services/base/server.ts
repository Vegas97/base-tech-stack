// Server-side methods only - for API routes and server actions
// NO React imports here

import { ConvexHttpClient } from "convex/browser";
import { BaseUtils, ServiceContext, ServiceError } from "./utils";

// Create ConvexHttpClient instance internally
const getConvexClient = () => {
  if (!process.env.CONVEX_URL) {
    throw new Error("CONVEX_URL environment variable is required");
  }
  return new ConvexHttpClient(process.env.CONVEX_URL);
};

export class BaseServerService {
  // ========================================
  // SERVER-SIDE METHODS (Server Actions, API Routes)
  // Uses ConvexHttpClient: convex.query(), convex.mutation()
  // ========================================

  static async executeQuery<TArgs, TResult>(
    queryFn: any,
    args: TArgs,
    context: ServiceContext
  ): Promise<TResult> {
    try {
      BaseUtils.log("info", context, "Server query started", { args });
      const startTime = Date.now();
      
      const convex = getConvexClient();
      const result = await convex.query(queryFn, args);

      const duration = Date.now() - startTime;
      BaseUtils.log("info", context, "Server query completed", {
        duration: `${duration}ms`,
        hasResult: !!result,
      });

      return result;
    } catch (error) {
      const enhancedError = BaseUtils.createError(
        `Server query failed: ${context.operation}`,
        context,
        error
      );
      BaseUtils.log("error", context, "Server query failed", {
        error: enhancedError,
      });
      throw enhancedError;
    }
  }

  static async executeMutation<TArgs, TResult>(
    mutationFn: any,
    args: TArgs,
    context: ServiceContext
  ): Promise<TResult> {
    try {
      BaseUtils.log("info", context, "Server mutation started", { args });
      const startTime = Date.now();

      const convex = getConvexClient();
      const result = await convex.mutation(mutationFn, args);

      const duration = Date.now() - startTime;
      BaseUtils.log("info", context, "Server mutation completed", {
        duration: `${duration}ms`,
        result,
      });

      return result;
    } catch (error) {
      const enhancedError = BaseUtils.createError(
        `Server mutation failed: ${context.operation}`,
        context,
        error
      );
      BaseUtils.log("error", context, "Server mutation failed", {
        error: enhancedError,
      });
      throw enhancedError;
    }
  }

  static async executeAction<TArgs, TResult>(
    actionFn: any,
    args: TArgs,
    context: ServiceContext
  ): Promise<TResult> {
    try {
      BaseUtils.log("info", context, "Server action started", { args });
      const startTime = Date.now();

      const convex = getConvexClient();
      const result = await convex.action(actionFn, args);

      const duration = Date.now() - startTime;
      BaseUtils.log("info", context, "Server action completed", {
        duration: `${duration}ms`,
        result,
      });

      return result;
    } catch (error) {
      const enhancedError = BaseUtils.createError(
        `Server action failed: ${context.operation}`,
        context,
        error
      );
      BaseUtils.log("error", context, "Server action failed", {
        error: enhancedError,
      });
      throw enhancedError;
    }
  }
}
