#!/bin/bash

option=${1:-none}

case $option in
  "up") 
  docker-compose -f docker.sonarqube.yml up -d && 
  docker logs sonarqube -f ;;

  "down")
  docker-compose -f docker.sonarqube.yml down ;; 

  "scan")
  if [ -z "${2}" ]; then
    echo "El Token no ha sido establecido"
    exit
  fi

  docker run --network=host -v "$(pwd):/usr/src" sonarsource/sonar-scanner-cli -e -Dsonar.login=$2 ;;

  "clean")
  docker rm -f sonarqube && docker rm -f sonarqubedb && docker-compose -f docker.sonarqube.yml down ;;

  *) 
  echo "No es una opción válida" ;;
esac
