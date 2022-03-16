import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class BaseService {
  constructor() {}

  protected handleError(errorRes: HttpErrorResponse): Observable<never> {
    let errorMsg = `Status: ${errorRes.status}, An error has occured`;

    if (typeof errorRes.error === 'string') {
      errorMsg = errorRes.error;
    } else if (errorRes.status === 400) {
      errorMsg = Array.isArray(errorRes.error.errors)
        ? 'Validation error'
        : 'Invalid format';
    } else if (errorRes.status === 422) {
      errorMsg = errorRes.error.detail;
    }

    return throwError(() => new Error(errorMsg));
  }
}
