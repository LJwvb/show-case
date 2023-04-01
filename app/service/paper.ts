import { Service } from 'egg';

export default class paper extends Service {
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
    const { author, type } = params;
    try {
      if (type === 'all') {
        // 获取所有组卷
        const result: any = await app.mysql.query(
          'select * from examination_paper order by paper_id desc',
        );
        const purviewPaper = result.filter((item: any) => item.purview === 0); // 官方的试卷
        const personPaper = result.filter(
          (item: any) => item.purview === 1 && item?.chkState !== 0,
        ); // 个人审核通过公开的试卷

        return {
          purviewPaper,
          personPaper,
        };
      }
      // 我的试卷
      const result: any = await app.mysql.query(
        `select * from examination_paper where author = '${author}' order by paper_id desc`,
      );

      return result;
    } catch (err) {
      return null;
    }
  }
  // 获取组卷详情
  public async getPaperQuestionsDetail(params) {
    const { app } = this;
    const { paperId } = params;

    try {
      const result: any = await app.mysql.get('examination_paper', {
        paper_id: paperId,
      });
      const ids = result.ids.split(',');
      const questions: any = [];
      for (let i = 0; i < ids.length; i++) {
        const item = ids[i];
        // 找到id对应的题目
        const question = await app.mysql.query(
          `select * from questions where id = (${item})`,
        );
        questions.push(question[0]);
      }

      return {
        paperInfo: result,
        questions,
      };
    } catch (err) {
      return null;
    }
  }
  // 审核试卷
  public async chkPaperQuestions(params) {
    const { app } = this;
    const { paperId, chkState } = params;
    try {
      const result = await app.mysql.update(
        'examination_paper',
        {
          chkState,
        },
        {
          where: {
            paper_id: paperId,
          },
        },
      );
      return result;
    } catch (err) {
      return null;
    }
  }
  // 所有未审核的试卷
  public async getNoChkPaper() {
    const { app } = this;
    try {
      const result: any = await app.mysql.query(
        'select * from examination_paper where chkState = 0',
      );
      return result;
    } catch (err) {
      return null;
    }
  }
}
