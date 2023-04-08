import { Service } from 'egg';
import { createMathExpr } from 'svg-captcha';
import md5 from 'md5';
import { getNowFormatDate } from '../utils';


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
  [key: string]: any; // 其他字段
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
      // 密码加密
      params.password = md5(md5(params.password));
      const result = await app.mysql.get('user', params);
      // 更新登录时间
      await app.mysql.update('user', {
        last_login_time: getNowFormatDate(),
      }, {
        where: { phone: params.phone },
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 注册
  public async register(params: RegisterParams) {
    const { app } = this;
    try {
      // 密码加密
      params.password = md5(md5(params.password));
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
  // 获取用户信息
  public async getUserInfo(params) {
    const { app } = this;
    const { phone, username } = params;
    try {
      if (phone) {
        const result: any = await app.mysql.get('user', { phone });
        const { username } = result;
        // 获取题目审核通过的数量
        const approvedNums = await app.mysql.query(
          `select count(*) from questions where creator = '${username}' and chkState = 1`,
        );
        result.approvedNums = approvedNums[0]['count(*)'];

        return result;
      }
      if (username) {
        const result: any = await app.mysql.get('user', { username });
        return result;
      }
    } catch (err) {
      return null;
    }
  }
  // 更新用户信息
  public async updateUserInfo(params) {
    const { app } = this;

    try {
      params.password = md5(md5(params.password));
      const result = await app.mysql.update('user', params, {
        where: { phone: params.phone },
      });
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
  // 获取用户上传的题目
  public async getUserUploadQues(params) {
    const { app } = this;
    const { username } = params;
    console.log(username);
    try {
      const result: any = await app.mysql.select('questions', {
        where: { creator: username },
      });
      // 区分未审核和审核通过的题目
      const uncheck = result.filter((item: any) => item.chkState === 0);
      const checked = result.filter((item: any) => item.chkState === 1);
      return { uncheck, checked };
    } catch (err) {
      return null;
    }
  }
}
