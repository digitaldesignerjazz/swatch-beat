# Swatch Internet Time Formula

## How .beat is calculated

Swatch Internet Time divides one day into **1000 .beats**.

### Basic Formula

```python
beats = (seconds_since_midnight_utc / 86.4)
```

- `seconds_since_midnight_utc` = current time in seconds since 00:00:00 UTC
- One .beat = **86.4 seconds** (exactly 1 minute and 26.4 seconds)

### Examples

| UTC Time     | Seconds since midnight | .beat   |
|--------------|------------------------|---------|
| 00:00:00     | 0                      | @000.00 |
| 06:00:00     | 21600                  | @250.00 |
| 12:00:00     | 43200                  | @500.00 |
| 18:00:00     | 64800                  | @750.00 |
| 23:59:59     | 86399                  | @999.99 |

## Conversion Functions

### UTC → .beat
```python
def utc_to_beat(hour, minute, second):
    total_seconds = hour * 3600 + minute * 60 + second
    beat = total_seconds / 86.4
    return round(beat, 2)
```

### .beat → UTC (approximate)
```python
def beat_to_utc(beat):
    total_seconds = beat * 86.4
    hours = int(total_seconds // 3600)
    minutes = int((total_seconds % 3600) // 60)
    seconds = int(total_seconds % 60)
    return hours, minutes, seconds
```

## Why use .beat?

- No time zones
- Universal time reference
- Decimal system (easier for calculations and creative timing)
- Perfect for global collaborative creative work