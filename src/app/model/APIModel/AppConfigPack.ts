/**
 * Created by zhaoxinlei on 2018/3/23.
 */
export class AppConfigPack_Layout {
  MetaClass?;
  Format?;
  ProjId?;
  ApplyId?;
  /**
   * 模块ID
   */
  TagA?;
  /**
   * 节点类型
   */
  TagB?;
  UpdateTime?;
  ParentId?;
  /**
   * 模版名称
   */
  Name?;
  ShareScope?;
  Remark?;
  Id?;
  PlatCustomerId?;
  CreateTime?;
  /**
   * 配置数据
   */
  Metadata?;
}

export class AppConfigPack_Block {
  /**
   * 配置数据
   */
  MetaClass?;
  Format?;
  ProjId?;
  ApplyId?;
  /**
   * 区域ID
   */
  TagA?;
  /**
   * 节点类型
   */
  TagB?;
  UpdateTime?;
  /**
   * 布局ID（唯一）
   */
  ParentId?;
  /**
   * 组件名称
   */
  Name?;
  ShareScope?;
  Remark?;
  Id?;
  PlatCustomerId?;
  CreateTime?;
  /**
   * 配置数据
   */
  Metadata?;
}

export class AppConfigPack_ConfigType {
  public static LAYOUT = 'layout';
  public static TABS = 'tabs';
  public static TAB = 'tab';
  public static COLUMN = 'col';
  public static COMPONENT = 'component';
}


