// 配置统一返回格式

import { Context } from 'egg';

export default {
  success(this: Context, data: any, message = '请求成功', code = 200) {
    this.body = {
      data,
      message,
      success: true,
      code,
    };
  },
  fail(this: Context, message = '请求失败', code = 500) {
    this.body = {
      message,
      success: false,
      code,
    };
  },
};
