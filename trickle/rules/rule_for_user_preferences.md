When developing features like Notifications or Audio:
- Always provide a manual trigger for permissions (e.g., a button "Enable Notifications") because browsers block automatic requests.
- Ensure audio recording uses widely supported formats (like 'audio/webm' or 'audio/mp4') and handle browser incompatibilities.
- Verify that features persist and work "out of the box" as much as possible, or provide clear feedback if they fail.