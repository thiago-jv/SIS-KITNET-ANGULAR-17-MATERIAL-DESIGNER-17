import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientModule} from "@angular/common/http";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {PortuguesePaginatorIntl} from "./util/portuguesePaginatorIntl";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    { provide: MatPaginatorIntl, useClass: PortuguesePaginatorIntl }
  ]
};
