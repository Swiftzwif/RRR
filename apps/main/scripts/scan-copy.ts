#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

// Known UI tokens that should be ignored
const KNOWN_TOKENS = [
  "Rethink • Redesign • Reignite",
  "Kill the boy so the man may rise.",
  // Domain names
  "identity", "health", "finances", "relationships", "emotions", "focus",
  // Label words
  "Unacceptable", "Acceptable", "Desirable",
  // Control labels
  "Submit", "Start Assessment", "Next", "Submitting...", "Get My Scorecard"
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', '.next', 'content', 'generated'];

function shouldIgnoreString(str: string): boolean {
  // Ignore strings with 6 or fewer words
  const wordCount = str.trim().split(/\s+/).length;
  if (wordCount <= 6) return true;
  
  // Ignore known tokens
  if (KNOWN_TOKENS.some(token => str.includes(token))) return true;
  
  // Ignore strings that are mostly code/technical
  if (str.includes('className=') || str.includes('onClick=') || str.includes('useState')) return true;
  if (str.includes('import ') || str.includes('export ')) return true;
  if (str.includes('function ') || str.includes('const ') || str.includes('let ')) return true;
  
  // Ignore strings that are clearly variable names or technical
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return true; // Single PascalCase words
  if (/^[a-z][a-zA-Z]*$/.test(str)) return true; // Single camelCase words
  
  return false;
}

function extractStringLiterals(content: string): Array<{line: number, text: string}> {
  const strings: Array<{line: number, text: string}> = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match single and double quoted strings
    const singleQuoted = line.match(/'([^']{10,})'/g);
    const doubleQuoted = line.match(/"([^"]{10,})"/g);
    const templateLiterals = line.match(/`([^`]{10,})`/g);
    
    if (singleQuoted) {
      singleQuoted.forEach(match => {
        const text = match.slice(1, -1); // Remove quotes
        if (!shouldIgnoreString(text)) {
          strings.push({ line: i + 1, text });
        }
      });
    }
    
    if (doubleQuoted) {
      doubleQuoted.forEach(match => {
        const text = match.slice(1, -1); // Remove quotes
        if (!shouldIgnoreString(text)) {
          strings.push({ line: i + 1, text });
        }
      });
    }
    
    if (templateLiterals) {
      templateLiterals.forEach(match => {
        const text = match.slice(1, -1); // Remove backticks
        if (!shouldIgnoreString(text)) {
          strings.push({ line: i + 1, text });
        }
      });
    }
  }
  
  return strings;
}

function scanDirectory(dirPath: string, basePath: string): Array<{file: string, line: number, text: string}> {
  const results: Array<{file: string, line: number, text: string}> = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (EXCLUDE_DIRS.includes(item)) continue;
        
        // Recursively scan subdirectories
        results.push(...scanDirectory(fullPath, basePath));
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (SCAN_EXTENSIONS.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const strings = extractStringLiterals(content);
            
            strings.forEach(({ line, text }) => {
              const relativePath = path.relative(basePath, fullPath);
              results.push({
                file: relativePath,
                line,
                text: text.length > 100 ? text.substring(0, 100) + '...' : text
              });
            });
          } catch (error) {
            console.error(`Error reading file ${fullPath}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return results;
}

function main() {
  const srcPath = path.join(process.cwd(), 'src');
  const basePath = process.cwd();
  
  console.log('🔍 Scanning for potentially invented copy...\n');
  console.log('Scanning directory:', srcPath);
  console.log('Excluding:', EXCLUDE_DIRS.join(', '));
  console.log('Known tokens ignored:', KNOWN_TOKENS.length, 'items\n');
  
  const results = scanDirectory(srcPath, basePath);
  
  if (results.length === 0) {
    console.log('✅ No potentially invented copy found!');
  } else {
    console.log(`⚠️  Found ${results.length} potentially invented copy strings:\n`);
    
    results.forEach(({ file, line, text }) => {
      console.log(`${file}:${line}`);
      console.log(`  "${text}"`);
      console.log('');
    });
    
    console.log('📝 Review these strings to ensure they are not invented copy.');
  }
}

if (require.main === module) {
  main();
}

