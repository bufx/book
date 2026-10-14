# oracle数据库导入导出cmd命令

**先切换为 oracle 用户**

```shell
 su - oracle
```

### 1.导出

- 如果是 plsql developer 导出，需要先执行下面语句，让空表可以导出：

```sql
select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0;
```

- 如果是命令 dmp 的导出

```shell
exp 用户/密码@127.0.0.1:1521/orcl file=/opt/data_bak/用户.dmp owner=用户1,用户2  tables=\(table1,table2\)
```

### 2.导入

```shell
imp 用户/密码@127.0.0.1:1521/shec file=/opt/data_bak/用户.dmp ignore=y full=y fromuser=用户1,用户2 tables=(table1)
```
