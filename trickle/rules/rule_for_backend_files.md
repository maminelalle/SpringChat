When user requests local execution files:
- Always include the full 'backend/' directory structure including 'pom.xml', 'application.properties', and the main Application class.
- Include JPA Repositories and Entity Models if a database is mentioned.
- Ensure 'pom.xml' includes necessary drivers (e.g., PostgreSQL) corresponding to 'application.properties'.