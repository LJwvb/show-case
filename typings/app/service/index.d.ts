// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportAdmin from '../../../app/service/admin';
import ExportComment from '../../../app/service/comment';
import ExportPaper from '../../../app/service/paper';
import ExportQuestions from '../../../app/service/questions';
import ExportRankingList from '../../../app/service/rankingList';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    admin: AutoInstanceType<typeof ExportAdmin>;
    comment: AutoInstanceType<typeof ExportComment>;
    paper: AutoInstanceType<typeof ExportPaper>;
    questions: AutoInstanceType<typeof ExportQuestions>;
    rankingList: AutoInstanceType<typeof ExportRankingList>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
