import { Service } from 'egg';

export default class RankingList extends Service {
  public async getRankingList() {
    const { app } = this;
    try {
      const result = await app.mysql.select('ranking_list');
      // 将排行榜按照点赞数量高低排序
      result.sort((a: any, b: any) => b.get_likes_num - a.get_likes_num);
      return result;
    } catch (err) {
      return null;
    }
  }
}
