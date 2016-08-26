import { Inject, Injectable } from '@angular/core';
import { Observable  } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/scan';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/retryWhen';
import { RxWebSocketService } from './rx-web-socket.service';
import { environment } from '../../app/';

export enum ConnectionStates {
  CONNECTING,
  CONNECTED,
  CLOSED,
  RETRYING
}

export interface TickerMessage {
  symbol: string,
  readmission: number,
  timestamp: number
}

@Injectable()
export class TickerService {
  // connection state is a behavior subject, so anyone that
  // subscribes to it can see the most recent value it's emitted.
  connectionState = new BehaviorSubject<ConnectionStates>(ConnectionStates.CONNECTING);

  constructor(public socket: RxWebSocketService) {
    const connectionState = this.connectionState;

    // subscribe to events from our RxWebSocket to oupdate connection status
    socket.didOpen = () => {
      connectionState.next(ConnectionStates.CONNECTED);
    }

    socket.willOpen = () => {
      connectionState.next(ConnectionStates.CONNECTING);
    }

    socket.didClose = () => {
      connectionState.next(ConnectionStates.CLOSED);
    }
  }

  getTicker(symbol: string): Observable<TickerMessage> {
    const socket = this.socket;

    // create a custom observable to return by wrapping
    // our subscription to the socket.
    return Observable.create(subscriber => {
      // when we subscribe to this observable...

      // first subscribe to the socket, filtering out
      // only the messages we care about
      console.log('subscriber')
      const msgSub = socket.out
        .filter(d => d.symbol === symbol)
        .subscribe(subscriber);

      // now send a message over the socket to tell the server
      // we want to subscribe to a particular stream of data
      socket.send({ symbol, type: 'sub' });

      // return an unsubscription function that, when tou unsubscribe...
      return () => {
        console.log('unsub');
        // sends a message to the server to tell it to stop
        // sending our data for this observable.
        socket.send({ symbol, type: 'unsub' });
        // and then unsubscribe from the socket
        msgSub.unsubscribe();
      };
    })
    // now share it to make it "hot"
    // that way we don't create the data producer for this more than once.
    .share()
    // if this fails, let's retry. The retryWhen operator
    // give us a stream of errors that we can transform
    // into an observable that notifies when we should
    // retry source
    .retryWhen(errors => errors.switchMap(err => {
      this.connectionState.next(ConnectionStates.RETRYING);

      if (navigator.onLine) {
        // if we have a network connection, try again in 3 seconds
        return Observable.timer(3000);
      } else {
        // if we're offline, so wait for an online event.
        return Observable.fromEvent(window, 'online').take(1);
      }
    }));
  }
}

export interface Tick {
  symbol: string,
  readmission: number,
  timestamp: number
}

export class Ticker {
  readmissions: Observable<string>;
  recentTicks: Observable<Tick[]>;
  maxRecentTicks = 50;

  constructor(public symbol: string,
              public ticks: Observable<Tick>) {
    // take each tick we're getting and scan it into an
    // observable of arrays, where each array is a list 
    // of accumulated valuse.
    this.recentTicks = this.ticks.scan((acc, tick) => {
      let result = acc.concat([tick]);
      while (result.length > this.maxRecentTicks) {
        result.shift();
      }
      return result;
    }, []);
  }
}