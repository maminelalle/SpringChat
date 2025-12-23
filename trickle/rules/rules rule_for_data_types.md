When handling data from backend:
- Be aware of type differences between Backend (Java) and Frontend (JS).
- Database IDs are often Numbers (Long), not Strings. Do not use String methods like `.split()` or `.includes()` directly on IDs without converting them first (e.g. `String(id)`).
- Always verify the structure of the data (e.g. room name format) before parsing it.