// title.service.ts
import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title
  ) {}

  initializeTitleTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => {
        const title = route.snapshot.data['title'] || 'Inventory Management System';
        return title;
      })
    ).subscribe(title => {
      this.title.setTitle(title);
      console.log('📄 Page title set to:', title);
    });
  }
}