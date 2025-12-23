When implementing WebSocket connections:
- Always implement a connection timeout (e.g. 5 seconds) to prevent infinite loading states if the server is unreachable.
- Wrap connection logic in a Promise and ensure both resolve and reject paths are covered.
- Handle component unmounting by cleaning up subscriptions and pending timeouts.
- In 'connect' methods, check if a connection is already active before creating a new one to avoid stacking connections.