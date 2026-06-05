/**
 * Swatch .beat Converter (Browser version)
 */

function getCurrentBeat() {
    const now = new Date();
    const totalSeconds =
        now.getUTCHours() * 3600 +
        now.getUTCMinutes() * 60 +
        now.getUTCSeconds() +
        now.getUTCMilliseconds() / 1000;
    return totalSeconds / 86.4;
}

function formatBeat(beat) {
    return '@' + beat.toFixed(2).padStart(6, '0');
}

function utcToBeat(hour, minute, second) {
    const totalSeconds = hour * 3600 + minute * 60 + second;
    return totalSeconds / 86.4;
}

function beatToUtc(beat) {
    const totalSeconds = beat * 86.4;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return { hours, minutes, seconds };
}