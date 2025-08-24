import { NextResponse } from 'next/server';

export async function GET() {
  const templates = [
    { key: 'CREATIVE', label: 'Creative', premium: false },
    { key: 'MODERN', label: 'Modern', premium: false },
    { key: 'CLASSIC', label: 'Classic', premium: false },
    { key: 'PROFESSIONAL', label: 'Professional', premium: true },
    { key: 'MINIMALIST', label: 'Minimalist', premium: false }
  ];
  return NextResponse.json({ templates });
}
