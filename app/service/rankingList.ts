import { Service } from 'egg';

export default class RankingList extends Service {
  public async getRankingList() {
    const { app } = this;
    try {
      const result = await app.mysql.select('ranking_list');
      return result;
    } catch (err) {
      return null;
    }
  }
}
