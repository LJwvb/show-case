import { Controller } from 'egg';

export default class comment extends Controller {
  // 添加评论
  public async addComment() {
    const { ctx } = this;
    const { content, userId } = ctx.request.body;
    if (!content || !userId) {
      ctx.fail('请填写完整信息~');
      return;
    }
    const result = await ctx.service.comment.addComment(ctx.request.body);
    if (result) {
      ctx.success(null, '评论成功~');
    } else {
      ctx.fail('评论失败~');
    }
  }
  // 获取评论列表
  public async getCommentList() {
    const { ctx } = this;
    const result = await ctx.service.comment.getCommentList();
    if (result) {
      ctx.success(result, '请求成功');
    } else {
      ctx.fail('获取评论列表失败');
    }
  }
  // 删除评论
  public async deleteComment() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.fail('id不能为空~');
      return;
    }
    const result = await ctx.service.comment.deleteComment(id);
    if (result) {
      ctx.success(null, '删除成功~');
    } else {
      ctx.fail('删除失败~');
    }
  }
}

