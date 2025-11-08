import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseServerUrl } from '.';
interface accessTokenResponse{
  accessToken:string
}
@Injectable({
  providedIn: 'root',
})
export class AccessToken {
      constructor(
    private http:HttpClient
  ){}

  private baseUrl = baseServerUrl+'user/access'
  
  getAccessToken():Observable<accessTokenResponse>{
    return this.http.get<accessTokenResponse>(this.baseUrl)
  }
}
