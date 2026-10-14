# oracle 创建存储过程包（触发器同步用户到LDAP）

### 1. 创建存储过程

```sql
CREATE OR REPLACE PACKAGE BODY LDAP_SYNC_EAC IS

  MY_SESSION DBMS_LDAP.SESSION; -- session对象，用于事务处理

  CONNECT_RETVAL PLS_INTEGER := -1; --用于接收异常代码

  CLOSE_CONNECT_RETVAL PLS_INTEGER := -1; --用于接收异常代码

  --查询未同步的人，00条一处理

  /*CURSOR SELECT_DATA_TABLE(IDNUMBER VARCHAR2) IS

    SELECT S.ID_NUMBER,

           S.USER_PWD,

           S.MOBILE

      FROM SYS_UICM_USER S

     WHERE S.IS_ACTIVE = '1'

       AND S.ID_NUMBER = IDNUMBER

       AND ROWNUM <= 500

     ORDER BY S.ID_NUMBER ASC;

  REC_SELECT_DATA_TABLE SELECT_DATA_TABLE%ROWTYPE;*/

  LDAP_BASE_ITT VARCHAR(256) := 'ou=people,dc=bufx,dc=edu,dc=cn'; --用户的根节点

  ERR_MSG VARCHAR2(1000) := '';

  --连接dap,生成ession

  FUNCTION CONNECT_LDAP RETURN PLS_INTEGER IS

    LDAP_HOST VARCHAR(256) := '127.0.0.1'; --LDAP服务器P地址

    LDAP_PORT VARCHAR(256) := '389'; --LDAP服务器端口

    LDAP_USER VARCHAR(256) := 'cn=admin,dc=bufx,dc=edu,dc=cn'; --管理员n;

    LDAP_PASSWD VARCHAR(256) := '123456'; --管理员密码

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

  BEGIN

    DBMS_LDAP.USE_EXCEPTION := FALSE; --打开异常

    MY_SESSION := DBMS_LDAP.INIT(LDAP_HOST, LDAP_PORT);

    --管理员登陆

    RETVAL := DBMS_LDAP.SIMPLE_BIND_S(MY_SESSION, LDAP_USER, LDAP_PASSWD);

    RETURN RETVAL;

  END CONNECT_LDAP;

  FUNCTION INSERT_LDAP(IN_USER_ID     VARCHAR2,
                       IN_USER_PWD    VARCHAR2,
                       IN_USER_MOBILE VARCHAR2)

   RETURN PLS_INTEGER IS

    MOD_USER VARCHAR2(500); --需要操作的用户帐号

    MY_ARRAY DBMS_LDAP.MOD_ARRAY;

    MY_VALS DBMS_LDAP.STRING_COLLECTION;

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

    LDAP_BASE_USE VARCHAR2(500);

  BEGIN

    LDAP_BASE_USE := LDAP_BASE_ITT;

    MOD_USER := 'cn=' || IN_USER_ID || ',' ||

                LDAP_BASE_USE;

    MY_ARRAY := DBMS_LDAP.CREATE_MOD_ARRAY(20);

    MY_VALS(1) := IN_USER_ID;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_ADD,

                                 'cn',

                                 MY_VALS);

    MY_VALS(1) := IN_USER_ID;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_ADD,

                                 'sn',

                                 MY_VALS);

    MY_VALS(1) := PwdToLdap(IN_USER_PWD);

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_ADD,

                                 'userPassword',

                                 MY_VALS);

    MY_VALS(1) := IN_USER_MOBILE;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_ADD,

                                 'mobile',

                                 MY_VALS);

    MY_VALS(1) := 'inetOrgPerson';

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_ADD,

                                 'objectClass',

                                 MY_VALS);

    /* my_vals(1) := 'organizationalPerson';

    dbms_ldap.populate_mod_array(my_array,

                                 dbms_ldap.MOD_ADD,

                                 'objectClass',

                                 my_vals);*/

    --设置用户的dap对象类这个是在建立epole节点时scc设置的

    --my_vals(1) := 'top';

    --my_vals(2) := 'person';

    --my_vals(3) := 'organizationalPerson';

    --my_vals(4) := 'inetOrgPerson';

    --my_vals(5) := 'dcpPerson';

    /*my_vals(1) := 'inetOrgPerson';

    dbms_ldap.populate_mod_array(my_array,

                                 dbms_ldap.MOD_ADD,

                                 'objectclass',

                                 my_vals);*/

    --添加操作

    RETVAL := DBMS_LDAP.ADD_S(MY_SESSION, MOD_USER, MY_ARRAY);

    --retval如果返回8，代表已经存在此用户

    --释放数组

    DBMS_LDAP.FREE_MOD_ARRAY(MY_ARRAY);

    RETURN RETVAL;

  END INSERT_LDAP;

  FUNCTION DELETE_LDAP(IN_USER_ID VARCHAR2)

   RETURN PLS_INTEGER IS

    MOD_USER VARCHAR2(500); --需要操作的用户帐号

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

    LDAP_BASE_USE VARCHAR2(500);

  BEGIN

    LDAP_BASE_USE := LDAP_BASE_ITT;

    MOD_USER := 'cn=' || IN_USER_ID || ',' || LDAP_BASE_USE;

    RETVAL := DBMS_LDAP.DELETE_S(MY_SESSION, MOD_USER);

    RETURN RETVAL;

  END DELETE_LDAP;

  FUNCTION UPDATE_LDAP(IN_USER_ID     VARCHAR2,
                       IN_USER_PWD    VARCHAR2,
                       IN_USER_MOBILE VARCHAR2)

   RETURN PLS_INTEGER IS

    MOD_USER VARCHAR2(500); --需要操作的用户帐号

    MY_ARRAY DBMS_LDAP.MOD_ARRAY;

    MY_VALS DBMS_LDAP.STRING_COLLECTION;

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

    LDAP_BASE_USE VARCHAR2(500);

  BEGIN

    LDAP_BASE_USE := LDAP_BASE_ITT;

    MOD_USER := 'cn=' || IN_USER_ID || ',' ||

                LDAP_BASE_USE;

    MY_ARRAY := DBMS_LDAP.CREATE_MOD_ARRAY(14);

    MY_VALS(1) := IN_USER_ID;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_REPLACE,

                                 'cn',

                                 MY_VALS);

    MY_VALS(1) := IN_USER_ID;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_REPLACE,
                                 'sn',
                                 MY_VALS);

    MY_VALS(1) := PwdToLdap(IN_USER_PWD);

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_REPLACE,

                                 'userPassword',

                                 MY_VALS);

    MY_VALS(1) := IN_USER_MOBILE;

    DBMS_LDAP.POPULATE_MOD_ARRAY(MY_ARRAY,

                                 DBMS_LDAP.MOD_REPLACE,

                                 'mobile',

                                 MY_VALS);

    --修改操作

    RETVAL := DBMS_LDAP.MODIFY_S(MY_SESSION, MOD_USER, MY_ARRAY);

    --释放数组

    DBMS_LDAP.FREE_MOD_ARRAY(MY_ARRAY);

    RETURN RETVAL;

  END UPDATE_LDAP;

  ---USER_ID 用户登录账号
  ---USER_ACTIVE 是否有效
  ---OP_TYPE 操作类型
  PROCEDURE SYNC_PERSON(USER_ID     VARCHAR2,
                        USER_PWD    VARCHAR2,
                        USER_MOBILE VARCHAR2,
                        OP_TYPE     VARCHAR2) AS

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

  BEGIN

    --开始连接dap，生成ession，如果连接不成功，则退出程序

    CONNECT_RETVAL := CONNECT_LDAP;

    --DBMS_OUTPUT.PUT_LINE('开始连接ldap');

    IF CONNECT_RETVAL = 0 THEN

      IF OP_TYPE = 'INT' THEN

        RETVAL := INSERT_LDAP(USER_ID, USER_PWD, USER_MOBILE);

      ELSIF OP_TYPE = 'UPT' THEN

        RETVAL := UPDATE_LDAP(USER_ID, USER_PWD, USER_MOBILE);

      ELSIF OP_TYPE = 'DEL' THEN

        RETVAL := DELETE_LDAP(USER_ID);

      END IF;

    ELSE

      DBMS_OUTPUT.PUT_LINE('ldap连接失败);

    END IF;

    --关闭dap连接的ession

    CLOSE_CONNECT_RETVAL := DBMS_LDAP.UNBIND_S(MY_SESSION);

  EXCEPTION

    WHEN OTHERS THEN

      ERR_MSG := 'ERR:' || TO_CHAR(SQLCODE) || ' ' || SQLERRM;

      DBMS_OUTPUT.PUT_LINE('系统出错的日志为' || ERR_MSG);

  END SYNC_PERSON;

/*PROCEDURE SYNC_PERSON(USER_ID VARCHAR2, OP_TYPE VARCHAR2) AS

    --记数器

    I NUMBER := 0;

    RETVAL PLS_INTEGER := -1; --用于接受异常代码

  BEGIN

    --开始读数据

    IF SELECT_DATA_TABLE%ISOPEN THEN

      CLOSE SELECT_DATA_TABLE;

    END IF;

    OPEN SELECT_DATA_TABLE(USER_ID);

    LOOP

      FETCH SELECT_DATA_TABLE

        INTO REC_SELECT_DATA_TABLE;

      IF SELECT_DATA_TABLE%NOTFOUND THEN

        CLOSE SELECT_DATA_TABLE;

        EXIT;

      ELSE

        --首次读数据开始连接ldap，生成ession，如果连接不成功，则退出程序

        IF I = 0 THEN

          CONNECT_RETVAL := CONNECT_LDAP;

          DBMS_OUTPUT.PUT_LINE('开始连接ldap');

        END IF;

        IF CONNECT_RETVAL = 0 THEN

          DBMS_OUTPUT.PUT_LINE('开始进行业务操作 || I);

          IF OP_TYPE = 'INT' THEN

            RETVAL := INSERT_LDAP(REC_SELECT_DATA_TABLE);

          ELSIF OP_TYPE = 'UPT' THEN

            RETVAL := UPDATE_LDAP(REC_SELECT_DATA_TABLE);

          ELSIF OP_TYPE = 'DEL' THEN

            RETVAL := DELETE_LDAP(REC_SELECT_DATA_TABLE);

          END IF;

        ELSE

          DBMS_OUTPUT.PUT_LINE('ldap连接失败);

          EXIT;

        END IF;

        \*sync_person_over(rec_select_data_table, retval);*\

        I := I + 1;

      END IF;

    END LOOP;

    IF I > 0 THEN

      --关闭dap连接的ession

      CLOSE_CONNECT_RETVAL := DBMS_LDAP.UNBIND_S(MY_SESSION);

    END IF;

  EXCEPTION

    WHEN OTHERS THEN

      ERR_MSG := 'ERR:' || TO_CHAR(SQLCODE) || ' ' || SQLERRM;

      DBMS_OUTPUT.PUT_LINE('系统出错的日志为' || ERR_MSG);

  END SYNC_PERSON;*/

END LDAP_SYNC_EAC;
```

### 2.创建存储过程（初始化用户到 LDAP）

```sql
CREATE OR REPLACE PACKAGE LDAP_SYNC_EAC IS


  PROCEDURE SYNC_PERSON(USER_ID     VARCHAR2,
                        USER_PWD    VARCHAR2,
                        USER_MOBILE VARCHAR2,
                        OP_TYPE     VARCHAR2);


END LDAP_SYNC_EAC;
```

### 3.添加触发器

```sql
create or replace trigger tr_sys_uicm_user_eac after insert or update or DELETE
on sys_uicm_user FOR EACH ROW
DECLARE
  --这里是关键的地方，在变量申明的地方，指定自定义事务处理。
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
  IF INSERTING THEN
    --INSERT触发
    --启用插入DAP
    IF :NEW.IS_ACTIVE = '1' THEN
      LDAP_SYNC_EAC.SYNC_PERSON(:NEW.ID_NUMBER,
                            :NEW.USER_PWD,
                            :NEW.MOBILE,
                            'INT');
    END IF;

  ELSIF UPDATING THEN

    --UPDATE触发
    IF :NEW.IS_ACTIVE = '1' AND :NEW.IS_DEL = '0' THEN
      IF :OLD.IS_ACTIVE = '1' AND :OLD.IS_DEL = '0' THEN
        LDAP_SYNC_EAC.SYNC_PERSON(:NEW.ID_NUMBER,
                              :NEW.USER_PWD,
                              :NEW.MOBILE,
                              'UPT');
       ELSE
         LDAP_SYNC_EAC.SYNC_PERSON(:NEW.ID_NUMBER,
                              :NEW.USER_PWD,
                              :NEW.MOBILE,
                              'INT');
      END IF;
    ELSE
      LDAP_SYNC_EAC.SYNC_PERSON(:NEW.ID_NUMBER, '', '', 'DEL');
    END IF;

  ELSIF DELETING THEN
    --DELETE触发
    LDAP_SYNC_EAC.SYNC_PERSON(:OLD.ID_NUMBER,'','', 'DEL');

  END IF;
END;
```
