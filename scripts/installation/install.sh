#!/bin/bash

############# Version Information Begin #############
# kubebernets 1.14.8 is test ok.
# istio version: v1.2.2
# seldon core: v1.2.2
# harbor: v2.1.0
# klever-model-registry 0.1.0
############# Version Information End ###############

# Set it as k8s master ip.
export MASTER_IP=$1

# Set klever-model-registry NodePort port.
export KLEVER_MODEL_REGISTRY_PORT=30100

# 
# Go to manifests directory, it is workdir.
CWD=$(pwd)

#
# Install Klever-web
#
git clone https://github.com/kleveross/klever-web.git
helm install klever-modeljob-operator $CWD/klever-web/manifests/klever-web \
    --set model.registry.address=http://$MASTER_IP:$KLEVER_MODEL_REGISTRY_PORT \
    --namespace=kleveross-system

