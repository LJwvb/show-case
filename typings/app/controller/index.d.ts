// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQuestions from '../../../app/controller/questions';
import ExportRankingList from '../../../app/controller/rankingList';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    questions: ExportQuestions;
    rankingList: ExportRankingList;
    user: ExportUser;
  }
}
