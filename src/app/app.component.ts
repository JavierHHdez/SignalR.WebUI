import { Component, Input, OnInit } from '@angular/core';
import { SignalRService } from './services/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { Employee } from './interfaces/employee.model';
import { EmployeeService } from './services/employee/employee.service';
import { FormBuilder, FormGroup, Validators,  NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  public employeetemp: Employee;
  public employeeForm : FormGroup;
  public isNew = true;
  public submitted = false;
  public clear = false;
  public employeeId : any;
  
  constructor(
    public signalRService : SignalRService,
    private http : HttpClient,
    private dataservice : EmployeeService,
    private formBuilder : FormBuilder) { }

  ngOnInit(){
    this.signalRService.startConnection();
    this.signalRService.addTransferEmployeeDataListener();
    this.signalRService.addBroadcastEmployeeDataListener();
    this.startHttpRequest();

    this.employeeForm = this.formBuilder.group({
      firstName   : ['', Validators.required],
      lastName    : ['', Validators.required],
      dateOfBirth : ['', Validators.required],
      phoneNumber : ['', Validators.required],
      email       : ['', Validators.required],
      gender      : ['', Validators.required]
    });
  }

  get f() { return this.employeeForm.controls; }

  private startHttpRequest = () => {
    this.http.get('https://localhost:44326/api/employee')
        .subscribe(res =>  {
          console.log(res);
        });
  }

  public onSubmit(){

    this.submitted = true;

    if(this.employeeForm.invalid){
      return;
    }
    
    this.clear = true;

    this.employeetemp = new Employee();
    this.employeetemp.FirstName = this.f.firstName.value;
    this.employeetemp.LastName = this.f.lastName.value;
    this.employeetemp.DateOfBirth = this.f.dateOfBirth.value;
    this.employeetemp.PhoneNumber = this.f.phoneNumber.value;
    this.employeetemp.Email = this.f.email.value;
    this.employeetemp.Gender = this.f.gender.value;

    if(this.isNew){
      this.dataservice.AddEmployee(this.employeetemp).subscribe(res=>{
        alert("Employee Added successfully");
      });
    }else {
      this.employeetemp.EmployeeId = this.employeeId;
      this.dataservice.EditEmployee(this.employeetemp).subscribe(res=>{
        alert("Employee Updated successfully");
      });
    }
  }

  public delete(employeeId : string){
    if(confirm('¿Are you sure delete this item?')){
      this.dataservice.DeleteEmployee(employeeId).subscribe(res=>{
          alert("Employee Deleted  successfully");
      });
    }
  }

  public selectedItem(selectedItem : any){

    this.clear = true;
    this.isNew = false;
    
    this.employeeForm.setValue({
      firstName   : selectedItem.firstName,
      lastName    : selectedItem.lastName,
      dateOfBirth : selectedItem.dateOfBirth,
      phoneNumber : selectedItem.phoneNumber,
      email       : selectedItem.email,
      gender      : selectedItem.gender
    });

    this.employeeId = selectedItem.employeeId;
  }

  public clearData(){
    this.employeeForm.setValue({
      firstName   : '',
      lastName    : '',
      dateOfBirth : '',
      phoneNumber : '',
      email       : '',
      gender      : ''
    });
    this.clear = false;
    this.isNew = true;
  }
}
