import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MakeService } from '../core/services/make-service/make.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { SubcategoryService } from './../core/services/subcategory-service/subcategory.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-make',
  templateUrl: './make.component.html',
  styleUrls: ['./make.component.css',
    '../subadmin-detail/subadmin-detail.component.css',]
})

export class MakeComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;
  viewOption: string
  rows: any = [];
  temp = []
  subcategories: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null;
  editId: string = null

  name: string = null;
  shortDesc: string = null;
  subcategoryId: string = null;


  nameE: string = null;
  shortDescE: string = null;
  subcategoryIdE: string = null;

  paramSubcategoryId: string = null
  paramSubcategoryName: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private makeService: MakeService,
    private subcategoryService: SubcategoryService
  ) {
    this.viewOption = this.activatedRoute.snapshot.data.viewOption
    if(this.viewOption === 'subcategory-makes'){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.paramSubcategoryId = params.get('subcategoryId');
      })
      this.makeService.getMakesAgainstSubcategory(this.paramSubcategoryId)
    }
    else if(this.viewOption === 'make'){
      this.makeService.getAllMakes();
    }
    
    this.subscriptions[0] = this.makeService.makeData$.subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.rows = data;
          this.paramSubcategoryName = this.viewOption === 'subcategory-makes' ? data[0].subcategoryId.name : ""
          console.log(this.paramSubcategoryName)
          this.temp = [...data]
        }
      }
    );
    if(this.viewOption === 'make'){
  //  this.subcategoryService.getAllSubcategories()
    this.subscriptions[1] = this.subcategoryService.subcategoryData$.subscribe(data => {
      if (data && data.length > 0) {
        this.subcategories = data;
        console.log('this.category)', this.subcategories);
      }
    });
  }
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.name.toLowerCase().indexOf(val) !== -1 || d.shortDesc.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  ngOnInit(): void {
  }

  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  resetHighlight() {
    let elem = document.getElementsByClassName('form-control');
    //elem.style = "color:red; border: 1px solid red";
    $('.form-control').css('border', '');
  }

  showHighlight(e) {
    let elem: HTMLElement = document.getElementById(e);
    elem.setAttribute('style', 'border: 1px solid red;');
  }

  onSubmit() {
    this.resetHighlight();
    if (this.name == null) {
      this.notifyService.showWarning('Make Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDesc == null) {
      this.notifyService.showWarning('Short Desc required', 'Error');
      this.showHighlight('shortDesc');
      return false;
    }
    if(this.viewOption === 'make'){
    if (this.subcategoryId == null) {
      this.notifyService.showWarning('Select Category', 'Error');
      this.showHighlight('subcategoryId');
      return false;
    }
  }
    const obj = {
      name: this.name,
      shortDesc: this.shortDesc,
      subcategoryId: this.viewOption === 'make' ? this.subcategoryId : this.paramSubcategoryId
    }
    this.makeService.createMake(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          // const data = this.makeService.makeData$.getValue();
          // data.push(res['data']);
          // this.makeService.makeData$.next(data);
          if(this.viewOption === 'subcategory-makes'){
            this.makeService.getMakesAgainstSubcategory(this.paramSubcategoryId);
          }
          else {
            this.makeService.getAllMakes();
          }
          this.notifyService.showSuccess(
            'Added successfully',
            'Success'
          );
          $('.form-control').val('');
          $('.form-c').val('');
        } else {
          this.notifyService.showWarning(
            'Failed to add the application form',
            'Error!'
          );
        }
      },
      (err) => {
        console.error('err', err.error.error);
        this.notifyService.showWarning(err.error.error, 'Error');
      }
    );
  }

  changeStatus(id, e) {
    let status = e.target.checked ? 'active' : 'blocked';
    const object = {
      status,
    };
    this.makeService.changeStatus(id, object);
  }



  editForm(id, i) {
    const editData = this.rows.find(row => row._id === id);

    console.log('editData', editData);
    this.nameE = editData.name;
    this.shortDescE = editData.shortDesc;
    this.editId = editData._id;
    this.subcategoryIdE = editData.subcategoryId._id;
  }

  onSubmitEdit() {

    this.resetHighlight();

    if (this.nameE == null) {
      this.notifyService.showWarning('Make Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDescE == null) {
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if(this.viewOption === 'make'){
    if (this.subcategoryIdE == null) {
      this.notifyService.showWarning("Select Sub Category", "Error");
      this.showHighlight('subcategoryIdE');
      return false;
    }
  }
    const obj = {
      name: this.nameE,
      shortDesc: this.shortDescE,
      subcategoryId: this.viewOption === 'make' ? this.subcategoryIdE : this.paramSubcategoryId
    
    }

    this.makeService.editMake(obj, this.editId)
      .subscribe(res => {
        console.log(res);
        if(this.viewOption === 'subcategory-makes'){
          this.makeService.getMakesAgainstSubcategory(this.paramSubcategoryId);
        }
        else {
          this.makeService.getAllMakes();
        }
        this.modalClose('editModal')
        this.editId = null
        this.nameE = null;
        this.shortDescE = null;
        this.subcategoryIdE = null
      })
  }

  deleteForm(id) {
    this.deleteId = id
  }

  deleteMake() {
    this.makeService.deleteMake(this.deleteId).subscribe(
      (res) => {
        if (res['success']) {
          this.rows = this.rows.filter(
            (make) => make['_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
        } else {
          this.notifyService.showWarning('Something went wrong', 'Error');
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showWarning(errObj, 'Error');
      }
    );
    this.modalClose('deleteModal');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.makeService.makeData$.next([]);
  }


}
