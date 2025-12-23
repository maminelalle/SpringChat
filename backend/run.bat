@echo off
REM Script de lancement alternatif car mvnw (binaire) ne peut pas être généré
REM Prérequis : Avoir Maven installé (mvn)

where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR : Maven n'est pas installe ou n'est pas dans le PATH.
    echo Veuillez installer Apache Maven et l'ajouter a vos variables d'environnement.
    pause
    exit /b
)

echo Lancement de l'application Spring Chat...
mvn spring-boot:run