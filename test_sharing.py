import urllib.request
import base64
import json
import urllib.parse

# Test payload
celebration = {
    "id": "test-aria-01",
    "title": "Aria's Birthday Premiere",
    "event_type": "birthday",
    "theme_id": "sculptural_gold",
    "recipient": {
        "name": "Aria Montgomery",
        "relationship": "sister"
    },
    "recipient_summary": "Aria Montgomery (Sister)",
    "scenes": [
        {"order": 0, "scene_type": "cinematic", "title": "The Starlit Prelude"}
    ]
}

# Encode like JS celebration_share.js does
json_str = json.dumps(celebration)
encoded = base64.b64encode(json_str.encode('utf-8')).decode('utf-8').replace('+', '-').replace('/', '_').rstrip('=')

# Decode back
padded = encoded + '=' * ((4 - len(encoded) % 4) % 4)
base64_str = padded.replace('-', '+').replace('_', '/')
decoded_json = json.loads(base64.b64decode(base64_str).decode('utf-8'))

print("Encoding check:")
print("Original title:", celebration["title"])
print("Decoded title:", decoded_json["title"])
assert decoded_json["title"] == celebration["title"]
print("ENCODING & DECODING TEST PASSED!")
