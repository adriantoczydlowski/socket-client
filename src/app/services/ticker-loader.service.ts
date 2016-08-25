import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../app/';

@Injectable()
/**
 * This service is a thin wrapper around Http, used to fetch a
 * list of ticker suggestions, given a search string.
 *
 * The service will automatically unwrap the response and return
 * an array of ticker objects.
 *
 * If the request fails once, the service will indiscriminately
 * retry the request with the same value.
 */
export class TickerLoaderService {

  constructor(private _http: Http) {}

  load(val: string): Observable<any[]> {
    return this._http
      .request(`${environment.tickerSearchURL}/drgs?ms_drg=${val}`)
      .retry(2)
      .map((res:Response) => <any[]>res.json());
  }

}