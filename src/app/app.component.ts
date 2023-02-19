import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscriber } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'User';

  displayedColumns: string[] = ['id', 'userName', 'email', 'phoneNumber','country','edit','delete'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog , private api: ApiService)
  {

  }
  ngOnInit(): void {
    this.getAllUsers();
  }

  openDialog() 
  {
    this.dialog.open(DialogComponent, {
      width: '35%',
      height: '63%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllUsers();
      }
    })
  }

  getAllUsers(){
    //let data : any = JSON.parse(localStorage.getItem("userData") || '{}')

    this.api.getUser()
    .subscribe({
      next:(res)=> {
this.dataSource= new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("Error while fetching the Records.....");
      }
    })  
  }
  // for updating records
  editUser(row :any)
  {
    this.dialog.open(DialogComponent,
      {
      width:'35%',
      height: '65%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllUsers();
      }
    })
  }

  // to delete the user data 
  deleteUser(id:number){
    this.api.deleteUser(id)
    .subscribe({
      next:(res)=>{
        alert("User Deleted Successfully.....!");
        this.getAllUsers();
      },
      error:()=>{
        alert("Error while deleting the record.....!");
      }
    })
  }

// for search functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
