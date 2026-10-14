# debian9安装shadowsocks libev版

```shell
[root@vultr ~]# sh -c 'printf "deb http://deb.debian.org/debian stretch-backports main" > /etc/apt/sources.list.d/stretch-backports.list'
[root@vultr ~]# apt update
[root@vultr ~]# apt -t stretch-backports install shadowsocks-libev -y
[root@vultr ~]# curl -sL https://deb.nodesource.com/setup_10.x | bash -
[root@vultr ~]# apt-get install -y nodejs

[root@host ~]# npm i -g shadowsocks-manager --unsafe-perm

[root@host ~]# npm i -g pm2

[root@vultr ~]# ss-manager -m aes-256-cfb -u --manager-address 127.0.0.1:6001
[root@host ~]# pm2 --name "ssmanger" -f start ss-manager -x -- -m aes-256-cfb -u --manager-address 127.0.0.1:6001

[root@host ~]# mkdir ~/.ssmgr
[root@host ~]# vi ~/.ssmgr/ss.json
```

```json
{
  "type": "s",
  "shadowsocks": {
    "address": "127.0.0.1:6001"
  },
  "manager": {
    "address": "0.0.0.0:6002",
    "password": "123456"
  },
  "db": "ss.sqlite"
}
```

```shell
[root@host .ssmgr]# ssmgr -c ~/.ssmgr/ss.json
[root@host ~]# pm2 --name "ss-json" -f start ssmgr -x -- -c ~/.ssmgr/ss.json
[root@host .ssmgr]# vi ~/.ssmgr/webgui.json
```

```json
{
  "type": "m",
  "manager": {
    "address": "47.244.162.218:6002",
    "password": "123456"
  },
  "plugins": {
    "flowSaver": {
      "use": true
    },
    "user": {
      "use": true
    },
    "account": {
      "use": true
    },
    "email": {
      "use": true,
      "type": "smtp",
      "username": "bufx@qq.com",
      "password": "iczgevxiljllccai",
      "host": "smtp.qq.com"
    },
    "webgui": {
      "use": true,
      "host": "0.0.0.0",
      "port": "80",
      "site": "http://ssmgr.pryhub.com",
      "gcmSenderId": "456102641793",
      "gcmAPIKey": "AAAAGzzdqrE:XXXXXXXXXXXXXX"
    },
    "webgui_telegram": {
      "use": false,
      "token": "191374681:AAw6oaVPR4nnY7T4CtW78QX-Xy2Q5WD3wmZ"
    }
  },
  "db": "webgui.sqlite",
  "redis": {
    "host": "127.0.0.1",
    "port": 6379,
    "password": "",
    "db": 0
  }
}
```

```shell
[root@host .ssmgr]# ssmgr -c ~/.ssmgr/webgui.json
[root@host ~]# pm2 --name "webguiyml" -f start ssmgr -x -- -c ~/.ssmgr/webgui.json
```

