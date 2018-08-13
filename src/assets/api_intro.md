# api功能说明

------

## <font size="5">一、common控制器</font>
> 实现对表资源、sql脚本资源、code资源的调用

----------

## (一)、GET请求
> 进行数据库的查询操作，即 [select]

|路由格式|说明|
|-------|----|
|/common/资源名|查询指定资源的数据集合|
|/common/资源名/资源id|查询指定资源和id的数据对象|
|/common/counter/资源名|查询指定资源的数据量|
|/common/父资源名/父资源id或父资源筛选条件/子资源名|查询指定父资源下对应的子资源数据集合|
|/common/counter/父资源名/父资源id或父资源筛选条件/子资源名|查询指定父资源下对应的子资源数据量|
|/common/counter/资源名/资源id或资源筛选条件/资源名|递归查询指定资源的数据|
|/common/values/资源名/属性名|查询指定资源的字段的数据字典值集合|
|/common/action/资源名/方法名|执行指定资源中的业务方法|

#### 1. 功能参数
> 系统内置，在api地址中使用
> <br/>
> 可以根据实际需求，将功能参数进行任意组合使用

##### (1). 字段查询
	_select: 指定返回的查询结果的属性，默认为全部查询；多个用,分隔
	_resultType: 指定返回的查询结果值的方式，默认值为anonymous
	_split: 指定返回的查询结果值间的分隔符，和_resultType搭配使用才有效果

> _resultType的值包括**:**

|值|说明|
|---|---|
|anonymous|即默认值，对查询结果没有影响|
|keyValues|查询结果的值，以key=value的形式返回，其中=可以通过_split指定，默认为=|
|strings|查询结果的每个对象的所有值，通过,连接成一个字符串返回，其中,可以通过_split指定，默认为,|
|text|查询结果的所有对象的所有值，通过,和\n连接成一个字符串返回，其中,可以通过_split指定，默认为,|

	
##### (2). 分页查询
	_limit: 指定一次限制显示多少行
	_start: 指定开始的行数

	_rows: 指定一页显示多少行
	_page: 指定第几页

> 两种分页查询方式，任意选择一种调用
> <br/>
> _limit + _start 的优先级高于 _rows + _page

##### (3). id聚焦
	_focusedId: 数据通过该参数传递到后台后，后台会原封不动再传出来
> 该参数一般和分页查询搭配使用。目前系统也只支持该参数和分页查询搭配使用

##### (4). 递归查询
	_recursive: 标识是否递归查询，值为true、false。如果不传值，默认为false
	_deep: 递归查询的深度，默认为2。值为-1，标识递归查询到底

> 递归查询出来的数据集合，会自动挂接到其父级的对象中，属性名为"children"

##### (5). 查询排序
	_sort: 指定查询结果根据哪些属性排序，以及排列的顺序。多个属性排序，用,分隔开

> 示例**:** ?_sort=age ASC, createDate DESC
> <br/>
> 相应的sql**:** ORDER BY age ASC, create_date DESC

##### (6). 父子关联查询
	_simpleModel: 是否以简单模式进行父子查询，值为true、false。如果不传值，默认为false
	_refPropName: 指定子资源的属性中，关联父资源id的属性名，默认值为parentId。只有_simpleModel=true时才有效
	
> 系统内对父子资源的关联方式分为两种**:** 第一种是子资源的某个属性，关联父资源id；另一种是通过关系表关联父子资源
> <br/>
> **(1).** 第一种就属于_simpleModel=true，这时需要指定_refPropName的值，系统会自动组装对应的sql语句
> <br/>
> SELECT sub_columns FROM sub_resource WHERE _refPropName = parent_resource_id
> <br/>
> **(2).** 第二种就属于_simpleModel=false，这时需要通过关系表查询子资源数据
> <br/>
> SELECT sub_columns FROM sub_resource s, relation_resource r WHERE s.Id = r.rightId AND r.leftId = parent_resource_id 
> <br/><br/>
> 目前系统中更多的都是使用第二种方式

##### (7). 子列表查询
	_subResourceName: 指定子资源的名称
	_refPropName: 指定子资源的属性中，关联父资源id的属性名，默认值为parentId
	_subSort: 指定子资源的排序规则，使用方式和_sort相同

> 查询出来的子资源集合，会自动挂接到查询结果的对象中，属性名为"children"

##### (8). 查询条件
> 任何查询结果中涉及到的属性，都可以作为查询条件
> <br/>
> 示例**:** ?name=哈哈&age=23
> <br/>
> 相应的sql**:** where name = '哈哈' and age = 23
> <br/>
> 对于相对复杂的条件，系统还提供了以下内置的条件函数

###### 1). 条件函数

|函数名|函数功能|支持取反*|示例|相应的sql|
|-----|-------|-------|---|---------|
|btn/between|区间查询|否|?date=btn('2018-1','2018-2')|WHERE date BETWEEN '2018-1' AND '2018-2'|
|ctn/contains|模糊查询|是|?name=ctn('%哈哈')|WHERE name LIKE '%哈哈'|
|in/any|批量查询|是|?id=in(1,2,3)|WHERE id IN ('1','2','3')|
|eq|等于|是|?name=eq(哈哈)|WHERE name = '哈哈'|
|ne|不等于|是|?name=ne(哈哈)|WHERE name != '哈哈'|
|ge|大于或等于|否|?age=ge(20)|WHERE age >= 20|
|gt|大于|否|?age=gt(20)|WHERE age > 20|
|le|小于或等于|否|?age=le(20)|WHERE age <= 20|
|lt|小于|否|?age=lt(20)|WHERE age < 20|

> ① 取反的关键字为"**!**"，例如: ?id=**!**in(1,2,3)，相应的sql为： WHERE id NOT IN ('1','2','3')
> <br/>
> ② 查询条件的值，如果包含特殊字符，可以通过''或""包裹起来，系统内部会过滤掉每个值最外层的一对''或""



### (二)、POST请求
> 进行数据库的保存操作，即 [insert]

|路由格式|说明|
|--------|------|
|/common/资源名|保存指定资源的数据对象|


### (三)、PUT请求
> 进行数据库的修改操作，即 [update]

|路由格式|说明|
|--------|------|
|/common/资源名|修改指定资源的数据对象|


### (四)、DELETE请求
> 进行数据库的删除操作，即 [delete]

|路由格式|说明|
|--------|------|
|/common/资源名|删除指定资源的数据对象|


<br/>
### <font size="5">二、file控制器</font>
> 实现对文件的操作

----------

### (一)、GET请求
> 进行文件下载操作，即 [download]

|路由格式|说明|
|--------|------|
|/file/download|下载文件|


### (二)、POST请求
> 进行文件上传操作，即 [upload]

|路由格式|说明|
|--------|------|
|/file/upload|上传文件|


### (三)、DELETE请求
> 进行文件删除操作，即 [delete]

|路由格式|说明|
|--------|------|
|/file/delete|删除文件|









