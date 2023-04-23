import { Controller } from 'egg';
import { getNowFormatDate } from '../utils';

export default class questions extends Controller {
  // 获取审核后的题目
  public async getQuestions() {
    const { ctx } = this;
    const result = await ctx.service.questions.getQuestions(ctx.request.body);

    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 题目详情
  public async getQuestionDetail() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.fail('题目id不能为空');
      return;
    }
    const result = await ctx.service.questions.getQuestionDetail({ id });
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 上传题目
  public async uploadQuestions() {
    const { ctx } = this;
    const { question, answer, questionType, difficulty } = ctx.request.body;
    if (!question || !answer || !questionType || !difficulty) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.uploadQuestions({
      ...ctx.request.body,
      addDate: getNowFormatDate(),
      chkState: 0,
      isChoice: 0,
      publishState: 0,
      catalogID: 0, // 最新
    });
    if (result) {
      ctx.success(null, '上传成功,请等待审核~');
    } else {
      ctx.fail('上传失败,请重新上传~');
    }
  }

  // 每日一练
  public async getDailyQuestions() {
    const { ctx } = this;
    const result = await ctx.service.questions.getDailyQuestions();
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 点赞题目
  public async likeQuestions() {
    const { ctx } = this;
    const { id, creator, username } = ctx.request.body;
    if (!id || !creator || !username) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.likeQuestions({
      id,
      creator,
      username,
    });
    if (result) {
      ctx.success(null, '点赞成功~');
    } else {
      ctx.fail('点赞失败,请重新点赞~');
    }
  }
  // 取消点赞题目
  public async cancelLikeQuestions() {
    const { ctx } = this;
    const { id, creator, username } = ctx.request.body;
    if (!id || !creator || !username) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.cancelLikeQuestions({
      id,
      creator,
      username,
    });
    if (result) {
      ctx.success(null, '取消点赞成功~');
    } else {
      ctx.fail('取消点赞失败,请重新取消点赞~');
    }
  }
  // 浏览数
  public async addBrowsesNum() {
    const { ctx } = this;
    const { id, username } = ctx.request.body;
    if (!id) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.questions.addBrowsesNum({
      id,
      username,
    });
    if (result) {
      ctx.success(null, '');
    } else {
      ctx.fail('浏览失败,请重新浏览~');
    }
  }
  // 相似题目
  public async getSimilarQuestions() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const result = await ctx.service.questions.getSimilarQuestions({
      id,
    });
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 搜索题目
  public async searchQuestions() {
    const { ctx } = this;
    const result = await ctx.service.questions.searchQuestions(ctx.request.body);
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
}
