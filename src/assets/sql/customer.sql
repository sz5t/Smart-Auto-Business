-- CreateLayout
--------------------------------------------------------------------------------
INSERT INTO LAYOUT_SETTING
(
  id,
  module_id,
  name,
  template,
  template_img,
  enabled,
  metadata,
  description,
  project_id,
  customer_id,
  create_date,
  create_user_id,
  last_update_date,
  last_updated_user_id
)
SELECT
  Id,
  module_id,
  name,
  template,
  template_img,
  enabled,
  metadata,
  description,
  project_id,
  customer_id,
  create_date,
  create_user_id,
  last_update_date,
  last_updated_user_id
FROM LAYOUT_SETTING_BUFFER WHERE buffer_Id = $BufferId$


INSERT INTO BLOCK_SETTING
(
  id,
  layout_id,
  parent_id,
  title,
  icon,
  type,
  area,
  span,
  size,
  metadata,
  show_title,
  project_id,
  customer_id,
  create_date,
  create_user_id,
  last_update_date,
  last_updated_user_id
)
SELECT
  id,
  layout_id,
  parent_id,
  title,
  icon,
  type,
  area,
  span,
  size,
  metadata,
  show_title,
  project_id,
  customer_id,
  create_date,
  create_user_id,
  last_update_date,
  last_updated_user_id
FROM BLOCK_SETTING_BUFFER WHERE buffer_Id = $BufferId$
---------------------------------------------------------------------------

-- UpdateLayout
---------------------------------------------------------------------------
UPDATE l SET
	l.name = b.name,
	l.template_img = b.template_img,
	l.template = b.template,
	l.project_id = b.project_id,
	l.module_id = b.module_id,
	l.metadata = b.metadata,
	l.last_update_date = b.last_update_date,
	l.last_updated_user_id = b.last_updated_user_id,
	l.enabled = b.enabled,
	l.description = b.description,
	l.customer_id = b.customer_id
FROM LAYOUT_SETTING AS l, LAYOUT_SETTING_BUFFER AS b
WHERE l.id = b.id AND b.id = $LayoutId$

UPDATE a SET
	 a.type = f.type,
	 a.title = f.title,
	 a.span = f.span,
	 a.size = f.size,
	 a.show_title = f.show_title,
	 a.project_id = f.project_id,
	 a.parent_id = f.parent_id,
	 a.metadata = f.metadata,
	 a.last_update_date = f.last_update_date,
	 a.last_updated_user_id = f.last_updated_user_id,
	 a.icon = f.icon,
	 a.customer_id = f.customer_id,
	 a.area = f.area
FROM BLOCK_SETTING AS a, BLOCK_SETTING_BUFFER AS f
WHERE a.id = f.id AND a.layout_id = $LayoutId$
-----------------------------------------------------------------------------


-- VIEW_SETTING--------------------------------------------------------------
INSERT INTO VIEW_SETTING
(
  TITLE,
  COMPONENT,
  LAYOUT_ID,
  TYPE,
  BLOCK_ID,
  PARENT_ID,
  METADATA,
  ID,
  CUSTOMER_ID,
  PROJECT_ID,
  CREATE_DATE,
  LAST_UPDATE_DATE,
  CREATE_USER_ID,
  LAST_UPDATE_USER_ID
)
SELECT
  TITLE,
  COMPONENT,
  LAYOUT_ID,
  TYPE,
  BLOCK_ID,
  PARENT_ID,
  METADATA,
  ID,
  CUSTOMER_ID,
  PROJECT_ID,
  CREATE_DATE,
  LAST_UPDATE_DATE,
  CREATE_USER_ID,
  LAST_UPDATE_USER_ID
FROM VIEW_SETTING_BUFFER WHERE BUFFER_ID = $BufferId$
-----------------------------------------------------------------------------

-- UPDATE VIEW_SETTING
UPDATE a SET
  a.ID = b.ID,
  a.BLOCK_ID = b.BLOCK_ID,
  a.COMPONENT = b.COMPONENT,
  a.CREATE_USER_ID = b.CREATE_USER_ID,
  a.CREATE_DATE = b.CREATE_DATE,
  a.CUSTOMER_ID = b.CUSTOMER_ID,
  a.METADATA = b.METADATA,
  a.TYPE = b.TYPE,
  a.LAYOUT_ID = b.LAYOUT_ID,
  a.PARENT_ID = b.PARENT_ID,
  a.TITLE = b.TITLE,
  a.PROJECT_ID = b.PROJECT_ID,
  a.LAST_UPDATE_DATE = b.LAST_UPDATE_DATE,
  a.LAST_UPDATE_USER_ID = b.LAST_UPDATE_USER_ID
FROM VIEW_SETTING AS a, VIEW_SETTING_BUFFER as b
WHERE a.ID = b.ID AND b.LAYOUT_ID = $LayoutId$







-- Component Tree -------------------------------------------------------------
SELECT
  Id,
  PARENT_ID,
  TITLE,
  LAYOUT_ID,
  TYPE
     --  ,[AREA]
     --  ,[CREATE_TIME]
     --  ,[ICON]
     --  ,[METADATA]
     --  ,[PLAT_CUSTOMER_ID]
     --  ,[PROJ_ID]
     --  ,[SIZE]
     --  ,[SPAN]
FROM BLOCK_SETTING
WHERE LAYOUT_ID = '2349a7fc1f0a4fa39cb595e19fb4de62'
UNION ALL
SELECT
  Id,
  BLOCK_ID as PARENT_ID,
  TITLE as TITLE,
  PARENT_ID as LAYOUT_ID,
  TYPE
      --  ,[METADATA]
      --  ,[PLAT_CUSTOMER_ID]
      --  ,[PROJ_ID]
      --  ,[TITLE]
      --  ,[CREATE_TIME]
FROM VIEW_SETTING_BUFFER
WHERE LAYOUT_ID = '2349a7fc1f0a4fa39cb595e19fb4de62'
---------------------------------------------------------------------------------

--Add Or Update ViewSetting-------------------------------------------------------------------------------
DECLARE @hasViewSetting INT
SET @hasViewSetting = 0
SELECT  @hasViewSetting = COUNT(1) FROM VIEW_SETTING WHERE LAYOUT_ID = '94658be5cb364e2da995cf4354b9e385'

IF @hasViewSetting > 0
BEGIN
  UPDATE a SET
    a.ID = b.ID,
    a.BLOCK_ID = b.BLOCK_ID,
    a.COMPONENT = b.COMPONENT,
    a.CREATE_USER_ID = b.CREATE_USER_ID,
    a.CREATE_DATE = b.CREATE_DATE,
    a.CUSTOMER_ID = b.CUSTOMER_ID,
    a.METADATA = b.METADATA,
    a.TYPE = b.TYPE,
    a.LAYOUT_ID = b.LAYOUT_ID,
    a.PARENT_ID = b.PARENT_ID,
    a.TITLE = b.TITLE,
    a.PROJECT_ID = b.PROJECT_ID,
    a.LAST_UPDATE_DATE = b.LAST_UPDATE_DATE,
    a.LAST_UPDATE_USER_ID = b.LAST_UPDATE_USER_ID
  FROM VIEW_SETTING AS a, VIEW_SETTING_BUFFER as b
  WHERE a.ID = b.ID AND b.LAYOUT_ID = '94658be5cb364e2da995cf4354b9e385'
END
ELSE
BEGIN
  INSERT INTO VIEW_SETTING
  (
    TITLE,
    COMPONENT,
    LAYOUT_ID,
    TYPE,
    BLOCK_ID,
    PARENT_ID,
    METADATA,
    ID,
    CUSTOMER_ID,
    PROJECT_ID,
    CREATE_DATE,
    LAST_UPDATE_DATE,
    CREATE_USER_ID,
    LAST_UPDATE_USER_ID
  )
  SELECT
    TITLE,
    COMPONENT,
    LAYOUT_ID,
    TYPE,
    BLOCK_ID,
    PARENT_ID,
    METADATA,
    ID,
    CUSTOMER_ID,
    PROJECT_ID,
    CREATE_DATE,
    LAST_UPDATE_DATE,
    CREATE_USER_ID,
    LAST_UPDATE_USER_ID
  FROM VIEW_SETTING_BUFFER WHERE LAYOUT_ID = '94658be5cb364e2da995cf4354b9e385'
END

-----------------------------------------------------------------------
CREATE PROCEDURE DEL_SHOWCASE
  @isCheck BIT,
  @Ids VARCHAR(2500),
  @Message VARCHAR(200) OUTPUT
AS
DECLARE @Result TABLE
(
  ID VARCHAR(32),
  CASE_NAME VARCHAR(64),
  CASE_COUNT INT,
  CASE_LEVEL INT,
  ENABLE_TEXT VARCHAR(255),
  CASE_TYPE_TEXT VARCHAR(255),
  DELETE_STATUS VARCHAR(255),
  DELETE_MESSAGE VARCHAR(255)
)
DECLARE @tempTable TABLE
(
  ID varchar(32)
)

INSERT INTO @tempTable(ID)
SELECT
  value
FROM
  [dbo].F_Split(@Ids,',')

IF (@isCheck = 1)
  BEGIN
    IF EXISTS (SELECT CASE_NAME FROM SHOW_CASE
    WHERE ID IN (SELECT ID FROM @tempTable)
          AND ENABLED = '1')
    BEGIN
      SET @Message = 'error:删除操作存在启用的数据，是否继续删除'
    END
	ELSE
	BEGIN
	  SET @Message = 'success:可以删除'
	END
  END
ELSE
  BEGIN
    /*
    * 可删除结果集
    */
    INSERT INTO @Result
    (
      ID,
      CASE_NAME,
      CASE_COUNT,
      CASE_LEVEL,
      ENABLE_TEXT,
      CASE_TYPE_TEXT,
      DELETE_STATUS,
      DELETE_MESSAGE
    )
    SELECT
      A.ID,
      A.CASE_NAME,
      A.CASE_COUNT,
      A.CASE_LEVEL,
      CASE A.ENABLED
        WHEN 1 THEN '启用'
        WHEN 0 THEN '禁用'
        END AS ENABLE_TEXT,
      CASE A.CASE_TYPE
        WHEN '1' THEN '表格'
        WHEN '2' THEN '组件树'
        WHEN '3' THEN '树表'
        WHEN '4' THEN '表单'
        WHEN '5' THEN '标签页'
        END AS CASE_TYPE_TEXT,
      '已删除' AS DELETE_STATUS,
      '无' AS DELETE_MESSAGE
    FROM
      SHOW_CASE AS A LEFT JOIN @tempTable AS B
      ON A.ID = B.ID
    WHERE A.ID IN (
      SELECT
        ID
      FROM SHOW_CASE
      WHERE ID NOT IN (PARENT_ID) AND ENABLED = 0
    )
    UNION ALL
    SELECT
      A.ID,
      A.CASE_NAME,
      A.CASE_COUNT,
      A.CASE_LEVEL,
      CASE A.ENABLED
        WHEN 1 THEN '启用'
        WHEN 0 THEN '禁用'
        END AS ENABLE_TEXT,
      CASE A.CASE_TYPE
        WHEN '1' THEN '表格'
        WHEN '2' THEN '组件树'
        WHEN '3' THEN '树表'
        WHEN '4' THEN '表单'
        WHEN '5' THEN '标签页'
        END AS CASE_TYPE_TEXT,
      '未删除' AS DELETE_STATUS,
      '包含子节点或已启用' AS DELETE_MESSAGE
    FROM
      SHOW_CASE AS A LEFT JOIN @tempTable AS B
      ON A.ID = B.ID
    WHERE A.ID IN (
      SELECT
        ID
      FROM SHOW_CASE
      WHERE ID IN (PARENT_ID) OR ENABLED = 1
    )

    DELETE FROM SHOW_CASE
    WHERE ID IN (
        SELECT ID FROM @Result
        WHERE DELETE_STATUS = '已删除'
    )

    SELECT
      ID,
      CASE_NAME,
      CASE_COUNT,
      CASE_LEVEL,
      ENABLE_TEXT,
      CASE_TYPE_TEXT,
      DELETE_STATUS,
      DELETE_MESSAGE
    FROM @Result

    SET @Message = 'success:操作完成'
    /*
    未删除结果集
    */
  END
--验证检查---------------------------------------------------------------------------------------
CREATE PROCEDURE DEL_SHOWCASE
  @Ids VARCHAR(2500),
  @Message VARCHAR(200) OUTPUT
AS
DECLARE @tempTable TABLE
(
  ID varchar(32)
)

INSERT INTO @tempTable(ID)
SELECT
  value
FROM
  [dbo].F_Split(@Ids,',')

IF EXISTS (SELECT CASE_NAME FROM SHOW_CASE
    WHERE ID IN (SELECT ID FROM @tempTable) AND ENABLED = '1')
BEGIN
  SET @Message = 'error:删除操作存在启用的数据，是否继续删除'
END
ELSE
BEGIN
  DELETE FROM SHOW_CASE
  WHERE ID IN (SELECT ID FROM @tempTable)
  SET @Message = 'success:删除成功'
END
