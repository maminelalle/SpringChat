# Frontend SpringChat - Groupe 9

Client web du chat temps réel : **JavaScript (React)** connecté au backend Spring Boot via **WebSocket (STOMP + SockJS)**.

## Technologies

- **React** (Babel standalone)
- **SockJS** : connexion au serveur (`/ws`)
- **STOMP** : envoi/souscription aux messages (`/app/chat.sendMessage`, `/topic/public`)
- **Tailwind CSS**

## Fichiers principaux

- `index.html` : point d’entrée, charge les scripts.
- `app.js` : composant principal et routage (Home, Login, Chat).
- `utils/db.js` : service WebSocket (connexion SockJS/STOMP, envoi, souscription) et appels API REST (salles).
- `components/` : Login, ChatLayout, ChatArea, Sidebar, etc.

## Lancer en dev

Le frontend est servi par le backend Spring à **http://localhost:8080** une fois le backend démarré. Pour ouvrir uniquement les fichiers (sans backend), ouvrir `index.html` ; les appels au serveur (WebSocket, API) ne fonctionneront que si le backend tourne sur le port 8080.
