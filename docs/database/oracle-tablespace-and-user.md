# oracle创建表空间和用户

#### 创建表空间

```sql
create tablespace tp datafile '/opt/app/oracle/oradata/orcl/orclpdb/tp.dbf' size 200 m autoextend on next 10 m maxsize unlimited ;
```
#### 创建用户和赋予相关权限

```sql
-- Create the user
create user 用户名
default tablespace TP
temporary tablespace TEMP
identified by 密码
profile DEFAULT;
-- Grant/Revoke role privileges
grant connect to 用户名;
-- grant dba to 用户名;
grant resource to 用户名;
-- Grant/Revoke system privileges
grant create session to 用户名;
grant delete any table to 用户名;
grant execute any class to 用户名;
grant execute any procedure to 用户名;
grant insert any table to 用户名;
grant select any dictionary to 用户名;
grant select any sequence to 用户名;
grant select any table to 用户名;
grant select any transaction to 用户名;
grant under any table to 用户名;
grant under any type to 用户名;
grant under any view to 用户名;
grant unlimited tablespace to 用户名;
grant update any table to 用户名;
GRANT IMP_FULL_DATABASE to 用户名;
GRANT EXP_FULL_DATABASE to 用户名;

grant create any table to 用户名;
grant drop any table to 用户名;


GRANT debug any procedure, debug connect session TO 用户名;
```
