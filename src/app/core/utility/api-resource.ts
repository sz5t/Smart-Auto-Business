/**
 * Created by zhaoxinlei on 2018/3/23.
 */
export class APIResource {
  /**
   * 	组织机构树的节点
   * @type {string}
   */
  public static OrgNode: string = 'SinoForce.User.OrgNode';
  /**
   * 资源类型
   * @type {string}
   */
  public static Resource_Type: string = 'SinoForce.SysData.ResourceType';
  /**
   * 平台通用数据分类
   * @type {string}
   */
  public static SysDataCategory: string = 'SinoForce.SysData.SysDataCategory';
  public static DataCategory = 'Sinoforce.AppData.DataCategory';
  /**
   * 	NULL
   * @type {string}
   */
  public static UserStatusLog: string = 'SinoForce.User.UserStatusLog';
  /**
   * 排序字段
   * @type {string}
   */
  public static EntitySort: string = 'SinoForce.SysData.EntitySort';	//
  /**
   * 应用访问许可集
   * @type {string}
   */
  public static AppPermission: string = 'AppPermission';	//
  /**
   * 平台通用数据分类连接关系
   * @type {string}
   */
  public static SysDataCategoryLink: string = 'SinoForce.SysData.SysDataCategoryLink';	//
  public static DataCategoryLink = 'SinoForce.AppData.DataCategoryLink';	//
  public static ShowCase = 'SinoForce.AppData.ShowCase';

  /**
   * 资源访问令牌
   * @type {string}
   */
  public static AccessToken: string = 'SinoForce.User.AccessToken';	//
  /**
   * 组织机构与用户关系表
   * @type {string}
   */
  public static OrgUserLink: string = 'SinoForce.User.OrgUserLink';	//
  /**
   * 应用配置包
   * @type {string}
   */
  public static AppConfigPack: string = 'SinoForce.SysData.AppConfigPack';	//
  /**
   * 用户信息
   * @type {string}
   */
  // 新建资源类型	新建资源类型
  public static AppUser: string = 'SinoForce.User.AppUser';	//
  /**
   * 在线用户信息
   * @type {string}
   */
  public static OnlineUser: string = 'SinoForce.User.OnlineUser';	//

  /**
   *
   * @type {string}
   */
  public static DynamicResExtend: string = 'SinoForce.SysData.DynamicResExtend';
  /**
   * 应用程序模板描述信息
   * @type {string}
   */
  public static AppTemplate: string = 'SinoForce.SysData.AppTemplate';	//
  /**
   * SQL脚本、存储过程、函数等数据库对象的完整配置
   * @type {string}
   */
  public static DbCommandConfig: string = 'SinoForce.SysData.DbCommandConfig';	//
  /**
   * 在线用户信息视图
   * @type {string}
   */
  public static OnlineUserInfo: string = 'SinoForce.User.OnlineUserInfo';	//
  /**
   * 一般非结构化数据
   * @type {string}
   */
  public static UnstructData: string = 'SinoForce.SysData.UnstructData';	//
  /**
   * 角色访问权限信息
   * @type {string}
   */
  public static PrivRole: string = 'SinoForce.User.PrivRole';	//
  /**
   * 多对多关系的中间表
   * @type {string}
   */
  public static EntituyRelation: string = 'SinoForce.SysData.EntityRelation';
  /**
   *
   * @type {string}
   */
  public static AppProject: string = 'SinoForce.SysData.AppProject';	// 应用项目
  /**
   * 动态资源模块
   * @type {string}
   */
  public static DynamicResModule: string = 'SinoForce.SysData.DynamicResModule';
  /**
   * 关联表
   * @type {string}
   */
  public static EntityRelevance: string = 'SinoForce.SysData.EntityRelevance';
  /**
   * 平台客户信息
   * @type {string}
   */
  public static PlatformCustomer = 'SinoForce.SysData.PlatformCustomer';
  /**
   * 用户令牌生命周期
   * @type {string}
   */
  public static TokenLife = 'SinoForce.User.TokenLife';
  /**
   * 权限主体与角色的关系表
   * @type {string}
   */
  public static PrivRoleLink = 'SinoForce.User.PrivRoleLink';
  /**
   * 索引信息
   * @type {string}
   */
  public static EntityIndex = 'SinoForce.SysData.EntityIndex';
  /**
   * 树表
   * @type {string}
   */
  public static EntityTree = 'SinoForce.SysData.EntityTree';
  /**
   * 实体属性描述信息
   * @type {string}
   */
  public static EntityPropertyDefine = 'SinoForce.SysData.EntityPropertyDefine';
  /**
   * 验证码
   * @type {string}
   */
  public static ValidCode = 'SinoForce.User.ValidCode';
  /**
   *
   * @type {string}
   */
  public static SysCommonCode = 'SinoForce.SysData.SysCommonCode';
  public static SysDataLink = 'SinoForce.SysData.SysDataLink';
  public static CommonCode = 'SinoForce.AppData.CommonCode';
  /**
   * 受限资源描述信息
   * @type {string}
   */
  public static PrivilegedResource = 'SinoForce.User.PrivilegedResource';
  /**
   * 应用项目模块描述信息
   * @type {string}
   */
  public static AppModuleConfig = 'SinoForce.SysData.AppModuleConfig';

  /**
   * 布局设置
   */
  public static LayoutSetting = 'SinoForce.SysData.LayoutSetting';

  /**
   * 区域设置
   */
  public static BlockSetting = 'SinoForce.SysData.BlockSetting';

  /**
   * 视图设置
   */
  public static ViewSetting = 'SinoForce.SysData.ViewSetting';


  public static GetOperationTree = 'SinoForce.SysData.GetOperationTree';

  /**
   * 配置平台标识代码
   * @type {string}
   */
  public static SettingCommonCode = '{WEB前端标识}';

  /**
   * 配置平台URL
   * @type {string}
   */

  public static SettingUrl = 'http://192.168.1.8:8081/api.cfg/';

  /**
   * 解析平台标识代码
   * @type {string}
   */
  public static LoginCommonCode = '{WEB应用运行平台}';

  /**
   * 解析平台URL
   * @type {string}
   */
  public static LoginUrl = 'http://192.168.1.8:8082/api.app';
  
  // public static LoginUrl = 'http://39.108.141.68:8016/eb43/Res/';

  /**
   * 本地URL
   * @type {string}
   */
  public static localUrl =  'http://localhost:4200/assets';
  // public static localUrl =  'http://192.168.1.8:8002/assets';
  // public static localUrl =  'http://192.168.1.8:8002/assets';


    /**
     * 配置系统客户ID
     * @type {string}
     */
  public static SysPlatCustomerId = 'f2771e4c90db29439e3c986d9859dc74';
    /**
     * 配置系统项目ID
     * @type {string}
     */
    public static SysProjId = '0ac12f70c2a7a44794b57ef0c1c480c2';

    /**
     * 配置系统ApplyId
     * @type {string}
     */
    public static SysApplyId = 'b9743e6da0b940beb34345fe09240c2f';

// ---------------------------------------------------------------------------------

    /**
     * 业务系统客户ID
     * @type {string}
     */
    public static AppPlatCustomerId = 'eb4332bbb4d01a4289457a891b6a0333';

    /**
     * 业务系统项目ID
     * @type {string}
     */
    public static AppProjId = '002905c7bf57c54c9e5e65ec0e5fafe8';

    /**
     * 业务系统ApplyId
     * @type {string}
     */
    public static AppApplyId = '3935eb43532d435398d5189d5ece0f5d';

    /**
     * 运行平台资源所属ID
     * @type {string}
     */

    public static AppDrmId = '57e76ec4a882334c85532f3a5f561a12';

    /**
     * 运行平台资源所属模块
     * @type {string}
     */
     public static AppOwnerAssembly = 'SinoForce.AppData';

}
