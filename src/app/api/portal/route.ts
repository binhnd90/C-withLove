import { NextResponse } from "next/server";
import { fieldWorkers, fieldReports } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    workers: fieldWorkers,
    reports: fieldReports,
  });
}
