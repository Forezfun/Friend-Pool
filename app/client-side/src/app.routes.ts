import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Rooms } from './pages/rooms/rooms';

export const routes: Routes = [
    {
        path:'',
        component:Landing
    },
    {
        path:'rooms',
        component:Rooms
    }
];
