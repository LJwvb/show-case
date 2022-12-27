import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // 前缀
  router.prefix('/api');

  router.post('/captcha', controller.user.captcha);
  router.post('/register', controller.user.register);
  router.post('/login', controller.user.login);

  router.post('/getQuestion', controller.questions.getQuestions);
  router.get('/getNoChkQuestions', controller.questions.getNoChkQuestions);
  router.post('/uploadQuestions', controller.questions.uploadQuestions);
  router.post('/chkQuestions', controller.questions.chkQuestions);
  router.post('/deleteQuestions', controller.questions.deleteQuestions);
  router.get('/getDailyQuestions', controller.questions.getDailyQuestions);

  router.get('/getRankingList', controller.rankingList.getRankingList);
};
