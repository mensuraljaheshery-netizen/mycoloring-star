import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const configFilePath = path.join(process.cwd(), 'src', 'data', 'site-config.json');

const defaultTiers = [
  { id: 'tier-1', pages: 10, price: '$9.99', enabled: true },
  { id: 'tier-2', pages: 25, price: '$19.99', enabled: true },
  { id: 'tier-3', pages: 50, price: '$29.99', enabled: true }
];

function getSafeConfig() {
  try {
    if (fs.existsSync(configFilePath)) {
      const data = fs.readFileSync(configFilePath, 'utf8');
      const parsed = JSON.parse(data);
      if (!parsed.pricingTiers) parsed.pricingTiers = defaultTiers;
      if (!parsed.disabledThemes) parsed.disabledThemes = [];
      if (!parsed.featuredThemes) parsed.featuredThemes = [];
      if (!parsed.customBanners) parsed.customBanners = {};
      return parsed;
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return {
    maintenanceMode: false,
    dailyLimit: 50,
    generationsToday: 0,
    lastResetDate: new Date().toISOString().split('T')[0],
    pricingTiers: defaultTiers,
    disabledThemes: [],
    featuredThemes: [],
    customBanners: {}
  };
}

function saveConfig(config: any) {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing config file:', err);
    return false;
  }
}

export async function GET() {
  const config = getSafeConfig();

  const today = new Date().toISOString().split('T')[0];
  if (config.lastResetDate !== today) {
    config.generationsToday = 0;
    config.lastResetDate = today;
    saveConfig(config);
  }

  return NextResponse.json(config);
}

export async function POST(req: Request) {
  try {
    const updates = await req.json();
    const config = getSafeConfig();

    if (typeof updates.maintenanceMode === 'boolean') {
      config.maintenanceMode = updates.maintenanceMode;
    }
    if (typeof updates.dailyLimit === 'number') {
      config.dailyLimit = updates.dailyLimit;
    }
    if (typeof updates.resetCount === 'boolean' && updates.resetCount) {
      config.generationsToday = 0;
    }
    if (Array.isArray(updates.pricingTiers)) {
      config.pricingTiers = updates.pricingTiers;
    }
    if (Array.isArray(updates.disabledThemes)) {
      config.disabledThemes = updates.disabledThemes;
    }
    if (Array.isArray(updates.featuredThemes)) {
      config.featuredThemes = updates.featuredThemes;
    }
    if (updates.customBanners && typeof updates.customBanners === 'object') {
      config.customBanners = updates.customBanners;
    }

    saveConfig(config);
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}