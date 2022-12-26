import assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';
import { getNowFormatDate } from '../../../app/utils';

describe('test/app/service/Test.test.js', () => {
  let ctx: Context;

  before(async () => {
    ctx = app.mockContext();
  });

  it('getQuestions', async () => {
    const result = await ctx.service.questions.getQuestions({
      currentPage: 1,
      pageSize: 10,
      subjectID: 1,
      catalogID: 2,
    });
    assert(result);
  });
  it('chkQuestions', async () => {
    const result = await ctx.service.questions.chkQuestions({
      id: 31,
      chkState: 1,
      chkUser: 'admin',
      chkRemarks: 'test',
      chkDate: getNowFormatDate(),
      publishDate: getNowFormatDate(),
      publishState: 1,
    });
    assert(result);
  });
});
