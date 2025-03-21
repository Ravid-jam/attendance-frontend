import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import Pagination from "./Pagination";

interface TableProps<T> {
  table: Table<T>; // Accepts a generic react-table instance
}

const DataTable = <T,>({ table }: TableProps<T>) => {
  return (
    <div className="w-full overflow-x-auto border shadow border-gray-200 rounded-lg">
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-primary text-white">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 text-center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-300 hover:bg-gray-100 text-center"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-4 text-center px-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="py-4 px-4">
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default DataTable;
