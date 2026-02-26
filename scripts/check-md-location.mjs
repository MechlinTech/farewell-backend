import fs from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const allowedDir = path.resolve(projectRoot, 'documents');
const ignoredDirs = new Set([
  '.git',
  'node_modules',
  'dist',
  'generated',
  'coverage',
]);

function walk(dir, markdownFiles) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue;
      }
      walk(fullPath, markdownFiles);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

const markdownFiles = [];
walk(projectRoot, markdownFiles);

const disallowed = markdownFiles.filter((filePath) => {
  const normalizedAllowed = allowedDir + path.sep;
  return !(filePath === allowedDir || filePath.startsWith(normalizedAllowed));
});

if (disallowed.length > 0) {
  console.error('Error: .md files are only allowed inside the documents folder.');
  console.error('Move these files to documents/:');
  for (const filePath of disallowed) {
    console.error(`- ${path.relative(projectRoot, filePath)}`);
  }
  process.exit(1);
}

console.info('Markdown location check passed.');
