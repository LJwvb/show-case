import { Controller } from 'egg';
import { subjectList } from '../utils';

export default class RankingList extends Controller {
  public async getSubjectList() {
    const { ctx } = this;
    const result = subjectList;
    ctx.success(result, '请求成功');
  }
}
