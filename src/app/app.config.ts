import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { httpCacheInterceptor } from './interceptors/http-cache.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([httpCacheInterceptor])),
    // Hash routing keeps the app working when served from a subdirectory
    // (chromiecraft.com/apps/...) inside the website's iframe, with no server rewrites.
    provideRouter(routes, withHashLocation()),
  ],
};
