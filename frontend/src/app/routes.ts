import { Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ContributorsComponent } from './about/contributors/contributors.component';
import { PinComponent } from './about/pin/pin.component';

import { IndexComponent } from './index/index.component';
import { IntellectualComponent } from './intellectual/intellectual.component';
import { MapContainerComponent } from './map-container/map-container.component';

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
        path: 'map',
        component: MapContainerComponent
    },
    {
        path: 'about',
        children: [
            {
                path: 'contributors',
                component: ContributorsComponent,
            },
            {
                path: 'PIN',
                component: PinComponent,
            },
            {
                path: '',
                component: AboutComponent,
            }
        ]
    },
    {
        path: '',
        redirectTo: '/map',
        pathMatch: 'full'
    }
];

export { routes };
