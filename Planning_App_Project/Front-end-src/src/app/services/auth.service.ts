//Author- Merhawi
//Citation: Stackoverflow.com

import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
    user: any;
  isDev:boolean;

  constructor(private http:Http) {
    this.isDev = true; // Change to false before deployment
  }


//////////////EditProfile///////////////////////
editprofile(user){
  let headers = new Headers();
  this.loadToken();
  headers.append('Authorization', this.authToken);
  headers.append('Content-Type','application/json');
  let ep = this.prepEndpoint('users/profile/edit');
  return this.http.put(ep, user,{headers: headers})
    .map(res => res.json());
}
//////////////Registration///////////////////////
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('users/register');
    return this.http.post(ep, user,{headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('users/authenticate');
    return this.http.post(ep, user,{headers: headers})
      .map(res => res.json());
  }

  getProfile(){
  //  console.log('getprofile called--->');
    
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('users/profile');
    return this.http.get(ep,{headers: headers})
      .map(res => res.json());
  }


  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired();
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  prepEndpoint(ep){
    if(this.isDev){
      return ep;
    } else {
      return 'http://localhost:8080/'+ep;
    }
  }



  ////////////////////////////ALL TaskServices/////////////////////////////

  getTasks(){
    console.log('gettasks called--->');
    
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    let ep = this.prepEndpoint('api/tasks');
    return this.http.get(ep,{headers: headers})
      .map(res => res.json());
  }
  
addTask(newTask){
  let headers = new Headers();
  this.loadToken();
headers.append('Authorization', this.authToken);
headers.append('Content-Type', 'application/json');
let ep = this.prepEndpoint('/api/task');
return this.http.post(ep, JSON.stringify(newTask), {headers: headers})
    .map(res => res.json());
}

deleteTask(id){
  let headers = new Headers();
  this.loadToken();
headers.append('Authorization', this.authToken);
headers.append('Content-Type', 'application/json');
let ep = this.prepEndpoint('/api/tasks');
return this.http.delete(ep+"/:"+id,{headers:headers})
    .map(res => res.json());
}

updateStatus(task){
  let headers = new Headers();
  this.loadToken();
headers.append('Authorization', this.authToken);
headers.append('Content-Type', 'application/json');
let ep = this.prepEndpoint('/api/tasks');
return this.http.put(ep+"/:"+task.task_id, JSON.stringify(task), {headers: headers})
    .map(res => res.json());
}


}
