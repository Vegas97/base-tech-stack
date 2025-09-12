import React from "react";
import { ICellRendererParams } from "ag-grid-community";

interface ActionsCellRendererProps extends ICellRendererParams {
  data: {
    _id: string;
    [key: string]: any;
  };
}

export const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = (
  params
) => {
  const handleEdit = () => {
    console.log("Edit product:", params.data._id);
    // Add your edit logic here
  };

  const handleDelete = () => {
    console.log("Delete product:", params.data._id);
    // Add your delete logic here
  };

  return (
    <div className="flex gap-2">
      <button
        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleEdit}
      >
        Edit
      </button>
      <button
        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};
