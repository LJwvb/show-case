import { Service } from 'egg';

interface IQuestion {
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  subjectID: number; // 科目ID
  catalogID: number; // 章节ID
}

interface IChkQuestions {
  id: number | string; // 题目ID
  chkState?: 0 | 1 | 2; // 审核状态 0:未审核 1:审核通过 2:审核不通过
  chkUser?: string; // 审核人
  creator?: string; // 创建人
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
  questionType: 0 | 1 | 2 | 3 | 4; // 题目类型 0: '单选题' 1: '多选题' 2: '判断题' 3: '填空题'4: '简答题'
  remarks?: string; // 备注
  number?: number; // 试题编号
  direction: string; // 题目方向
  difficulty: 0 | 1 | 2; // 难度 0:'简单'1:'中等'2:'困难'
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
    const { subjectID, catalogID } = params;
    try {
      if (subjectID === -1) {
        const result = await app.mysql.select('questions', {
          where: { catalogID },
        });
        // 去除未审核的题目,把tags转换成数组
        // const filterResult = result.filter((item: any) => item?.chkState === 1);
        result.forEach((item: any) => {
          item.tags = item?.tags?.split(',');
        });

        console.log(result);
        // 获取所有题目总数
        const count = await app.mysql.query(
          `select count(*) as count from questions where catalogID = ${catalogID}`,
        );
        return {
          result,
          total: count[0].count,
        };
      }
      const result = await app.mysql.select('questions', {
        where: { subjectID, catalogID },
      });
      // 去除未审核的题目,把tags转换成数组
      const filterResult = result.filter((item: any) => item?.chkState === 1);
      filterResult.forEach((item: any) => {
        item.tags = item?.tags?.split(',');
      });
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
  // 题目详情
  public async getQuestionDetail(params) {
    const { app } = this;
    const { id } = params;
    try {
      const result = await app.mysql.get('questions', { id });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 所有未审核的题目
  public async getNoChkQuestions() {
    const { app } = this;
    try {
      const result = await app.mysql.select('questions', {
        where: { chkState: 0 },
      });
      // 获取所有未审核题目总数
      const count = await app.mysql.query(
        'select count(*) as count from questions where chkState = 0',
      );
      return { result, total: count[0].count };
    } catch (err) {
      return null;
    }
  }
  // 审核题目
  public async chkQuestions(params: IChkQuestions) {
    const { app } = this;
    const { chkState, creator } = params;
    try {
      const result = await app.mysql.update('questions', params, {
        where: { id: params.id },
      });
      // 审核通过则更新排行榜上传题目数量
      if (chkState === 1) {
        const rankList: any = await app.mysql.get('ranking_list', {
          username: creator,
        });
        if (rankList) {
          await app.mysql.update(
            'ranking_list',
            { upload_ques_num: rankList.upload_ques_num + 1 },
            { where: { username: creator } },
          );
        }
      }
      return result;
    } catch (err) {
      return null;
    }
  }
  // 删除题目
  public async deleteQuestions(params) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('questions', params);
      return result;
    } catch (err) {
      return null;
    }
  }
  // 点赞题目
  public async likeQuestions(params) {
    const { app } = this;
    const { id, creator } = params;
    try {
      // 获取当前题目的点赞数量
      const questions: any = await app.mysql.get('questions', { id });
      const result = await app.mysql.update(
        'questions',
        { likes_num: questions.likes_num + 1 },
        { where: { id } },
      );
      // 更新排行榜点赞数量
      const rankList: any = await app.mysql.get('ranking_list', {
        username: creator,
      });
      if (rankList) {
        await app.mysql.update(
          'ranking_list',
          { get_likes_num: rankList.get_likes_num + 1 },
          { where: { username: creator } },
        );
      }
      return result;
    } catch (err) {
      return null;
    }
  }
  // 取消点赞题目
  public async cancelLikeQuestions(params) {
    const { app } = this;
    const { id, creator } = params;
    try {
      // 获取当前题目的点赞数量
      const questions: any = await app.mysql.get('questions', { id });
      const result = await app.mysql.update(
        'questions',
        { likes_num: questions.likes_num - 1 },
        { where: { id } },
      );
      // 更新排行榜点赞数量
      const rankList: any = await app.mysql.get('ranking_list', {
        username: creator,
      });
      if (rankList) {
        await app.mysql.update(
          'ranking_list',
          { get_likes_num: rankList.get_likes_num - 1 },
          { where: { username: creator } },
        );
      }
      return result;
    } catch (err) {
      return null;
    }
  }
  // 浏览数
  public async addBrowsesNum(params) {
    const { app } = this;
    const { id } = params;
    try {
      // 获取当前题目的浏览数量
      const questions: any = await app.mysql.get('questions', { id });
      const result = await app.mysql.update(
        'questions',
        { browses_num: questions.browses_num + 1 },
        { where: { id } },
      );
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
  // 每日一题
  public async getDailyQuestions() {
    // 从所有已审核的题目中随机获取1道题目
    const { app } = this;
    try {
      const result = await app.mysql.query(
        'select * from questions where chkState = 1 order by rand() limit 1',
      );
      return result;
    } catch (err) {
      return null;
    }
  }
  // 组卷
  public async getPaperQuestions(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('examination_paper', params);
      return result;
    } catch (err) {
      return null;
    }
  }
  // 获取组卷列表
  public async getPaperQuestionsList(params) {
    const { app } = this;
    const { author } = params;
    try {
      const result: any = await app.mysql.query(
        `select * from examination_paper where author = '${author}' order by paper_id desc`,
      );
      const ids = result.map((item: any) => item.ids);
      const questions: any = [];
      for (let i = 0; i < ids.length; i++) {
        const item = ids[i];
        const question = await app.mysql.query(
          `select * from questions where id in (${item})`,
        );
        questions.push(question);
      }

      return { questions };
    } catch (err) {
      return null;
    }
  }
}
