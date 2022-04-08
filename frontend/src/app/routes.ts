import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'timeline',
        component: TimelineComponent
    }
];

export { routes };
