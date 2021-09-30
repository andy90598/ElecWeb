import { AuthHeaderInterceptor } from './auth-header-interceptors';
import { HTTP_INTERCEPTORS } from "@angular/common/http";

export const httpInterceptProviders=[
  //依賴提供者 要在app moudle的provider裡面註冊，useClass就是auth-header-interveptor的名字
  {provide:HTTP_INTERCEPTORS,useClass:AuthHeaderInterceptor,multi:true}
  // {provide:HTTP_INTERCEPTORS,useClass:ErrorHeaderInterceptor,multi:true}
];
