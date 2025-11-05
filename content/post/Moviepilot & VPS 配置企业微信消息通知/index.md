+++
title = 'Moviepilot & VPS 配置微信消息通知'
date = 2024-10-18T22:37:44+08:00
tags = ["NAS","PT"]
categories = ["笔记"]
+++

在企业微信的应用配置中，需要设置“可信 IP”或绑定已认证的域名。对于个人用户，通常只能选择绑定 IP 地址。家用宽带要么没有公网，要么公网 IP 是动态分配的，每次重新拨号后可能会获得一个新的 IP，这意味着需要频繁地更新“可信 IP”设置，非常不方便。

考虑将原来的数据通信路径：

- **去程**：微信客户端 → 腾讯服务器 → NAS

- **回程**：NAS → 腾讯服务器 → 微信客户端

通过引入 VPS 后，变为以下路径：

- **去程**：微信客户端 → 腾讯服务器 → NAS（有公网的情况）

- **回程**：NAS → VPS → 腾讯服务器 → 微信客户端

如此一来只需要绑定 VPS 的 IP，这里以 frp 为例进行配置，使用zerotier应该也能实现。

## 服务端配置

### 安装frps


{{< highlight bash >}}
wget https://raw.githubusercontent.com/mvscode/frps-onekey/master/install-frps.sh -O ./install-frps.sh
chmod 700 ./install-frps.sh
./install-frps.sh install
{{< /highlight >}}

一直按enter即可。

### 安装微信中转代理

{{< highlight bash >}}
apt upgrade -y &&
apt install curl -y &&
curl -fsSL https://get.docker.com -o get-docker.sh &&
sh get-docker.sh &&
timedatectl set-timezone Asia/Shanghai && docker run -d \
--name wxchat \
--restart=always \
-p 81:80 \
ddsderek/wxchat:latest
{{< /highlight >}}

## 客户端配置

### docker 安装 frpc

#### 编辑`frpc.toml`

{{< highlight toml >}}
serverAddr = ""
serverPort = 5443
auth.method = "token"
auth.token = "" ##token

log.to = "/frp/logs/frpc.log"
log.level = "info"
log.maxDays = 180
log.disablePrintColor = false

[[proxies]]
name = "moviepilot"
type = "http"
localIP = "1.1.1.1" ##moviepilot的局域网ip
localPort = 3000
customDomains = [""] ##不绑定域名的话可以直接填vps的ip
transport.useEncryption = true
transport.useCompression = false
{{< /highlight >}}

#### docker-compose

{{< highlight yaml >}}
services:
  frpc:
    image: snowdreamtech/frpc:latest
    container_name: frpc
    restart: always
    network_mode: host
    volumes:
      - ./frpc.toml:/etc/frp/frpc.toml:ro
            - ./logs:/frp/logs
{{< /highlight >}}

## 其他设置

1. moviepilot新增一条环境变量```WECHAT_PROXY: http://qyapi.weixin.qq.com:81```

2. 修改`qyapi.weixin.qq.com`的 host为vps的ip

