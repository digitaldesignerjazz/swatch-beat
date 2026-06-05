#!/usr/bin/env python3
"""
Swatch .beat Converter
Convert between UTC time and Swatch Internet Time (.beat)
"""

from datetime import datetime, timezone


def get_current_beat() -> float:
    """Return current time as .beat (with two decimal places)"""
    now = datetime.now(timezone.utc)
    seconds_since_midnight = (
        now.hour * 3600 + now.minute * 60 + now.second + now.microsecond / 1_000_000
    )
    beat = seconds_since_midnight / 86.4
    return round(beat, 2)


def utc_to_beat(hour: int, minute: int, second: int) -> float:
    """Convert UTC time to .beat"""
    total_seconds = hour * 3600 + minute * 60 + second
    beat = total_seconds / 86.4
    return round(beat, 2)


def beat_to_utc(beat: float) -> tuple:
    """Convert .beat back to approximate UTC time (hours, minutes, seconds)"""
    total_seconds = beat * 86.4
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    return hours, minutes, seconds


def format_beat(beat: float) -> str:
    """Format beat as @XXX.XX"""
    return f"@{beat:06.2f}"


def main():
    print("Swatch .beat Converter")
    print("=" * 30)
    
    current_beat = get_current_beat()
    print(f"Current time (@000 = 00:00 UTC): {format_beat(current_beat)}")
    
    # Example conversions
    print("\nExamples:")
    print(f"  00:00 UTC → {format_beat(utc_to_beat(0, 0, 0))}")
    print(f"  06:00 UTC → {format_beat(utc_to_beat(6, 0, 0))}")
    print(f"  12:00 UTC → {format_beat(utc_to_beat(12, 0, 0))}")
    print(f"  18:00 UTC → {format_beat(utc_to_beat(18, 0, 0))}")
    
    # Convert back
    h, m, s = beat_to_utc(500)
    print(f"\n@500.00 → {h:02d}:{m:02d}:{s:02d} UTC (approx)")


if __name__ == "__main__":
    main()