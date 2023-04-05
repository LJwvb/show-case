import { Controller } from 'egg';
import { getNowFormatDate } from '../utils';

export default class paper extends Controller {
  // 组卷
  public async getPaperQuestions() {
    const { ctx } = this;
    const { ids, author, paperTitle, paperTags, purview } = ctx.request.body;
    const arrayIds = ids.split(',');
    if (!paperTitle) {
      ctx.fail('请填写完整信息~');
      return;
    }
    // 不能少于5道题
    if (arrayIds.length < 5) {
      ctx.fail('组卷失败,题目数量不能少于5道~');
      return;
    }
    // 不能大于20道题
    if (arrayIds.length > 20) {
      ctx.fail('组卷失败,题目数量不能大于20道~');
      return;
    }
    const result = await ctx.service.paper.getPaperQuestions({
      ids,
      author,
      paper_title: paperTitle,
      paper_tags: paperTags,
      purview,
      ctime: getNowFormatDate(),
      chkState: Number(purview) === 1 ? 0 : 1,
    });
    if (result) {
      ctx.success(null, '组卷成功~');
    } else {
      ctx.fail('组卷失败,请重新组卷~');
    }
  }
  // 获取组卷列表
  public async getPaperQuestionsList() {
    const { ctx } = this;
    const { currentPage, pageSize, author, type } = ctx.request.body;
    const result = await ctx.service.paper.getPaperQuestionsList({
      currentPage,
      pageSize,
      author,
      type,
    });
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
  // 试卷详情
  public async getPaperQuestionsDetail() {
    const { ctx } = this;
    const { paperId } = ctx.request.body;
    const result = await ctx.service.paper.getPaperQuestionsDetail({
      paperId,
    });
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取题目失败~');
    }
  }
}
