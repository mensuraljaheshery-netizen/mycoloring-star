import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const configFilePath = path.join(process.cwd(), 'src', 'data', 'site-config.json');

export async function GET() {
  try {
    if (!fs.existsSync(configFilePath)) {
      return NextResponse.json({ dailyLimit: 500, generationsToday: 0, maintenanceMode: false });
    }
    const data = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();
    let currentConfig: any = {};

    if (fs.existsSync(configFilePath)) {
      currentConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    }

    const newConfig = {
      ...currentConfig,
      ...updates
    };

    fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2), 'utf8');
    return NextResponse.json({ success: true, config: newConfig });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}