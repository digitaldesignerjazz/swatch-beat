/**
 * Swatch .beat Converter (JavaScript)
 * Works in browser and Node.js
 */

function getCurrentBeat() {
    const now = new Date();
    // Get UTC time
    const utcHours = now.getUTCHours();
    const utcMinutes = now.getUTCMinutes();
    const utcSeconds = now.getUTCSeconds();
    const utcMilliseconds = now.getUTCMilliseconds();

    const totalSeconds =
        utcHours * 3600 +
        utcMinutes * 60 +
        utcSeconds +
        utcMilliseconds / 1000;

    const beat = totalSeconds / 86.4;
    return Math.round(beat * 100) / 100; // two decimals
}

function formatBeat(beat) {
    return '@' + beat.toFixed(2).padStart(6, '0');
}

function utcToBeat(hour, minute, second) {
    const totalSeconds = hour * 3600 + minute * 60 + second;
    return Math.round((totalSeconds / 86.4) * 100) / 100;
}

function beatToUtc(beat) {
    const totalSeconds = beat * 86.4;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return { hours, minutes, seconds };
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentBeat,
        formatBeat,
        utcToBeat,
        beatToUtc
    };
}