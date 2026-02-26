import { NextResponse } from "next/server";
import { anomalyAlerts, aiSuggestions } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    alerts: anomalyAlerts,
    suggestions: aiSuggestions,
  });
}
