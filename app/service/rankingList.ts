import { Service } from 'egg';

export default class RankingList extends Service {
  public async getRankingList() {
    const { app } = this;
    try {
      const result:any = await app.mysql.select('ranking_list');
      // 如果get_likes_num和upload_ques_num其中为0，就去除这一条数据
      for (let i = 0; i < result.length; i++) {
        if (result[i].get_likes_num === 0 && result[i].upload_ques_num === 0) {
          result.splice(i, 1);
          i--;
        }
      }
      // 将排行榜按照点赞数量+上传题目数量排序
      result.sort((a: any, b: any) => {
        return (
          b.get_likes_num +
          b.upload_ques_num -
          (a.get_likes_num + a.upload_ques_num)
        );
      });
      return result;
    } catch (err) {
      return null;
    }
  }
}
