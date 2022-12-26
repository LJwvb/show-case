import { Service } from 'egg';

interface IQuestion {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  subjectID: number; // 科目ID
  catalogID: number; // 章节ID
}

interface IGetNoChkQuestions {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
}

interface IChkQuestions {
  id: number | string; // 题目ID
  chkState?: 0 | 1 | 2; // 审核状态 0:未审核 1:审核通过 2:审核不通过
  chkUser?: string; // 审核人
  chkRemarks?: string; // 审核备注
  chkDate?: string; // 审核时间
  publishDate?: string; // 发布时间
  publishState?: 0 | 1 | 2; // 发布状态 0:未发布 1:已发布 2:已下架
}

interface IUploadQuestions {
  subjectID: number; // 科目ID
  catalogID: number; // 章节ID
  question: string; // 题干
  answer: string; // 答案
  addDate: string; // 添加时间
  tags: string; // 标签
  questionType: '单选题' | '多选题' | '判断题' | '填空题' | '简答题'; // 题目类型
  remarks?: string; // 备注
  number?: number; // 试题编号
  direction: string; // 题目方向
  difficulty: '简单' | '中等' | '困难'; // 难度
  isChoice?: 0 | 1; // 是否精选 0:否 1:是
  publishState?: 0 | 1 | 2; // 发布状态 0:未发布 1:已发布 2:已下架
  publishDate?: string; // 发布时间
  chkState?: 0 | 1 | 2; // 审核状态 0:未审核 1:审核通过 2:审核不通过
  chkUser?: string; // 审核人
  chkRemarks?: string; // 审核备注
  chkDate?: string; // 审核时间
  creator: string; // 创建人
}

export default class questions extends Service {
  // 获取题目
  public async getQuestions(params: IQuestion) {
    const { app } = this;
    const { currentPage, pageSize, subjectID, catalogID } = params;
    const offset = currentPage * pageSize;
    const limit = pageSize;
    try {
      const result = await app.mysql.select('questions', {
        where: { subjectID, catalogID },
        offset,
        limit,
      });
      // 去除未审核的题目
      const filterResult = result.filter((item: any) => item.chkState === 1);
      // 获取所有题目总数
      const count = await app.mysql.query(
        `select count(*) as count from questions where subjectID = ${subjectID} and catalogID = ${catalogID}`,
      );
      return {
        result: filterResult,
        total: count[0].count - filterResult.length,
      };
    } catch (err) {
      return null;
    }
  }
  // 所有未审核的题目
  public async getNoChkQuestions(params: IGetNoChkQuestions) {
    const { currentPage, pageSize } = params;
    const offset = currentPage * pageSize;
    const limit = pageSize;
    const { app } = this;
    try {
      const result = await app.mysql.select('questions', {
        where: { chkState: 0 },
        offset,
        limit,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 审核题目
  public async chkQuestions(params: IChkQuestions) {
    const { app } = this;
    try {
      const result = await app.mysql.update('questions', params, {
        where: { id: params.id },
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 上传题目
  public async uploadQuestions(params: IUploadQuestions) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('questions', params);
      return result;
    } catch (err) {
      return null;
    }
  }
}
