#!/usr/bin/env node

/**
 * Discovers and runs all generate-*.js scripts in this directory.
 * Adding a new generator is just dropping a file — no package.json edits needed.
 */

const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;
const scripts = fs
    .readdirSync(scriptsDir)
    .filter(f => f.startsWith('generate-') && f.endsWith('.js') && f !== 'generate-all.js')
    .sort();

for (const script of scripts) {
    const { generate } = require(path.join(scriptsDir, script));
    if (typeof generate === 'function') {
        const changed = generate();
        const label = script.replace('.js', '');
        if (changed) {
            console.log(`[${label}] Updated`);
        } else {
            console.log(`[${label}] Up to date`);
        }
    }
}
