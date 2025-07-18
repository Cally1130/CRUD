import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'checklist/:id',
        loadComponent: () => import('./checklist/checklist.component')
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component'),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    }
];
