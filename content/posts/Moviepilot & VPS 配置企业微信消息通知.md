+++
title = 'Moviepilot & VPS 配置微信消息通知'
date = 2024-10-18T22:37:44+08:00
description = "使用frp内网穿透，在无公网的情况下接收微信通知"
tags = ["nas","pt","frp","vps"]
+++

在企业微信应用那边，需要设置“可信ip”或者绑定域名（需要认证），作为个人用户自然是只能绑定ip。那么家宽由于公网肯定不合适：每次重新拨号大概率会分配到一个新的ip，需要重新设置绑定可信ip，为了解决这个问题，可以使用内网穿透工具来实现ip地址固定。比如zerotier、frp。这里以frp为例。  

目的是实现从：  

去程：微信客户端->🐧服务器->NAS  
回程：NAS->🐧服务器->微信客户端  

变成：

去程：微信客户端->🐧服务器->NAS  
NAS->VPS->🐧服务器->微信客户端  

## 服务端

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

## 客户端

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

## moviepilot设置

新增一条环境变量```WECHAT_PROXY: http://qyapi.weixin.qq.com:81```

## 修改host

修改`qyapi.weixin.qq.com`的 host为vps的ip
