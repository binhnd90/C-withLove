import { NextResponse } from "next/server";
import { proposals } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ proposals });
}
