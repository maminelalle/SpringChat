# SpringChat – Guide complet et présentation

**Groupe 9 : Spring Boot + WebSocket**  
**Thème :** Communication bidirectionnelle en temps réel entre le serveur et le client.

---

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Fonctionnalités](#2-fonctionnalités)
3. [Architecture](#3-architecture)
4. [Prérequis et installation](#4-prérequis-et-installation)
5. [Lancement de l'application](#5-lancement-de-lapplication)
6. [Guide d'utilisation](#6-guide-dutilisation)
7. [Éléments techniques (conformité sujet)](#7-éléments-techniques-conformité-sujet)
8. [Structure du projet](#8-structure-du-projet)
9. [Dépannage](#9-dépannage)

---

## 1. Vue d'ensemble

**SpringChat** est une application de **chat en temps réel** qui illustre la **communication bidirectionnelle** entre un serveur Spring Boot et un client web (JavaScript/React) via **WebSocket** (protocole STOMP et SockJS).

- **Côté serveur :** Spring Boot expose un endpoint WebSocket (`/ws`), reçoit et diffuse les messages en temps réel.
- **Côté client :** une interface web (React) se connecte au serveur, envoie des messages et reçoit instantanément ceux des autres utilisateurs sans recharger la page.

L'application permet de discuter dans des **salons publics**, d'ouvrir des **conversations privées** entre deux utilisateurs, d'envoyer des **messages texte**, des **messages vocaux**, des **images** et des **fichiers PDF**, avec affichage et téléchargement dans l'app.

---

## 2. Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| **Connexion / Déconnexion** | Saisie d’un pseudo pour rejoindre le chat ; déconnexion propre (notification LEAVE). |
| **Salons publics** | Salon « Général » par défaut ; création de salons supplémentaires ; envoi de messages visibles par tous les membres du salon. |
| **Chat privé** | Conversation entre deux utilisateurs dans une **petite fenêtre** (popup) ; ouverture en cliquant sur un utilisateur ou en saisissant son pseudo. |
| **Messages texte** | Saisie et envoi de messages ; affichage en temps réel pour tous les participants. |
| **Messages vocaux** | Enregistrement au micro (tenir le bouton ou cliquer 2 fois) ; envoi sous forme de message vocal avec lecteur audio et téléchargement. |
| **Images** | Envoi d’une image (JPEG, PNG, GIF, WebP) ; **affichage dans la conversation** + lien **Télécharger l’image**. |
| **Fichiers PDF** | Envoi d’un PDF ; **lien Ouvrir le PDF** (nouvel onglet) + **lien Télécharger**. |
| **Présence** | Notification lorsqu’un utilisateur rejoint (JOIN) ou quitte (LEAVE) le chat. |
| **Thème clair / sombre** | Bascule entre mode clair et mode sombre. |

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Client (navigateur)                                              │
│  • React + SockJS + STOMP.js                                      │
│  • Connexion WebSocket vers http://localhost:8080/ws              │
│  • Envoi : /app/chat.sendMessage, /app/chat.addUser               │
│  • Réception : /topic/public, /topic/room/{id}                    │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTP + WebSocket (SockJS/STOMP)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│  Serveur Spring Boot (port 8080)                                 │
│  • WebSocketConfig : endpoint /ws, SockJS, préfixes /app, /topic  │
│  • ChatController : @MessageMapping, SimpMessagingTemplate        │
│  • API REST : /api/rooms, /api/upload/voice, /api/upload/file     │
│  • Fichiers : /api/voice/{id}, /api/files/{id}                    │
│  • Base : H2 (mémoire) ou PostgreSQL (profil postgres)           │
└─────────────────────────────────────────────────────────────────┘
```

- **Temps réel :** les messages et événements (JOIN/LEAVE) passent par WebSocket (STOMP), pas par du polling HTTP.
- **Fichiers (vocaux, images, PDF) :** upload via API REST, puis envoi dans le chat d’un message spécial (ex. `VOICE:id`, `IMAGE:id`, `PDF:id`) ; l’affichage et le téléchargement utilisent les URLs fournies par le serveur.

---

## 4. Prérequis et installation

- **Java 17** (ou supérieur) installé sur la machine.
- **Aucune installation de Maven** requise : le script `run.ps1` du backend utilise un Maven embarqué (téléchargé automatiquement au premier lancement).
- **Navigateur web** à jour (Chrome, Firefox, Edge, etc.) pour ouvrir l’interface.

Aucune base de données à installer pour un usage standard : l’application utilise **H2 en mémoire** par défaut.

---

## 5. Lancement de l'application

### Méthode unique (recommandée)

1. Ouvrir un terminal (PowerShell ou CMD).
2. Se placer dans le dossier backend du projet :
   ```powershell
   cd c:\Users\lalle\Desktop\SpringChat\backend
   ```
3. Lancer le serveur :
   ```powershell
   .\run.ps1
   ```
4. Attendre l’affichage du message du type : `Started SpringChatApplication`.
5. Ouvrir un navigateur et aller à l’adresse : **http://localhost:8080**.

Le **frontend** est servi par le backend : une seule commande suffit pour avoir l’application complète (backend + interface).

### Arrêter l’application

- Dans le terminal où tourne `.\run.ps1`, appuyer sur **Ctrl+C**.

### Si le port 8080 est déjà utilisé

- Le script `run.ps1` tente déjà de libérer le port au démarrage.
- Si l’erreur persiste, exécuter une fois (PowerShell) :
  ```powershell
  Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- Puis relancer : `.\run.ps1`.

---

## 6. Guide d'utilisation

### 6.1 Première utilisation

1. Aller sur **http://localhost:8080**.
2. Sur la page d’accueil, cliquer sur **« Accéder à l’espace »** (ou équivalent).
3. Sur l’écran de connexion, **saisir un nom d’utilisateur** (ex. « Alice ») et valider.
4. Vous arrivez dans l’interface de chat : **salon Général** par défaut, liste des salons et des utilisateurs en ligne à gauche.

### 6.2 Envoyer un message texte

- Saisir le texte dans la zone en bas au centre.
- Cliquer sur le bouton **Envoyer** (icône avion) ou appuyer sur **Entrée**.

### 6.3 Changer de salon

- Dans la barre latérale gauche, section **« Salons »**, cliquer sur un salon pour l’activer.
- Les messages affichés correspondent au salon sélectionné.
- Créer un nouveau salon : cliquer sur l’icône **+** à côté de « Salons » et donner un nom.

### 6.4 Ouvrir une conversation privée

- **Option 1 :** Dans **« Démarrer une conversation »**, saisir le **pseudo** de l’autre utilisateur dans le champ prévu, puis cliquer sur **« Ouvrir »**.
- **Option 2 :** Cliquer directement sur un **utilisateur en ligne** dans la liste.

Une **petite fenêtre** (popup) s’ouvre en bas à droite : c’est la conversation privée avec cette personne. Vous pouvez y écrire, envoyer des vocales, des images ou des PDF. Fermer la fenêtre avec le **X** pour revenir au chat principal sans quitter l’application.

### 6.5 Envoyer un message vocal

- **Tenir appuyé** le bouton **micro** (icône micro) : l’enregistrement démarre (bouton rouge, chrono).
- **Relâcher** : l’enregistrement s’arrête et le message vocal est envoyé.
- Alternative : **un clic** pour démarrer, **un second clic** pour arrêter et envoyer.

Dans la conversation, les vocales s’affichent avec un **lecteur audio** (play / pause).

### 6.6 Envoyer une image ou un PDF

- Cliquer sur l’icône **trombone** (pièce jointe).
- Choisir un fichier **image** (JPEG, PNG, GIF, WebP) ou un **PDF** (max 10 Mo).
- Le fichier est envoyé ; dans le chat :
  - **Image :** affichage direct dans la conversation + lien **« Télécharger l’image »**.
  - **PDF :** liens **« Ouvrir le PDF »** et **« Télécharger »**.

### 6.7 Télécharger un fichier reçu

- **Image :** cliquer sur **« Télécharger l’image »** sous l’image.
- **PDF :** cliquer sur **« Télécharger »** (ou **« Ouvrir le PDF »** pour l’ouvrir dans un nouvel onglet).
- **Vocal :** utiliser le lecteur audio (lecture dans la page) ou le lien de téléchargement si présent.

### 6.8 Se déconnecter

- Cliquer sur l’icône **déconnexion** (porte de sortie) en haut à gauche de la barre latérale, à côté de votre pseudo.

---

## 7. Éléments techniques (conformité sujet)

Le projet respecte le cahier des charges **Groupe 9 : Spring Boot + WebSocket**.

| Élément demandé | Rôle dans le projet |
|-----------------|----------------------|
| **WebSocketConfig** | Classe de configuration : endpoint `/ws`, SockJS, préfixes `/app` (envoi vers le serveur) et `/topic` (réception côté client). Fichier : `backend/.../config/WebSocketConfig.java`. |
| **SimpMessagingTemplate** | Envoi des messages du serveur vers les clients (ex. `convertAndSend("/topic/public", msg)`). Utilisé dans `ChatController` et `WebSocketEventListener`. |
| **@MessageMapping** | Méthodes qui reçoivent les messages STOMP envoyés par le client (ex. `/app/chat.sendMessage`, `/app/chat.addUser`). Fichier : `ChatController.java`. |
| **STOMP** | Protocole de messagerie sur WebSocket : souscription à des topics, envoi vers des destinations. Configuré côté serveur et utilisé côté client (STOMP.js). |
| **SockJS** | Connexion au WebSocket avec fallback si le navigateur ou le réseau bloque le WebSocket pur. Endpoint `/ws` avec `.withSockJS()` ; client : `new SockJS(WS_URL)` dans `frontend/utils/db.js`. |

**Différence WebSocket / HTTP :**  
HTTP = requête / réponse, connexion fermée après chaque échange. WebSocket = **connexion persistante**, **full-duplex** : le serveur peut envoyer des données à tout moment sans que le client ait fait une requête. Dans SpringChat, la connexion est établie une fois vers `/ws`, puis tous les messages de chat et événements (JOIN/LEAVE) passent par cette connexion.

**Client JavaScript :**  
Interface en **React** ; connexion au backend via **SockJS** et **STOMP** (fichier `frontend/utils/db.js`). Les messages sont envoyés avec `stompClient.send("/app/chat.sendMessage", ...)` et reçus via `stompClient.subscribe("/topic/public", ...)` (et `/topic/room/{id}` pour les salons privés).

Pour une vérification détaillée point par point, voir le fichier **CONFORMITE_GROUPE9.md**.

---

## 8. Structure du projet

```
SpringChat/
├── README.md                 # Présentation rapide et lancement
├── PRESENTATION.md           # Ce guide complet
├── CONFORMITE_GROUPE9.md     # Vérification détaillée du sujet
├── backend/
│   ├── run.ps1               # Script de lancement (Windows)
│   ├── LANCER.txt            # Rappel des commandes backend
│   ├── pom.xml               # Dépendances Maven (Spring Boot, WebSocket, JPA, H2, etc.)
│   └── src/main/
│       ├── java/com/chat/
│       │   ├── config/       # WebSocketConfig, DataLoader
│       │   ├── controller/   # ChatController, RoomController, VoiceController, FileUploadController
│       │   ├── listener/     # WebSocketEventListener (JOIN/LEAVE)
│       │   ├── model/        # ChatMessage, ChatRoom, User
│       │   └── repository/   # JPA repositories
│       └── resources/
│           ├── application.properties  # Config H2, port 8080, upload
│           └── static/       # Copie du frontend (servi à la racine)
├── frontend/
│   ├── index.html            # Point d’entrée, chargement des scripts
│   ├── app.js                # Composant principal React
│   ├── utils/
│   │   ├── db.js             # Connexion SockJS/STOMP, API REST, upload
│   │   └── time.js           # Formatage des dates/heures
│   ├── components/           # Login, ChatArea, Sidebar, PrivateChatPopup, etc.
│   └── LANCER.txt            # Rappel exécution frontend
```

---

## 9. Dépannage

| Problème | Solution |
|----------|----------|
| **« Le port 8080 est déjà utilisé »** | Arrêter l’ancienne instance (Ctrl+C dans le terminal qui lance le backend) ou exécuter la commande de libération du port 8080 (voir section 5), puis relancer `.\run.ps1`. |
| **« Maven n’est pas reconnu »** | Utiliser **uniquement** `.\run.ps1` dans le dossier `backend` : le script télécharge et utilise Maven automatiquement. Ne pas lancer `mvn` à la main sauf si Maven est installé globalement. |
| **La page ne se charge pas** | Vérifier que le backend a bien démarré (message « Started SpringChatApplication »). Accéder à **http://localhost:8080** (et non pas à un fichier local `file://...`). |
| **« Erreur de connexion » au login** | Vérifier que le backend tourne sur le port 8080 et qu’aucun pare-feu ne bloque les connexions vers `localhost:8080`. |
| **Le micro ne s’active pas** | Autoriser l’accès au micro dans le navigateur (icône cadenas / paramètres du site). Utiliser de préférence HTTPS ou localhost. |
| **Les images/PDF ne s’affichent pas** | Vérifier que les fichiers envoyés sont bien des images (JPEG, PNG, etc.) ou des PDF et qu’ils ne dépassent pas 10 Mo. |

---

## Récapitulatif

- **Un seul lancement** : `cd backend` puis `.\run.ps1`, puis ouvrir **http://localhost:8080**.
- **Tout est inclus** : salons, chat privé (fenêtre dédiée), texte, vocales, images (affichage + téléchargement), PDF (ouverture + téléchargement).
- **Conformité Groupe 9** : WebSocketConfig, SimpMessagingTemplate, @MessageMapping, STOMP, SockJS, client JavaScript ; voir **CONFORMITE_GROUPE9.md** pour les détails.

Ce document constitue le **guide complet** de l’application et peut servir de support pour la **présentation** du projet (soutenance ou rapport).
