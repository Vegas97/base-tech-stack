// Client-side methods only - for React components
// React hooks imports

import { useQuery, useMutation, usePaginatedQuery } from "convex/react";
import { BaseUtils, ServiceContext, ServiceError } from "./utils";

export class BaseClientService {
  // ========================================
  // CLIENT-SIDE METHODS (React Components)
  // Uses React hooks: useQuery, useMutation, usePaginatedQuery
  // ========================================

  static useQueryWithBase<TArgs, TResult>(
    queryFn: any,
    args: TArgs,
    context: ServiceContext
  ) {
    const result = useQuery(queryFn, args as any);

    // Log query execution on client
    if (typeof window !== "undefined" && result !== undefined) {
      BaseUtils.log("info", context, "Query executed", {
        args,
        hasResult: !!result,
      });
    }

    return result;
  }

  static usePaginatedQueryWithBase<TArgs, TResult>(
    queryFn: any,
    args: TArgs,
    options: { initialNumItems: number },
    context: ServiceContext
  ) {
    const result = usePaginatedQuery(queryFn, args as any, options);

    // Log paginated query execution on client
    if (typeof window !== "undefined" && result.results !== undefined) {
      BaseUtils.log("info", context, "Paginated query executed", {
        args,
        resultCount: result.results?.length || 0,
        status: result.status,
      });
    }

    return result;
  }

  static useMutationWithBase<TArgs, TResult>(
    mutationFn: any,
    context: ServiceContext
  ) {
    const mutation = useMutation(mutationFn);

    return async (args: TArgs): Promise<TResult> => {
      try {
        BaseUtils.log("info", context, "Mutation started", { args });
        const result = await mutation(args);
        BaseUtils.log("info", context, "Mutation completed successfully", {
          result,
        });
        return result;
      } catch (error) {
        const enhancedError = BaseUtils.createError(
          `Mutation failed: ${context.operation}`,
          context,
          error
        );
        BaseUtils.log("error", context, "Mutation failed", { error: enhancedError });
        throw enhancedError;
      }
    };
  }
}
