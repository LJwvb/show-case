import { Controller } from 'egg';
import { getNowFormatDate } from '../utils';

export default class questions extends Controller {
  public async getQuestions() {
    const { ctx } = this;
    const { currentPage, pageSize, subjectID, catalogID } = ctx.request.body;
    const result = await ctx.service.questions.getQuestions({
      currentPage,
      pageSize,
      subjectID,
      catalogID,
    });

    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  public async uploadQuestions() {
    const { ctx } = this;
    const {
      subjectID,
      catalogID,
      question,
      answer,
      tags,
      questionType,
      direction,
      difficulty,
    } = ctx.request.body;
    if (
      !subjectID ||
      !catalogID ||
      !question ||
      !answer ||
      !tags ||
      !questionType ||
      !direction ||
      !difficulty
    ) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.uploadQuestions({
      ...ctx.request.body,
      addDate: getNowFormatDate(),
      chkState: 0,
      isChoice: 0,
      publishState: 0,
    });
    if (result) {
      ctx.success(null, '上传成功,请等待审核~');
    } else {
      ctx.fail('上传失败,请重新上传~');
    }
  }

  public async getNoChkQuestions() {
    const { ctx } = this;
    const { currentPage, pageSize } = ctx.request.body;
    const result = await ctx.service.questions.getNoChkQuestions({
      currentPage,
      pageSize,
    });
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 审核题目
  public async chkQuestions() {
    const { ctx } = this;
    const { id, chkState, chkUser, chkRemarks } = ctx.request.body;
    if (!id || !chkState) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.chkQuestions({
      id,
      chkState,
      chkUser,
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
}
