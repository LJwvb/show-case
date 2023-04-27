/* eslint-disable comma-dangle */
import { Service } from 'egg';
import { getNowFormatDate } from '../utils';

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

export default class admin extends Service {
  // 管理员登录
  public async adminLogin(params) {
    const { app } = this;
    try {
      const result: any = await app.mysql.get('admin', params);
      // 更新登录时间
      await app.mysql.update(
        'admin',
        {
          last_login_time: getNowFormatDate(),
        },
        {
          where: { id: result.id },
        }
      );

      return {
        ...result,
        isAdmin: true,
      };
    } catch (err) {
      return null;
    }
  }
  // 修改密码
  public async editAdminPassword(params) {
    const { app } = this;
    const { id, password } = params;
    try {
      const result = await app.mysql.update(
        'admin',
        {
          password,
        },
        {
          where: { id },
        }
      );
      return result;
    } catch (err) {
      return null;
    }
  }
  // 获取用户列表
  public async getUserList() {
    const { app } = this;
    try {
      const user = await app.mysql.select('user');
      const admin = await app.mysql.select('admin');
      return [ ...admin, ...user ];
    } catch (err) {
      return null;
    }
  }
  // 所有未审核的题目
  public async getNoChkQuestions(params) {
    const { app } = this;
    const { currentPage, pageSize } = params;

    try {
      const result = await app.mysql.select('questions', {
        where: { chkState: 0 },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      // 获取所有未审核题目总数
      const count = await app.mysql.query(
        'select count(*) as count from questions where chkState = 0'
      );
      return { result, total: count[0].count };
    } catch (err) {
      return null;
    }
  }
  // 所有已审核的题目
  public async getAllChkQuestions(params) {
    const { app } = this;
    const { currentPage, pageSize } = params;
    console.log(params);

    try {
      const result = await app.mysql.select('questions', {
        where: { chkState: 1 },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      // 获取所有已审核题目总数
      const count = await app.mysql.query(
        'select count(*) as count from questions where chkState = 1'
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
      // 审核通过则更新排行榜上传题目数量和用户上传题目数量
      if (chkState === 1) {
        const rankList: any = await app.mysql.get('ranking_list', {
          username: creator,
        });
        const user: any = await app.mysql.get('user', { username: creator });
        if (rankList) {
          await app.mysql.update(
            'ranking_list',
            { upload_ques_num: rankList.upload_ques_num + 1 },
            { where: { username: creator } }
          );
        }
        if (user) {
          await app.mysql.update(
            'user',
            { approvedNums: user.approvedNums + 1 },
            { where: { username: creator } }
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
        }
      );
      return result;
    } catch (err) {
      return null;
    }
  }
  // 所有未审核的试卷
  public async getNoChkPaper(params) {
    const { app } = this;
    const { currentPage, pageSize } = params;
    try {
      const result: any = await app.mysql.select('examination_paper', {
        where: { chkState: 0 },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      // 获取所有未审核题目总数
      const count = await app.mysql.query(
        'select count(*) as count from examination_paper where chkState = 0'
      );
      return { result, total: count[0].count };
    } catch (err) {
      return null;
    }
  }
  // 所有已审核的试卷
  public async getAllChkPaper(params) {
    const { app } = this;
    const { currentPage, pageSize } = params;
    try {
      const result = await app.mysql.select('examination_paper', {
        where: { chkState: 1 },
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      });
      // 获取所有已审核题目总数
      const count = await app.mysql.query(
        'select count(*) as count from examination_paper where chkState = 1'
      );
      return { result, total: count[0].count };
    } catch (err) {
      return null;
    }
  }
  // 删除试卷
  public async deletePaper(params) {
    const { app } = this;
    const { paperId } = params;
    try {
      const result = await app.mysql.delete('examination_paper', {
        paper_id: paperId,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
  // 删除用户
  public async deleteUser(params) {
    const { app } = this;
    const { userId } = params;
    try {
      const result = await app.mysql.delete('user', {
        userId,
      });
      return result;
    } catch (err) {
      return null;
    }
  }
}
