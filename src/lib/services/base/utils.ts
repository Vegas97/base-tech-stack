// Shared utilities for both client and server
// NO React imports here - only pure TypeScript

export interface ServiceContext {
  tenantId: string;
  userId?: string;
  operation: string;
}

export interface ServiceError extends Error {
  context?: ServiceContext;
  originalError?: unknown;
}

export class BaseUtils {
  // Enhanced logging with structured format
  static log(
    level: "info" | "error",
    context: ServiceContext,
    message: string,
    data?: any
  ) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      tenant: context.tenantId,
      operation: context.operation,
      message,
      ...(data && { data }),
      ...(context.userId && { userId: context.userId }),
    };

    if (level === "error") {
      console.error(
        `[${timestamp}] [${context.tenantId}] ERROR: ${context.operation}`,
        logEntry
      );
    } else {
      console.log(
        `[${timestamp}] [${context.tenantId}] INFO: ${context.operation}`,
        logEntry
      );
    }
  }

  // Create enhanced error with context
  static createError(
    message: string,
    context: ServiceContext,
    originalError?: unknown
  ): ServiceError {
    const error = new Error(message) as ServiceError;
    error.context = context;
    error.originalError = originalError;
    return error;
  }
}
