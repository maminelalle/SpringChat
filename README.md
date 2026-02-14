# SpringChat - Groupe 9 : Spring Boot + WebSocket

**Thème :** Communication bidirectionnelle en temps réel entre le serveur et le client.

## Conformité au sujet (Groupe 9)

Le projet respecte le cahier des charges : thème (communication bidirectionnelle temps réel), objectifs pédagogiques (WebSocket vs HTTP, Spring STOMP, client JavaScript), idée de projet (chat en temps réel), et tous les éléments clés : **WebSocketConfig**, **SimpMessagingTemplate**, **@MessageMapping**, **STOMP**, **SockJS**. → Voir **CONFORMITE_GROUPE9.md** pour la vérification détaillée.

## À apprendre

- **WebSocket vs HTTP** : connexion persistante, communication full-duplex (les deux sens en même temps).
- **Spring avec STOMP** : `@EnableWebSocketMessageBroker` (équivalent de @EnableWebSocket pour STOMP), `@MessageMapping`, `SimpMessagingTemplate`.
- **Client** : backend connecté à un client **JavaScript** (React) via **SockJS** et **STOMP**.

## Éléments clés du projet

| Élément | Rôle |
|--------|------|
| **WebSocketConfig** | Configure le serveur WebSocket : endpoint `/ws`, SockJS, préfixes `/app` et `/topic`. |
| **SimpMessagingTemplate** | Envoie des messages vers les clients (ex. `convertAndSend("/topic/public", msg)`). |
| **@MessageMapping** | Méthodes qui reçoivent les messages STOMP (ex. `/chat.sendMessage`, `/chat.addUser`). |
| **STOMP** | Protocole de messagerie sur WebSocket (souscription, envoi ciblé). |
| **SockJS** | Fallback si WebSocket pur n’est pas disponible (négociation de transport). |

## Structure

- **backend/** : Spring Boot (WebSocket, STOMP, JPA, H2).
- **frontend/** : client web (HTML, React via Babel, SockJS, STOMP.js).

## Lancer l’application

1. **Backend** (dans `backend/`) :
   ```powershell
   cd c:\Users\lalle\Desktop\SpringChat\backend
   .\run.ps1
   ```

2. **Frontend** : rien à lancer à part. Ouvrir **http://localhost:8080** dans le navigateur : le frontend est servi par le backend (page d’accueil SpringChat, connexion, chat).

3. **Résumé** : une seule commande (`.\run.ps1` dans `backend`) puis **http://localhost:8080** pour tout utiliser (backend + frontend).
