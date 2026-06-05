#!/usr/bin/env node
/**
 * Swatch .beat CLI Tool - Optimized
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
Swatch .beat CLI Tool (Optimized)

Commands:
  current                  Show current .beat
  convert-utc <h> <m> <s>  Convert UTC to .beat
  convert-beat <beat>      Convert .beat to UTC
  countdown <target>       Live countdown with ms precision (optimized)
`);
}

// ============================================
// OPTIMIZED LIVE COUNTDOWN
// ============================================
function startLiveCountdown(targetBeat) {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    console.log(`\nLive countdown to @${targetBeat.toFixed(2)}  (Ctrl+C to stop)\n`);

    let lastUpdate = 0;

    countdownInterval = setInterval(() => {
        const current = getCurrentBeat();
        let diff = targetBeat - current;

        if (diff < 0) diff += 1000;

        // Calculate total remaining time with high precision
        const totalSeconds = diff * 86.4;

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const ms = Math.floor((totalSeconds % 1) * 1000);

        const timeStr = 
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}.` +
            `${ms.toString().padStart(3, '0')}`;

        const beatStr = diff.toFixed(2);

        clearLine();
        process.stdout.write(`Time remaining: ${timeStr}  |  ${beatStr} beats remaining`);

        // Stop when very close
        if (diff <= 0.005) {
            clearInterval(countdownInterval);
            clearLine();
            console.log(`\n\n✅ Reached @${targetBeat.toFixed(2)}`);
            process.exit(0);
        }
    }, 100); // Optimized: 100ms update interval (smooth + efficient)

    // Graceful Ctrl+C handling
    process.on('SIGINT', () => {
        if (countdownInterval) clearInterval(countdownInterval);
        clearLine();
        console.log('\n\nCountdown stopped.');
        process.exit(0);
    });
}

// ============================================
// COMMAND HANDLER
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
    if ([h, m, s].some(isNaN)) {
        console.error('Usage: node beat-cli.js convert-utc <hour> <minute> <second>');
        process.exit(1);
    }
    console.log(`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')} UTC = ${formatBeat(utcToBeat(h, m, s))}`);
} 

else if (command === 'convert-beat') {
    const beat = parseFloat(args[1]);
    if (isNaN(beat)) {
        console.error('Usage: node beat-cli.js convert-beat <beat>');
        process.exit(1);
    }
    const t = beatToUtc(beat);
    console.log(`${formatBeat(beat)} = ${t.hours.toString().padStart(2,'0')}:${t.minutes.toString().padStart(2,'0')}:${t.seconds.toString().padStart(2,'0')} UTC`);
} 

else if (command === 'countdown') {
    const target = parseFloat(args[1]);
    if (isNaN(target)) {
        console.error('Usage: node beat-cli.js countdown <target-beat>');
        process.exit(1);
    }
    startLiveCountdown(target);
} 

else {
    console.log(`Unknown command: "${command}". Use "help" for available commands.`);
}