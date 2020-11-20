# Klever Web

English | [中文](./README_zh.md)

Klever Web is the front-end interface of [Klever Model Registry](https://github.com/kleveross/klever-model-registry)

## Getting Started

### Clone Repository

```
$ git clone https://github.com/kleveross/klever-web.git
$ cd klever-web
```

Install dependencies:

```bash
$ yarn
```

### Start the dev server:

```bash
$ yarn start
```

## Installation

### Build Image

```
$ yarn run build
$ docker build -t lever-dev.cargo.io/release/klever-web:v0.0.3 .
```

### Run Image

```
$ docker run -p 8888:8080 -d lever-dev.cargo.io/release/klever-web:v0.0.3
```

### Installation

Please have a look at [docs/installation.md](docs/installation.md).

If you want to trial quickly, you can run installation script as follow.

```bash
$ wget https://raw.githubusercontent.com/kleveross/klever-web/master/scripts/installation/install.sh
$ bash install.sh <master-ip>
```

## Community

klever-web project is part of Klever, a Cloud Native Machine Learning platform.

The Klever slack workspace is klever.slack.com. To join, click this [invitation to our Slack workspace](https://join.slack.com/t/kleveross/shared_invite/zt-g0eoiyq9-9OwiI7c__oV79bh_94MyTw).
