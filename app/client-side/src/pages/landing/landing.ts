import { Component, OnInit } from '@angular/core';
import { Logo } from '../../components/logo/logo';

@Component({
  selector: 'app-landing',
  imports: [Logo],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
  standalone: true
})
export class Landing{
  
}
