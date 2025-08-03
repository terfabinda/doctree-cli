
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Default folders/files to ignore
const DEFAULT_IGNORE = new Set([
  'node_modules',
  'build',
  'dist',
  'out',
  '.dart_tool',
  '.git',
  '.DS_Store',
  'flutter_plugins',
  '.idea',
  '.vscode',
  '__pycache__',
  'coverage',
  'tmp',
  'temp',
  '.next',
  'venv',
  '.env',
  'logs'
]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    // Step 1: Ask user for additional ignores
    const answer = await askQuestion(
      'Any additional folders or files to ignore (comma-separated, e.g. cache, secret.json)? (Press Enter to skip): '
    );

    const customIgnores = answer
      .split(',')
      .map(item => item.trim())
      .filter(item => item);

    // Combine default and custom ignores
    const IGNORE_SET = new Set([...DEFAULT_IGNORE, ...customIgnores]);

    function isIgnored(item: string): boolean {
      return Array.from(IGNORE_SET).some(pattern => {
        if (pattern.startsWith('*')) return item.endsWith(pattern.slice(1));
        if (pattern.endsWith('*')) return item.startsWith(pattern.slice(0, -1));
        return item === pattern;
      });
    }

    function buildTree(dir: string, prefix = '', isLast = true, depth = 0, maxDepth = 10): string {
      if (depth > maxDepth) return '';

      try {
        const items = fs.readdirSync(dir).filter(item => !isIgnored(item));
        if (items.length === 0) return '';

        const sorted = items.sort((a, b) => {
          const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
          const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
          if (aIsDir && !bIsDir) return -1;
          if (!aIsDir && bIsDir) return 1;
          return a.localeCompare(b);
        });

        let tree = '';

        sorted.forEach((item, index) => {
          const isLastItem = index === sorted.length - 1;
          const currentPrefix = prefix + (isLast ? '    ' : '│   ');
          const line = prefix + (isLastItem ? '└── ' : '├── ') + item;
          const fullPath = path.join(dir, item);

          tree += line + '\n';

          if (fs.statSync(fullPath).isDirectory()) {
            tree += buildTree(fullPath, currentPrefix, isLastItem, depth + 1, maxDepth);
          }
        });

        return tree;
      } catch (err) {
        console.error('Error reading directory:', err);
        return '';
      }
    }

    // Step 2: Generate tree
    const tree = buildTree(process.cwd(), '', true, 0, 8);

    if (!tree.trim()) {
      console.log('⚠️  No readable files found or directory is empty.');
      return;
    }

    // Step 3: Insert into README.md
    const readmePath = path.join(process.cwd(), 'README.md');
    const isLarge = tree.split('\n').length > 50;
    let content = '```\n' + tree + '```\n';

    if (isLarge) {
      const preview = tree.split('\n').slice(0, 20).join('\n');
      content = '```\n' + preview + '\n├── ...\n[View full structure →](fs-full.md)\n```\n';

      // Save full tree
      fs.writeFileSync(path.join(process.cwd(), 'fs-full.md'), `# Project Structure\n\n\`\`\`\n${tree}\`\`\`\n`);
      console.log('📄 Full structure saved to fs-full.md');
    }

    if (fs.existsSync(readmePath)) {
      const data = fs.readFileSync(readmePath, 'utf8');
      fs.writeFileSync(readmePath, content + data);
      console.log('✅ Tree inserted into README.md');
    } else {
      fs.writeFileSync(readmePath, `# Project\n\n${content}`);
      console.log('📄 README.md created and tree inserted!');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    rl.close();
  }
}

// Run the app
main();