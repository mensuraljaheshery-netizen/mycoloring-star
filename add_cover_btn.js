const fs = require('fs');
const file = 'src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the 2-column button grid with a 3-button layout including + Cover
const target = `<div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedThemeForPrompt(t);
                              setShowAddPromptModal(true);
                            }}
                            className="py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <FileText className="w-3 h-3" /> + Prompt
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingBannerSlug(t.slug);
                              setTempBannerPath(currentBanner);
                            }}
                            className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <ImageIcon className="w-3 h-3" /> Banner
                          </button>
                        </div>`;

const replacement = `<div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedThemeForPrompt(t);
                              setShowAddPromptModal(true);
                            }}
                            className="py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <FileText className="w-3 h-3" /> + Prompt
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              openManageModal(t);
                              setActiveModalTab('covers');
                            }}
                            className="py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                          >
                            <BookOpen className="w-3 h-3" /> + Cover
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingBannerSlug(t.slug);
                              setTempBannerPath(currentBanner);
                            }}
                            className="py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                          >
                            <ImageIcon className="w-3 h-3" /> Banner
                          </button>
                        </div>`;

if (content.includes(target)) {
  fs.writeFileSync(file, content.replace(target, replacement), 'utf8');
  console.log('Added + Cover button to theme cards!');
} else {
  console.log('Target snippet not matched directly; open Manage Prompts -> Cover Page Prompts tab.');
}
