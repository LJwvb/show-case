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
  // 获取未审核的题目
  router.get('/getNoChkQuestions', controller.questions.getNoChkQuestions);
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
  // 组卷
  router.post('/getPaperQuestions', controller.questions.getPaperQuestions);
  // 试卷列表
  router.post('/getPaperQuestionsList', controller.questions.getPaperQuestionsList);
};
