# 云服务器搭建Bitwarden

## 准备

1. 已按照章节 [云服务器部署博客](https://blog.buubiu.com/2021/09/02/云服务器部署博客)部署

## 安装镜像

```sh
$ docker pull vaultwarden/server:latest
```

## 运行镜像

```sh
$ docker run -d -p 8000:80 \
  -v /data/docker_volumes/vw-data/:/data/ \
  -v /etc/localtime:/etc/localtime \
  -e ADMIN_TOKEN=some_random_token_as_per_above_explanation \
  --restart=always \
  --name buubiu_vaultwarden \
  vaultwarden/server:latest
```

## 配置域名证书

由于需要https，所以需要从厂商下载域名证书到服务器中。

1. 创建相关目录

   ```
   $ mkdir -p /data/docker_volumes/nginx/config/conf.d/pki/bitwarden.buubiu.com
   ```

2. 把`bitwarden.buubiu.pem、bitwarden.buubiu.key`拷贝到`/data/docker_volumes/nginx/congfig/conf.d/pki/bitwarden.buubiu.com`中

## 新建nginx配置

在目录`/data/docker_volumes/nginx/conf.d`创建配置：

**注意：配置文件中不要把注释单独放在一行，一定要放在行尾**

```sh bitwarden.buubiu.conf
# Define the server IP and ports here.
upstream vaultwarden-default { server 10.xx.xx.xx:8000 }
upstream vaultwarden-ws { server 10.xx.xx.xx:3012; }

server {
    listen 80;
    server_name bitwarden.buubiu.com; #需要将yourdomain.com替换成证书绑定的域名。

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name bitwarden.buubiu.com; #需要将yourdomain.com替换成证书绑定的域名。

    ssl_certificate "/etc/nginx/conf.d/pki/bitwarden.buubiu.com/bitwarden.buubiu.com.pem";  #需要将cert-file-name.pem替换成已上传的证书文件的名称。
    ssl_certificate_key "/etc/nginx/conf.d/pki/bitwarden.buubiu.com/bitwarden.buubiu.com.key"; #需要将cert-file-name.key替换成已上传的证书密钥文件的名称。
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; #表示使用的TLS协议的类型。
    ssl_prefer_server_ciphers on;

    client_max_body_size 128M;

    location / {
        proxy_pass http://vaultwarden-default;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
      
    location /notifications/hub {
        proxy_pass http://vaultwarden-ws;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
    }
      
    location /notifications/hub/negotiate {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://vaultwarden-default;
    }

    # Optionally add extra authentication besides the ADMIN_TOKEN
    # If you don't want this, leave this part out
    location /admin {
        # See: https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/
        # auth_basic "Private";
        # auth_basic_user_file /path/to/htpasswd_file;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://vaultwarden-default;
    }
}
```

## 重启nginx

```
$ docker restart buubiu_nginx
```

## 访问

- 前端：https://bitwarden.buubiu.com
- 后端：https://bitwarden.buubiu.com/admin

  
