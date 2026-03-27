import { NextResponse } from "next/server";
import { loadIdeasFromVault } from "@/lib/idea-loader";

export async function GET() {
  const data = loadIdeasFromVault();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}