import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/User';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  public authenticateUser(User: User) {
    return this.http
      .post(
        environment.serverUrl + environment.users + environment.validate,
        { User }
      )
      .pipe(
        map((res) => {
          this.setSession(res);
        }),
        catchError((err) => this.handleError(err))
      );
  }

  private setSession(authResult: any) {
    const now = new Date();
    const expiresAt: Date = new Date(
      now.setSeconds(now.getSeconds() + authResult.expiresIn)
    );

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt.toISOString());
  }

  private deleteSession() {
    localStorage.clear();
  }

  public addUser(User: User) {
    return this.http
      .post(
        environment.serverUrl + environment.users + environment.add,
        { User }
      )
      .pipe(catchError((err) => this.handleError(err)));
  }

  public getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(environment.serverUrl + environment.users + environment.get)
      .pipe<User[]>(catchError((err) => this.handleError(err)));
  }
}
