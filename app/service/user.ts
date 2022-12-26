import { Service } from 'egg';
import { createMathExpr } from 'svg-captcha';
import md5 from 'md5';

interface LoginParams {
  password: string;
  phone: string;
}
interface RegisterParams {
  username: string;
  password: string;
  phone: string;
  sex: string;
  email: string;
  ctime: string;
  avatar: string;
  last_login_time: string;
}
interface CaptchaParams {
  width?: number;
  height?: number;
  fontSize?: number;
  noise?: number;
  color?: boolean;
  background?: string;
}

export default class User extends Service {
  // 登录
  public async login(params: LoginParams) {
    const { app } = this;
    console.log(params, 'params');
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
      return result;
    } catch (err) {
      return null;
    }
  }
  public async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 更新用户信息
  public async updateUserInfo(params) {
    const { app } = this;
    console.log(params, 'params');
    try {
      await app.mysql.update('user', params, {
        where: { phone: params.phone },
      });
    } catch (err) {
      return null;
    }
  }
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
}
