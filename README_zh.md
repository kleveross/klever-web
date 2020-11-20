# Klever Web

[English](./README.md) | 中文

Klever Web 是 [Klever Model Registry](https://github.com/kleveross/klever-model-registry) 的前端界面

## Getting Started

### Clone Repository

```
$ git clone https://github.com/kleveross/klever-web.git
$ cd klever-web
```

### Install dependencies

```bash
$ yarn
```

### Start the dev server

```bash
$ yarn start
```

## Publish

### Build Image

```
$ yarn run build
$ docker build -t lever-dev.cargo.io/release/klever-web:v0.0.3 .
```

### Run Image

```
$ docker run -p 8888:8080 -d lever-dev.cargo.io/release/klever-web:v0.0.3
```

## nodePort

默认应用端口是 8080， docker 启动容器对外端口是 8888

