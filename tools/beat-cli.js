#!/usr/bin/env node
/**
 * Swatch .beat CLI Tool
 * Usage: node tools/beat-cli.js [command] [args]
 */

const { getCurrentBeat, formatBeat, utcToBeat, beatToUtc } = require('./beat_converter');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
    console.log(`
Swatch .beat CLI

Usage:
  node beat-cli.js current
  node beat-cli.js convert-utc <hour> <minute> <second>
  node beat-cli.js convert-beat <beat>
  node beat-cli.js countdown <target-beat>
`);
}

if (!command || command === 'help') {
    printHelp();
    process.exit(0);
}

if (command === 'current') {
    const beat = getCurrentBeat();
    console.log(`Current time: ${formatBeat(beat)}`);
} 

else if (command === 'convert-utc') {
    const [h, m, s] = args.slice(1).map(Number);
    if (isNaN(h) || isNaN(m) || isNaN(s)) {
        console.log('Usage: node beat-cli.js convert-utc <hour> <minute> <second>');
        process.exit(1);
    }
    const beat = utcToBeat(h, m, s);
    console.log(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')} UTC = ${formatBeat(beat)}`);
} 

else if (command === 'convert-beat') {
    const beat = parseFloat(args[1]);
    if (isNaN(beat)) {
        console.log('Usage: node beat-cli.js convert-beat <beat>');
        process.exit(1);
    }
    const { hours, minutes, seconds } = beatToUtc(beat);
    console.log(`${formatBeat(beat)} = ${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')} UTC`);
} 

else if (command === 'countdown') {
    const target = parseFloat(args[1]);
    if (isNaN(target)) {
        console.log('Usage: node beat-cli.js countdown <target-beat>');
        process.exit(1);
    }
    const current = getCurrentBeat();
    let diff = target - current;
    if (diff < 0) diff += 1000;
    
    const totalSec = Math.floor(diff * 86.4);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    
    console.log(`Time until @${target.toFixed(2)}: ${h}h ${m}m ${s}s (${diff.toFixed(2)} beats)`);
} 

else {
    console.log('Unknown command. Use "help" for available commands.');
}