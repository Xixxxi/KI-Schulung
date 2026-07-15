import json, re

path = r'c:\Users\G\Desktop\KI-Schulung\schulungsplattform\backend\content\ki-agent-tool-calling.json'

with open(path, encoding='utf-8') as f:
    content = f.read()

try:
    json.loads(content)
    print("Already valid JSON")
except json.JSONDecodeError as e:
    print(f"Error at pos {e.pos}: {e.msg}")
    # Show 60 chars around the error
    snippet = content[max(0, e.pos-60):e.pos+60]
    for i, c in enumerate(snippet, max(0, e.pos-60)):
        if c == '"':
            print(f"  Quote at abs pos {i}, relative to error: {i - e.pos:+d}")
    print("Snippet:", repr(snippet))
