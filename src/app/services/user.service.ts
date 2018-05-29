import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject ,  of } from 'rxjs';
import { User, PublicMember } from '../models/user';
import { map, flatMap, catchError, tap } from 'rxjs/operators';

// import * as moment from 'moment';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Options } from '../models/options';

@Injectable()
export class UserService extends BaseService {

    // private _rememberUser: boolean;
    private currentUserSource: BehaviorSubject<User>;
    public currentUser$: Observable<User>;
    private _currentUser: User;
    public redirectUrl: string;
    public returningMember: boolean; // temporary hack

    private _options: Options;
    private _optionsSource: BehaviorSubject<Options>;

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {
        super();

        this._currentUser = new User();
        this.currentUserSource = new BehaviorSubject(this._currentUser);
        this.currentUser$ = this.currentUserSource.asObservable();
        this.getUser().subscribe(user => {
            this._currentUser = user;
            this.currentUserSource.next(this._currentUser);
        });
        // this.errorHandler.lastError$.subscribe(err => this.onError(err));
    }

    get user(): User {
        return this._currentUser;
    }

    login(username: string, password: string, remember: boolean): Observable<void> {

        // this._rememberUser = remember;

        let email = '';
        if (username.indexOf('@') > 0) {
            email = username;
            username = '';
        }

        return this.http.post(`${this.authUrl}/login/`, { username: username, email: email, password: password }, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            flatMap((data: any) => {
                if (data && data.key) {
                    this.saveTokenToStorage(data.key, remember);
                    return this.getUser();
                }
            }),
            map(user => {
                this._currentUser = user;
                // this.saveUserToStorage(JSON.stringify(this._currentUser));
                // this.errorHandler.setUserContext(this._currentUser);
                this.currentUserSource.next(this._currentUser);
                return;
            })
        );
    }

    // login for a read-only user
    quietLogin(username: string): Observable<void> {
        return this.http.post(`${this.authUrl}/login/`, { username: username, email: '', password: 'gamer' }, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            map((data: any) => {
                if (data && data.key) {
                    this.saveTokenToStorage(data.key, false);
                    return;
                }
            })
        );
    }

    logout(): void {
        this.http.post(`${this.authUrl}/logout/`, {}).subscribe(
            () => this.resetUser(),   // onNext
            (err) => this.resetUser() // onError
        );
    }

    resetPassword(email: string): Observable<any> {
        return this.http.post(`${this.authUrl}/password/reset/`, { email: email }, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

    changePassword(password1: string, password2: string): Observable<any> {
        return this.http.post(`${this.authUrl}/password/change/`, {
            'new_password1': password1,
            'new_password2': password2
        }, {
                headers: new HttpHeaders().set('Content-Type', 'application/json'),
            });
    }

    confirmReset(reset: PasswordReset): Observable<any> {
        return this.http.post(`${this.authUrl}/password/reset/confirm/`, reset.toJson(), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

    createAccount(newUser: any): Observable<any> {
        return this.http.post(`${this.authUrl}/registration/`, newUser, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        });
    }

    updateAccount(partial: any): Observable<any> {
        return this.http.patch(`${this.authUrl}/user/`, partial, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            tap(() => {
                this.refreshUser();
            })
        );
    }

    refreshUser(): void {
        this.getUser().pipe(
            map(user => {
                this._currentUser = user;
                // this.saveUserToStorage(JSON.stringify(this._currentUser));
                this.currentUserSource.next(this._currentUser);
                return;
            })
        ).subscribe(() => { return; }); // no-op - force the call
    }

    getUser(): Observable<User> {
        return this.http.get(`${this.authUrl}/user/`).pipe(
            map((data: any) => {
                return new User().fromJson(data);
            }),
            catchError((err: any) => {
                this.removeTokenFromStorage();
                return of(new User());
            })
        );
    }

    onError(message: string): void {
        if (message === 'Invalid token.') {
            this.resetUser();
        }
    }

    resetUser(): void {
        this.cookieService.delete('crsftoken');
        this.removeTokenFromStorage();
        this._currentUser = new User();
        this.currentUserSource.next(this._currentUser);
        // this.saveUserToStorage(JSON.stringify(this._currentUser));
        // this.errorHandler.clearUserContext();
    }

    friends(): Observable<PublicMember[]> {
        return this.http.get(`${this.baseUrl}/friends/`).pipe(
            map((members: any[]) => {
                return members.map((m: any) => new PublicMember().fromJson(m));
            })
        );
    }

    addFriend(member: PublicMember): Observable<PublicMember[]> {
        return this.http.post(`${this.baseUrl}/friends/add/${member.id}/`, {}, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            map((members: any[]) => {
                return members.map((m: any) => new PublicMember().fromJson(m));
            })
        );
    }

    removeFriend(member: PublicMember): Observable<PublicMember[]> {
        return this.http.post(`${this.baseUrl}/friends/remove/${member.id}/`, {}, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            map((members: any[]) => {
                return members.map((m: any) => new PublicMember().fromJson(m));
            })
        );
    }

    allMembers(): Observable<PublicMember[]> {
        return this.http.get(`${this.baseUrl}/members/`).pipe(
            map((members: any[]) => {
                return members.map((m: any) => new PublicMember().fromJson(m));
            })
        );
    }

    sortMembers(members: PublicMember[]): PublicMember[] {
        return members.sort(function(a, b) {
            if (a.firstName > b.firstName) {
                return 1;
            }
            if (a.firstName < b.firstName) {
                return -1;
            }
            if (a.lastName > b.lastName) {
                return 1;
            }
            if (a.lastName < b.lastName) {
                return -1;
            }
            return 0;
        });
    }

    get options(): Observable<Options> {
        const options = localStorage.getItem('gamer-options');
        if (!options) {
            this._options = new Options();
            localStorage.setItem('gamer-options', JSON.stringify(this._options));
        } else {
            this._options = JSON.parse(options);
        }
        if (!this._optionsSource) {
            this._optionsSource = new BehaviorSubject(this._options);
        }
        this._optionsSource.next(Object.assign(new Options(), this._options));
        return this._optionsSource.asObservable();
    }

    updateOptions(options: Options): void {
        localStorage.setItem('gamer-options', JSON.stringify(options));
        this._options = options;
        if (!this._optionsSource) {
            this._optionsSource = new BehaviorSubject(this._options);
        }
        this._optionsSource.next(Object.assign({}, this._options));
    }

    private getTokenFromStorage(): string {
        let token = localStorage.getItem('gamer-token');
        if (!token) {
            token = sessionStorage.getItem('gamer-token');
        }
        return token;
    }

    private saveTokenToStorage(data: string, remember: boolean): void {
        if (remember) {
            localStorage.setItem('gamer-token', data);
        } else {
            sessionStorage.setItem('gamer-token', data);
        }
    }

    private removeTokenFromStorage(): void {
        localStorage.removeItem('gamer-token');
        sessionStorage.removeItem('gamer-token');
    }

    // private getUserFromStorage(): string {
    //     return sessionStorage.getItem('gamer-user');
    // }

    // private saveUserToStorage(data: string): void {
    //     sessionStorage.setItem('gamer-user', data);
    // }

    // private removeUserFromStorage(): void {
    //     sessionStorage.removeItem('gamer-user');
    // }
}

export class PasswordReset {
    uid: string;
    token: string;
    password1: string;
    password2: string;

    get isValid(): boolean {
        return this.uid && this.token && this.password1 && this.password1 === this.password2;
    }

    get matching(): boolean {
        return this.password1 && this.password1 === this.password2;
    }

    toJson(): any {
        return {
            'uid': this.uid,
            'token': this.token,
            'new_password1': this.password1,
            'new_password2': this.password2
        };
    }
}
