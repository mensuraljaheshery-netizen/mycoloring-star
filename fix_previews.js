const fs = require('fs');
const filePath = 'src/app/theme/[slug]/page.tsx';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace the image block with a smart fallback that shows theme badge + icon instead of duplicating superhero
  const oldImageBlock = `<div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-1.5">
                    <img
                      src={t.previewImage}
                      alt={t.name}
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', '/theme-previews/superhero.png');
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    <span className="absolute top-1 left-1 bg-black/70 text-[8px] font-black uppercase text-white px-1.5 py-0.5 rounded-md backdrop-blur">
                      {t.category}
                    </span>
                  </div>`;

  const newImageBlock = `<div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 border border-orange-200/60 mb-1.5 flex items-center justify-center text-center p-2">
                    <img
                      src={t.previewImage}
                      alt={t.name}
                      onError={(e) => {
                        // Hide broken image so the clean colored placeholder behind it shows
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                    <div className="flex flex-col items-center justify-center gap-1 z-0">
                      <span className="text-xl">🎨</span>
                      <span className="text-[10px] font-black text-slate-700 leading-tight line-clamp-2 px-1">
                        {t.name}
                      </span>
                    </div>
                    <span className="absolute top-1 left-1 bg-black/70 text-[8px] font-black uppercase text-white px-1.5 py-0.5 rounded-md backdrop-blur z-10">
                      {t.category}
                    </span>
                  </div>`;

  content = content.replace(oldImageBlock, newImageBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed theme fallback previews!');
} else {
  console.log('File not found:', filePath);
}
