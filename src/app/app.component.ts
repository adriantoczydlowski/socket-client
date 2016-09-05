import { Component } from '@angular/core';
import { Observable  } from 'rxjs/Observable';
import { TickerService, Ticker } from './services/ticker.service';

const statusLookup = [
  'WAITING FOR CONNECTION',
  'CONNECTED',
  'CLOSED',
  'RETRYING'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
    if(tickers.find(x => {
      console.log('find', x, symbol);
      return x.symbol === symbol.ms_drg})) {
      return;
    }

    const ticks = this._tickerService.getTicker(symbol.ms_drg);
    console.log('ticks', ticks);
    ticks.subscribe((q) => console.log('q', q))
    tickers.push(new Ticker(symbol.ms_drg, ticks));
  }
}
