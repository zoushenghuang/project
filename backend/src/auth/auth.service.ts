import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  // 简单的用户验证，实际项目应该从数据库查询
  private readonly users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123', // 实际项目应该使用加密密码
      name: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'admin@example.com',
    },
  ];

  async login(loginDto: { username: string; password: string }) {
    const { username, password } = loginDto;
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 实际项目应该生成 JWT token
    const token = `mock-token-${user.id}`;

    return {
      status: 'ok',
      type: 'account',
      currentAuthority: 'admin',
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      },
    };
  }

  async getCurrentUser() {
    // 简单实现，实际应该从 token 中获取
    const user = this.users[0];
    return {
      success: true,
      data: {
        name: user.name,
        avatar: user.avatar,
        userid: user.id.toString(),
        email: user.email,
        signature: '海纳百川，有容乃大',
        title: '管理员',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          { key: '0', label: '很有想法的' },
          { key: '1', label: '专注设计' },
          { key: '2', label: '辣~' },
          { key: '3', label: '大长腿' },
          { key: '4', label: '川妹子' },
          { key: '5', label: '海纳百川' },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: 'admin',
        geographic: {
          province: { label: '浙江省', key: '330000' },
          city: { label: '杭州市', key: '330100' },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
      },
    };
  }
}
