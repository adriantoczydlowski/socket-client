import { bootstrap  } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { ROUTER_PROVIDERS } from '@angular/router';
import { SocketClientAppComponent, environment } from './app/';
import { RxWebSocketService } from './app/services/rx-web-socket.service';
import { TickerService } from './app/services/ticker.service';
import { TickerLoaderService } from './app/services/ticker-loader.service';

if (environment.production) {
  enableProdMode();
}

bootstrap(SocketClientAppComponent, [
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  TickerService,
  provide(RxWebSocketService, {useFactory: () => {
    return new RxWebSocketService(WebSocket);
  }}),
  
]);

