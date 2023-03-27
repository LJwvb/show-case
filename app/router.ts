import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // 前缀
  router.prefix('/api');
  // 验证码
  router.post('/captcha', controller.user.captcha);
  // 注册
  router.post('/register', controller.user.register);
  // 登录
  router.post('/login', controller.user.login);
  // 编辑用户信息
  router.post('/updateUserInfo', controller.user.updateUserInfo);
  // 获取用户信息列表
  router.post('/getUserList', controller.user.getUserList);
  // 管理员登录
  router.post('/adminLogin', controller.user.adminLogin);
  // 题目列表
  router.post('/getQuestions', controller.questions.getQuestions);
  // 获取题目详情
  router.post('/getQuestionDetail', controller.questions.getQuestionDetail);
  // 获取未审核的题目
  router.get('/getNoChkQuestions', controller.questions.getNoChkQuestions);
  // 所有已审核的题目
  router.get('/getAllChkQuestions', controller.questions.getAllChkQuestions);
  // 上传题目
  router.post('/uploadQuestions', controller.questions.uploadQuestions);
  // 审核题目
  router.post('/chkQuestions', controller.questions.chkQuestions);
  // 删除题目
  router.post('/deleteQuestions', controller.questions.deleteQuestions);
  // 每日一题
  router.get('/getDailyQuestions', controller.questions.getDailyQuestions);
  // 点赞
  router.post('/likeQuestions', controller.questions.likeQuestions);
  // 游览
  router.post('/addBrowsesNum', controller.questions.addBrowsesNum);
  // 取消点赞
  router.post('/cancelLikeQuestions', controller.questions.cancelLikeQuestions);
  // 获取排行榜
  router.get('/getRankingList', controller.rankingList.getRankingList);
  // 相似题目
  router.post('/getSimilarQuestions', controller.questions.getSimilarQuestions);
  // 搜索题目
  router.post('/searchQuestions', controller.questions.searchQuestions);
  // 科目列表
  router.get('/getSubjectList', controller.subjectList.getSubjectList);

  // 组卷
  router.post('/getPaperQuestions', controller.paper.getPaperQuestions);
  // 试卷列表
  router.post('/getPaperQuestionsList', controller.paper.getPaperQuestionsList);
  // 试卷详情
  router.post('/getPaperQuestionsDetail', controller.paper.getPaperQuestionsDetail);
  // 试卷审核
  router.post('chkPaper', controller.paper.chkPaper);
  // 所有未审核的试卷
  router.get('/getNoChkPaper', controller.paper.getNoChkPaper);
};
