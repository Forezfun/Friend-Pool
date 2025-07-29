import { Component } from '@angular/core';
import { Search } from "./components/search/search";
import { Player } from './components/player/player';


@Component({
  selector: 'app-player-page',
  imports: [Search,Player],
  standalone: true,
  templateUrl: './player-page.html',
  styleUrl: './player-page.scss'
})
export class PlayerPage {

}
