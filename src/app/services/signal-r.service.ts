import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Employee } from '../interfaces/employee.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  public data : Employee[];
  public bradcastedData: Employee[];

  private hubConnection : signalR.HubConnection;

  public startConnection = () => {

    this.hubConnection = new signalR.HubConnectionBuilder()
                          .withUrl('https://localhost:44326/employee')
                          .build();

    this.hubConnection
        .start()
        .then(() => console.log('Connection started...'))
        .catch(err => console.log('Error while starting connection: ' + err));
  }


  public addTransferEmployeeDataListener = () => {
    this.hubConnection.on('transferemployeedata', (data) => {
      this.data = data;
      //console.log(this.data);
    });
  }

  public broadcastEmployeeData = () => {
    this.hubConnection.invoke('broadcastemployeedata', this.data)
        .catch(err => console.log(err));
  }

  public addBroadcastEmployeeDataListener = () => {
    this.hubConnection.on('broadcastemployeedata', (data) => {
      this.bradcastedData = data;
    });
  }
}
