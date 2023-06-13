"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InvoiceSchema, SubscriptionSchema } from "~/db/schema";
import { formatUnixTimestamp, formatCurrency } from "~/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Files, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { DataTableSortableHeader } from "../ui/DataTable/DataTableSortableHeader";

export interface Invoice extends InvoiceSchema {
  subscription: SubscriptionSchema;
}

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "product",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader column={column} title="Producto/servicio" />
      );
    },
    cell: ({ row }) => {
      return row.original.subscription.name;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableSortableHeader column={column} title="Estado" />;
    },
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.getValue("status") === "paid" ? "success" : "destructive"
          }
        >
          {" "}
          {row.getValue("status")}{" "}
        </Badge>
      );
    },
  },
  {
    accessorKey: "billingReason",
    header: "Concepto",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha",
    cell: ({ row }) => {
      const timestamp = parseInt(row.getValue("createdAt"));
      return formatUnixTimestamp(timestamp);
    },
  },
  {
    accessorKey: "amountPaid",
    header: () => <div className="">Cantidad</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("amountPaid"));
      const currency = row.original.currency || "EUR";
      const locale = navigator.language;
      return (
        <div className="font-medium">
          {formatCurrency({
            amount,
            currency,
            locale,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden justify-end md:flex">
            <div className="self-end">
              <Button variant="ghost" className=" p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Files className="mr-2 h-4 w-4" />
              <span>Copiar ID</span>
            </DropdownMenuItem>
            {!!row.original.invoiceUrl && (
              <DropdownMenuItem className="cursor-pointer" asChild>
                <a href={row.original.invoiceUrl} target="_blank">
                  <FileCheck className="mr-2 h-4 w-4" />
                  <span>Descargar Factura</span>
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
