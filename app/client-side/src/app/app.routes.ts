import { Routes } from '@angular/router';
import { Rooms } from './pages/rooms/rooms';
import { Landing } from './pages/landing/landing';

export const routes: Routes = [
    {path:'rooms',component:Rooms},
    {path:'',component:Landing}
];
