"use client";
import { ColumnDef } from "@tanstack/react-table";
import { SubscriptionSchema } from "~/db/schema";
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
import { MoreHorizontal, Files, XCircle } from "lucide-react";
import Link from "next/link";

import { DataTableSortableHeader } from "../ui/DataTable/DataTableSortableHeader";

export type Subscription = SubscriptionSchema;

// export type Subscription = {
//   status: string;
//   currentPeriodStart: number;
//   currentPeriodEnd: number;
//   price: number;
// };

export const columns: ColumnDef<Subscription>[] = [
  // {
  //   accessorKey: "description",
  //   header: "descripción",
  // },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableSortableHeader column={column} title="Estatus" />;
    },
  },
  {
    accessorKey: "name",
    header: "Producto",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "currentPeriodStart",
    header: "Comienzo",
    cell: ({ row }) => {
      const timestamp = parseInt(row.getValue("currentPeriodStart"));
      return formatUnixTimestamp(timestamp);
    },
  },
  {
    accessorKey: "currentPeriodEnd",
    header: "Expiración",
    cell: ({ row }) => {
      const timestamp = parseInt(row.getValue("currentPeriodEnd"));
      return formatUnixTimestamp(timestamp);
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="">Cantidad</div>,
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("price"));
      const currency = row.original.currency || "EUR";
      console.log(row.original.currency);
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
              className="cursor-pointer hover:bg-indigo-50"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Files className="mr-2 h-4 w-4" />
              <span>Copiar ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-indigo-50"
              asChild
            >
              <Link
                href={`/dashboard/subscriptions/${row.original.stripePriceId}/invoices`}
              >
                <Files className="mr-2 h-4 w-4" />
                <span>Ver Facturas</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-red-100"
              asChild
            >
              <Link
                href={`/dashboard/subscriptions/${row.original.stripePriceId}/cancel`}
              >
                <XCircle className="mr-2 h-4 w-4" />
                <span>Cancelar Subscripción</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
