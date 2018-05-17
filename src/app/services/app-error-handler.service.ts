import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

    private errorSource: Subject<string>;
    public lastError$: Observable<string>;

    constructor(
    ) {
        super();
        this.errorSource = new Subject();
        this.lastError$ = this.errorSource.asObservable();
    }

    handleError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        super.handleError(err);
    }

    logError(err: any): void {
        this.errorSource.next(err.message ? err.message : err.toString());
        console.error(err.toString());
    }

    logResponse(message: string, response: HttpErrorResponse) {
        this.errorSource.next(message);
        console.log(`${response.status}: ${JSON.stringify(response.error)}`);
    }

    logWarning(message: string): void {
        console.warn(message);
    }

    logMessage(message: string): void {
        console.log(message);
    }
}
