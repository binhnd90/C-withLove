import { NextResponse } from "next/server";
import {
  donations,
  expenses,
  invoices,
  getFinancialSummary,
} from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    summary: getFinancialSummary(),
    donations,
    expenses,
    invoices,
  });
}
