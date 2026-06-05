#!/usr/bin/env node
/**
 * Swatch .beat CLI Tool
 * Usage examples:
 *   node beat-cli.js current
 *   node beat-cli.js convert-utc 14 30 0
 *   node beat-cli.js convert-beat 650
 *   node beat-cli.js countdown 750
 */

const { getCurrentBeat, formatBeat, utcToBeat, beatToUtc } = require('./beat_converter');

const args = process.argv.slice(2);
const command = args[0];

let countdownInterval = null;

function clearLine() {
    process.stdout.write('\r\x1b[K');
}

function printHelp() {
    console.log(`
Swatch .beat CLI Tool

Commands:
  current                  Show current .beat time
  convert-utc <h> <m> <s>  Convert UTC time to .beat
  convert-beat <beat>      Convert .beat to UTC
  countdown <target>       Live countdown to a target .beat (e.g. 750)

Examples:
  node beat-cli.js current
  node beat-cli.js countdown 750
`);
}

// ============================================
// LIVE COUNTDOWN
// ============================================
function startLiveCountdown(targetBeat) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    console.log(`\nLive countdown to @${targetBeat.toFixed(2)} (Press Ctrl+C to stop)\n`);

    countdownInterval = setInterval(() => {
        const current = getCurrentBeat();
        let diff = targetBeat - current;

        if (diff < 0) {
            diff += 1000; // wrap to next day
        }

        const totalSeconds = Math.floor(diff * 86.4);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const beatStr = `${diff.toFixed(2)} beats`;

        clearLine();
        process.stdout.write(`Time remaining: ${timeStr}  |  ${beatStr} remaining`);

        if (diff <= 0.05) {
            clearInterval(countdownInterval);
            clearLine();
            console.log(`\n\n✅ Target @${targetBeat.toFixed(2)} reached!`);
            process.exit(0);
        }
    }, 250); // Update every 250ms for smooth feel

    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        if (countdownInterval) clearInterval(countdownInterval);
        clearLine();
        console.log('\n\nCountdown stopped.');
        process.exit(0);
    });
}

// ============================================
// MAIN COMMAND HANDLER
// ============================================
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
    startLiveCountdown(target);
} 

else {
    console.log(`Unknown command: ${command}`);
    printHelp();
}