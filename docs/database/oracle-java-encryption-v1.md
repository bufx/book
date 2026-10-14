# oracle 存储过程执行java进行密码加密成LDAP方式

#### 步骤

##### 1.先写 java

```java
import sun.misc.BASE64Encoder;


public class PwdToLdap {

    public static String ldapSHA(String pwd) {
        byte[] md = hexStringTobyteArray(pwd);
        return "{SHA}" + (new BASE64Encoder()).encode(md);
    }

    public static byte[] hexStringTobyteArray(String str) {
        if(str == null || str.trim().equals("")) {
            return new byte[0];
        }


        byte[] bytes = new byte[str.length() / 2];
        for(int i = 0; i < str.length() / 2; i++) {
            String subStr = str.substring(i * 2, i * 2 + 2);
            bytes[i] = (byte) Integer.parseInt(subStr, 16);
        }
        return bytes;
    }


}
```

##### 2.把相关包拷贝到当前目录下（rt.jar）

##### 3.查询 oracle 的 jdk 版本

```sql
CREATE OR REPLACE FUNCTION get_java_property (prop IN VARCHAR2)
RETURN VARCHAR2 IS LANGUAGE JAVA
name 'java.lang.System.getProperty(java.lang.String) return java.lang.String';


SELECT get_java_property('java.version') FROM dual;
```

##### 4.javac 执行编译（要用 oracle 自带的 jdk，因为版本不一致的话 loadjava 报错）

```shell
D:\app\oracle\Administrator\product\11.2.0\dbhome_1\jdk\bin>javac -classpath F:\
bufx\rt.jar F:\bufx\PwdToLdap.java
```

##### 5.loadjava 导入到 oracle 中

```shell
F:\bufx>loadjava -r -f -u sys/123456@192.168.2.110:1521/orcl -v PwdToLdap.class
```

##### 6.sql 查询是否存在 Java

```sql
SELECT * FROM USER_OBJECTS WHERE OBJECT_TYPE ='JAVA CLASS'order by created desc;
```

##### 7.写存储过程

```sql
CREATE OR REPLACE FUNCTION PwdToLdap(str in varchar2)  RETURN VARCHAR2 AS LANGUAGE JAVA NAME 'PwdToLdap.ldapSHA (java.lang.String) return java.lang.String';
```

##### 8.执行存储过程（两种方法）

###### 8.1 直接查询

```sql
SELECT PwdToLdap('18dacbf7db89381473a754b4d76b0c3f03749ecc') FROM dual;
```

###### 8.2 sqlplus 执行

```
SQL> VARIABLE myString VARCHAR2(20);
SQL> CALL PwdToLdap('18dacbf7db89381473a754b4d76b0c3f03749ecc') INTO :myString;
Method called
myString
---------
{SHA}GNrL99uJOBRzp1S012sMPwN0nsw=


SQL> PRINT myString;
myString
---------
{SHA}GNrL99uJOBRzp1S012sMPwN0nsw=


SQL>
```

##### 9.删除 java 类

```shell
dropjava -u sys/123456@192.168.2.110:1521/orcl -v -resolve PwdToLdap.class
```
