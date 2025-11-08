import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { Rooms } from './pages/rooms/rooms';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,  // HttpClient доступен всему приложению
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
