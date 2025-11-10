# Express TypeScript 模板项目

[English](https://github.com/CasNine418/express-template/blob/master/README.md) | [中文](https://github.com/CasNine418/express-template/blob/master/README_zh_CN.md)

一个基于 Express 和 TypeScript 构建的现代化 Web 应用程序模板，集成了常用中间件和最佳实践。

## 项目特点

- 基于 Express 5.x 和 TypeScript
- 模块化路由控制器架构
- 集成安全中间件（Helmet、CORS）
- 请求频率限制
- 日志记录功能
- 配置管理（TOML 格式）
- HTTPS 支持
- 数据库连接支持（MySQL、PostgreSQL 等）
- 打包和部署支持

## 目录结构

```
.
├── src/
│   ├── api/                 # API 控制器
│   │   ├── user/            # 用户相关控制器示例
│   │   └── base_controller.ts # 基础控制器类
│   ├── middleware/          # 自定义中间件
│   ├── model/               # 数据模型和响应格式
│   └── utils/               # 工具函数
├── app.ts                   # 应用程序入口
├── config.toml              # 配置文件
├── config.ts                # 配置加载器
└── ...
```

## 快速开始

### 环境要求

- Node.js >= 14.x
- npm 或 pnpm

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 配置

编辑 `config.toml` 文件以配置服务器设置：

```toml
[server.base]
port = 3000                    # 服务端口
cors_origin = "*"              # CORS 设置
mode = "http"                  # 运行模式 (http 或 https)
env = "development"            # 环境 (development, production, test)

[server.database]
driver = "mysql"               # 数据库类型
host = "localhost"             # 数据库主机
port = 3306                    # 数据库端口
user = "your_username"         # 数据库用户名
password = "your_password"     # 数据库密码
database = "your_database"     # 数据库名称
```

### 运行项目

```bash
# 开发模式运行
npm start

# 构建项目
npm run build

# 打包为可执行文件
npm run pack
```

## API 示例

项目包含一个用户管理的示例控制器：

```
GET    /users        # 获取所有用户
GET    /users/:id    # 获取特定用户
POST   /users        # 创建用户
PUT    /users/:id    # 更新用户
DELETE /users/:id    # 删除用户
```

## 部署

### 构建项目

```bash
npm run build
```

### 打包为可执行文件

```bash
npm run pack
```

这将生成一个独立的可执行文件，可以在没有 Node.js 环境的服务器上运行。

## 许可证

[MIT](LICENSE)
