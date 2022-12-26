import { Controller } from 'egg';
import { getNowFormatDate } from '../utils';

export default class User extends Controller {
  // 登录
  public async login() {
    const { ctx } = this;
    const { password, phone } = ctx.request.body;
    const data = await ctx.service.user.login({ password, phone });
    if (!phone || !password) {
      ctx.fail('账号密码不能为空');
      return;
    }
    if (data) {
      await ctx.service.user.updateUserInfo({
        last_login_time: getNowFormatDate(),
        phone,
      });
      // 去除密码
      const returnData = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (key === 'password') {
            return undefined;
          }
          return value;
        }),
      );
      ctx.success(returnData, '登录成功');
    } else {
      ctx.fail('账号或密码错误，登录失败');
    }
  }
  // 注册
  public async register() {
    const { ctx } = this;
    const { username, email, password, phone, sex } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    const defaultAvatar =
      'https://c-ssl.dtstatic.com/uploads/blog/202104/22/20210422220419_1797f.thumb.1000_0.jpg';
    if (!email || !password) {
      ctx.fail('账号密码不能为空');
      return;
    }
    if (userInfo) {
      ctx.fail('账户已被注册，请重新输入');
      return;
    }
    const result = await ctx.service.user.register({
      username,
      password,
      sex,
      email,
      phone,
      ctime: getNowFormatDate(),
      last_login_time: getNowFormatDate(),
      avatar: defaultAvatar,
    });
    if (result) {
      ctx.success(null, '注册成功');
    } else {
      ctx.fail('服务出错啦');
    }
  }
  public async captcha() {
    const { ctx } = this;
    const data = await ctx.service.user.captcha(ctx.request.body);
    if (typeof data === 'string') {
      ctx.fail(data);
      return;
    }
    if (data?.data) {
      ctx.success(data);
    } else {
      ctx.fail('验证码生成失败');
    }
  }
}
