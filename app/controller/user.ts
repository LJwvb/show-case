import { Controller } from 'egg';
import { getNowFormatDate, removePassword } from '../utils';

export default class User extends Controller {
  // 登录
  public async login() {
    const { ctx } = this;
    const { password, phone } = ctx.request.body;
    if (!phone || !password) {
      ctx.fail('账号密码不能为空');
      return;
    }
    const data = await ctx.service.user.login({ password, phone });

    if (data) {
      await ctx.service.user.updateUserInfo({
        last_login_time: getNowFormatDate(),
        phone,
      });
      // 去除密码
      const returnData = removePassword(data);
      ctx.success(returnData, '登录成功');
    } else {
      ctx.fail('账号或密码错误，登录失败');
    }
  }
  // 注册
  public async register() {
    const { ctx } = this;
    const { username, email, password, phone, sex } = ctx.request.body;
    const userInfoPhone = await ctx.service.user.getUserInfo({
      phone,
    });
    const userInfoUserName = await ctx.service.user.getUserInfo({
      username,
    });
    const defaultAvatar = 'https://img95.699pic.com/xsj/1p/0r/j2.jpg%21/fh/300';
    if (!email || !password) {
      ctx.fail('账号密码不能为空');
      return;
    }
    if (userInfoPhone) {
      ctx.fail('该手机号已被注册，请重新输入');
      return;
    }
    if (userInfoUserName) {
      ctx.fail('该用户名已被注册，请重新输入');
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
  // 验证码
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
  // 获取用户信息
  public async getUserInfo() {
    const { ctx } = this;
    const result = await ctx.service.user.getUserInfo(ctx.request.body);
    if (result) {
      // 去除密码
      const returnData = removePassword(result);
      ctx.success(returnData, '请求成功');
    } else {
      ctx.fail('获取用户信息失败');
    }
  }
  // 编辑信息
  public async updateUserInfo() {
    const { ctx } = this;
    const result = await ctx.service.user.updateUserInfo(ctx.request.body);
    if (result) {
      ctx.success(null, '修改成功');
    } else {
      ctx.fail('修改失败');
    }
  }
  // 获取用户上传的题目
  public async getUserUploadQues() {
    const { ctx } = this;
    const result = await ctx.service.user.getUserUploadQues(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('请求失败');
    }
  }
}
