# Conformité au sujet – Groupe 9 : Spring Boot + WebSocket

Ce document vérifie que le projet **SpringChat** respecte intégralement le cahier des charges du professeur.

---

## Thème

> **Communication bidirectionnelle en temps réel entre le serveur et le client.**

**Conformité : OUI**

- Le serveur envoie des messages aux clients via WebSocket (ex. nouveau message de chat, JOIN/LEAVE).
- Le client envoie des messages au serveur (ex. envoi de message, connexion utilisateur).
- Tout est en temps réel (pas de polling HTTP).

---

## À apprendre

### 1. Comprendre la différence entre WebSocket et HTTP (connexion persistante, communication full-duplex)

**Conformité : OUI**

- **HTTP** : requête/réponse, connexion fermée après chaque échange.
- **WebSocket** : une seule connexion persistante ; le serveur peut envoyer à tout moment sans que le client ait demandé (full-duplex).
- Dans le projet : le client ouvre une connexion WebSocket (via SockJS) vers `/ws` et garde cette connexion ouverte ; les messages circulent dans les deux sens en continu.
- Référence côté client : `frontend/utils/db.js` (connexion SockJS, envoi via `stompClient.send`, réception via `stompClient.subscribe`).

### 2. Utiliser Spring avec STOMP : @EnableWebSocket, @MessageMapping, SimpMessagingTemplate

**Conformité : OUI**

| Élément demandé | Dans Spring (STOMP) | Où dans le projet |
|-----------------|---------------------|--------------------|
| **@EnableWebSocket** | Pour STOMP, Spring utilise **@EnableWebSocketMessageBroker** (active WebSocket + broker de messages STOMP). | `backend/.../config/WebSocketConfig.java` ligne 19 : `@EnableWebSocketMessageBroker` |
| **@MessageMapping** | Méthodes qui reçoivent les messages STOMP envoyés par les clients. | `backend/.../controller/ChatController.java` : `@MessageMapping("/chat.sendMessage")` et `@MessageMapping("/chat.addUser")` |
| **SimpMessagingTemplate** | Objet pour envoyer des messages vers les clients (souscriptions /topic). | `ChatController.java` : `messagingTemplate.convertAndSend("/topic/public", ...)` et `"/topic/room/" + roomId`. Également dans `WebSocketEventListener.java` pour les déconnexions (LEAVE). |

### 3. Connecter le backend à un client JavaScript ou Angular/React

**Conformité : OUI**

- Client : **JavaScript** (React chargé via Babel dans le navigateur).
- Connexion au backend : **SockJS** + **STOMP** (bibliothèques chargées dans `frontend/index.html` : sockjs-client, stomp.js).
- Fichier principal de connexion WebSocket : `frontend/utils/db.js` (connexion SockJS à `/ws`, client STOMP, envoi vers `/app/chat.sendMessage` et `/app/chat.addUser`, souscription à `/topic/public` et `/topic/room/{id}`).

---

## Idée de projet

> **Créer une application de chat en temps réel ou un système de notifications instantanées.**

**Conformité : OUI**

- Application de **chat en temps réel** : salons publics, conversations privées, messages texte et vocaux, présence (JOIN/LEAVE).
- Les notifications instantanées sont couvertes par la diffusion des messages et des événements JOIN/LEAVE via WebSocket.

---

## Éléments clés

| Élément demandé | Rôle | Fichier / emplacement |
|-----------------|------|------------------------|
| **WebSocketConfig** | Configuration du serveur WebSocket : endpoint d’entrée, SockJS, préfixes des destinations. | `backend/.../config/WebSocketConfig.java` |
| **SimpMessagingTemplate** | Envoi des messages vers les clients (diffusion sur `/topic/public` et `/topic/room/{id}`). | `ChatController.java` (injection et `convertAndSend`), `WebSocketEventListener.java` (LEAVE) |
| **STOMP** | Protocole de messagerie sur WebSocket (souscription à des topics, envoi vers des destinations). | Backend : config dans `WebSocketConfig` (`/app`, `/topic`). Client : STOMP sur SockJS dans `frontend/utils/db.js` |
| **SockJS** | Connexion au WebSocket avec fallback si le navigateur ou le réseau bloque le WebSocket pur. | Backend : `WebSocketConfig.registerStompEndpoints` → `.withSockJS()`. Client : `new SockJS(WS_URL)` dans `frontend/utils/db.js` |

---

## Récapitulatif des fichiers importants

| Fichier | Rôle pour le sujet |
|---------|---------------------|
| `backend/.../config/WebSocketConfig.java` | WebSocketConfig, @EnableWebSocketMessageBroker, STOMP, SockJS |
| `backend/.../controller/ChatController.java` | @MessageMapping, SimpMessagingTemplate |
| `backend/.../listener/WebSocketEventListener.java` | SimpMessagingTemplate (LEAVE) |
| `frontend/utils/db.js` | Client JavaScript : SockJS, STOMP, connexion au backend |
| `frontend/index.html` | Chargement des librairies SockJS et STOMP |

---

**Conclusion :** Le projet respecte le thème, les objectifs pédagogiques et tous les éléments clés demandés (WebSocketConfig, SimpMessagingTemplate, @MessageMapping, STOMP, SockJS), avec un client JavaScript (React) connecté au backend Spring Boot.
