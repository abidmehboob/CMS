import { SubcategoryService } from './../core/services/subcategory-service/subcategory.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChildSubcategoryService } from '../core/services/child-subcategory-service/child-subcategory.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-child-subcategory',
  templateUrl: './child-subcategory.component.html',
  styleUrls: ['./child-subcategory.component.css',
    '../subadmin-detail/subadmin-detail.component.css']
})
export class ChildSubcategoryComponent implements OnInit {


  @ViewChild('myTable') table: DatatableComponent;

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

  constructor(
    private notifyService: NotificationService,
    private childSubcategoryService: ChildSubcategoryService,
    private subcategoryService: SubcategoryService

  ) {
    this.childSubcategoryService.getAllChildSubcategories();
    this.subscriptions[0] = this.childSubcategoryService.childSubcategoryData$.subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );

   // this.subcategoryService.getAllSubcategories()
    this.subscriptions[1] = this.subcategoryService.subcategoryData$.subscribe(data => {
      if (data && data.length > 0) {
        this.subcategories = data;
        console.log('this.subcategory)', this.subcategories);
      }
    });
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
      this.notifyService.showWarning('child subcategory Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDesc == null) {
      this.notifyService.showWarning('Short Desc required', 'Error');
      this.showHighlight('shortDesc');
      return false;
    }
    if (this.subcategoryId == null) {
      this.notifyService.showWarning('Select Subcategory', 'Error');
      this.showHighlight('subcategoryId');
      return false;
    }
    const obj = {
      name: this.name,
      shortDesc: this.shortDesc,
      subcategoryId: this.subcategoryId
    }
    this.childSubcategoryService.createChildSubcategory(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          // const data = this.childSubcategoryService.childSubcategoryData$.getValue();
          // data.push(res['data']);
          // this.childSubcategoryService.childSubcategoryData$.next(data);
          this.childSubcategoryService.getAllChildSubcategories();
          this.notifyService.showSuccess(
            'Added successfully',
            'Success'
          );
          $('.form-control').val('');
          $('.form-c').val('');
          this.subcategoryId = null
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
    this.childSubcategoryService.changeStatus(id, object);
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
      this.notifyService.showWarning('ChildSubcategory Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDescE == null) {
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if (this.subcategoryIdE == null) {
      this.notifyService.showWarning('Select Subcategory', 'Error');
      this.showHighlight('subcategoryIdE');
      return false;
    }
    const obj = {
      name: this.nameE,
      shortDesc: this.shortDescE,
      subcategoryId: this.subcategoryIdE
    }
    this.childSubcategoryService.editChildSubcategory(obj, this.editId)
      .subscribe(res => {
        console.log(res);
        this.childSubcategoryService.getAllChildSubcategories();
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

  deleteChildSubcategory() {
    this.childSubcategoryService.deleteChildSubcategory(this.deleteId).subscribe(
      (res) => {
        if (res['success']) {
          this.rows = this.rows.filter(
            (model) => model['_id'] !== this.deleteId
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
    this.childSubcategoryService.childSubcategoryData$.next([]);
  }


}
