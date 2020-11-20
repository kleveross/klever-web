# 安装

安装 klever-web 之前，需安装依赖的如下组件：
* [istio](https://github.com/istio/istio)
* [seldon-core](https://github.com/SeldonIO/seldon-core)
* [harbor](https://github.com/goharbor/harbor)
* [klever-model-registry](https://github.com/kleveross/klever-model-registry)

## 安装 klever-web
```bash
$ git clone https://github.com/kleveross/klever-web
$ cd klever-web/manifests
$ helm install klever-web ./klever-web --namespace=kleveross-system --set model.registry.address={model-registry-external-address}  --set service.nodePort={port}
```

### klever-web parameters
| Key | Comments |
| :-----| :---- |
### klever-web parameters
| Key | Comments |
| :-----| :---- |
| model.registry.address | model.registry.address 是 klever-model-registry 集群外部访问地址|
| service.type | klever-web 对外访问类型，默认是 NodePort，当前只支持这种类型. |
| service.nodePort | 对外访问 nodePort端口， 默认是 30200. |