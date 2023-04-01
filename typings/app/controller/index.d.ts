// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAdmin from '../../../app/controller/admin';
import ExportPaper from '../../../app/controller/paper';
import ExportQuestions from '../../../app/controller/questions';
import ExportRankingList from '../../../app/controller/rankingList';
import ExportSubjectList from '../../../app/controller/subjectList';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    admin: ExportAdmin;
    paper: ExportPaper;
    questions: ExportQuestions;
    rankingList: ExportRankingList;
    subjectList: ExportSubjectList;
    user: ExportUser;
  }
}
