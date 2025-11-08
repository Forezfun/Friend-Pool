import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    console.log('intercepted');
    let modifiedReq = req.clone({withCredentials:true})
    return next(modifiedReq);
};
