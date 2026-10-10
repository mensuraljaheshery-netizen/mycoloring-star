import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getThemeConfig } from '@/lib/themes';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const configFilePath = path.join(process.cwd(), 'src', 'data', 'site-config.json');
const themesFilePath = path.join(process.cwd(), 'src', 'data', 'themes-data.json');

function checkAndIncrementUsage(): { allowed: boolean; reason?: string } {
  try {
    if (!fs.existsSync(configFilePath)) return { allowed: true };
    const raw = fs.readFileSync(configFilePath, 'utf8');
    const config = JSON.parse(raw);

    if (config.maintenanceMode) {
      return { allowed: false, reason: 'Generation engine is temporarily paused for scheduled maintenance.' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (config.lastResetDate !== today) {
      config.generationsToday = 0;
      config.lastResetDate = today;
    }

    if (config.generationsToday >= (config.dailyLimit || 500)) {
      return { allowed: false, reason: 'Daily free generation limit reached for today! Resets at midnight.' };
    }

    config.generationsToday = (config.generationsToday || 0) + 1;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
    return { allowed: true };
  } catch (err) {
    console.error('Config check error:', err);
    return { allowed: true };
  }
}

function getRandomSceneAction(themeName: string): string {
  const t = (themeName || 'Superhero').toLowerCase().trim();
  const themeSlug = t.replace(/\s+/g, '-');

  try {
    if (fs.existsSync(themesFilePath)) {
      const raw = fs.readFileSync(themesFilePath, 'utf8');
      const data = JSON.parse(raw);

      if (data.extraPrompts && Array.isArray(data.extraPrompts[themeSlug]) && data.extraPrompts[themeSlug].length > 0) {
        const extraList = data.extraPrompts[themeSlug];
        const pick = extraList[Math.floor(Math.random() * extraList.length)];
        if (pick?.prompt) return pick.prompt;
      }

      if (Array.isArray(data.customThemes)) {
        const found = data.customThemes.find((ct: any) => ct.slug === themeSlug);
        if (found && Array.isArray(found.scenes) && found.scenes.length > 0) {
          const pick = found.scenes[Math.floor(Math.random() * found.scenes.length)];
          if (pick?.prompt) return pick.prompt;
        }
      }
    }
  } catch (e) {
    console.error('Failed reading custom admin themes:', e);
  }

  const config = getThemeConfig(themeSlug, 'boy');
  if (config && config.scenes && config.scenes.length > 0) {
    const randomScene = config.scenes[Math.floor(Math.random() * config.scenes.length)];
    return randomScene.promptDesc;
  }

  return `engaging in an exciting, cheerful ${themeName} adventure`;
}

function getThemeCostumeDirective(theme: string): string {
  const t = (theme || '').toLowerCase();

  if (t.includes('superhero')) {
    return 'Transform outfit into a heroic child superhero suit with a vibrant cape. Plain chest with a clean five-point star. Absolutely NO copyrighted logos like Superman S shield or Batman.';
  }
  if (t.includes('princess')) {
    return 'Transform outfit into an elegant fairytale princess gown with a sparkling tiara.';
  }
  if (t.includes('ballet') || t.includes('dance')) {
    return 'Transform outfit into a colorful stage dancer costume with matching dance shoes.';
  }
  if (t.includes('astronaut') || t.includes('space') || t.includes('mars')) {
    return 'Transform outfit into an astronaut spacesuit with exploration patches and boots.';
  }
  if (t.includes('dinosaur') || t.includes('jungle') || t.includes('safari') || t.includes('desert')) {
    return 'Transform outfit into an explorer safari jacket with utility pockets and field boots.';
  }
  if (t.includes('doctor') || t.includes('vet')) {
    return 'Transform outfit into a white doctor lab coat with a toy stethoscope.';
  }
  if (t.includes('firefighter')) {
    return 'Transform outfit into a firefighter turnout jacket with reflective safety stripes and helmet.';
  }
  if (t.includes('chef') || t.includes('kitchen')) {
    return 'Transform outfit into a white chef coat, apron, and tall chef hat.';
  }
  if (t.includes('pirate')) {
    return 'Transform outfit into a playful pirate captain coat with gold trim and tricorn hat.';
  }
  if (t.includes('winter') || t.includes('snow') || t.includes('arctic')) {
    return 'Transform outfit into a puffy winter coat with a warm beanie hat and snow boots.';
  }
  if (t.includes('soccer')) {
    return 'Transform outfit into an athletic soccer uniform jersey, team shorts, tall socks, and cleats.';
  }
  if (t.includes('basketball')) {
    return 'Transform outfit into a basketball jersey, matching athletic shorts, and sneakers.';
  }
  if (t.includes('race') || t.includes('car')) {
    return 'Transform outfit into a race car driver jumpsuit with checkered racing stripes.';
  }

  return `Transform outfit into vibrant attire matching the ${theme} adventure.`;
}

export async function POST(req: NextRequest) {
  try {
    const check = checkAndIncrementUsage();
    if (!check.allowed) {
      return NextResponse.json({ error: check.reason }, { status: 429 });
    }

    const {
      imageBase64,
      childName,
      theme,
      isCover,
      prompt: customPrompt,
      orientation = 'portrait',
      paperSize = 'letter'
    } = await req.json();

    const currentThemeName = theme || 'Superhero';
    const costumeDirective = getThemeCostumeDirective(currentThemeName);
    const chosenAction = getRandomSceneAction(currentThemeName);
    const heroName = (childName || 'HERO').toUpperCase();
    const isLandscape = orientation === 'landscape';

    // Map orientation to Gemini standard ratios
    const targetAspectRatio = isLandscape ? '4:3' : '3:4';
    const formatName = paperSize.toLowerCase() === 'a4' ? 'A4 International Standard (210x297mm)' : 'US Letter (8.5x11 inches)';

    const canvasOrientationRule = isLandscape
      ? `ASPECT RATIO & COMPOSITION: Horizontal landscape canvas matching ${formatName} at strict 4:3 aspect ratio. Characters, titles, and backdrop scenery must naturally extend across the wide panoramic width and height with zero letterboxing bars, zero white borders, edge-to-edge bleed.`
      : `ASPECT RATIO & COMPOSITION: Vertical portrait canvas matching ${formatName} at strict 3:4 aspect ratio. Characters, title banners, and scenery must cleanly span the tall vertical height with zero side bars, edge-to-edge bleed.`;

    let prompt = '';

    if (isCover) {
      const displayTheme = currentThemeName.replace(/variety pack/i, 'Variety').toUpperCase();

      prompt = `Deluxe commercial children's adventure coloring book cover illustration starring the child from the reference photo named "${heroName}".
${canvasOrientationRule}
CANVAS COMPOSITION & VERTICAL HEADROOM RULES:
- IMPORTANT: Leave ample blank sky space (at least 15% clear margin) at the top of the canvas so typography sits cleanly below the page boundary.
- The entire title cluster and ribbon banner must sit comfortably below the top edge with generous breathing room.
- Full-bleed colorful illustration edge-to-edge on all sides. Zero borders, zero white bars.

CHARACTER ART & LIKENESS:
- Bold 2D animated comic cartoon art style with crisp ink outlines and vibrant saturated cel-shaded colors.
- Recreate the child's exact recognizable facial features, smile, hairstyle, and skin tone from the reference photo.
- Joyful child hero centered comfortably in the foreground.
COSTUME: ${costumeDirective}
SCENE: Saturated, dynamic, detailed ${currentThemeName} backdrop.

CLEAN COVER TYPOGRAPHY:
- TOP TITLE: Bold, playful 3D cartoon bubble typography arched comfortably across the upper area reading "${heroName}". Vibrant yellow/orange letters with heavy dark outlines and drop shadow.
- SUBTITLE: Crisp comic ribbon banner underneath reading "${displayTheme}".
- BOTTOM BADGE: Simple, small brand logo centered near the bottom edge reading "MyColoringStar".
- STRICTLY FORBIDDEN: Do NOT write "PERSONALIZED KEEPSAKE EDITION", do NOT write "Coloring Artist", do NOT add blank lines or text boxes to write in.
- Finished retail comic book cover presentation. Zero clipped text.`;
    } else if (customPrompt) {
      prompt = `Professional printable children's coloring book page featuring the child from the photo as the hero.
${canvasOrientationRule}
CHARACTER LIKENESS: Replicate the child's facial identity, haircut, and joyful smile.
SCENE ACTION: ${customPrompt}
COSTUME: ${costumeDirective}
MANDATORY LINE ART STYLE:
- High-contrast, razor-sharp vector black ink outlines (#000000) on solid pure white paper (#FFFFFF).
- Bold outer contour line weights (3pt to 4pt stroke) with clean interior details.
- Completely empty white fills ready for crayons and markers.
- STRICTLY ZERO COLOR, ZERO grayscale shading, NO halftone patterns, NO sketch smudges, NO gray wash. Solid black outlines only.`;
    } else {
      prompt = `Professional printable children's coloring book page starring the child from the photo named "${heroName}".
${canvasOrientationRule}
Preserve their distinct facial likeness, haircut, and joyful smile from the photo.
COSTUME: ${costumeDirective}
SCENE ACTION: ${chosenAction}.
BACKGROUND: Fun, whimsical cartoon ${currentThemeName} scenery with bold elements filling the ${isLandscape ? 'horizontal wide' : 'vertical'} page for kids to color.
MANDATORY LINE ART STYLE:
- Crisp, clean thick black ink contour lines on solid white paper.
- Completely empty white spaces for coloring.
- STRICTLY ZERO COLOR, NO gray shading, NO shadows, NO realistic textures, NO 3D renders. High contrast black line drawing only.`;
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing in environment variables.' }, { status: 500 });
    }

    const modelId = 'google/gemini-3.1-flash-lite-image';

    const messages: any[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ];

    if (imageBase64) {
      messages[0].content.push({
        type: 'image_url',
        image_url: { url: imageBase64 }
      });
    }

   const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterKey.trim()}`,
        'HTTP-Referer': 'https://www.mycoloringstar.com',
        'X-Title': 'MyColoringStar'
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        modalities: ['image', 'text'],
        provider: {
          order: ['Google AI Studio'],
          allow_fallbacks: true
        }
      })
    });

    const orData = await orRes.json();
    if (!orRes.ok) {
      console.error('OpenRouter Error Details:', JSON.stringify(orData, null, 2));
      throw new Error(orData.error?.message || `OpenRouter returned status ${orRes.status}`);
    }

    const choice = orData.choices?.[0];
    const message = choice?.message;

    let imageUrl: string | null = null;

    if (Array.isArray(message?.images) && message.images.length > 0) {
      const firstImg = message.images[0];
      if (typeof firstImg === 'string') imageUrl = firstImg;
      else if (firstImg?.image_url?.url) imageUrl = firstImg.image_url.url;
      else if (typeof firstImg?.image_url === 'string') imageUrl = firstImg.image_url;
      else if (firstImg?.url) imageUrl = firstImg.url;
    }

    if (!imageUrl && message?.image_url) {
      imageUrl = typeof message.image_url === 'string' ? message.image_url : message.image_url.url;
    }

    if (!imageUrl && Array.isArray(message?.content)) {
      for (const item of message.content) {
        if (item.type === 'image_url' && item.image_url?.url) {
          imageUrl = item.image_url.url;
          break;
        }
      }
    }

    if (!imageUrl && typeof message?.content === 'string') {
      const markdownMatch = message.content.match(/!\[.*?\]\((https?:\/\/.*?)\)/);
      const directUrlMatch = message.content.match(/https?:\/\/\S+\.(?:png|jpe?g|webp)/i);
      if (markdownMatch) imageUrl = markdownMatch[1];
      else if (directUrlMatch) imageUrl = directUrlMatch[0];
    }

    if (!imageUrl) {
      const textPreview = typeof message?.content === 'string' ? message.content.slice(0, 140) : JSON.stringify(message);
      throw new Error(`No image URL returned from model: "${textPreview}"`);
    }

    return NextResponse.json({ imageUrl });

  } catch (err: any) {
    console.error('Generation API error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}