import { ColDef, ValueFormatterParams } from "ag-grid-community";
import { Product } from "@/../convex/entities/products";
import { ActionsCellRenderer } from "./actions-cell-renderer";

export const productColumnDefs: ColDef<Product>[] = [
  {
    field: "_id",
    headerName: "ID",
    sortable: true,
    filter: true,
    width: 200,
    // hide: true // Hidden by default but available for debugging
  },
  {
    field: "_creationTime",
    headerName: "Created Time",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? new Date(params.value).toLocaleString() : "",
    sortable: true,
    filter: "agDateColumnFilter",
    width: 150,
    // hide: true, // Hidden by default
  },
  {
    field: "name",
    headerName: "Product Name",
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 150,
  },
  {
    field: "category",
    headerName: "Category",
    sortable: true,
    filter: true,
    minWidth: 100,
  },
  {
    field: "price",
    headerName: "Price",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? `$${params.value.toFixed(2)}` : "$0.00",
    sortable: true,
    filter: "agNumberColumnFilter",
    minWidth: 100,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "cost",
    headerName: "Cost",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? `$${params.value.toFixed(2)}` : "$0.00",
    sortable: true,
    filter: "agNumberColumnFilter",
    minWidth: 100,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    minWidth: 200,
    maxWidth: 400,
    wrapText: false,
    autoHeight: false,
    cellStyle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
  {
    field: "internalNotes",
    headerName: "Internal Notes",
    flex: 1,
    minWidth: 200,
    wrapText: true,
    autoHeight: true,
    hide: true, // Hidden by default as it's internal data
  },
  {
    field: "tenantId",
    headerName: "Tenant ID",
    sortable: true,
    filter: true,
    width: 150,
    hide: true, // Hidden by default as it's system data
  },
  {
    field: "createdAt",
    headerName: "Created",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? new Date(params.value).toLocaleDateString() : "",
    sortable: true,
    filter: "agDateColumnFilter",
    minWidth: 100,
  },
  {
    field: "updatedAt",
    headerName: "Updated",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? new Date(params.value).toLocaleDateString() : "",
    sortable: true,
    filter: "agDateColumnFilter",
    minWidth: 100,
  },
  {
    field: "isActive",
    headerName: "Active",
    valueFormatter: (params: ValueFormatterParams) =>
      params.value ? "Yes" : "No",
    sortable: true,
    filter: "agSetColumnFilter",
    minWidth: 80,
    cellStyle: (params) => ({
      color: params.value ? "#22c55e" : "#ef4444",
      fontWeight: "bold",
    }),
  },
  {
    headerName: "Actions",
    cellRenderer: ActionsCellRenderer,
    sortable: false,
    filter: false,
    width: 120,
    pinned: "right",
    hide: true,
  },
];
