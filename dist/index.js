"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
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
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
async function main() {
    try {
        // Step 1: Ask user for additional ignores
        const answer = await askQuestion('Any additional folders or files to ignore (comma-separated, e.g. cache, secret.json)? (Press Enter to skip): ');
        const customIgnores = answer
            .split(',')
            .map(item => item.trim())
            .filter(item => item);
        // Combine default and custom ignores
        const IGNORE_SET = new Set([...DEFAULT_IGNORE, ...customIgnores]);
        function isIgnored(item) {
            return Array.from(IGNORE_SET).some(pattern => {
                if (pattern.startsWith('*'))
                    return item.endsWith(pattern.slice(1));
                if (pattern.endsWith('*'))
                    return item.startsWith(pattern.slice(0, -1));
                return item === pattern;
            });
        }
        function buildTree(dir, prefix = '', isLast = true, depth = 0, maxDepth = 10) {
            if (depth > maxDepth)
                return '';
            try {
                const items = fs.readdirSync(dir).filter(item => !isIgnored(item));
                if (items.length === 0)
                    return '';
                const sorted = items.sort((a, b) => {
                    const aIsDir = fs.statSync(path.join(dir, a)).isDirectory();
                    const bIsDir = fs.statSync(path.join(dir, b)).isDirectory();
                    if (aIsDir && !bIsDir)
                        return -1;
                    if (!aIsDir && bIsDir)
                        return 1;
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
            }
            catch (err) {
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
        }
        else {
            fs.writeFileSync(readmePath, `# Project\n\n${content}`);
            console.log('📄 README.md created and tree inserted!');
        }
    }
    catch (err) {
        console.error('Unexpected error:', err);
    }
    finally {
        rl.close();
    }
}
// Run the app
main();
//# sourceMappingURL=index.js.map