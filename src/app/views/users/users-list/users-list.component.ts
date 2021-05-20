import { HandleErrorService } from './../../../shared/services/handle-error.service';
import { ApisService } from './../../../shared/services/apis.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  dataSource: any = [];
  constructor(private api: ApisService, private toaster: ToastrService, private handleError: HandleErrorService) {
    this.dataSource = new MatTableDataSource([]);
  }

  displayedColumns: string[] = ['id', 'name', 'email', 'actions'];


  ngOnInit(): void {
    // Get Users List
    this.getUsers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Get Users List
  getUsers() {
    this.api.GET('dashboard/users').subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.body.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  deleteUser(user: any) {
    Swal.fire({
      title: `Are you sure you want to delete ${user.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8263FF',
      cancelButtonColor: '#5b6e88',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.DELETE('dashboard/users/' + user.id).subscribe((res: any) => {
          if (res.body.message) {
            this.toaster.info(`${user.name} has been deleted`);
            this.getUsers();
          }
        }, error => {
          this.handleError.handleError(error);
        })
      }
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}