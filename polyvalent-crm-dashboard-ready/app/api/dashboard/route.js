import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.CRM_API_URL;

  if (!url) {
    return NextResponse.json(
      { status: "error", message: "CRM_API_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error(`Apps Script returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, max-age=0" }
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}
