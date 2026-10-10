import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const customThemesPath = path.join(process.cwd(), 'src', 'data', 'custom-themes.json');

export type AgeGroup = '2-4' | '5-7' | '8+' | 'all';

interface CustomScene {
  id: string;
  title: string;
  prompt: string;
  ageGroup?: AgeGroup;
}

interface CustomThemeData {
  slug: string;
  name: string;
  category: string;
  genderTarget: 'boy' | 'girl' | 'all';
  previewImage: string;
  description: string;
  coverPrompts?: string[];
  scenes: CustomScene[];
}

interface StoredData {
  customThemes: CustomThemeData[];
  extraPrompts: Record<string, CustomScene[]>;
  extraCoverPrompts?: Record<string, string[]>;
}

function getStoredData(): StoredData {
  try {
    if (fs.existsSync(customThemesPath)) {
      const raw = fs.readFileSync(customThemesPath, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        customThemes: Array.isArray(parsed?.customThemes) ? parsed.customThemes : [],
        extraPrompts: parsed?.extraPrompts && typeof parsed.extraPrompts === 'object' ? parsed.extraPrompts : {},
        extraCoverPrompts: parsed?.extraCoverPrompts && typeof parsed.extraCoverPrompts === 'object' ? parsed.extraCoverPrompts : {}
      };
    }
  } catch (err) {
    console.error('Failed reading custom-themes.json', err);
  }
  return { customThemes: [], extraPrompts: {}, extraCoverPrompts: {} };
}

function saveData(data: StoredData) {
  const dir = path.dirname(customThemesPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(customThemesPath, JSON.stringify(data, null, 2), 'utf8');
}

// GET: Fetch all custom themes, extra interior prompts, and extra cover prompts
export async function GET() {
  const data = getStoredData();
  return NextResponse.json(data);
}

// POST: Handle adding themes, interior scene prompts, cover prompts, or deletions
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = getStoredData();

    // ACTION A: Add New Theme
    if (body.action === 'CREATE_THEME') {
      const { name, category, genderTarget, previewImage, description, coverPrompts, scenes } = body;
      const cleanName = (name || '').trim();
      const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      if (!slug) {
        return NextResponse.json({ error: 'Theme name is required' }, { status: 400 });
      }

      const exists = (data.customThemes || []).some((t) => t.slug === slug);
      if (exists) {
        return NextResponse.json({ error: 'A custom theme with this name already exists' }, { status: 400 });
      }

      const newTheme: CustomThemeData = {
        slug,
        name: cleanName,
        category: category || 'Adventure',
        genderTarget: genderTarget || 'all',
        previewImage: previewImage || '/theme-previews/superhero.png',
        description: description || `Adventure world exploring ${cleanName}`,
        coverPrompts: Array.isArray(coverPrompts) ? coverPrompts : [],
        scenes: Array.isArray(scenes) ? scenes : []
      };

      if (!Array.isArray(data.customThemes)) {
        data.customThemes = [];
      }

      data.customThemes.push(newTheme);
      saveData(data);
      return NextResponse.json({ success: true, theme: newTheme });
    }

    // ACTION B: Add Interior Scene Prompt (with Age Group)
    if (body.action === 'ADD_PROMPT') {
      const { slug, title, prompt, ageGroup } = body;
      if (!slug || !title || !prompt) {
        return NextResponse.json({ error: 'Slug, title, and prompt are required' }, { status: 400 });
      }

      const validAgeGroup: AgeGroup = ['2-4', '5-7', '8+', 'all'].includes(ageGroup) ? ageGroup : 'all';

      const newScene: CustomScene = {
        id: `custom-${Date.now()}`,
        title: title.trim(),
        prompt: prompt.trim(),
        ageGroup: validAgeGroup
      };

      if (!data.extraPrompts) {
        data.extraPrompts = {};
      }

      if (!Array.isArray(data.extraPrompts[slug])) {
        data.extraPrompts[slug] = [];
      }

      data.extraPrompts[slug].push(newScene);
      saveData(data);
      return NextResponse.json({ success: true, scene: newScene });
    }

    // ACTION C: Add Cover Prompt (Full-Color Cover)
    if (body.action === 'ADD_COVER_PROMPT') {
      const { slug, prompt } = body;
      if (!slug || !prompt || !prompt.trim()) {
        return NextResponse.json({ error: 'Slug and cover prompt are required' }, { status: 400 });
      }

      if (!data.extraCoverPrompts) {
        data.extraCoverPrompts = {};
      }

      if (!Array.isArray(data.extraCoverPrompts[slug])) {
        data.extraCoverPrompts[slug] = [];
      }

      data.extraCoverPrompts[slug].push(prompt.trim());
      saveData(data);
      return NextResponse.json({ success: true, coverPrompt: prompt.trim() });
    }

    // ACTION D: Delete Scene Prompt
    if (body.action === 'DELETE_PROMPT') {
      const { slug, promptId } = body;
      if (!slug || !promptId) {
        return NextResponse.json({ error: 'Slug and promptId are required' }, { status: 400 });
      }

      if (data.extraPrompts && Array.isArray(data.extraPrompts[slug])) {
        data.extraPrompts[slug] = data.extraPrompts[slug].filter((p) => p.id !== promptId);
      }

      const customTheme = (data.customThemes || []).find((t) => t.slug === slug);
      if (customTheme && Array.isArray(customTheme.scenes)) {
        customTheme.scenes = customTheme.scenes.filter((p) => p.id !== promptId);
      }

      saveData(data);
      return NextResponse.json({ success: true });
    }

    // ACTION E: Delete Cover Prompt
    if (body.action === 'DELETE_COVER_PROMPT') {
      const { slug, promptIndex } = body;
      if (!slug || promptIndex === undefined) {
        return NextResponse.json({ error: 'Slug and promptIndex are required' }, { status: 400 });
      }

      if (data.extraCoverPrompts && Array.isArray(data.extraCoverPrompts[slug])) {
        data.extraCoverPrompts[slug].splice(promptIndex, 1);
      }

      const customTheme = (data.customThemes || []).find((t) => t.slug === slug);
      if (customTheme && Array.isArray(customTheme.coverPrompts)) {
        customTheme.coverPrompts.splice(promptIndex, 1);
      }

      saveData(data);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed processing theme update' }, { status: 500 });
  }
}
