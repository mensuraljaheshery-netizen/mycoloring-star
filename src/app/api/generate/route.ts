import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getCoverScene, getCoverTale, getThemeConfig } from '@/lib/themes';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const configFilePath = path.join(process.cwd(), 'src', 'data', 'site-config.json');
const themesFilePath = path.join(process.cwd(), 'src', 'data', 'themes-data.json');

// Initialize Supabase admin client directly with project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jjvjojevlxqykdzlpvqv.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Rate-limiting and lifetime lock for free 3-page mini books
async function verifyAndRecordFreeTier(
  req: NextRequest,
  isPaidOrder: boolean,
  shouldRecord: boolean,
  childName?: string,
  theme?: string,
  email?: string
): Promise<{ allowed: boolean; reason?: string }> {
  if (isPaidOrder) {
    return { allowed: true };
  }

  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');
  const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || cfIp || '127.0.0.1';

  const cleanEmail = (email || '').toLowerCase().trim();

  try {
    let query = supabase.from('free_book_claims').select('id, claimed_at');

    if (cleanEmail) {
      query = query.or(`ip_address.eq.${ip},email.eq.${cleanEmail}`);
    } else {
      query = query.eq('ip_address', ip);
    }

    const { data: existing, error: selectError } = await query.maybeSingle();

    if (selectError) {
      console.warn('[SUPABASE_SELECT_WARNING]:', selectError.message);
    }

    if (existing) {
      return {
        allowed: false,
        reason: "You've unlocked your free sample! Ready to order the full edition?"
      };
    }

    if (shouldRecord) {
      const { error: insertError } = await supabase
        .from('free_book_claims')
        .insert([{
          ip_address: ip,
          email: cleanEmail || null,
          child_name: childName || 'Hero',
          theme: theme || 'superhero'
        }]);

      if (insertError) {
        console.warn('[SUPABASE_INSERT_WARNING]:', insertError.message);
      }
    }

    return { allowed: true };
  } catch (err: any) {
    console.warn('[FREE_TIER_CHECK_EXCEPTION]:', err);
    return { allowed: true };
  }
}

function checkMaintenance(): { allowed: boolean; reason?: string } {
  try {
    if (fs.existsSync(configFilePath)) {
      const raw = fs.readFileSync(configFilePath, 'utf8');
      const config = JSON.parse(raw);
      if (config.maintenanceMode) {
        return { allowed: false, reason: 'Generation engine is temporarily paused for scheduled maintenance.' };
      }
    }
  } catch (err) {
    console.error('Maintenance read error:', err);
  }
  return { allowed: true };
}

const VARIETY_EXCLUDED = ['princess', 'ballet', 'ballet-and-dance'];

function pickVarietyScene(): { themeName: string; prompt: string } {
  const config = getThemeConfig('variety-pack', 'boy');
  const scenes = (config.scenes || []).filter((scene) => {
    const title = (scene.title || '').toLowerCase();
    return scene.promptDesc && !VARIETY_EXCLUDED.some((name) => title.startsWith(name));
  });

  if (scenes.length === 0) {
    return {
      themeName: 'Superhero',
      prompt: 'Soaring high above sunlit skyscrapers with a waving superhero cape.'
    };
  }

  const scene = scenes[Math.floor(Math.random() * scenes.length)];
  const themeName = scene.title.includes(':') ? scene.title.split(':')[0].trim() : 'Superhero';
  return { themeName, prompt: scene.promptDesc };
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
    const maint = checkMaintenance();
    if (!maint.allowed) {
      return NextResponse.json({ error: maint.reason }, { status: 503 });
    }

    const {
      imageBase64,
      childName,
      theme,
      email,
      isCover,
      prompt: customPrompt,
      orientation = 'portrait',
      paperSize = 'letter',
      orderId,
      finalizeFreeClaim
    } = await req.json();

    const isPaidOrder = Boolean(orderId && (orderId.startsWith('paid_') || orderId.startsWith('ord_')));

    if (finalizeFreeClaim) {
      const usageCheck = await verifyAndRecordFreeTier(req, false, true, childName, theme, email);
      if (!usageCheck.allowed) {
        return NextResponse.json({ error: usageCheck.reason }, { status: 403 });
      }
      return NextResponse.json({ ok: true });
    }

    const usageCheck = await verifyAndRecordFreeTier(req, isPaidOrder, false, childName, theme, email);
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.reason }, { status: 403 });
    }

    const rawThemeName = theme || 'Superhero';
    const isVariety = rawThemeName.toLowerCase().includes('variety');
    let sceneThemeName = rawThemeName;
    let chosenAction = '';

    if (!isCover && isVariety) {
      const picked = pickVarietyScene();
      sceneThemeName = picked.themeName;
      chosenAction = picked.prompt;
    } else if (!isCover) {
      chosenAction = getRandomSceneAction(rawThemeName);
    }

    const costumeDirective = getThemeCostumeDirective(isCover ? rawThemeName : sceneThemeName);
    const heroName = (childName || 'HERO').toUpperCase();
    const isLandscape = orientation === 'landscape';

    const formatName = paperSize.toLowerCase() === 'a4' ? 'A4 International Standard (210x297mm)' : 'US Letter (8.5x11 inches)';

    const canvasOrientationRule = isLandscape
      ? `ASPECT RATIO & COMPOSITION: Horizontal landscape canvas matching ${formatName} at strict 4:3 aspect ratio. Characters, titles, and backdrop scenery must naturally extend across the wide panoramic width and height with zero letterboxing bars, zero white borders, edge-to-edge bleed.`
      : `ASPECT RATIO & COMPOSITION: Vertical portrait canvas matching ${formatName} at strict 3:4 aspect ratio. Characters, title banners, and scenery must cleanly span the tall vertical height with zero side bars, edge-to-edge bleed.`;

    let prompt = '';

    if (isCover) {
      const displayTheme = rawThemeName.replace(/variety pack/i, 'Variety').toUpperCase();
      const tale = getCoverTale(rawThemeName);
      const titleStyles = [
        `TOP TITLE: Bold playful 3D bubble letters reading "${heroName}". SUBTITLE: a forked comic ribbon directly under the name reading "${displayTheme}".`,
        `TOP TITLE: Huge 3D bubble letters reading "${heroName}". NO ribbon and NO banner under the name. Put the theme only in a clean dark bar along the bottom reading "${heroName}'S ${displayTheme} BOOK".`,
        `TOP TITLE: Bold 3D bubble letters reading "${heroName}". Under it, a plain straight white banner, not a forked ribbon, reading "${displayTheme}".`,
        `TOP TITLE: The name "${heroName}" stacked in big block letters. NO ribbon. A small line of text under the name reads "${displayTheme}".`,
        `TOP TITLE: the name "${heroName}" in flowing golden script, not block letters. Under the name, elegant white script reads "${tale}". NO ribbon. A clean dark bar along the bottom reads "${heroName}'S ${displayTheme} BOOK", with a small line under it reading "Coloring Artist:" and a blank line to sign.`
      ];
      const titleStyle = titleStyles[Math.floor(Math.random() * titleStyles.length)];

      prompt = `Deluxe commercial children's adventure coloring book cover illustration starring the child from the reference photo named "${heroName}".
${canvasOrientationRule}
ANATOMY REQUIREMENTS: Symmetrical, natural human anatomy. Exactly two arms, exactly two legs, exactly five distinct fingers per hand. Zero extra limbs, zero duplicated body parts.
CANVAS COMPOSITION & VERTICAL HEADROOM RULES:
- IMPORTANT: Leave ample blank sky space (at least 15% clear margin) at the top of the canvas so typography sits cleanly below the page boundary.
- The title must sit comfortably below the top edge with generous breathing room.
- Full-bleed colorful illustration edge-to-edge on all sides. Zero borders, zero white bars.

CHARACTER ART & LIKENESS:
- Bold 2D animated comic cartoon art style with crisp ink outlines and vibrant saturated cel-shaded colors.
- Recreate the child's exact recognizable facial features, smile, hairstyle, and skin tone from the reference photo.
- Joyful child hero centered comfortably in the foreground.
COSTUME: ${costumeDirective}
SCENE: ${getCoverScene(rawThemeName)}

CLEAN COVER TYPOGRAPHY:
- ${titleStyle}
- Letters are vibrant yellow or orange with heavy dark outlines.
- BOTTOM BADGE: Simple, small brand logo centered near the bottom edge reading "MyColoringStar", unless a bottom title bar is already there.
- STRICTLY FORBIDDEN: Do NOT write "PERSONALIZED KEEPSAKE EDITION". Write "Coloring Artist" only when the chosen title style asks for it. Do NOT add extra blank boxes.
- Finished retail comic book cover presentation. Zero clipped text.`;
    } else if (customPrompt) {
      prompt = `Professional printable children's coloring book page featuring the child from the photo as the hero.
${canvasOrientationRule}
CHARACTER LIKENESS & ANATOMY: Replicate the child's facial identity, haircut, and joyful smile from reference photo. Natural human anatomy: exactly two arms, exactly two legs, exactly five distinct fingers per hand. Clear limb spacing, zero conjoined limbs, zero extra legs, zero duplicated feet.
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
CHARACTER LIKENESS & ANATOMY: Preserve distinct facial likeness, haircut, and joyful smile from photo. Anatomically correct child proportions: exactly two arms, exactly two legs, exactly five distinct fingers on each hand. Clear separation between arms and torso, no extra limbs, no phantom hands.
COSTUME: ${costumeDirective}
SCENE ACTION: ${chosenAction}.
BACKGROUND: Fun, whimsical cartoon ${sceneThemeName} scenery with bold elements filling the ${isLandscape ? 'horizontal wide' : 'vertical'} page for kids to color.
MANDATORY LINE ART STYLE:
- Crisp, clean thick black ink contour lines on solid white paper.
- Completely empty white spaces for coloring.
- STRICTLY ZERO COLOR, NO gray shading, NO shadows, NO realistic textures, NO 3D renders. High contrast black line drawing only.`;
    }

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing in environment variables.' }, { status: 500 });
    }

    // Nano Banana 2 Lite (Gemini 3.1 Flash Lite Image) explicitly set
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000);

    let orRes: Response;
    try {
      orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
        }),
        signal: controller.signal
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === 'AbortError') {
        throw new Error('Image generation timed out after 50 seconds. Retrying scene...');
      }
      throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    const orData = await orRes.json();
    if (!orRes.ok) {
      console.error('OpenRouter Error Details:', JSON.stringify(orData, null, 2));
      throw new Error(orData.error?.message || `Model provider returned status ${orRes.status}`);
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

    // Direct lightweight URL return to avoid browser storage quota crashes
    return NextResponse.json({ imageUrl });

  } catch (err: any) {
    console.error('Generation API error:', err);
    return NextResponse.json({ error: err.message || 'Generation failed' }, { status: 500 });
  }
}