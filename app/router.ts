import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.post('/captcha', controller.user.captcha);
  router.post('/register', controller.user.register);
  router.post('/login', controller.user.login);
};
