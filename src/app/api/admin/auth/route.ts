import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const correctSecret = process.env.ADMIN_SECRET_KEY || '@?mensur?@';

    if (passcode === correctSecret) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ error: 'Incorrect admin passcode' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}