import { Service } from 'egg';

export default class comment extends Service {
  // 添加评论
  public async addComment(params) {
    const { app } = this;
    const { userId } = params;
    try {
      // 查找用户是否存在
      const user: any = await app.mysql.get('user', { userId });
      if (!user) {
        return null;
      }
      const data = {
        user_id: userId,
        content: params.content,
        username: user.username,
        avatar: user.avatar,
      };
      const result = await app.mysql.insert('comment', data);
      return result;
    } catch (err) {
      return null;
    }
  }
  // 获取评论列表
  public async getCommentList() {
    const { app } = this;
    try {
      const result: any = await app.mysql.select('comment');
      // 根据时间排序
      result.sort((a, b) => {
        return b.create_time - a.create_time;
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 删除评论
  public async deleteComment(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('comment', { id });
      return result;
    } catch (err) {
      return null;
    }
  }
}
