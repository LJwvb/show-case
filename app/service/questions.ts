import { Service } from 'egg';
import { compareTwoStrings } from 'string-similarity';
import { getSubjectName, getCatalogName } from '../utils';

interface IQuestion {
  type?: 'all'; // all:全部
  currentPage: number; // 当前页
  pageSize: number; // 每页条数
  catalogID: number; // 章节ID
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
    const { type, currentPage, pageSize, catalogID, refresh, ids } = params;
    console.log('params', params);
    try {
      const subjectList: any = [];
      const allSubjectList: any = [];
      const userSubjectList: any = [];

      if (type === 'all') {
        const result = await app.mysql.select('questions', {
          where: {
            catalogID,
          },
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
        });
        const filterResult = result.filter((item: any) => item?.chkState === 1);
        filterResult.forEach(async (item: any) => {
          item.tags = item?.tags?.split(',');
          if (item?.browses_num > 10 && item?.catalogID === 0) {
            item.catalogID = 1;
            await app.mysql.update(
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
        const allQuestionList = refresh
          ? filterResult
            .filter((item: any) => item?.catalogID === 0)
            .sort(() => Math.random() - 0.5)
          : filterResult.filter((item: any) => item?.catalogID === 0);
        const allQuestionList1 = refresh
          ? filterResult
            .filter((item: any) => item?.catalogID === 1)
            .sort(() => Math.random() - 0.5)
          : filterResult.filter((item: any) => item?.catalogID === 1);
        const allQuestionList2 = refresh
          ? filterResult
            .filter((item: any) => item?.catalogID === 2)
            .sort(() => Math.random() - 0.5)
          : filterResult.filter((item: any) => item?.catalogID === 2);
        allSubjectList.push({
          list: [
            {
              catalog: {
                catalogID: 0,
                catalogName: '最新',
              },
              questionList: allQuestionList,
            },
            {
              catalog: {
                catalogID: 1,
                catalogName: '最热',
              },
              questionList: allQuestionList1,
            },
            {
              catalog: {
                catalogID: 2,
                catalogName: '精选',
              },
              questionList: allQuestionList2,
            },
          ],
        });
        return {
          result: allSubjectList[0],
        };
      }

      if (type === 'home') {
        const result = await app.mysql.select('questions');
        // 去除未审核的题目,把tags转换成数组
        const filterResult = result.filter((item: any) => item?.chkState === 1);
        filterResult.forEach(async (item: any) => {
          item.tags = item?.tags?.split(',');
          if (item?.browses_num > 10 && item?.catalogID === 0) {
            item.catalogID = 1;
            await app.mysql.update(
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
        filterResult.forEach((item: any) => {
          const { subjectID, catalogID } = item;
          // 如果是全部题目，题目中catalogID为0的所有题目都组合为一个章节

          const subjectIndex = subjectList.findIndex(
            (sub: any) => sub.subject.subjectID === subjectID,
          );
          if (subjectIndex === -1) {
            subjectList.push({
              subject: {
                subjectID,
                subjectName: getSubjectName(subjectID),
              },
              catalogList: [
                {
                  catalog: {
                    catalogID,
                    catalogName: getCatalogName(catalogID),
                  },
                  questionList: [ item ],
                },
              ],
            });
          } else {
            const catalogIndex = subjectList[
              subjectIndex
            ].catalogList.findIndex(
              (cat: any) => cat.catalog.catalogID === catalogID,
            );
            if (catalogIndex === -1) {
              subjectList[subjectIndex].catalogList.push({
                catalog: {
                  catalogID,
                  catalogName: getCatalogName(catalogID),
                },
                questionList: [ item ],
              });
            } else {
              subjectList[subjectIndex].catalogList[
                catalogIndex
              ].questionList.push(item);
            }
          }
        });
        // 每个科目下返回3个题目
        subjectList.forEach((item: any) => {
          const { catalogList } = item;
          catalogList.forEach((cat: any) => {
            const { questionList } = cat;
            cat.questionList = questionList.slice(0, 3);
          });
        });
        // 根据科目ID排序
        subjectList.sort(
          (a: any, b: any) => a.subject.subjectID - b.subject.subjectID,
        );
        // 根据章节ID排序
        subjectList.forEach((item: any) => {
          item.catalogList.sort(
            (a: any, b: any) => a.catalog.catalogID - b.catalog.catalogID,
          );
        });
        return {
          result: subjectList,
        };
      }
      if (type === 'user') {
        const result = await app.mysql.select('questions');
        const questionIds: any = ids && ids.split(',');
        questionIds.forEach((id: any) => {
          const question = result.find((item: any) => item.id === Number(id));
          if (question) {
            userSubjectList.push(question);
          }
        });
        return {
          result: userSubjectList,
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
    const { id, username } = params;
    try {
      // 获取当前题目的浏览数量
      const questions: any = await app.mysql.get('questions', { id });
      // 获取用户浏览的题目id
      const user: any = await app.mysql.get('user', {
        username,
      });
      const browseTopicsId = user?.browseTopicsId?.split(',');
      browseTopicsId.push(id);
      const idStr = browseTopicsId.join(',');
      await app.mysql.update(
        'user',
        { browseTopicsId: idStr },
        { where: { username } },
      );
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
      console.log(question);
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
    const { keyword, questionType, difficulty } = params;
    try {
      // 只有关键字
      if (keyword && !questionType && !difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%'`,
        );
        return result;
      }
      // 只有题型
      if (!keyword && questionType && !difficulty) {
        const result = await app.mysql.query(
          `select * from questions where questionType = '${questionType}'`,
        );
        return result;
      }
      // 只有难度
      if (!keyword && !questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where difficulty = '${difficulty}'`,
        );
        return result;
      }
      // 题型和难度
      if (!keyword && questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where questionType = '${questionType}' and difficulty = '${difficulty}'`,
        );
        return result;
      }
      // 关键字和题型
      if (keyword && questionType && !difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and questionType = '${questionType}'`,
        );
        return result;
      }
      // 关键字和难度
      if (keyword && !questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and difficulty = '${difficulty}'`,
        );
        return result;
      }
      // 题型和难度和关键字
      if (keyword && questionType && difficulty) {
        const result = await app.mysql.query(
          `select * from questions where question like '%${keyword}%' and questionType = '${questionType}' and difficulty = '${difficulty}'`,
        );
        return result;
      }
    } catch (err) {
      return null;
    }
  }
}
