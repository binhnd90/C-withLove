import { NextResponse } from "next/server";
import { progressEntries } from "@/lib/data";

export async function GET() {
  const sorted = [...progressEntries].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  return NextResponse.json({ progress: sorted });
}
