# Rapport de Projet : Application de Chat Temps Réel (Spring Boot + WebSocket)
**Groupe 9**

---

## 1. Introduction

Ce projet vise à concevoir et développer une application web de chat en temps réel, illustrant la puissance de la communication bidirectionnelle offerte par le protocole **WebSocket**.

L'objectif pédagogique est de maîtriser l'architecture **Spring Boot** pour le backend (Server-side) et **React** pour le frontend (Client-side).

## 2. Architecture Technique

### 2.1 Backend (Serveur Spring Boot)
Le serveur est écrit en Java avec le framework Spring Boot. Il expose des points de terminaison (endpoints) WebSocket pour permettre aux clients de s'y connecter.
*   **Technologies** : Java 17, Spring Boot 3.2.0, Spring WebSocket, Spring Data JPA, PostgreSQL.
*   **Protocole** : STOMP sur WebSocket.
*   **Rôle** : Gérer les connexions, diffuser les messages (Broadcast), et persister les données dans PostgreSQL.

### 2.2 Frontend (Interface React)
L'interface utilisateur est une "Single Page Application" (SPA) construite avec React et stylisée avec TailwindCSS.
*   **Technologies** : React 18, TailwindCSS, HTML5.
*   **Rôle** : Afficher l'interface, gérer les interactions utilisateur et communiquer avec le serveur.

---

## 3. Guide d'Exécution du Projet

Le projet est divisé en deux parties qui doivent être exécutées simultanément pour une architecture complète, bien que l'interface fournie ici inclut un **mode simulation** pour fonctionner immédiatement sans serveur.

### Partie A : Lancer le Backend (Serveur)
Le backend est une application Java autonome.

**Prérequis :**
*   Java JDK 17+
*   Maven (installé et ajouté au PATH)
*   PostgreSQL (avec une base de données vide nommée `springchat`)

**Commandes :**
1.  Ouvrez un terminal dans le dossier `backend`.
2.  Assurez-vous que le script de lancement a les droits d'exécution (Mac/Linux) : `chmod +x run.sh`.
3.  Lancez le serveur :
    *   **Mac/Linux** : `./run.sh`
    *   **Windows** : `run.bat`
    *   Ou universellement : `mvn spring-boot:run`
4.  Le serveur démarrera sur le port **8080**.

### Partie B : Lancer le Frontend (Client)
Le frontend est composé de fichiers statiques (HTML, JS, CSS).

**Méthode simple :**
1.  Allez dans le dossier racine du projet.
2.  Double-cliquez sur le fichier `index.html` pour l'ouvrir dans votre navigateur web (Chrome, Firefox, Safari).
3.  L'application se chargera immédiatement.

**Note sur le mode Simulation :**
L'interface fournie (`index.html`) est configurée par défaut pour utiliser une couche de simulation (`utils/db.js`) qui interagit avec la base de données Trickle en ligne. Cela permet de tester l'interface graphique et la logique React sans avoir besoin que le serveur Java tourne localement.

Pour connecter ce frontend au "Vrai" backend Java local, il faudrait modifier la couche de service (`utils/db.js`) pour utiliser une librairie client STOMP (comme `stompjs`) pointant vers `ws://localhost:8080/ws`.

---

## 4. Description Détaillée des Fichiers

Voici le rôle précis de chaque fichier du projet pour comprendre comment ils travaillent ensemble :

### 4.1 Racine (Frontend)
*   `index.html` : **Le Cœur de l'Affichage**. C'est le seul fichier HTML. Il charge React, Tailwind, et tous les scripts JS. C'est lui que le navigateur affiche.
*   `app.js` : **Le Chef d'Orchestre**. C'est le point d'entrée React. Il décide quelle "page" afficher (Login, Chat, ou Accueil) en fonction de l'état de l'application.
*   `utils/db.js` : **La Mémoire (Service)**. Ce fichier gère toutes les données. C'est lui qui envoie et récupère les messages. Actuellement, il simule le comportement du backend Java.
*   `components/ChatLayout.js` : **Le Gestionnaire de Chat**. C'est le composant principal une fois connecté. Il interroge régulièrement le service (`polling`) pour voir s'il y a de nouveaux messages.
*   `components/ChatArea.js` : **La Zone de Discussion**. Affiche la liste des messages et la barre de saisie. Il gère l'affichage visuel des bulles de discussion.
*   `components/Sidebar.js` : **La Barre Latérale**. Affiche la liste des salons et des utilisateurs connectés.
*   `components/Login.js` : **La Page de Connexion**. Simple formulaire pour entrer son pseudo.

### 4.2 Dossier `backend` (Serveur Java)
*   `pom.xml` : **La Recette de Construction**. Fichier Maven qui liste toutes les librairies nécessaires (Spring Boot, WebSocket, Driver PostgreSQL).
*   `run.sh` / `run.bat` : **Les Démarreurs**. Scripts pour lancer le serveur facilement sans taper de longues commandes.
*   `src/main/resources/application.properties` : **La Configuration**. Contient les identifiants de la base de données (URL, User, Password) et le port du serveur.

### 4.3 Dossier `backend/src/.../java/com/chat` (Code Java)
*   `SpringChatApplication.java` : **Le Point de Départ**. Contient la méthode `main()` qui démarre toute l'application Spring Boot.
*   `config/WebSocketConfig.java` : **La Gare de Triage**. Configure le serveur pour accepter les connexions WebSocket sur `/ws` et définit les routes des messages.
*   `controller/ChatController.java` : **L'Aiguilleur**. Reçoit les messages envoyés par les clients et les redistribue aux autres utilisateurs connectés.
*   `model/ChatMessage.java` : **Le Plan du Message**. Définit à quoi ressemble un message en mémoire (contenu, expéditeur, heure). C'est une classe "Entité" mappée à la base de données.
*   `model/User.java` : **Le Plan de l'Utilisateur**. Définit la structure d'un utilisateur pour la base de données.
*   `repository/...` : **Les Bibliothécaires**. Interfaces qui permettent de discuter avec la base de données PostgreSQL sans écrire de SQL (grâce à JPA).

---

## 5. Fonctionnalités Clés Implémentées

1.  **Architecture en Couches** : Séparation nette entre le visuel (React) et la logique serveur (Spring Boot).
2.  **Base de Données Relationnelle** : Utilisation de PostgreSQL pour un stockage robuste et persistant.
3.  **Temps Réel** : Architecture prête pour le WebSocket (Push) au lieu du HTTP classique (Request/Response).
4.  **Interface Moderne** : Mode sombre, Responsive Design, et UX soignée.

---

## 6. Problèmes Courants et Solutions

*   **Erreur "mvnw: No such file"** : Le wrapper Maven binaire est absent. **Solution** : Utilisez les scripts `run.sh` ou `run.bat` fournis qui utilisent votre installation globale de Maven.
*   **Erreur de Compilation Java** : Assurez-vous d'utiliser Java 17. Le code a été adapté pour ne pas dépendre de Lombok afin d'éviter les erreurs de configuration d'IDE.
*   **Connexion Base de Données échouée** : Vérifiez que PostgreSQL est lancé et que la base `springchat` existe. Vérifiez les identifiants dans `application.properties`.

---
© 2025 Groupe 9 - Projet Universitaire