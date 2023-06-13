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
import { MoreHorizontal, Files, XCircle, FileCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <DataTableSortableHeader column={column} title="Producto/servicio" />
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
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
            row.getValue("status") === "active" ? "success" : "destructive"
          }
        >
          {" "}
          {row.getValue("status")}{" "}
        </Badge>
      );
    },
  },
  {
    accessorKey: "currentPeriodEnd",
    header: "Próximo Pago",
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
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            >
              <Files className="mr-2 h-4 w-4" />
              <span>Copiar ID</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link
                href={{
                  pathname: "/dashboard/invoices",
                  query: { subscriptionId: row.original.id },
                }}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                <span>Ver Facturas</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer focus:bg-red-100"
              asChild
            >
              <Link
                href={`/dashboard/subscriptions/${row.original.stripePriceId}/cancel`}
                className=""
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
