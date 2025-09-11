import { NextRequest, NextResponse } from "next/server";
import { productsServer } from "@/lib/services/products/server";
import {
  ProductFilters,
  CreateProductInput,
  productFilterKeys,
} from "@/../convex/entities/products";
import { extractTenantFromRequest } from "@/lib/utils/tenant-server";
import { 
  extractPaginationParams, 
  extractSortParams, 
  extractFiltersFromKeys 
} from "@/lib/utils/api-params";

/**
 * GET /api/v1/products
 * List products with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract tenant from middleware header
    const tenantId = extractTenantFromRequest(request);

    // Extract all params using utilities - no hardcoding!
    const paginationOpts = extractPaginationParams(searchParams);
    const sort = extractSortParams(searchParams);
    const filters = extractFiltersFromKeys(searchParams, productFilterKeys);

    const result = await productsServer.list({
      tenantId,
      filters,
      sort,
      paginationOpts,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing products:", error);
    return NextResponse.json(
      { error: "Failed to list products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract tenant from middleware header
    const tenantId = extractTenantFromRequest(request);

    // Validate required fields
    const { name, description, category, price, cost, internalNotes } = body;
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "name, description, and category are required" },
        { status: 400 }
      );
    }

    const product = await productsServer.create({
      name,
      description,
      category,
      price: price ? parseFloat(price) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      internalNotes,
      tenantId,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
