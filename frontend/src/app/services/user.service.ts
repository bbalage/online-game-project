import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/User';
import { BaseService } from './base.service';

export const ID_TOKEN_KEY = "id_token";

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {

  private isAdmin: boolean = false;

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
          this.isAdmin = false;
          this.setSession(res);
        }),
        catchError((err) => this.handleError(err))
      );
  }

  public authenticateAdmin(User: User) {
    return this.http
      .post(
        environment.serverUrl + environment.admin + environment.validate,
        { User }
      )
      .pipe(
        map((res) => {
          this.isAdmin = true;
          this.setSession(res);
        }),
        catchError((err) => this.handleError(err))
      );
  }


  public logoutUser() {
    sessionStorage.clear();
    this.isAdmin = false;
  }

  private setSession(authResult: any) {
    const now = new Date();
    const expiresAt: Date = new Date(
      now.setSeconds(now.getSeconds() + authResult.expiresIn)
    );

    sessionStorage.setItem(ID_TOKEN_KEY, authResult.idToken);
    sessionStorage.setItem('expires_at', expiresAt.toISOString());
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

  public checkAdmin() :boolean {
    return this.isAdmin;
  }

  public getUsername(): Observable<any> {
    const token = sessionStorage.getItem("id_token");

    return this.http
      .post(environment.serverUrl + environment.users + environment.getOne, { token: token })
      .pipe(catchError((err) => this.handleError(err)));
  }
}
