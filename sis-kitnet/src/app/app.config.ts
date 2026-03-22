import {ApplicationConfig, importProvidersFrom, LOCALE_ID} from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { provideRouter } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import { JwtInterceptor } from './auth/jwt.interceptor';
import {MatPaginatorIntl} from "@angular/material/paginator";
import {PortuguesePaginatorIntl} from "./util/portuguesePaginatorIntl";

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    { provide: MatPaginatorIntl, useClass: PortuguesePaginatorIntl },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
};
