
# 布局配置说
ng build --prod --no-extract-license
## 1、默认及嵌套布局
```bash
        {
                "rows": [                                   -- 功能页面是一个行集合，可以由多个行对象构成
                    {
                        "row": {                                -- 行对象，一行可以划分多个列对象
                            "cols": [                             -- 列对象集合，集合内每一个对象代表一列，也就是所谓的布局区域，在区域内可以放置组件、嵌套布局等
                                { 
                                    "id": "area2",                    -- 列ID，必须为系统唯一值（建议采用 模块+功能+编号）的方式命名
                                    "title": "查询",                   -- 设置区域标题，如果不设置或者为""，则区域内将不限时标题
                                    "span": 24,                       -- 区域占比设置，每个区域的宽度被平均分为24份，span必须是1-24的数字（默认占比）
                                    "icon": "anticon anticon-search", -- 设置标题图标 可以参考 iconfont、 anticon 的官网进行设置 
                                    "size": {                         -- 设置屏幕自适应宽度占比
                                        "nzXs": 24,                     -- <768px的占比
                                        "nzSm": 24,                     -- >768px的占比
                                        "nzMd": 24,                     -- >996px的占比
                                        "nzLg": 24,                     -- >1200px的占比
                                        "nzXl": 24                      -- >1600px的占比
                                    },
                                    "viewCfg": []                     -- 组件设置/布局或者组件只能保留一个配置节点
                                    "rows":[]                         -- 嵌套布局，嵌套以上结构即可实现
                                }
                            }
                     }
                }
        }
```
## 2、标签页布局
```bash
        {
                "rows": [                                       -- 功能页面是一个行集合，可以由多个行对象构成
                    {
                        "row": {                                    -- 行对象，一行可以划分多个列对象
                            "cols": [                                 -- 列对象集合，集合内每一个对象代表一列，也就是所谓的布局区域，在区域内可以放置组件、嵌套布局等
                                { -- 
                                    "id": "area2",                        -- 列ID，必须为系统唯一值（建议采用 模块+功能+编号）的方式命名
                                    "title": "查询",                       -- 设置区域标题，如果不设置或者为""，则区域内将不限时标题
                                    "span": 24,                           -- 区域占比设置，每个区域的宽度被平均分为24份，span必须是1-24的数字（默认占比）
                                    "icon": "anticon anticon-search",     -- 设置标题图标 可以参考 iconfont、 anticon 的官网进行设置 
                                    "size": {                             -- 设置屏幕自适应宽度占比
                                        "nzXs": 24,                         -- <768px的占比
                                        "nzSm": 24,                         -- >768px的占比
                                        "nzMd": 24,                         -- >996px的占比
                                        "nzLg": 24,                         -- >1200px的占比
                                        "nzXl": 24                          -- >1600px的占比
                                    },
                                    "tabs": [                             -- 标签页布局集合，集合内的每一个对象都是一个独立的标签
                                        {
                                            "title": "tab 1",
                                            "icon": "icon-list",
                                            "active": "",
                                            "viewCfg": []                     -- 设置标签内的组件
                                        },
                                        {
                                            "title": "tab 2",
                                            "icon": "icon-add",
                                            "active": "",
                                            "viewCfg": []                     -- 设置标签内的组件
                                        }
                                    ]                     
                                }
                            }
                     }
                }
        }
```

# 组件配置说明
## 1、数据网格
### 基本属性
```
{
        "config": {
            "title": "数据网格",                              -- 数据网格标题
            "viewId": "singleTable",                         -- 全局唯一ID
            "component": "bsnTable",                         -- 组件类型
            "info": true,                                    -- 是否显示附加信息
            "keyId": "Id",                                   -- 设置与表格关联数据的主键
            "pagination": true,                              -- 是否进行分页
            "showTotal": true,                               -- 是否显示总记录数
            "pageSize": 5,                                   -- 分页每页记录数
            "pageSizeOptions": [5,10,20,30,40,50],           -- 设置用户可选择的分页范围
            "ajaxConfig": {                                  -- 表格数据源设置
                "url": "common/GetCase",                       -- 数据源API
                "ajaxType": "get",                             -- 数据获取方式
                "params": [],                                  -- 附加参数，（后续参数部分说明）
                "filter": [                                    -- 设置查询字段，所设置的对象将会作为查询表单查询的内容
                    {
                        "name": "caseName",                        -- 查询的条件名称（API对象的属性）
                        "valueName": "_caseName",                  -- 取值名称，表示改字段是从那个临时属性中获取，该值需要与其他设置配合使用
                        "type": "",                                -- 取值类型：value/tempValue/guid/componentValue
                        "value": ""                                -- type为value的时候，该API对象的属性取值，取此处设置的值
                    }
                ]
            },
            "dataList": []                                   -- 初始化数据集
        }
}
```
### 表格列配置
```
"columns": [                                       -- 设置表格中的列，集合中的每个对象都是一列
        {
            "title": "序号",                              -- 列标题
            "field": "_serilize",                        -- 列对应的API数据源属性
            "width": "50px",                             -- 列宽度
            "hidden": false,                             -- 是否隐藏
            "showFilter": false,                         -- 是否使用列数据过滤功能
            "showSort": false,                           -- 是否使用该字段排序
            "editor": {                                  -- 设置编辑列，（行内编辑的组件配置，参照详细说明）
                "type": "input",                           -- 编辑类型
                "field": "Id",                             -- 编辑属性
                "options": {                               -- 编辑选项
                    "type": "input",                         -- 文本类型
                    "inputType": "text"                      -- 文本组件类型
                }
            }
        }
    ],
```
### 通知配置
```
 "componentType": {                                -- 组件的关系类型（参照详细说明）
        "parent": true,
        "child": false,
        "own": true
 },
    "relations": [                                   -- 组件关系设置（参照详细说明）
        {
            "relationViewId": "singleTable",
            "relationSendContent": [],
            "relationReceiveContent": []
        }
    ]
```

### 工具栏配置
```
"toolbar": [                                       -- 工具栏设置，
        {
            "group": [                                   -- 工具栏按钮分组，包含在内的所有按钮将会被分为一组，每组之间将会有一定的间隔进行区分
                {
                    "name": "addRow",                        -- 按钮名称，用于区分事件的触发者
                    "text": "新增",                           -- 按钮文字
                    "action": "CREATE",                      -- 按钮动作（主要处理行内操作）,不同类型的动作都会引起表格不同的操作行为
                                                                                                            /CREATE/UPDATE/DELETE/EXECUTE_CHECKED/EXECUTE_SELECTED/SAVE/CANCEL/FORM/WINDOW
                    "icon": "anticon anticon-plus",          -- 图标
                    "color": "text-primary"                  -- 按钮颜色
                },
                {
                    "name": "deleteRow",
                    "class": "editable-add-btn",
                    "text": "删除",
                    "action": "DELETE",
                    "icon": "anticon anticon-delete",
                    "color": "text-red-light",
                    "ajaxConfig": {                          -- 按钮触发后执行的API设置
                        "delete": [                            -- API动作类型/post/put/delete/get
                            {
                                "actionName": "delete",            -- 动作名称
                                "url": "common/ShowCase",          -- 执行的API
                                "ajaxType": "delete",              -- 调用类型
                                "params": [                        -- 参数设置（参考具体说明）
                                    {
                                        "name": "Id",
                                        "valueName": "Id",
                                        "type": "checkedRow"
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        {
            "group": [
                {
                    "name": "addForm",
                    "class": "editable-add-btn",
                    "text": "弹出新增表单",
                    "icon": "anticon anticon-form",
                    "action": "FORM",
                    "actionType": "formDialog",                -- 动作类型
                    "actionName": "addShowCase",               -- 设置动作关联名称（将于后续弹出表单或者页面的设置进行关联）
                    "type": "showForm"                         -- 执行类型：showForm/ShowBatchForm/ShowLayout
                }
            ]
        },
        {
            "dropdown": [                                  -- 分组下拉按钮
                {  
                    "name": "btnGroup",                        -- 分组名称
                    "text": " 分组操作",                         -- 分组文本
                    "icon": "icon-plus",                       -- 图标
                    "buttons": [                               -- 按钮设置，（内部配置参考上文）
                        {
                            "name": "refresh",
                            "class": "editable-add-btn",
                            "text": " 刷新",
                            "icon": "icon-list"
                        }
                    ]
                }
            ]
        }
    ]
```

### 弹出表单配置
```
"formDialog": [                                      -- 设置弹出表单
        {
            "keyId": "Id",                                 -- 表单数据的主键
            "name": "addShowCase",                         -- 与按钮动作关联的名称，按钮将会根据相同名称的
            "layout": "horizontal",                        -- 表单布局结构，水平布局/垂直布局（horizontal/vertical）
            "title": "新增数据",                             -- 表单标题
            "width": "800",                                -- 弹出框的宽度
            "isCard": true,                                -- 是否以卡片方式显示
            "componentType": {                             -- 组件的关系类型
                "parent": false,
                "child": false,
                "own": true
            },
            "forms": [                                     -- 表单元素集合，具体参照表单元素说明
                "controls": []                               -- 表单元素分组，每一组controls中的表单元素将显示在一行当中，多个controls节点即为多行
            ],                                   
            "buttons": [                                   -- 设置表单按钮
                {
                    "name": "save",                            -- save 并保存后刷新/ saveAndKeep 表示保存后继续表单操作
                    "text": "保存",
                    "type": "primary",                         -- 按钮的样式（default/primary/dashed/danger）
                    "ajaxConfig": {                            -- 设置表单提交的API资源
                        "post": [
                            {
                                "url": "common/ShowCase",            -- API资源名称
                                "params": [                          -- 参数数据集合（表单中需要被提交的元素，每个对象对应一个表单元素）
                                    {
                                        "name": "caseName",              -- API资源的属性名称
                                        "type": "componentValue",        -- 取值方式（componentValue表示从表单组件取值）
                                        "valueName": "caseName",         -- 表单的组件名称
                                        "value": ""
                                    }
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "reset",                           
                    "text": "重置"
                },
                {
                    "name": "close",
                    "text": "关闭"
                }
            ]
        },
        {
            "keyId": "Id",
            "name": "updateShowCase",
            "title": "编辑",
            "width": "600",
            "ajaxConfig": {                                   -- 表单编辑数据必须设置该属性，用来加载表单数据
                "url": "common/ShowCase",
                "ajaxType": "getById",                          -- 根据ID查询相关数据对象
                "params": [
                    {
                        "name": "Id",
                        "type": "tempValue",
                        "valueName": "_id",
                        "value": ""
                    }
                ]
            },
            "componentType": {},
            "forms": [],
            "buttons": [],
            "dataList": []
        }
    ]
```

### 弹出页面配置
```
"windowDialog": [                                    -- 弹出窗体
        { 
            "title": "",
            "name": "ShowCaseWindow",                        -- 窗体名称
            "layoutName": "singleTable",                     -- 关联窗体名称
            "width": 800,
            "buttons": [
                {
                    "name": "ok1",
                    "text": "确定",
                    "type": "primary"
                },
                {
                    "name": "close",
                    "text": "关闭"
                }
            ]
        }
    ]
}
```

## 2、表单
### 文本编辑
####（1）文本框
```bash
        {
            "type": "input",                                      -- 表单类型 input：输入类型
            "labelSize": "6",                                     -- 标签占比
            "controlSize": "16",                                  -- 元素占比
            "inputType": "text",                                  -- 文本框
            "name": "caseName",                                   -- 元素名称
            "label": "名称",
            "isRequired": true,                                   -- 是否显示为必填元素
            "placeholder": "请输入Case名称",                        -- 默认显示内容
            "perfix": "anticon anticon-edit",                     -- 前缀图标
            "suffix": "",                                         -- 后缀图标
            "disabled": false,                                    -- 是否禁用
            "readonly": false,                                    -- 是否只读
            "size": "default",                                    -- 组件大小 default/small/large
            "layout": "column",                                   -- 排列方式 column：按列布局
            "span": "24",                                         -- 占比宽度 24/24
            "validations": [                                      -- 设置验证规则（必填、最大长度、最小长度，正则表达式 pattern、范围、数字等）
                {
                    "validator": "required",                          -- 验证方式：required 必填
                    "errorMessage": "请输入Case名称!!!!"                -- 验证消息
                },
                {
                    "validator": "minLength",                         -- 验证方式：minLength 最小长度
                    "length": "3",
                    "errorMessage": "请输入最少三个字符"
                },
                {
                    "validator": "maxLength",                         -- 验证昂视：maxLength 最大长度
                    "length": "5",
                    "errorMessage": "请输入最5个字符"
                },
                {
                    "validator": "pattern",                         -- 验证昂视：maxLength 最大长度
                    "pattern": {},                                  -- 正则表达式
                    "errorMessage": "请输入最5个字符"
                }
            ]
        }
```   
####（2）日期
```bash
{
    "type": "datePicker",                                   -- 表单类型：datePicker 日期组件 
    "labelSize": "6",
    "controlSize": "16",
    "inputType": "text",
    "name": "createTime",
    "label": "创建时间",
    "placeholder": "",
    "disabled": false,
    "readonly": false,
    "size": "default",
    "layout": "column",
    "showTime": true,                                       -- 是否显示时间
    "format": "yyyy-MM-dd",                                 -- 日期格式化
    "showToday": true,                                      -- 是否显示当天日期
    "span": "24"
}
```
####（3）时间 （同上）
####（4）日期区间
```bash
{
    "type": "rangePicker",                                  -- 表单类型：datePicker 日期组件
    "labelSize": "6",
    "controlSize": "16",
    "inputType": "text",
    "name": "createTime",
    "label": "时间范围",
    "placeholder": "",
    "disabled": false,
    "readonly": false,
    "size": "default",
    "layout": "column",
    "showTime": true,
    "format": "yyyy-MM-dd",
    "showToday": true,
    "span": "24"
}
```
####（5）上传 (待完善)

### 下拉列表
#### （1）静态数据下拉列表
```bash
{
        "type": "select",                                  -- 表单组件类型：select
        "labelSize": "6",                                  -- 标签占比 6/24
        "controlSize": "16",                               -- 元素占比 16/24
        "name": "enabled",                                 -- 表单名称（必须API中对象属性相同）
        "label": "状态",                                    -- 标签文本
        "notFoundContent": "",                             -- 没有数据是显示的内容
        "selectModel": false,                              -- 是否多选
        "showSearch": true,                                -- 是否显示查询内容
        "placeholder": "--请选择--",                        -- 默认初始化是显示的内容 
        "disabled": false,                                 -- 是否禁用
        "size": "default",                                 -- 组件大小 default/small/large
        "options": [                                       -- 静态数据源
            {  
                "label": "启用",                                -- 下拉文本
                "value": true,                                 -- 下拉选中的值
                "disabled": false
            },
            {
                "label": "禁用",
                "value": false,
                "disabled": false
            }
        ],
        "layout": "column",                                -- 元素布局方式 column
        "span": "24"                                       -- 组件宽度占比
 }
```
#### （2）动态数据下拉列表
```bash
        {
            "type": "select",
            "labelSize": "6",
            "controlSize": "16",
            "name": "caseType",
            "label": "父类别",
            "labelName": "caseType",                             -- 数据源映射的标签名称
            "valueName": "Id",                                   -- 数据源映射的值名称
            "notFoundContent": "",
            "selectModel": false,
            "showSearch": true,
            "placeholder": "--请选择--",
            "disabled": false,
            "size": "default",
            "ajaxConfig": {                                      -- 设置数据源
                "url": "common/ShowCase",
                "ajaxType": "get",
                "params": []
            },
            "cascader": [                                        -- 设置下拉及联关系（如果需要下拉及联，则设置此属性）
                {
                    "name": "getCaseName",                           -- 及联名称
                    "type": "sender",                                -- 及联类型
                    "cascaderData": {                                -- 设置及联的数据内容
                        "params": [
                            {
                                "pid": "Id",                               -- 及联数据源属性
                                "cid": "_typeId"                           -- 及联属性的取值
                            }
                        ]
                    }
                }
            ],
            "layout": "column",
            "span": "24"
        }
```
#### （3）下拉树
```bash
{
    "type": "selectTree",                                    -- 表单类型 selectTree 下拉树
    "labelSize": "6",
    "controlSize": "16",
    "name": "parentId",
    "label": "父类别",
    "notFoundContent": "",
    "selectModel": false,
    "showSearch": true,
    "placeholder": "--请选择--",
    "disabled": false,
    "size": "default",
    "columns": [                                             -- 字段映射，映射成树结构所需
        { title: "主键", field: "key", valueName: "Id" },
        { title: "父节点", field: "parentId", valueName: "parentId" },
        { title: "标题", field: "title", valueName: "caseName" },
    ],
    "ajaxConfig": {
        "url": "common/ShowCase",
        "ajaxType": "get",
        "params": []
    },
    "layout": "column",
    "span": "24"
}
```

###多选框
####（1）静态多选框
```bash
{
        "type": "checkboxGroup",                           -- 表单组件类型：checkboxGroup
        "labelSize": "6",                                  -- 标签占比 6/24
        "controlSize": "16",                               -- 元素占比 16/24
        "name": "enabled",                                 -- 表单名称（必须API中对象属性相同）
        "label": "状态",                                    -- 标签文本
        "disabled": false,                                 -- 是否禁用
        "size": "default",                                 -- 组件大小 default/small/large
        "options": [                                       -- 静态数据源
            {  
                "label": "启用",                                -- 下拉文本
                "value": true,                                 -- 下拉选中的值
                "disabled": false
            },
            {
                "label": "禁用",
                "value": false,
                "disabled": false
            }
        ],
        "layout": "column",                                -- 元素布局方式 column
        "span": "24"                                       -- 组件宽度占比
}
```
####（2）动态多选框
```bash
{
        "type": "radioGroup",                              -- 表单组件类型：radioGroup
        "labelSize": "6",                                  -- 标签占比 6/24
        "controlSize": "16",                               -- 元素占比 16/24
        "name": "enabled",                                 -- 表单名称（必须API中对象属性相同）
        "label": "状态",                                    -- 标签文本
        "disabled": false,                                 -- 是否禁用
        "size": "default",                                 -- 组件大小 default/small/large
        "options": [                                       -- 静态数据源
            {  
                "label": "启用",                                -- 下拉文本
                "value": true,                                 -- 下拉选中的值
                "disabled": false
            },
            {
                "label": "禁用",
                "value": false,
                "disabled": false
            }
        ],
        "layout": "column",                                -- 元素布局方式 column
        "span": "24"                                       -- 组件宽度占比
}
```
###单选框
#### （1）静态单选框
```bash

```
#### （2）动态单选框
```bash

```
##3、树
### （1）同步树
```bash
{
    config: {
        "viewId": "tree_and_tabs_tree",                                   -- 全局唯一标识ID
        "component": "bsnTree",                                           -- 组件名称
        "asyncData": true,                                                -- 是否异步加载数据
        "expandAll": true,                                                -- 是否展开所有节点
        "checkable": false,                                               -- 是否节点前添加checkbox
        "showLine": false,                                                -- 显示连接线                        
        "columns": [                                                      -- 字段映射，映射成树结构所需
            { title: "主键", field: "key", valueName: "Id" },                -- 设置树的主键
            { title: "父节点", field: "parentId", valueName: "parentId" },   -- 设置树的父节点属性
            { title: "标题", field: "title", valueName: "caseName" },        -- 设置树节点展示哪个字段的值
        ],
        "componentType": {                                                -- 设置组件关系类型
            "parent": true,
            "child": false,
            "own": false
        },
        "parent": [                                                       -- 设置树的遍历初始值
            { name: "parentId", type: "value", valueName: "取值参数名称", value: "null" }
        ],
        "ajaxConfig": {                                                   -- 设置树绑定的数据源
            "url": "common/ShowCase",
            "ajaxType": "get",
            "params": []
        },
        "relations": [{                                                   -- 消息关系设置
            "relationViewId": "tree_and_tabs_tree",                         -- 关系视图ID（当前视图ID）
            "relationSendContent": [                                        -- 消息集合
                {
                    "name": "clickNode",                                        -- 消息名称（消息的触发动作）
                    "sender": "tree_and_tabs_tree",                             -- 发送者（当前组件的viewID）
                    "aop": "after",                                             -- 消息的发送时机（after：操作之后，before：操作之前）
                    "receiver": "tree_and_tabs_table",                          -- 接收消息者（viewID）
                    "relationData": {                                           -- 设置发送的关系数据
                        "name": "refreshAsChild",                                 -- 接收消息的方式
                        "params": [                                               -- 消息所传递的数据
                            { "pid": "key", "cid": "_id" }
                        ]
                    },
                },
                {
                    "name": "clickNode",
                    "sender": "tree_and_tabs_tree",
                    "aop": "after",
                    "receiver": "tree_and_tabs_form",
                    "relationData": {
                        "name": "refreshAsChild",
                        "params": [
                            { "pid": "key", "cid": "_id" }
                        ]
                    },
                }
            ],
            "relationReceiveContent": []
        }]
    },
    dataList: []
}
```
### （2）异步树
```bash
{
    "config": {
        "viewId": "tree_and_tabs_tree",                                   -- 全局唯一标识ID
        "component": "bsnTree",                                           -- 组件名称
        "asyncData": true,                                                -- 是否异步加载数据
        "expandAll": false,                                               -- 是否展开所有节点（动态树，需要节点默认关闭）
        "checkable": false,                                               -- 是否节点前添加checkbox
        "showLine": false,                                                -- 显示连接线                        
        "columns": [                                                      -- 字段映射，映射成树结构所需
            { "title": "主键", "field": "key", "valueName": "Id" },                -- 设置树的主键
            { "title": "父节点", "field": "parentId", "valueName": "parentId" },   -- 设置树的父节点属性
            { "title": "标题", "field": "title", "valueName": "caseName" },        -- 设置树节点展示哪个字段的值
        ],
        "componentType": {                                                -- 设置组件关系类型
            "parent": true,
            "child": false,
            "own": false
        },
        "parent": [                                                       -- 设置树的遍历初始值
            { "name": "parentId", "type": "value", "valueName": "取值参数名称", "value": "null" }
        ],
        "ajaxConfig": {                                                   -- 设置树绑定的数据源
            "url": "common/ShowCase",
            "ajaxType": "get",
            "params": []
        },
        "expand": [                                                       -- 节点展开，动态加载数据
                {
                        "type": false,                         
                        "ajaxConfig": {                                           -- 节点展开后，动态加载的数据源
                                "url": "common/ShowCase",
                                "ajaxType": "get",
                                "params": [
                                        { name: "parentId", type: "componentValue", valueName: "", value: "" }
                                ]
                        }
                }
        ],
        "relations": [{                                                   -- 消息关系设置
            "relationViewId": "tree_and_tabs_tree",                         -- 关系视图ID（当前视图ID）
            "relationSendContent": [                                        -- 消息集合
                {
                    "name": "clickNode",                                        -- 消息名称（消息的触发动作）
                    "sender": "tree_and_tabs_tree",                             -- 发送者（当前组件的viewID）
                    "aop": "after",                                             -- 消息的发送时机（after：操作之后，before：操作之前）
                    "receiver": "tree_and_tabs_table",                          -- 接收消息者（viewID）
                    "relationData": {                                           -- 设置发送的关系数据
                        "name": "refreshAsChild",                                 -- 接收消息的方式
                        "params": [                                               -- 消息所传递的数据
                            { "pid": "key", "cid": "_id" }
                        ]
                    },
                },
                {
                    "name": "clickNode",
                    "sender": "tree_and_tabs_tree",
                    "aop": "after",
                    "receiver": "tree_and_tabs_form",
                    "relationData": {
                        "name": "refreshAsChild",
                        "params": [
                            { "pid": "key", "cid": "_id" }
                        ]
                    },
                }
            ],
            "relationReceiveContent": []
        }]
    },
    dataList: []
}
```
## 3、树表
+ 基本与表格配置保持一致，数据源配置上有一定区别使用主子查询的查询结构即可,例如：
> url:common/ShowCase/null/ShowCase

# 区域及联配置说明
###
+ 所谓区域联动是指，对页面中某一区域进行操作后，使得其他相关区域进行*数据刷新*或者*界面改变*等效果
+ 原理是通过系统通过消息机制，发送各种界面元素行为的通知，等待接收消息的区域接收到【属于自己的】通知后，便会作出通知相应的动作
+ 进行系统消息配置时，需要明确消息的两种角色，发送者（UI区域），接收者（UI区域）。
+ 发送者中需要配置发送的消息内容及接收消息的对象和数据
```bash
"componentType": {                              -- 组件的关系类型
    "parent": false,                              -- 是否是发送者
    "child": true,                                -- 是否市接收者
    "own": false                                  -- 是否自动加载
},
"relations": [                                  -- 消息集合，在一个区域中可以配置多种的联动罅隙
    {
        "relationViewId": "parentTable",            -- 区域关系ID（区域的viewId）
        "relationSendContent": [                    -- 消息内容
            {
                "name": "selectRow",                    -- 设置发送消息的动作
                "sender": "parentTable",                -- 设置消息的发送者（区域的viewId）
                "aop": "after",                         -- 发送消息的时机
                "receiver": "childTable",               -- 设置消息的接收者（区域的viewId）
                "relationData": {                       -- 消息包含的数据
                    "name": "refreshAsChild",             -- 消息行为
                    "params": [                           -- 消息发送的数据列表
                        { "pid": "Id", "cid": "_parentId" },
                    ]
                },
            }
        ],
        "relationReceiveContent": []
    }
]
```
+ 接收者需要配置消息的发送者是哪个区域
```bash
"componentType": {
    "parent": false,
    "child": true,
    "own": false
},
"relations": [{
    "relationViewId": "parentTable",              -- 区域关系ID（发送者区域的viewId）
    "cascadeMode": "REFRESH_AS_CHILD",            -- 消息接受着所要处理的消息动作
    "params": [                                   -- 设置发送者传递数据的映射关系
        { pid: "Id", cid: "_parentId" }
    ],
    "relationReceiveContent": []
    }]
}
```

### 消息的动作类型
