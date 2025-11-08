import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { roomScreenInformation, RoomService } from '../../services/roomService';
import { Observable } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  imports: [AsyncPipe,ReactiveFormsModule],
  standalone:true,
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss'
})
export class Rooms implements OnInit,AfterViewInit {
  constructor(
    private roomService: RoomService,
    private elementRef:ElementRef,
    private renderer2:Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  rooms$!: Observable<roomScreenInformation[]>;
  createRoomSpan!:HTMLSpanElement
  showRoomModule:boolean = false
  createRoomForm=new FormGroup({
    name:new FormControl('',Validators.required),
    goal:new FormControl('',Validators.required),
    sum:new FormControl('',Validators.required),
    details:new FormControl('',Validators.required)
  })

  ngOnInit() {
    this.rooms$ = this.roomService.getRoomScreenInformation();
  }
  ngAfterViewInit(): void {
    this.createRoomSpan=this.elementRef.nativeElement.querySelector('.createRoomSpan') as HTMLSpanElement
    console.log()
  }
  createRoom(){
    const VALUE = this.createRoomForm.value
    console.log(VALUE)
  }
  openRoomModule(){
    this.showRoomModule=true
  }
  closeRoomModule(){
    this.showRoomModule=false
  }
}

