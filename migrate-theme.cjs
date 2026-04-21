const fs = require('fs');
const path = require('path');

const replacements = [
  // Text colors
  [/text-white\/20/g, 'text-ink/20'],
  [/text-white\/30/g, 'text-ink/30'],
  [/text-white\/40/g, 'text-ink/40'],
  [/text-white\/50/g, 'text-ink/50'],
  [/text-white\/60/g, 'text-ink/60'],
  [/text-white\/70/g, 'text-ink/70'],
  [/text-white\/80/g, 'text-ink/80'],
  [/text-white\/\[0\.01\]/g, 'text-ink/[0.01]'],
  [/text-white\/\[0\.02\]/g, 'text-ink/[0.02]'],
  [/text-white(?![\w\/\-])/g, 'text-ink'],
  [/text-slate-100/g, 'text-ink'],
  [/text-slate-400\/60/g, 'text-ink/40'],
  [/text-slate-400/g, 'text-ink/40'],
  [/text-slate-500/g, 'text-ink/40'],
  [/text-slate-600/g, 'text-ink/30'],
  [/text-slate-200/g, 'text-ink/70'],
  // Backgrounds
  [/bg-background-dark/g, 'bg-background-paper'],
  [/bg-black\/95/g, 'bg-ink/60'],
  [/bg-black\/60/g, 'bg-ink/40'],
  [/bg-black\/40/g, 'bg-ink/40'],
  [/bg-white\/\[0\.03\]/g, 'bg-background-warm/60'],
  [/bg-white\/\[0\.05\]/g, 'bg-background-warm/80'],
  [/bg-white\/\[0\.01\]/g, 'bg-ink/[0.01]'],
  [/bg-white\/5/g, 'bg-background-warm'],
  [/bg-white\/10/g, 'bg-ink/5'],
  [/bg-zinc-900/g, 'bg-background-paper'],
  [/bg-zinc-800/g, 'bg-background-warm'],
  // Borders
  [/border-white\/5/g, 'border-divider'],
  [/border-white\/10/g, 'border-divider'],
  [/border-white\/20/g, 'border-divider'],
  // Hovers
  [/hover:bg-white\/10/g, 'hover:bg-ink/5'],
  [/hover:bg-white\/\[0\.05\]/g, 'hover:bg-ink/5'],
  [/hover:text-white(?![\w\/])/g, 'hover:text-ink'],
  [/hover:border-white\/20/g, 'hover:border-ink/20'],
  [/group-hover:text-white\/50/g, 'group-hover:text-ink/50'],
  [/group-hover:text-white(?![\w\/])/g, 'group-hover:text-ink'],
  // Fonts
  [/font-display/g, 'font-sans'],
  // Placeholder
  [/placeholder:text-slate-600/g, 'placeholder:text-ink/30'],
  [/placeholder:text-slate-500/g, 'placeholder:text-ink/30'],
  // Shadows
  [/shadow-\[0_0_20px_rgba\(209,169,62/g, 'shadow-[0_0_20px_rgba(122,46,46'],
  [/shadow-\[0_0_40px_rgba\(209,169,62/g, 'shadow-[0_0_40px_rgba(122,46,46'],
  [/shadow-\[0_15px_30px_rgba\(209,169,62/g, 'shadow-[0_15px_30px_rgba(122,46,46'],
  // Dividers
  [/bg-white\/\[0\.04\]/g, 'bg-ink/[0.04]'],
  [/h-px bg-white/g, 'h-px bg-divider'],
];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file === 'node_modules' || file === '.git') continue;
      walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', path.relative(process.cwd(), fullPath));
      }
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done!');
