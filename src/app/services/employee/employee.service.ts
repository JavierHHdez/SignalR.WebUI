import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Employee } from '../../interfaces/employee.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  public employees: Observable<Employee[]>;
  public newemployee: Employee;

  constructor(private http: HttpClient) { }

  AddEmployee(emp: Employee) {

    const headers = new HttpHeaders().set('content-type', 'application/json');

    var body = {
      FirstName: emp.FirstName, LastName: emp.LastName, DateOfBirth: emp.DateOfBirth, PhoneNumber: emp.PhoneNumber, Email: emp.Email, Gender: emp.Gender
    }

    return this.http.post<Employee>(environment.API_URL + '/employee', body, { headers });

  }

  EditEmployee(emp: Employee) {
    console.log(emp);
    const params = new HttpParams().set('EmployeeId', emp.EmployeeId.toString());
    const headers = new HttpHeaders().set('content-type', 'application/json');
    var body = {
      EmployeeId: emp.EmployeeId, FirstName: emp.FirstName, LastName: emp.LastName, DateOfBirth : emp.DateOfBirth, PhoneNumber : emp.PhoneNumber, Email: emp.Email, gender: emp.Gender
    }
    return this.http.put<Employee>(environment.API_URL + '/employee/' + emp.EmployeeId, body, { headers, params })

  }

  DeleteEmployee(employeeId : string) {
    return this.http.delete<Employee>(environment.API_URL + '/employee/' + employeeId)
  }
}
