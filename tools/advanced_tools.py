#!/usr/bin/env python3
"""
Advanced Swatch .beat Tools
- Countdown between two .beats
- Scheduling helper
"""

from datetime import datetime, timezone, timedelta


def beat_countdown(from_beat: float, to_beat: float) -> dict:
    """Calculate time difference between two .beats"""
    diff_beats = to_beat - from_beat
    if diff_beats < 0:
        diff_beats += 1000  # wrap around midnight
    
    total_seconds = diff_beats * 86.4
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    
    return {
        "beats_difference": round(diff_beats, 2),
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,
        "total_seconds": round(total_seconds)
    }


def schedule_from_now(target_beat: float) -> dict:
    """Calculate when a target .beat occurs from now"""
    current_beat = get_current_beat()  # reuse from beat_converter
    return beat_countdown(current_beat, target_beat)


def get_current_beat():
    now = datetime.now(timezone.utc)
    seconds = now.hour * 3600 + now.minute * 60 + now.second
    return round(seconds / 86.4, 2)


def main():
    print("Advanced .beat Tools")
    print("=" * 40)
    
    # Example: Countdown from now to @750
    result = schedule_from_now(750)
    print(f"Time until @750.00: {result['hours']}h {result['minutes']}m {result['seconds']}s")
    
    # Countdown between two specific beats
    diff = beat_countdown(250, 750)
    print(f"From @250 to @750: {diff['beats_difference']} beats ({diff['hours']}h {diff['minutes']}m)")

if __name__ == "__main__":
    main()