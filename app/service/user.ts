import { Service } from 'egg';
import { createMathExpr } from 'svg-captcha';
import md5 from 'md5';

interface LoginParams {
  password: string; // 密码
  phone: string; // 手机号
}
interface RegisterParams {
  username: string; // 用户名
  password: string; // 密码
  phone: string; // 手机号
  sex: string; // 性别
  email: string; // 邮箱
  ctime: string; // 创建时间
  avatar: string; // 头像
  last_login_time: string; // 最后登录时间
}
interface CaptchaParams {
  width: number; // 宽度
  height: number; // 高度
  fontSize?: number; // 字体大小
  noise?: number; // 干扰线条的数量
  color?: boolean; // 验证码的字符是否有颜色
  background?: string; // 验证码图片背景颜色
}

export default class User extends Service {
  // 登录
  public async login(params: LoginParams) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', params);
      return result;
    } catch (err) {
      return null;
    }
  }
  // 注册
  public async register(params: RegisterParams) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      // 往排行榜中插入这一条数据
      await app.mysql.insert('ranking_list', {
        username: params.username,
        avatar: params.avatar,
        upload_ques_num: 0,
        get_likes_num: 0,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  public async getUserByName(val: string) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { val });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 更新用户信息
  public async updateUserInfo(params) {
    const { app } = this;
    try {
      await app.mysql.update('user', params, {
        where: { phone: params.phone },
      });
    } catch (err) {
      return null;
    }
  }
  // 获取用户列表
  public async getUserList() {
    const { app } = this;
    // 新建长度为23的数组，用来存放用户信息

    try {
      const result = await app.mysql.select('user');

      return result;
    } catch (err) {
      return null;
    }
  }

  // 验证码
  public async captcha(params: CaptchaParams) {
    const {
      width,
      height,
      fontSize = 36,
      noise = 4,
      color = true,
      background,
    } = params;
    if (!width || !height) {
      return 'width and height are required';
    }

    const { data, text } = createMathExpr({
      size: 4,
      ignoreChars: '0o1i',
      width,
      height,
      fontSize,
      noise,
      color,
      background,
    });

    return {
      data,
      text: md5(text),
    };
  }
  // 管理员登录
  public async adminLogin(params) {
    const { app } = this;
    try {
      const result = await app.mysql.get('admin', params);
      return result;
    } catch (err) {
      return null;
    }
  }
}
