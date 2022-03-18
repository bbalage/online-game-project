import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  public getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(environment.serverUrl + environment.users)
      .pipe<User[]>(
        catchError<User[], Observable<never>>((err) => this.handleError(err))
      );
  }
  //TODO implement
  public authenticateUser(User: User) {}
}
