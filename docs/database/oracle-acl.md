# oracle ACL 操作

```sql
begin
  dbms_network_acl_admin.create_acl (       -- 创建访问控制文件（CL）
    acl         => 'httprequestpermission.xml',          -- 文件名称
    description => 'HTTP Access',           -- 描述
    principal   => 'user',                   -- 授权或者取消授权账号，大小写敏感
    is_grant    => TRUE,                    -- 授权还是取消授权
    privilege  => 'connect',               -- 授权或者取消授权的权限列表
    start_date  => null,                    -- 起始日期
    end_date    => null                    -- 结束日期
  );
   commit;
end;
begin
  dbms_network_acl_admin.add_privilege (    -- 添加访问权限列表项
    acl        => 'httprequestpermission.xml',           -- 刚才创建的cl名称
    principal  => 'user',                    -- 授权或取消授权用户
    is_grant   => TRUE,                     -- 与上同
    privilege  => 'resolve',                -- 权限列表
    start_date => null,
    end_date   => null
  );
  commit;
end;
begin
  dbms_network_acl_admin.assign_acl (       -- 该段命令意思是允许访问cl名为tl_http.xml下授权的用户，使用racle网络访问包，所允许访问的目的主机，及其端口范围。
    acl        => 'httprequestpermission.xml',
    host       => '127.0.0.1',              -- ip地址或者域名，填写ttps://localhost:9000/hello与ttps://localhost:9000/是会报ost无效的
                                            -- 且建议使用p地址或者使用域名，若用ocalhost，当racle不是安装在本机上的情况下，会出现问题
    lower_port => 389,                     -- 允许访问的起始端口号
    upper_port => Null                      -- 允许访问的截止端口号
  );
  commit;
end;
```
