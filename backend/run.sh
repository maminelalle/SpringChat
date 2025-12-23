#!/bin/bash
# Script de lancement alternatif car mvnw (binaire) ne peut pas être généré
# Prérequis : Avoir Maven installé (mvn)

if ! command -v mvn &> /dev/null
then
    echo "ERREUR : Maven n'est pas installé ou n'est pas dans le PATH."
    echo "Sur Mac, vous pouvez l'installer via Homebrew : brew install maven"
    echo "Sur Linux, utilisez votre gestionnaire de paquets (ex: apt install maven)"
    exit 1
fi

echo "Lancement de l'application Spring Chat..."
mvn spring-boot:run