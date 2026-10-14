# WebLogic 安装补丁

> 1. Oracle 官方于美国时间 2020 年 7 月 14 日将发布大规模的季度补丁更新，以修补多达 433 个的新安全漏洞。  
> 2. 本次以 `WebLogic` 安装补丁为例  
> 3. 执行命令之前做好代码的备份

## 解压对应的压缩包

从官方找到对应的漏洞补丁压缩包，如：`p31178516_121300_Generic.zip`,并解压到目录。

## 授权目录

对解压后的补丁目录和 `weblogic` 目录赋予 `weblogic` 权限

## 停止服务

停止服务并做好相关备份

## 执行 `attachHome.sh` 文件

切换 `weblogic` 用户，执行: `/opt/weblogic/oui/bin/attachHome.sh`（如果之前执行过，就不需要执行了）

说明： `/opt/weblogic/` 为我的安装目录。

## 执行 `opatch` 命令

进入补丁解压后的目录，执行：`/opt/weblogic/OPatch/opatch apply -jdk /opt/java/jdk1.7.0_79`

## 验证补丁是否安装成功

验证版本：`/opt/weblogic/OPatch/opatch lsinventory`
