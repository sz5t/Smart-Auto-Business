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