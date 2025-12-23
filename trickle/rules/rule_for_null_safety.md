When rendering data from external sources (API, WebSocket):
- Always check for null or undefined values before accessing properties like `.toLowerCase()`, `.includes()`, or `.length`.
- Provide default values (e.g., `const content = msg.content || '';`) to prevent crashes when data is missing or incomplete.