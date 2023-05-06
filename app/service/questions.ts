import { Service } from 'egg';
import { compareTwoStrings } from 'string-similarity';
import { getSubjectName, getCatalogName } from '../utils';

interface IQuestion {
  type?: 'all'; // all:全部
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  catalogID: number; // 章节ID
  subjectID?: number; // 科目ID
  refresh?: boolean; // 是否刷新
  ids?: string; // 题目ID
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
    const {
      type,
      catalogID: catalogIDParams,
      subjectID: subjectIDParams,
      ids,
      pageSize = 10,
      currentPage,
    } = params;
    try {
      // const allSubjectList: any = [];
      const userSubjectList: any = [];
      const homeSubjectList: any = [];

      const subjectIdList: any = [];
      const subjectNameList: any = [];
      const catalogIdList: any = [];
      const catalogNameList: any = [];

      if (type === 'all') {
        const result = await app.mysql.select('questions', {
          where: {
            subjectID: subjectIDParams,
          },
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        });
        const total = await app.mysql.count('questions', {
          subjectID: subjectIDParams,
        });
        result.forEach((item: any) => {
          if (item?.browses_num > 10 && item?.catalogID === 0) {
            item.catalogID = 1;
            app.mysql.update(
              'questions',
              {
                catalogID: 1,
              },
              {
                where: {
                  id: item.id,
                },
              },
            );
          }
        });

        return {
          result,
          total,
        };
      }

      if (type === 'home') {
        const result: any = await app.mysql.query(
          `select * from questions where catalogID = ${catalogIDParams} and subjectID = ${subjectIDParams} and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        result.forEach((item: any) => {
          item.tags = item?.tags?.split(',');
          homeSubjectList.push(item);
        });

        const chkStateQuestion: any = await app.mysql.select('questions', {
          where: {
            chkState: 1,
          },
        });
        chkStateQuestion.forEach((item: any) => {
          if (subjectIdList.indexOf(item.subjectID) === -1) {
            subjectIdList.push(item.subjectID);
          }
          if (catalogIdList.indexOf(item.catalogID) === -1) {
            catalogIdList.push(item.catalogID);
          }
          if (item?.browses_num > 10 && item?.catalogID === 0) {
            item.catalogID = 1;
            app.mysql.update(
              'questions',
              {
                catalogID: 1,
              },
              {
                where: {
                  id: item.id,
                },
              },
            );
          }
        });
        subjectIdList
          .sort((a: any, b: any) => a - b)
          .forEach((subjectID: any) => {
            subjectNameList.push({
              subjectID,
              subjectName: getSubjectName(subjectID),
            });
          });
        catalogIdList
          .sort((a: any, b: any) => a - b)
          .forEach((catalogID: any) => {
            catalogNameList.push({
              catalogID,
              catalogName: getCatalogName(catalogID),
            });
          });

        return {
          result: homeSubjectList,
          subjectNameList,
          catalogNameList,
        };
      }
      if (type === 'user') {
        const questionIds: any = ids && ids.split(',');
        const result: any = await app.mysql.query(
          `select * from questions where id in (${questionIds}) and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.count('questions', {
          id: questionIds,
        });
        result.forEach((item: any) => {
          item.tags = item?.tags?.split(',');
          userSubjectList.push(item);
        });
        return {
          result: userSubjectList,
          total,
        };
      }
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

  // 点赞题目
  public async likeQuestions(params) {
    const { app } = this;
    const { id, creator, username } = params;
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
      // 获取之前点赞的题目id
      const user: any = await app.mysql.get('user', { username });
      if (user) {
        const likeTopicsId = user?.likeTopicsId?.split(',');
        likeTopicsId.push(id);
        const idStr = likeTopicsId.join(',');
        await app.mysql.update(
          'user',
          { likeTopicsId: idStr },
          { where: { username } },
        );
        await app.mysql.update(
          'user',
          { like_ques_num: user.like_ques_num + 1 },
          { where: { username: creator } },
        );
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
    const { id, creator, username } = params;
    try {
      // 获取当前题目的点赞数量
      const questions: any = await app.mysql.get('questions', { id });
      const result = await app.mysql.update(
        'questions',
        { likes_num: questions.likes_num - 1 },
        { where: { id } },
      );
      // 更新用户点赞的题目id
      const user: any = await app.mysql.get('user', { username });
      const likeTopicsId = user?.likeTopicsId?.split(',');
      const index = likeTopicsId.indexOf(id);
      likeTopicsId.splice(index, 1);
      const idStr = likeTopicsId.join(',');
      await app.mysql.update(
        'user',
        { likeTopicsId: idStr },
        { where: { username } },
      );
      await app.mysql.update(
        'user',
        { like_ques_num: user.like_ques_num - 1 },
        { where: { username: creator } },
      );

      // 更新排行榜点赞数量
      const rankList: any = await app.mysql.get('ranking_list', {
        username: creator,
      });
      await app.mysql.update(
        'ranking_list',
        { get_likes_num: rankList.get_likes_num - 1 },
        { where: { username: creator } },
      );

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
    const { creator } = params;
    try {
      // 获取用户上传的题目数量
      const user: any = await app.mysql.get('user', {
        username: creator,
      });
      await app.mysql.update(
        'user',
        { upload_ques_num: user.upload_ques_num + 1 },
        { where: { username: creator } },
      );
      await app.mysql.update(
        'ranking_list',
        { upload_ques_num: user.upload_ques_num + 1 },
        { where: { username: creator } },
      );

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

  // 相似题目
  public async getSimilarQuestions(params) {
    const { app } = this;
    const { id } = params;
    try {
      const result: any = await app.mysql.query(
        'select * from questions where chkState = 1',
      );
      const question = result.find((item: any) => item.id === id)?.question;
      const questions = result.map((item: any) => {
        return {
          id: item.id,
          subjectID: item.subjectID,
          catalogID: item.catalogID,
          question: item.question,
          difficulty: item.difficulty,
          questionType: item.questionType,
        };
      });

      const similarQuestions: any = [];
      for (let i = 0; i < questions.length; i++) {
        const item = questions[i];
        const similar = await compareTwoStrings(question, item?.question);
        if (similar === 1) {
          continue;
        }
        if (similar > 0.1) {
          similarQuestions.push(item);
        }
      }

      // 如果有多条，随机打乱返回两条
      if (similarQuestions.length > 2) {
        similarQuestions.sort(() => Math.random() - 0.5);
        return similarQuestions.slice(0, 2);
      }
      return similarQuestions;
    } catch (err) {
      return null;
    }
  }
  // 搜索题目
  public async searchQuestions(params) {
    const { app } = this;
    const {
      keyword,
      questionType,
      difficulty,
      currentPage,
      pageSize = 10,
    } = params;
    try {
      // 只有关键字
      if (keyword && !questionType && !difficulty) {
        // 过滤掉未审核的题目
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where question like '%${keyword}%' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 只有题型
      if (!keyword && questionType && !difficulty) {
        const result = await app.mysql.query(
          `select * from questions where questionType = '${questionType}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where questionType = '${questionType}' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 只有难度
      if (!keyword && !questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where difficulty = '${difficulty}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where difficulty = '${difficulty}' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 题型和难度
      if (!keyword && questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where questionType = '${questionType}' and difficulty = '${difficulty}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where questionType = '${questionType}' and difficulty = '${difficulty}' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 关键字和题型
      if (keyword && questionType && !difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and questionType = '${questionType}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where question like '%${keyword}%' and questionType = '${questionType}' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 关键字和难度
      if (keyword && !questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and difficulty = '${difficulty}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where question like '%${keyword}%' and difficulty = '${difficulty}' and chkState = 1`,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
      // 题型和难度和关键字
      if (keyword && questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and questionType = '${questionType}' and difficulty = '${difficulty}' and chkState = 1 limit ${pageSize} offset ${
            (currentPage - 1) * pageSize
          }`,
        );
        const total = await app.mysql.query(
          `select count(*) from questions where question like '%${keyword}%' and questionType = '${questionType}' and difficulty = '${difficulty}' and chkState = 1 `,
        );
        return {
          result,
          total: total[0]['count(*)'],
        };
      }
    } catch (err) {
      return null;
    }
  }
}
