import { Routes } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { IntellectualComponent } from './intellectual/intellectual.component';

const routes: Routes = [
    {
        path: 'index',
        component: IndexComponent,
    },
    {
        path: 'intellectual/:id',
        component: IntellectualComponent,
    },
    {
        path: '',
        redirectTo: '/index',
        pathMatch: 'full'
    }
];

export { routes };
