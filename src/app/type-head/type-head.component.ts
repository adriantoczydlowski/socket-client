import { Component, OnInit, EventEmitter, ChangeDetectionStrategy, Output, Injectable } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mapTo';
import { TickerLoaderService } from '../services/ticker-loader.service';

@Component({
  moduleId: module.id,
  selector: 'app-type-head',
  templateUrl: 'type-head.component.html',
  styleUrls: ['type-head.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TickerLoaderService],
  directives: [REACTIVE_FORM_DIRECTIVES, NgIf, NgFor]
})
export class TypeHeadComponent implements OnInit {

  @Output('selected') selected = new EventEmitter();
  clear = new EventEmitter();
  myGroup = new FormGroup({
       searchText: new FormControl()
    });

  tickers: Observable<any>;

  constructor(http: Http, tickerLoader: TickerLoaderService) {
    const myFormValueChanges$ = this.myGroup.valueChanges;

    // subscribe to the stream 
    // myFormValueChanges$.map(c => {console.log('c', c); return c.searchText;}).subscribe(x => {
    //   console.log('x', x)
    // });
    // get a stream of changes from the tickers input
    this.tickers = myFormValueChanges$
      // wait for a pause in typing of 200ms then emit the last value
      .debounceTime(200)
      // only accept values that don't repeat themselves
      .distinctUntilChanged()
      // map that to an observable HTTP request, using the TickerLoad
      // service and switch to that
      // observable. That means unsubscribing from any previous HTTP request
      // (cancelling it), and subscribing to the newly returned on here.
      .switchMap((val: any) => {
      console.log('qwe', val)
      return tickerLoader.load(val.searchText)
      })
      // send an empty array to tickers whenever clear emits by
      // merging in a the stream of clear events mapped to an
      // empty array.
      .merge(this.clear.mapTo([]));
  }

  ngOnInit() {}

  onSelect(ticker){
    console.log('select');
    this.selected.next(ticker);
    this.clear.next('');
  }

}



