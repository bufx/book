# open ldap 创建只读用户

#### 1.生成密码

```shell
[root@ldap01 opt]# slappasswd -s 123456
{SSHA}abZPY3cWgMMtnNqtFyuX64xq7Mm0TNFd
```

#### 2.创建 ldif 文件

```shell
[root@ldap01 opt]# cat test.ldif
dn: cn=uservpn,dc=bufx,dc=gov,dc=cn
cn: uservpn
sn: vpn
userPassword: {SSHA}abZPY3cWgMMtnNqtFyuX64xq7Mm0TNFd
objectClass: inetOrgPerson
objectClass: organizationalPerson
[root@ldap01 opt]#
```

#### 3.执行 ldif 文件

```shell
[root@ldap01 opt]# ldapadd -x -D "cn=admin,dc=bufx,dc=gov,dc=cn" -W -f test.ldif
Enter LDAP Password:  admin的密码
adding new entry "cn=uservpn,dc=bufx,dc=gov,dc=cn"
[root@ldap01 opt]#
```
