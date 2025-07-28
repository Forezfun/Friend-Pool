import { Component, OnInit } from '@angular/core';
import { Player } from './components/player/player';
import { Search } from "./components/search/search";

@Component({
  selector: 'app-player-page',
  imports: [Player,Search],
  standalone: true,
  templateUrl: './player-page.html',
  styleUrl: './player-page.scss'
})
export class PlayerPage{
}
