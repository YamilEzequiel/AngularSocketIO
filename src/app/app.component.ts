import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private socket: Socket) {
    socket.fromEvent('new_message').subscribe((msj: any) => {
      console.log('llego un mensaje ', msj)
      this.message=true;
      setTimeout(() => {
        this.message=false;
      }, 1000);
    });
  }

  title = 'Angular';
  message = false;

  private _room$ = new BehaviorSubject<string | null>('UNO');


  ngOnInit(): void {
    this.socket.emit('event_message', '🎈 Dato enviado desde el front');
    this.joinRoom();
  }

  sendMessage(msg: string) {
    this.socket.emit('event_join', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data) => data));
  }

  leaveRoom(){
    this.socket.emit('event_leave', this._room$.getValue() );
  }

  joinRoom(){
    this.socket.emit('event_join', this._room$.getValue() );
  }


}
