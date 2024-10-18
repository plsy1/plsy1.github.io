+++
title = 'Hello'
date = 2024-10-18T22:37:44+08:00
draft = false
+++

### 换源

```shell
bash <(curl -sSL https://linuxmirrors.cn/main.sh)
```

### 安装 docker

```shell
apt update -y &&
apt upgrade -y &&
apt install apparmor apparmor-utils -y &&
apt install curl -y &&
curl -fsSL https://get.docker.com -o get-docker.sh &&
sh get-docker.sh &&
timedatectl set-timezone Asia/Shanghai

1.1 Debian使用阿里源实现Docker安装

apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/debian/gpg | apt-key add -
add-apt-repository "deb [arch=amd64 trusted=yes] https://mirrors.aliyun.com/docker-ce/linux/debian $(lsb_release -cs) stable"

#或者 直接

echo "deb [arch=amd64 trusted=yes] https://mirrors.aliyun.com/docker-ce/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker-ce.list
apt update -y
apt install docker-ce -y
systemctl start docker
systemctl enable docker
```

### 安装 [itzg/minecraft-server](https://hub.docker.com/r/itzg/minecraft-server)

```shell
docker run  -p 25565:25565 --name mc -v /mc-data:/data  -e EULA=TRUE dockerproxy.cn/itzg/minecraft-server
```

