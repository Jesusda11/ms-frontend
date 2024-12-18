import { Component, OnInit } from '@angular/core';

interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  activeUser: string = 'Usuario Activo'; // Simula el usuario activo

  ngOnInit() {
    // Simula la recuperación de mensajes
    this.messages = [
      { id: 1, text: 'Hola, ¿cómo estás?', sender: 'Otro Usuario', timestamp: new Date() },
      { id: 2, text: '¡Hola! Estoy bien, gracias.', sender: 'Usuario Activo', timestamp: new Date() },
      { id: 3, text: '¿Qué has estado haciendo?', sender: 'Otro Usuario', timestamp: new Date() },
    ];
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const newMsg: Message = {
        id: this.messages.length + 1,
        text: this.newMessage,
        sender: this.activeUser,
        timestamp: new Date()
      };
      this.messages.push(newMsg);
      this.newMessage = '';
    }
  }

  isActiveUser(sender: string): boolean {
    return sender === this.activeUser;
  }
}

