import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Observable  } from 'rxjs/Observable';
import { TypeHeadComponent } from './type-head';
import { TickerService, Ticker } from './services/ticker.service';

const statusLookup = [
  'WAITING FOR CONNECTION',
  'CONNECTED',
  'CLOSED',
  'RETRYING'
];

@Component({
  moduleId: module.id,
  selector: 'socket-client-app',
  templateUrl: 'socket-client.component.html',
  styleUrls: ['socket-client.component.css'],
  directives: [NgFor, TypeHeadComponent],
  providers: [TickerService]
})
export class SocketClientAppComponent {
  tickers: Ticker[] = [];
  connectionStatus:Observable<string>;

  constructor(private _tickerService: TickerService) {
    // map our observable of connection states to
    // more readable status strings
    this.connectionStatus = this._tickerService.connectionState
      .map((state: number) => statusLookup[state])
  }

  onSelect(symbol){
    console.log('symbol', symbol)
    const tickers = this.tickers;
    if(tickers.find(x => x.symbol === symbol.ms_drg)) {
      return;
    }

    const ticks = this._tickerService.getTicker(symbol.ms_drg);
    tickers.push(new Ticker(symbol.ms_drg, ticks));
  }
}
