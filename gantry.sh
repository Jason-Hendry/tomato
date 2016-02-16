#!/bin/bash

export COMPOSE_PROJECT_NAME="tomato"
export CAP_VERSION="3.4.0"
export DOCKER_HTTP_PORT="1095"

if [ "$GANTRY_ENV" == "prod" ]; then
    export BOWER_VOL="/app/prototypes/volumes/bower"
elif  [ "$GANTRY_ENV" == "dev" ]; then
    export BOWER_VOL="/tmp/${COMPOSE_PROJECT_NAME}_bower"
fi

export BOWER_MAP="$BOWER_VOL:/source/app/bower_components";

# deploy
function deploy() {
    ssh ubuntu@rain.systems bash -c "cd /var/www/tomato && git pull"
}
