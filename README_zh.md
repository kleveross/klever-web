# klever web

[English](./README.md) | 中文

Klever Web 是 [Klever Model Registry](https://github.com/kleveross/klever-model-registry) 的前端界面

## 开始

### 构建镜像

```
$ git clone https://github.com/kleveross/klever-web.git
$ cd klever-web
```

Install dependencies：

```bash
$ yarn
```

Start the dev server：

```bash
$ yarn start
```

## Installation

### 编译镜像

```
$ yarn run build
$ docker build -t lever-dev.cargo.io/release/klever-web:v0.0.3 .
```

### 运行

```
$ docker run -p 8888:8080 -d lever-dev.cargo.io/release/klever-web:v0.0.3
```

### 部署

请参考 [docs/docs_zh/installation.md](docs/docs_zh/installation.md)

如果想快速部署验证，可使用脚本按照如下安装步骤安装。

```bash
$ wget https://raw.githubusercontent.com/kleveross/klever-web/master/scripts/installation/install.sh
$ bash install.sh <master-ip>
```

## 社区

klever-web 是 Klever 云原生机器学习平台的子项目，Klever 的 Slack 是 klever.slack.com. 请利用[这一邀请链接](https://join.slack.com/t/kleveross/shared_invite/zt-g0eoiyq9-9OwiI7c__oV79bh_94MyTw)加入 Slack 讨论。
