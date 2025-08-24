import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { template } = await req.json();
  // For brevity, return minimal HTML snippet
  return NextResponse.json({
    html: `<div style="padding:8px;border:1px solid #e5e7eb;border-radius:8px">Preview: ${template}</div>`
  });
}
