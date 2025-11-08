import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseServerUrl } from '.';
import { Observable } from 'rxjs';
export interface roomScreenInformation{
  name:String,
  id:Number
}

@Injectable({
  providedIn: 'root'
})

export class RoomService {

  constructor(
    private http:HttpClient
  ){}

  private baseUrl = baseServerUrl+'rooms'
  
  getRoomScreenInformation():Observable<roomScreenInformation[]>{
    return this.http.get<roomScreenInformation[]>(this.baseUrl)
  }
}
