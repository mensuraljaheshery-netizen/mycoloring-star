const fs = require('fs');
const file = 'src/app/theme/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state for custom extra cover prompts
const oldState = `  const [customThemeData, setCustomThemeData] = useState<ThemeConfig | null>(null);
  const [customExtraPrompts, setCustomExtraPrompts] = useState<SceneTemplate[]>([]);`;

const newState = `  const [customThemeData, setCustomThemeData] = useState<ThemeConfig | null>(null);
  const [customExtraPrompts, setCustomExtraPrompts] = useState<SceneTemplate[]>([]);
  const [customExtraCoverPrompts, setCustomExtraCoverPrompts] = useState<string[]>([]);`;

if (content.includes(oldState)) {
  content = content.replace(oldState, newState);
}

// 2. Load coverPrompts from custom themes AND extraCoverPrompts from admin
const oldFetchParsing = `        // 1. Check if this is a custom-created theme
        if (Array.isArray(data.customThemes)) {
          const found = data.customThemes.find((t: any) => t.slug === slug);
          if (found) {
            setCustomThemeData({
              slug: found.slug,
              name: found.name,
              category: found.category || 'Adventure',
              description: found.description || \`Exciting adventures centered around \${found.name}\`,
              coverPrompts: [
                \`2D storybook cover art, vibrant full-color illustration of \${found.name}, happy child hero in central focus\`
              ],
              scenes: (found.scenes || []).map((s: any) => ({
                id: s.id || \`custom-\${Math.random()}\`,
                title: s.title,
                promptDesc: s.prompt
              }))
            });
          }
        }

        // 2. Check if extra prompts were added to this theme
        if (data.extraPrompts && Array.isArray(data.extraPrompts[slug])) {
          const extra = data.extraPrompts[slug].map((s: any) => ({
            id: s.id,
            title: s.title,
            promptDesc: s.prompt
          }));
          setCustomExtraPrompts(extra);
        }`;

const newFetchParsing = `        // 1. Check if this is a custom-created theme
        if (Array.isArray(data.customThemes)) {
          const found = data.customThemes.find((t: any) => t.slug === slug);
          if (found) {
            const definedCovers = Array.isArray(found.coverPrompts) && found.coverPrompts.length > 0
              ? found.coverPrompts
              : [\`2D storybook cover art, vibrant full-color illustration of \${found.name}, happy child hero in central focus\`];

            setCustomThemeData({
              slug: found.slug,
              name: found.name,
              category: found.category || 'Adventure',
              description: found.description || \`Exciting adventures centered around \${found.name}\`,
              coverPrompts: definedCovers,
              scenes: (found.scenes || []).map((s: any) => ({
                id: s.id || \`custom-\${Math.random()}\`,
                title: s.title,
                promptDesc: s.prompt
              }))
            });
          }
        }

        // 2. Check if extra interior scene prompts were added
        if (data.extraPrompts && Array.isArray(data.extraPrompts[slug])) {
          const extra = data.extraPrompts[slug].map((s: any) => ({
            id: s.id,
            title: s.title,
            promptDesc: s.prompt
          }));
          setCustomExtraPrompts(extra);
        }

        // 3. Check if extra cover prompts were added from admin
        if (data.extraCoverPrompts && Array.isArray(data.extraCoverPrompts[slug])) {
          setCustomExtraCoverPrompts(data.extraCoverPrompts[slug]);
        }`;

if (content.includes(oldFetchParsing)) {
  content = content.replace(oldFetchParsing, newFetchParsing);
}

// 3. Prioritize custom cover prompts when generating the cover
const oldCoverCall = `      const coverPrompt = coverPrompts?.[0] || \`Vibrant children's storybook cover featuring \${themeName}\`;
      const coverRes = await fetch('/api/generate', {`;

const newCoverCall = `      // Prioritize admin-added cover prompts first, then theme cover prompts, then fallback
      const activeCoverPrompts = [...customExtraCoverPrompts, ...(coverPrompts || [])];
      const coverPrompt = activeCoverPrompts[0] || \`Vibrant children's storybook cover featuring \${themeName}\`;
      const coverRes = await fetch('/api/generate', {`;

if (content.includes(oldCoverCall)) {
  content = content.replace(oldCoverCall, newCoverCall);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully connected custom cover prompts into book generator pipeline!');
