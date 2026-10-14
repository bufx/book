# 升级Hexo以及主题步骤

## 升级Hexo

> 比如本次更新为7.3.0

### 查看最新hexo生成的依赖版本

在其他目录重新初始化hexo项目

```sh
$ npm install hexo@latest
$ npx hexo init test
```

查看test目录里面的package.json，比较里面的依赖版本，有没有大版本升级（比如从0.0.1升级到了2.0.0）就需要在老项目改一下前版本号

### 执行npm命令查看依赖版本

可以通过npm查看依赖版本来进一步确认是否需要升级

```sh
$ npm outdated
$ npm uptate
$ rm -f node_modules package-lock.json
$ npm install
```

## 升级主题

直接到theme目录里面git升级即可

```sh
$ cd theme/XXXX
$ git checkout master
$ git fetch upstream
$ git merge upstream
$ git fetch --tags
$ git merge upstream --tags
$ git checkout develop
$ git merge TAG
$ git push origin
```

## 升级完成

重新生成静态文件 启动

```sh
$ npx hexo clean
$ npx hexo g && npx hexo d
```

