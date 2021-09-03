import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MessageService } from './message.service'
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = 'http://localhost:5001/api'
  constructor(
    private http:HttpClient,
    private messageService:MessageService
  ) { }
  private log(message:string){
    this.messageService.add(`HeroService: ${message}`);
  }
  get(api:string):Observable<any>{
    return this.http.get<any>(this.apiUrl+api,{observe:'response'})
      .pipe(
        catchError(this.handleError<any>(`HttpGet [${api}] API`,[]))
      )
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(error as T);
    };
  }
}
