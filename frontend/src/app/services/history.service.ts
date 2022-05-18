import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { History } from '../models/History';

@Injectable({
  providedIn: 'root',
})
export class HistoryService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  public getHistory(id: number): Observable<History> {
    let queryParams = new HttpParams().set("id", id);

    return this.http
      .get<History>(
        environment.serverUrl + environment.histories + environment.getOne,
        { params: queryParams }
      )
      .pipe<History>(
        catchError((err) => this.handleError(err))
      );
  }

  public addHistory(History: History) {
    return this.http
      .post(
        environment.serverUrl + environment.histories + environment.add,
        { History }
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  public getHistories(): Observable<History[]> {
    return this.http
      .get<History[]>(environment.serverUrl + environment.histories + environment.get)
      .pipe<History[]>(catchError((err) => this.handleError(err)));
  }
}
