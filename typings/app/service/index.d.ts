// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportPaper from '../../../app/service/paper';
import ExportQuestions from '../../../app/service/questions';
import ExportRankingList from '../../../app/service/rankingList';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    paper: AutoInstanceType<typeof ExportPaper>;
    questions: AutoInstanceType<typeof ExportQuestions>;
    rankingList: AutoInstanceType<typeof ExportRankingList>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
