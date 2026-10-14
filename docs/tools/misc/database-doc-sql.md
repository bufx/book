# 书写数据库文档辅助SQL

### 快速生成类似表格

|    代码     | 数据类型 | 数据长度 | 是否为空 | 默认值 |  备注  |
| :---------: | :------: | :------: | :------: | :----: | :----: |
| RESOURCE_ID | VARCHAR2 |    32    |    N     |        | 流水号 |

```sql
SELECT tt.column_name  代码,
       tt.data_type    数据类型,
       tt.data_length  数据长度,
       tt.nullable     是否为空,
       tt.data_default 默认值,
       t.comments      备注
FROM (select * from dba_col_comments where Table_Name = '表名' AND OWNER = '数据库用户名') t,
     (SELECT a.column_name, a.data_type, a.data_length, a.nullable, a.data_default
      FROM dba_tab_columns a
      WHERE a.Table_Name = '表名'
      AND OWNER = '数据库用户名'
      ORDER BY a.column_id) tt
WHERE t.column_name = tt.column_name;
```

### 创建字典表

```sql
CREATE TABLE DICT_XXX
(
  CODEVALUE VARCHAR2(4) NOT NULL
, CODENAME VARCHAR2(200)
, EXT1 VARCHAR2(200)
, EXT2 VARCHAR2(200)
, IS_VALID VARCHAR2(1) DEFAULT 1
, ORDERATTR NUMBER
, CONSTRAINT DICT_XXX_PK PRIMARY KEY
  (
    CODEVALUE
  )
  ENABLE
)
TABLESPACE 表空间;
COMMENT ON TABLE DICT_XXX IS '表备注';
COMMENT ON COLUMN DICT_XXX.CODEVALUE IS '码值';
COMMENT ON COLUMN DICT_XXX.CODENAME IS '码名';
COMMENT ON COLUMN DICT_XXX.EXT1 IS '扩展字段1';
COMMENT ON COLUMN DICT_XXX.EXT2 IS '扩展字段2';
COMMENT ON COLUMN DICT_XXX.IS_VALID IS '是否有效1:有';
COMMENT ON COLUMN DICT_XXX.ORDERATTR IS '排序字段';
```

### 生成常用字段

```sql
ALTER TABLE 用户名.表名 ADD CREATE_USER VARCHAR2(32) ;
COMMENT ON COLUMN 用户名.表名.CREATE_USER IS '创建人' ;
ALTER TABLE 用户名.表名 ADD CREATE_TIME DATE;
COMMENT ON COLUMN 用户名.表名.CREATE_TIME IS '创建时间' ;
ALTER TABLE 用户名.表名 ADD MODIFY_USER VARCHAR2(32) ;
COMMENT ON COLUMN 用户名.表名.MODIFY_USER IS '修改人' ;
ALTER TABLE 用户名.表名 ADD MODIFY_TIME DATE ;
COMMENT ON COLUMN 用户名.表名.MODIFY_TIME IS '修改时间’ ;
```

### 生成表所有字段的创建 SQL 语句

```sql
SELECT 'alter table 现表名 add ' || tt.column_name || ' '|| tt.data_type || '('|| tt.data_length ||');' as colum,
       'comment on column 现表名.' || tt.column_name || ' is ' || '''' || t.comments ||'''' as comm
FROM (select * from dba_col_comments where Table_Name = '原表名' AND OWNER = '用户名') t,
     (SELECT a.column_name, a.data_type, a.data_length, a.nullable, a.data_default
      FROM dba_tab_columns a
      WHERE a.Table_Name = '原表名'
        AND OWNER = '用户名'
      ORDER BY a.column_id) tt
WHERE t.column_name = tt.column_name;
```
