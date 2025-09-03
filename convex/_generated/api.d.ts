/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_permissions from "../auth/permissions.js";
import type * as auth_roles from "../auth/roles.js";
import type * as auth_users from "../auth/users.js";
import type * as entities_products from "../entities/products.js";
import type * as entities_tenants from "../entities/tenants.js";
import type * as lib_audit_utils from "../lib/audit_utils.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_field_permissions from "../lib/field_permissions.js";
import type * as lib_permission_generators from "../lib/permission_generators.js";
import type * as lib_permission_utils from "../lib/permission_utils.js";
import type * as lib_validation_utils from "../lib/validation_utils.js";
import type * as lib_validators from "../lib/validators.js";
import type * as seed from "../seed.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/permissions": typeof auth_permissions;
  "auth/roles": typeof auth_roles;
  "auth/users": typeof auth_users;
  "entities/products": typeof entities_products;
  "entities/tenants": typeof entities_tenants;
  "lib/audit_utils": typeof lib_audit_utils;
  "lib/constants": typeof lib_constants;
  "lib/field_permissions": typeof lib_field_permissions;
  "lib/permission_generators": typeof lib_permission_generators;
  "lib/permission_utils": typeof lib_permission_utils;
  "lib/validation_utils": typeof lib_validation_utils;
  "lib/validators": typeof lib_validators;
  seed: typeof seed;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
