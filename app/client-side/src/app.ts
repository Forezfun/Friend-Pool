import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomService } from './services/roomService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers:[
    RoomService
  ],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('FriendPool');
}
