import { BrowserModule } from '@angular/platform-browser';
import { NgModule, provide } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TypeHeadComponent } from './type-head';
import { GraphComponent } from './graph';
import { TickerService, Ticker } from './services/ticker.service';
import { RxWebSocketService } from './services/rx-web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    TypeHeadComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    TickerService,
    provide(RxWebSocketService, {useFactory: () => {
      return new RxWebSocketService(WebSocket);
    }}),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
