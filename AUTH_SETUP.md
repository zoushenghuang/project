# 登录认证系统配置说明

## 概述

已为博客管理系统添加了完整的登录认证功能。

## 后端配置

### 1. 创建的文件

```
backend/src/auth/
├── auth.controller.ts   # 认证控制器
├── auth.service.ts      # 认证服务
└── auth.module.ts       # 认证模块
```

### 2. API 接口

#### 登录接口
- **URL**: `POST /api/auth/login`
- **请求体**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **响应**:
```json
{
  "status": "ok",
  "type": "account",
  "currentAuthority": "admin",
  "token": "mock-token-1",
  "user": {
    "id": 1,
    "name": "管理员",
    "avatar": "https://...",
    "email": "admin@example.com"
  }
}
```

#### 获取当前用户
- **URL**: `GET /api/auth/currentUser`
- **响应**:
```json
{
  "success": true,
  "data": {
    "name": "管理员",
    "avatar": "https://...",
    "userid": "1",
    "email": "admin@example.com",
    ...
  }
}
```

#### 退出登录
- **URL**: `POST /api/auth/logout`
- **响应**:
```json
{
  "success": true
}
```

### 3. 默认账户

目前系统内置了一个测试账户：
- **用户名**: `admin`
- **密码**: `admin123`

⚠️ **注意**: 这是一个简单的实现，生产环境需要：
1. 使用数据库存储用户信息
2. 密码需要使用 bcrypt 等加密
3. 实现 JWT token 认证
4. 添加权限控制

## 前端配置

### 1. 修改的文件

- `antdPro/src/services/ant-design-pro/api.ts` - 更新 API 接口路径
- `antdPro/src/pages/user/login/index.tsx` - 简化登录页面

### 2. 登录流程

1. 用户在 `/user/login` 页面输入用户名和密码
2. 前端调用 `/api/auth/login` 接口
3. 后端验证用户名密码
4. 返回用户信息和 token
5. 前端保存用户信息到全局状态
6. 跳转到首页 `/dashboard`

### 3. 登录页面

- 简化为只有账号密码登录
- 移除了手机号登录和第三方登录
- 显示默认账号提示

## 启动系统

### 1. 启动后端

```bash
cd backend
npm install
npm run start:dev
```

后端将运行在: http://localhost:3001

### 2. 启动前端

```bash
cd antdPro
npm install
npm run start:dev
```

前端将运行在: http://localhost:8000

### 3. 登录

访问 http://localhost:8000/user/login

使用默认账户登录：
- 用户名: `admin`
- 密码: `admin123`

## 测试 API

可以使用 curl 或 Postman 测试：

```bash
# 登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取当前用户
curl http://localhost:3001/api/auth/currentUser

# 退出登录
curl -X POST http://localhost:3001/api/auth/logout
```

## 后续改进建议

### 安全性
1. **密码加密**: 使用 bcrypt 加密存储密码
2. **JWT Token**: 实现真正的 JWT token 认证
3. **Token 刷新**: 实现 token 刷新机制
4. **HTTPS**: 生产环境使用 HTTPS

### 功能增强
1. **用户管理**: 添加用户增删改查功能
2. **角色权限**: 实现基于角色的权限控制
3. **登录日志**: 记录登录历史
4. **密码重置**: 实现忘记密码功能
5. **多因素认证**: 添加 2FA 支持

### 数据库集成
```typescript
// 创建 User Entity
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // 加密后的密码

  @Column()
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 常见问题

### Q: 登录后刷新页面会退出登录？
A: 目前没有实现 token 持久化，需要添加 localStorage 或 sessionStorage 存储。

### Q: 如何添加新用户？
A: 目前用户是硬编码的，需要创建用户管理功能或直接在数据库添加。

### Q: 如何修改密码？
A: 需要在 `auth.service.ts` 中修改 users 数组，或实现密码修改功能。

### Q: 如何实现权限控制？
A: 可以使用 Ant Design Pro 的 access 系统配合后端角色实现。

## 相关文档

- [Ant Design Pro - 权限管理](https://pro.ant.design/zh-CN/docs/authority-management)
- [NestJS - Authentication](https://docs.nestjs.com/security/authentication)
- [JWT 官方文档](https://jwt.io/)
