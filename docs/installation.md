# Installation

To use klever-web, you MUST install some dependent components as follows:
* [istio](https://github.com/istio/istio)
* [seldon-core](https://github.com/SeldonIO/seldon-core)
* [harbor](https://github.com/goharbor/harbor)
* [klever-model-registry](https://github.com/kleveross/klever-model-registry)

## Install klever-web
```bash
$ git clone https://github.com/kleveross/klever-web
$ cd klever-web/manifests
$ helm install klever-web ./klever-web --namespace=kleveross-system --set model.registry.address={model-registry-external-address}  --set service.nodePort={port}
```

### klever-web parameters
| Key | Comments |
| :-----| :---- |
| model.registry.address | It is klever-model-registry's address, it is exposed out of k8s cluster. |
| service.type | It is klever-web's Service Type, default is NodePort, it is support only. |
| service.nodePort | It is klever-web's Service NodePort, default is 30200. |