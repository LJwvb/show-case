/* eslint-disable comma-dangle */
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // 前缀
  router.prefix('/api');

  // todo user
  // 验证码
  router.post('/captcha', controller.user.captcha);
  // 注册
  router.post('/register', controller.user.register);
  // 登录
  router.post('/login', controller.user.login);
  // 编辑用户信息
  router.post('/editUserInfo', controller.user.updateUserInfo);
  // 获取用户信息
  router.post('/getUserInfo', controller.user.getUserInfo);
  // 获取用户上传的题目
  router.post('/getUserUploadQues', controller.user.getUserUploadQues);

  // todo admin
  // 管理员登录
  router.post('/adminLogin', controller.admin.adminLogin);
  // 获取用户信息列表
  router.post('/getUserList', controller.admin.getUserList);
  // 获取未审核的题目
  router.get('/getNoChkQuestions', controller.admin.getNoChkQuestions);
  // 所有已审核的题目
  router.get('/getAllChkQuestions', controller.admin.getAllChkQuestions);
  // 审核题目
  router.post('/chkQuestions', controller.admin.chkQuestions);
  // 删除题目
  router.post('/deleteQuestions', controller.admin.deleteQuestions);

  // todo 题目
  // 题目列表
  router.post('/getQuestions', controller.questions.getQuestions);
  // 获取题目详情
  router.post('/getQuestionDetail', controller.questions.getQuestionDetail);
  // 上传题目
  router.post('/uploadQuestions', controller.questions.uploadQuestions);
  // 每日一题
  router.get('/getDailyQuestions', controller.questions.getDailyQuestions);
  // 点赞
  router.post('/likeQuestions', controller.questions.likeQuestions);
  // 游览
  router.post('/addBrowsesNum', controller.questions.addBrowsesNum);
  // 取消点赞
  router.post('/cancelLikeQuestions', controller.questions.cancelLikeQuestions);
  // 相似题目
  router.post('/getSimilarQuestions', controller.questions.getSimilarQuestions);
  // 搜索题目
  router.post('/searchQuestions', controller.questions.searchQuestions);
  // 科目列表
  router.get('/getSubjectList', controller.subjectList.getSubjectList);

  // todo 试卷
  // 组卷
  router.post('/getPaperQuestions', controller.paper.getPaperQuestions);
  // 试卷列表
  router.post('/getPaperQuestionsList', controller.paper.getPaperQuestionsList);
  // 试卷详情
  router.post(
    '/getPaperQuestionsDetail',
    controller.paper.getPaperQuestionsDetail
  );
  // 试卷审核
  router.post('chkPaper', controller.paper.chkPaper);
  // 所有未审核的试卷
  router.get('/getNoChkPaper', controller.paper.getNoChkPaper);

  // todo 排行榜
  // 获取排行榜
  router.get('/getRankingList', controller.rankingList.getRankingList);
};
