# 鲜购 - 移动端电商 H5

基于 Vue 2 的移动端生鲜电商客户端，SPA 单页应用，使用 Mock.js 模拟后端数据，覆盖完整的电商购物流程。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 2.7 | 前端框架 |
| Vue Router | 3.x | SPA 路由管理 |
| Vuex | 3.x | 全局状态管理（user / cart / product / checkout） |
| Vant | 2.x | 移动端 UI 组件库 |
| Axios | 0.27 | HTTP 请求封装（含请求/响应拦截器） |
| Mock.js | 1.1 | 后端接口数据模拟 |
| SCSS | - | CSS 预处理器（全局变量 + BEM 命名） |
| Jest | 27.x | 单元测试 |
| Docker + Nginx | - | 容器化部署 |

## 功能模块

| 模块 | 页面 | 说明 |
|------|------|------|
| 用户认证 | 登录、注册 | 表单校验、token 持久化、路由守卫 |
| 首页 | 首页 | 轮播图、分类入口、推荐商品列表、下拉刷新 |
| 商品 | 分类、搜索、商品详情 | 左右分栏分类浏览、关键词搜索、规格选择、收藏 |
| 购物车 | 购物车 | 增删改查、全选、数量步进器、滑动删除 |
| 订单 | 确认订单、收银台、支付结果、订单列表 | 地址选择、支付方式选择、支付倒计时、订单状态筛选 |
| 个人中心 | 个人中心、收货地址、我的收藏、优惠券 | 地址 CRUD、收藏管理、优惠券列表 |

## 业务流程

```
浏览商品 → 加入购物车 → 确认订单（选择地址）→ 收银台（选择支付方式）→ 支付结果 → 查看订单 → 确认收货
```

订单状态流转：待付款 → 待发货 → 待收货 → 已完成（可在任意待付款阶段取消订单）

## 项目结构

```
frontend-user/
├── public/                  # 静态资源
├── src/
│   ├── api/                 # 接口封装（auth / product / cart / order / address / favorite / coupon）
│   ├── components/          # 公共组件（ProductCard / TabBar）
│   ├── mock/                # Mock.js 数据模拟（7 个模块）
│   ├── router/              # 路由配置 + 导航守卫
│   ├── store/               # Vuex 状态管理（user / cart / product / checkout）
│   ├── styles/              # 全局样式（SCSS 变量 + 全局样式）
│   ├── views/               # 页面组件（15 个页面）
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── tests/                   # 单元测试
├── Dockerfile               # 多阶段构建（Node 构建 + Nginx 部署）
├── nginx.conf               # Nginx 配置（SPA history fallback）
└── package.json
```

## 快速开始

### 方式一：Docker（推荐）

```bash
docker-compose up --build -d
```

访问 http://localhost:8081

### 方式二：本地开发

```bash
cd frontend-user
npm install
npm run dev
```

访问 http://localhost:8081

### 构建生产版本

```bash
cd frontend-user
npm run build
```

构建产物输出到 `frontend-user/dist/` 目录。

### 运行测试

```bash
cd frontend-user
npm test                # 运行单元测试
npm run test:coverage   # 运行测试并生成覆盖率报告
```

## 服务信息

| 服务 | 端口 | 说明 |
|------|------|------|
| frontend-user | 8081 | H5 移动端电商客户端 |

## 测试账号

| 用户名 | 密码 |
|--------|------|
| demo | 123456 |
| test | 123456 |

## Mock 接口清单

所有接口通过 Mock.js 在前端拦截，无需后端服务。

| 模块 | 接口数 | 说明 |
|------|--------|------|
| 认证 | 2 | 登录、注册 |
| 商品 | 5 | 轮播图、分类、推荐、商品列表、商品详情 |
| 购物车 | 5 | CRUD + 全选 |
| 订单 | 5 | 创建、列表、取消、支付、确认收货 |
| 地址 | 4 | CRUD |
| 收藏 | 4 | 列表、添加、取消、检查状态 |
| 优惠券 | 1 | 列表（按类型筛选） |

完整接口文档见 [docs/project_design.md](docs/project_design.md)。

## 设计文档

详细的系统架构、数据模型、状态管理、UI 规范等内容见 [项目设计文档](docs/project_design.md)。

## 依赖安全说明

项目存在 30 个 npm 依赖漏洞，均来自 Vue 2 / Vue CLI 底层依赖链（如 webpack-dev-server、postcss 等），需升级到 Vue 3 才能彻底解决，不影响生产环境运行。

> 当前 npm registry（npmmirror）不支持 `npm audit`，如需验证请切换到官方 registry：`npm audit --registry=https://registry.npmjs.org`
