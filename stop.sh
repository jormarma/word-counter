#!/bin/bash
if ! command -v docker-compose &> /dev/null
then
    echo "ERROR: 'docker-compose' command could not be found"
    exit 1
fi

docker-compose down

if [ $? -eq 0 ]
then
  echo "Service stoped"
else
  echo "Could not stop the service." >&2
fi

