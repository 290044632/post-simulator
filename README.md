# post-simulator
一款模拟http请求的Chrome插件，用于将日常开发中打印的http请求参数通过复制粘贴快速模拟请求，不需要关心参数格式的转化过程。

# 历史版本

## v1.0.0.20240521

- 新增：支持POST、GET请求方式
- 新增：支持自定义http header信息，多个通过`换行符(\n)`分割
- 新增：支持两种请求参数格式`application/x-www-form-urlencoded`、`application/json`
- 新增：支持两种参数格式转换`urlencoded(application/x-www-form-urlencoded)`、`json(application/json)`
- 新增：支持多种参数格式，示例如下：
  ```
  # json格式
  {name:"zhangsan",age:14}

  # url参数格式
  name=zhangsan&age=14

  # key=value格式，以换行符(\n)分割
  name=zhangsan
  age=14
  ```
- 新增：支持响应结果回显，包括状态码、响应数据格式、响应数据
