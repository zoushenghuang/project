# Mac 连接服务器指南

## 📋 服务器信息

- **公网 IP**: 43.139.188.39
- **内网 IP**: 10.1.0.13
- **默认端口**: 22 (SSH)

---

## 🔐 方法一：使用密码连接（首次连接推荐）

### 1. 打开终端

在 Mac 上打开「终端」（Terminal）应用：
- 按 `Command + 空格` 搜索 "终端"
- 或打开「应用程序」→「实用工具」→「终端」

### 2. 连接服务器

```bash
ssh root@43.139.188.39
```

或者指定端口（如果不是默认 22 端口）：
```bash
ssh -p 22 root@43.139.188.39
```

### 3. 首次连接确认

第一次连接时会提示：
```
The authenticity of host '43.139.188.39 (43.139.188.39)' can't be established.
ECDSA key fingerprint is SHA256:xxxxx.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

输入 `yes` 并按回车。

### 4. 输入密码

输入服务器 root 用户的密码（输入时不会显示，这是正常的）。

### 5. 连接成功

看到类似以下提示说明连接成功：
```
Welcome to Ubuntu 22.04 LTS
...
root@your-server:~#
```

---

## 🔑 方法二：使用 SSH 密钥连接（推荐，更安全）

### 1. 检查是否已有 SSH 密钥

```bash
ls -la ~/.ssh
```

如果看到 `id_rsa` 和 `id_rsa.pub`（或 `id_ed25519` 和 `id_ed25519.pub`），说明已有密钥。

### 2. 生成 SSH 密钥（如果没有）

```bash
# 使用 RSA 算法（兼容性好）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 或使用 Ed25519 算法（更安全，推荐）
ssh-keygen -t ed25519 -C "your_email@example.com"
```

按提示操作：
- 保存位置：直接回车使用默认位置 `~/.ssh/id_rsa`
- 设置密码：可以设置密码保护密钥，或直接回车跳过

### 3. 复制公钥到服务器

#### 方法 A：使用 ssh-copy-id（最简单）

```bash
ssh-copy-id root@43.139.188.39
```

输入密码后，公钥会自动复制到服务器。

#### 方法 B：手动复制

```bash
# 1. 查看公钥内容
cat ~/.ssh/id_rsa.pub
# 或
cat ~/.ssh/id_ed25519.pub

# 2. 复制输出的内容（从 ssh-rsa 或 ssh-ed25519 开始到邮箱结束）

# 3. 连接到服务器
ssh root@43.139.188.39

# 4. 在服务器上执行（创建 .ssh 目录并添加公钥）
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴刚才复制的公钥内容，保存退出（Ctrl+X, Y, Enter）
chmod 600 ~/.ssh/authorized_keys
```

### 4. 测试密钥连接

```bash
ssh root@43.139.188.39
```

如果配置成功，应该可以直接连接，不需要输入密码。

---

## ⚙️ 方法三：配置 SSH Config（推荐，最方便）

### 1. 创建/编辑 SSH 配置文件

```bash
nano ~/.ssh/config
```

### 2. 添加服务器配置

```bash
Host blog-server
    HostName 43.139.188.39
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    # 如果使用 Ed25519 密钥
    # IdentityFile ~/.ssh/id_ed25519
```

保存退出（`Ctrl + X`，然后 `Y`，然后 `Enter`）。

### 3. 设置配置文件权限

```bash
chmod 600 ~/.ssh/config
```

### 4. 使用别名连接

现在可以直接使用别名连接：

```bash
ssh blog-server
```

---

## 🛠️ 常用 SSH 命令

### 基本连接

```bash
# 使用密码连接
ssh root@43.139.188.39

# 使用密钥连接
ssh -i ~/.ssh/id_rsa root@43.139.188.39

# 指定端口
ssh -p 2222 root@43.139.188.39

# 使用别名（配置了 SSH config 后）
ssh blog-server
```

### 执行远程命令

```bash
# 执行单个命令
ssh root@43.139.188.39 "ls -la"

# 执行多个命令
ssh root@43.139.188.39 "cd /var/www/blog && ls -la"
```

### 文件传输

#### 使用 SCP 上传文件

```bash
# 上传单个文件
scp /path/to/local/file.txt root@43.139.188.39:/var/www/blog/

# 上传整个目录
scp -r /path/to/local/directory root@43.139.188.39:/var/www/blog/

# 使用密钥
scp -i ~/.ssh/id_rsa file.txt root@43.139.188.39:/var/www/blog/
```

#### 使用 SCP 下载文件

```bash
# 下载单个文件
scp root@43.139.188.39:/var/www/blog/file.txt ~/Downloads/

# 下载整个目录
scp -r root@43.139.188.39:/var/www/blog/backend ~/Downloads/
```

#### 使用 rsync（推荐，支持断点续传）

```bash
# 上传（同步）
rsync -avz --progress /path/to/local/ root@43.139.188.39:/var/www/blog/

# 下载（同步）
rsync -avz --progress root@43.139.188.39:/var/www/blog/ ~/Downloads/

# 排除 node_modules
rsync -avz --progress --exclude 'node_modules' --exclude '.git' \
  /path/to/local/ root@43.139.188.39:/var/www/blog/
```

---

## 🔍 常见问题排查

### 1. 连接超时

**问题**: `ssh: connect to host 43.139.188.39 port 22: Operation timed out`

**解决方法**:
```bash
# 检查服务器是否开启
ping 43.139.188.39

# 检查防火墙是否开放 22 端口
# 在服务器上执行
sudo ufw status
sudo ufw allow 22

# 检查服务器 SSH 服务是否运行
# 在服务器上执行
sudo systemctl status ssh
```

### 2. 权限被拒绝

**问题**: `Permission denied (publickey,password)`

**解决方法**:
```bash
# 检查密钥权限
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# 检查服务器上的 authorized_keys 权限
# 在服务器上执行
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# 尝试使用密码连接
ssh -o PreferredAuthentications=password root@43.139.188.39
```

### 3. 主机密钥验证失败

**问题**: `Host key verification failed`

**解决方法**:
```bash
# 删除旧的主机密钥
ssh-keygen -R 43.139.188.39

# 或编辑 known_hosts 文件
nano ~/.ssh/known_hosts
# 删除包含 43.139.188.39 的行
```

### 4. 连接后立即断开

**问题**: 连接成功但立即断开

**解决方法**:
```bash
# 检查服务器 SSH 配置
# 在服务器上执行
sudo nano /etc/ssh/sshd_config
# 确保以下配置正确：
# PermitRootLogin yes
# PasswordAuthentication yes
# PubkeyAuthentication yes

# 重启 SSH 服务
sudo systemctl restart ssh
```

### 5. 查看详细连接信息

```bash
# 使用详细模式连接，查看具体错误
ssh -v root@43.139.188.39
# 或更详细
ssh -vvv root@43.139.188.39
```

---

## 📝 快速连接脚本

创建一个快速连接脚本：

```bash
# 创建脚本
nano ~/connect-blog.sh
```

添加内容：
```bash
#!/bin/bash
ssh root@43.139.188.39
```

设置执行权限：
```bash
chmod +x ~/connect-blog.sh
```

使用：
```bash
~/connect-blog.sh
```

---

## 🔒 安全建议

1. **使用密钥认证**：比密码更安全
2. **禁用密码登录**（配置好密钥后）：
   ```bash
   # 在服务器上编辑
   sudo nano /etc/ssh/sshd_config
   # 修改：PasswordAuthentication no
   sudo systemctl restart ssh
   ```
3. **修改默认端口**（可选）：
   ```bash
   # 在服务器上编辑
   sudo nano /etc/ssh/sshd_config
   # 修改：Port 2222（或其他端口）
   ```
4. **使用非 root 用户**（可选）：
   ```bash
   # 创建新用户
   sudo adduser yourname
   sudo usermod -aG sudo yourname
   ```

---

## 🚀 快速开始部署

连接成功后，可以开始部署：

```bash
# 1. 连接服务器
ssh root@43.139.188.39

# 2. 更新系统
sudo apt update && sudo apt upgrade -y

# 3. 安装 Node.js（使用 nvm）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# 4. 安装 PM2
npm install -g pm2

# 5. 安装 Nginx
sudo apt install -y nginx

# 6. 创建项目目录
mkdir -p /var/www/blog
cd /var/www/blog

# 7. 上传项目文件（在 Mac 上执行）
# scp -r /Users/zoushenghuang/project/blog/myBlog/* root@43.139.188.39:/var/www/blog/
```

---

## 📞 需要帮助？

如果遇到连接问题，可以：
1. 检查服务器控制台是否显示服务器运行正常
2. 确认防火墙规则是否开放 22 端口
3. 查看服务器日志：`sudo journalctl -u ssh`
4. 使用 `-v` 参数查看详细连接信息

