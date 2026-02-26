import { NextResponse } from "next/server";
import {
  bankAccounts,
  interestRecords,
  getTotalInterestEarned,
} from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    accounts: bankAccounts,
    interestRecords,
    totalInterestEarned: getTotalInterestEarned(),
  });
}
