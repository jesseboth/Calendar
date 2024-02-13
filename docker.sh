#!/usr/bin/env bash

IMAGENAME="newtab-server"
CONTAINERNAME="${IMAGENAME}container"

if [ "$1" == "daemon" ]; then
  docker build -t "$IMAGENAME" .
  docker run -d -p 8000:8000 --restart always --name "$CONTAINERNAME" "$IMAGENAME"
elif [ "$1" == "help" ] || [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  echo "Build the docker container:"
  echo "./docker.sh daemon: Creates container and restarts at boot"
  echo "./docker.sh stop: Stops the container"
  echo "./docker.sh: Creates container and starts right now"
  echo "./docker.sh help: Display this message"
elif [ "$1" == "stop" ]; then
  docker stop "$CONTAINERNAME"
  docker rm "$CONTAINERNAME"
else
  docker build -t "$IMAGENAME" .
  docker run -d -p 8000:8000 --name "$CONTAINERNAME" "$IMAGENAME"
fi
