# Backend Spring Chat

Ce dossier contient le code source Java Spring Boot pour le backend de l'application.

## Pourquoi `mvnw` est-il absent ?
Le wrapper Maven (`mvnw`) nécessite des fichiers binaires (`.jar`) qui ne peuvent pas être générés dans cet environnement textuel. Nous fournissons à la place des scripts utilisant votre installation Maven globale.

## Prérequis
1. **Java JDK 17** ou supérieur installé.
2. **Maven** installé et accessible via la commande `mvn`.
3. **PostgreSQL** installé et lancé.

## Configuration Base de Données
Assurez-vous d'avoir créé une base de données vide nommée `springchat` dans PostgreSQL.
L'application se connectera avec les identifiants configurés dans `src/main/resources/application.properties` :
- User: `lalle`
- Pass: `As10101010la$`

## Comment lancer le projet ?

### Sur Mac / Linux
1. Ouvrez un terminal dans ce dossier `backend`.
2. Rendez le script exécutable :
   ```bash
   chmod +x run.sh
   ```
3. Lancez l'application :
   ```bash
   ./run.sh
   ```
   Ou directement via Maven :
   ```bash
   mvn spring-boot:run
   ```

### Sur Windows
1. Ouvrez un terminal (CMD ou PowerShell) dans ce dossier.
2. Lancez le script :
   ```cmd
   run.bat
   ```
   Ou directement via Maven :
   ```cmd
   mvn spring-boot:run
   ```