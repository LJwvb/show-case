/* eslint-disable comma-dangle */
import { Controller } from 'egg';
import { getNowFormatDate, removePassword } from '../utils';

export default class admin extends Controller {
  // 管理员登录
  public async adminLogin() {
    const { ctx } = this;
    const { name, password } = ctx.request.body;
    if (!name || !password) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const data = await ctx.service.admin.adminLogin(ctx.request.body);
    if (data) {
      const returnData = removePassword(data);
      ctx.success(returnData, '登录成功');
    } else {
      ctx.fail('账号或密码错误，登录失败');
    }
  }
  // 修改密码
  public async editAdminPassword() {
    const { ctx } = this;
    const { password } = ctx.request.body;
    if (!password) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.admin.editAdminPassword(ctx.request.body);
    if (result) {
      ctx.success(null, '修改成功~');
    } else {
      ctx.fail('修改失败,请重新修改~');
    }
  }
  // 获取用户列表
  public async getUserList() {
    const { ctx } = this;

    const result = await ctx.service.admin.getUserList();

    if (result) {
      // 去除密码
      // const returnData = removePassword(result);
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取用户列表失败');
    }
  }
  // 获取未审核题目
  public async getNoChkQuestions() {
    const { ctx } = this;
    const result = await ctx.service.admin.getNoChkQuestions(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 所有已审核的题目
  public async getAllChkQuestions() {
    const { ctx } = this;
    const result = await ctx.service.admin.getAllChkQuestions(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 审核题目
  public async chkQuestions() {
    const { ctx } = this;
    const { id, chkState, chkUser, chkRemarks, creator } = ctx.request.body;
    if (!id || !chkState) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.admin.chkQuestions({
      id,
      chkState,
      chkUser,
      creator,
      chkRemarks,
      chkDate: getNowFormatDate(),
      publishDate: getNowFormatDate(),
      publishState: 1,
    });
    if (result) {
      ctx.success(null, '审核成功~');
    } else {
      ctx.fail('审核失败,请重新审核~');
    }
  }
  // 删除题目
  public async deleteQuestions() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.admin.deleteQuestions({
      id,
    });
    if (result) {
      ctx.success(null, '删除成功~');
    } else {
      ctx.fail('删除失败,请重新删除~');
    }
  }
  // 审核试卷
  public async chkPaper() {
    const { ctx } = this;
    const { paperId, chkState } = ctx.request.body;
    const result = await ctx.service.admin.chkPaperQuestions({
      paperId,
      chkState,
    });
    if (result) {
      ctx.success(result, '审核通过');
    } else {
      ctx.fail('失败~');
    }
  }
  // 所有未审核的试卷
  public async getNoChkPaper() {
    const { ctx } = this;
    const result = await ctx.service.admin.getNoChkPaper(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 所有已审核的试卷
  public async getAllChkPaper() {
    const { ctx } = this;
    const result = await ctx.service.admin.getAllChkPaper(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 删除试卷
  public async deletePaper() {
    const { ctx } = this;
    const { paperId } = ctx.request.body;
    const result = await ctx.service.admin.deletePaper({
      paperId,
    });
    if (result) {
      ctx.success(null, '删除成功~');
    } else {
      ctx.fail('删除失败,请重新删除~');
    }
  }
  // 删除用户I
  public async deleteUser() {
    const { ctx } = this;
    const { userId } = ctx.request.body;
    const result = await ctx.service.admin.deleteUser({
      userId,
    });
    if (result) {
      ctx.success(null, '删除成功~');
    } else {
      ctx.fail('删除失败,请重新删除~');
    }
  }
}
