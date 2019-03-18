# egova-starter-template

> 系统名称

## 项目结构
```
┌── build                   # webpack脚本
├── config                  # config
├── src                     # main
│    ├── application 		# 程序启动载入处理逻辑
│    ├── assets     		# 可打包资源文件
│    │    ├── images      	# 图片资源
│    │    ├── styles      	# 样式资源
│    ├── common             # common
│    │    ├── mixins      	# vue多页面共用mixins
│    │    └── utils   		# 页面相关样式，页面内单独引用
│    ├── components 		# 项目中共用components
│    ├── models 		    # 项目中模型实体定义
│    ├── routes 		    # vue-router前端路由
│    ├── services 		    # 项目中共用服务定义
│    ├── store              # store
│    │    └── modules      	# 按模块使用
│    ├── types              # d文件定义
│    ├── views              # 业务模块视图定义
│    ├── settings      		# 全局设置
│    └── index.ts           # 入口
│
├── node_modules            # 依赖
├── public                  # 静态文件
│    ├── index.html 		# 程序启动载入处理逻辑
│    └── favicon.ico     	# 程序图标
├── dist                    # 打包之后的文件
├── .editorconfig	        # 通用编辑器配置
├── .gitignore		        # git忽略提交配置
├── .postcssrc.js           # postcss配置
└── package.json            # package info
```

## 注意事项

因为采用了 dll 预打包，所以首次（或核心库版本发生变动），需要执行:

``` bash
$ npm run dll
```

> 默认核心库包含如下内容:

- vue
    - vue
    - vue-router
- flagwind
    - flagwind-core
    - @egova/flagwind-web
    - @egova/flagwind-echarts
> 自定义核心库在 `vendor.js` 中配置

如果项目依赖如 `axios`，`lodash` 等库，只需按照如下方式导入即可:

``` js
import axios from "axios";
import lodash from "lodash";
```

## 常用命令

- `npm run dev` 进入调试模式，默认地址为 `http://localhost:8040`
- `npm run lint` 使用 `tslint` 验证源码
- `npm run dll` 预打包核心依赖库
- `npm run build` 生产打包
- `npm run template` 把项目置为vue cli 模版项目并发布至npm上
