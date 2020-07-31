#!/bin/bash
if ! command -v docker-compose &> /dev/null
then
    echo "ERROR: 'docker-compose' command could not be found"
    exit 1
fi

docker-compose up --detach

if [ $? -eq 0 ]
then
  echo "Access the service here: http://localhost:8080"
else
  echo "Could not start the service." >&2
fi
