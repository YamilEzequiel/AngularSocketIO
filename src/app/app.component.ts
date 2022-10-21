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

    socket.fromEvent('new_message_user').subscribe((msj: any) => {
      console.log('llego un mensaje ', msj)
      this.messages$.next([...this.messages$.getValue() , msj])
    });
  }

  title = 'Angular';
  message = false;

  messages$ = new BehaviorSubject<any[]>([]);

  private _room$ = new BehaviorSubject<string | null>('UNO');

  myMessage: string= '';


  ngOnInit(): void {
    this.socket.emit('event_message', '🎈 Dato enviado desde el front');
    this.joinRoom();
    this.sendMessageInput();
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

  sendMessageInput(){
    console.log(this.myMessage);
    this.socket.emit('newMessage', this.myMessage );
    this.myMessage='';
  }


}
