import { NextRequest, NextResponse } from "next/server";
import { productsServer } from "@/lib/services/products/server";
import {
  ProductFilters,
  CreateProductInput,
} from "@/../convex/entities/products";
import { extractTenantFromRequest } from "@/lib/utils/tenant-server";

/**
 * GET /api/v1/products
 * List products with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract tenant from middleware header
    const tenantId = extractTenantFromRequest(request);

    // Extract query parameters
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const numItems = searchParams.get("numItems");
    const cursor = searchParams.get("cursor");

    // Build filters
    const filters: ProductFilters = {};
    if (category) filters.category = category;
    if (search) filters.search = search;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);

    // Build pagination options
    const paginationOpts = {
      numItems: numItems ? parseInt(numItems) : 20,
      cursor: cursor || null,
    };

    const result = await productsServer.list({
      tenantId,
      filters,
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
