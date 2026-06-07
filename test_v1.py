import json
from packlm import PackLM

data = {
  "context": {
    "task": "Our favorite hikes together",
    "location": "Boulder",
    "season": "spring_2025"
  },
  "friends": ["ana", "luis", "sam"],
  "hikes": [
    {"id": 1, "name": "Blue Lake Trail",  "distanceKm": 7.5, "elevationGain": 320, "companion": "ana",  "wasSunny": True},
    {"id": 2, "name": "Ridge Overlook",   "distanceKm": 9.2, "elevationGain": 540, "companion": "luis", "wasSunny": False},
    {"id": 3, "name": "Wildflower Loop",  "distanceKm": 5.1, "elevationGain": 180, "companion": "sam",  "wasSunny": True},
  ]
}

try:
    packed = PackLM.encode(data)
    stats = PackLM.token_savings_estimate(json.dumps(data), packed)
    print("V1 PACKED:")
    print(packed)
    print("V1 STATS:")
    print(stats)
except Exception as e:
    print(f"V1 ERROR: {e}")
