import { NextRequest, NextResponse } from "next/server";
import { productsServer } from "@/lib/services/products/server";
import { UpdateProductInput } from "@/../convex/entities/products";

/**
 * GET /api/v1/products/[id]
 * Get a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const product = await productsServer.get(id, tenantId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    return NextResponse.json(
      { error: "Failed to get product" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/products/[id]
 * Update a product
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { tenantId, ...updates } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: UpdateProductInput = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.category) updateData.category = updates.category;
    if (updates.price !== undefined)
      updateData.price = parseFloat(updates.price);
    if (updates.cost !== undefined) updateData.cost = parseFloat(updates.cost);
    if (updates.internalNotes !== undefined)
      updateData.internalNotes = updates.internalNotes;

    const { id } = await params;
    const result = await productsServer.update(
      id,
      tenantId,
      updateData
    );

    if (!result) {
      return NextResponse.json(
        { error: "Product not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/products/[id]
 * Delete a product (soft delete by setting isActive = false)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "tenantId is required" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const result = await productsServer.delete(
      id,
      tenantId
    );

    if (!result) {
      return NextResponse.json(
        { error: "Product not found or delete failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
