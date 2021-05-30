import { CategoryService } from './../core/services/category-service/category.service';
import { SubscriptionService } from './../core/services/subscription-service/subscription.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css',
    '../subadmin-detail/subadmin-detail.component.css',]
})
export class SubscriptionComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  categories: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null;
  editId: string = null

  name: string = null;
  price: string = null
  categoryId: string = null
  packageForm: FormGroup;
  listingDays: string = null
  packageExpiresIn: string = null
  photosIncluded: string = null
  isFeatured: Boolean
  details: string = ""

  nameE: string = null;
  priceE: string = null
  categoryIdE: string = null
  packageFormE: FormGroup
  listingDaysE: string = null
  packageExpiresInE: string = null
  photosIncludedE: string = null
  isFeaturedE: Boolean
  detailsE: string = ""

  constructor(
    private notifyService: NotificationService,
    private subscriptionService: SubscriptionService,
    private categoryService: CategoryService,
    private fb: FormBuilder

  ) {
    // this.packageForm = this.fb.group({
    //   quantities: this.fb.array([]),
    // });
    // this.packageFormE = this.fb.group({
    //   quantitiesE: this.fb.array([]),
    // });
    this.subscriptionService.getAllSubscriptions();
    this.subscriptions[0] = this.subscriptionService.subscriptionData$.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );
  //  this.categoryService.getAllCategories()
    this.subscriptions[1] = this.categoryService.categoryData$.subscribe(data => {
      if (data && data.length > 0) {
        this.categories = data;
        console.log('this.category)',this.categories);
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

  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  ngOnInit(): void {
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

  // quantities(): FormArray {
  //   return this.packageForm.get("quantities") as FormArray
  // }

  // quantitiesE(): FormArray {
  //   return this.packageFormE.get("quantitiesE") as FormArray
  // }

  // newQuantity(): FormGroup {
  //   return this.fb.group({
  //     name: '',
  //   })
  // }

  // addQuantity() {
  //   this.quantities().push(this.newQuantity());
  // }
  // addQuantityE() {
  //   this.quantitiesE().push(this.newQuantity());
  // }
  // removeQuantity(i: number) {
  //   this.quantities().removeAt(i);
  // }

  // removeQuantityE(i: number) {
  //   this.quantitiesE().removeAt(i);
  // }

  onSubmit() {

    this.resetHighlight();
    if (this.name == null) {
      this.notifyService.showWarning('Subscription Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.price == null) {
      this.notifyService.showWarning('Enter price', 'Error');
      return false;
    }
    if (this.listingDays == null) {
      this.notifyService.showWarning('Enter listing days', 'Error');
      return false;
    }
    if (this.packageExpiresIn == null) {
      this.notifyService.showWarning('Enter package expiry days', 'Error');
      return false;
    }
    if (this.photosIncluded == null) {
      this.notifyService.showWarning('Enter photos included', 'Error');
      return false;
    }
    if (this.categoryId == null) {
      this.notifyService.showWarning('Select category', 'Error');
      return false;
    }
    // if  (this.packageForm.value.quantities.length == 0) {
    //   this.notifyService.showWarning("Please add package details", "Error");
    //   return false;
    // }
    const obj = {
      name: this.name,
      price: this.price,
      categoryId: this.categoryId,
      photosIncluded: this.photosIncluded,
      listingDays: this.listingDays,
      isFeatured: this.isFeatured,
      packageExpiresIn: this.packageExpiresIn,
      details: this.details
      // details: this.packageForm.value.quantities
    }
    this.subscriptionService.createSubscription(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          this.notifyService.showSuccess('Successfully added', 'Success')      
          this.subscriptionService.getAllSubscriptions();
          $('.form-control').val('');
          this.categoryId = null
          // this.packageForm = this.fb.group({
          //   quantities: this.fb.array([]),
          // });
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
    let status = e.target.checked ? 'active' : 'inactive';
    const object = {
      status,
    };
    this.subscriptionService.changeStatus(id, object);
  }

  editForm(id, i) {
    const editData =  this.rows.find(row => row._id === id);
    console.log('editData', editData);
    this.nameE = editData.name;
    this.editId = editData._id;
    this.priceE = editData.price
    this.listingDaysE = editData.listingDays
    this.isFeaturedE = editData.isFeatured
    this.photosIncludedE = editData.photosIncluded
    this.packageExpiresInE = editData.packageExpiresIn
    this.categoryIdE = editData.categoryId._id
    this.details = editData.details
    // this.packageFormE = this.fb.group({
    //   quantitiesE: this.fb.array(editData.details.map(d => 
    //     this.fb.group({
    //       name: this.fb.control(d.name)
    //     })
    //   ))
    // })
  }

  onSubmitEdit() {
    this.resetHighlight();

    if (this.nameE == null) {
      this.notifyService.showWarning("Subscription Name required", "Error");
      this.showHighlight('nameE');
      return false;
    }
    if (this.priceE == null) {
      this.notifyService.showWarning('Enter price', 'Error');
      return false;
    }
    if (this.categoryIdE == null) {
      this.notifyService.showWarning('Select category', 'Error');
      return false;
    }
    
    if (this.listingDaysE == null) {
      this.notifyService.showWarning('Enter listing days', 'Error');
      return false;
    }
    if (this.packageExpiresInE == null) {
      this.notifyService.showWarning('Enter package expiry days', 'Error');
      return false;
    }
    if (this.photosIncludedE == null) {
      this.notifyService.showWarning('Enter photos included', 'Error');
      return false;
    }
    // if (this.packageFormE.value.quantitiesE.length == 0) {
    //   this.notifyService.showWarning("Please add package details", "Error");
    //   return false;
    // }
    
    const obj = {
      name: this.nameE,
      price: this.priceE,
      categoryId: this.categoryIdE,
      photosIncluded: this.photosIncludedE,
      listingDays: this.listingDaysE,
      isFeatured: this.isFeaturedE,
      packageExpiresIn: this.packageExpiresInE,
      details: this.details
      // details: this.packageFormE.value.quantitiesE
    }
    this.subscriptionService.editSubscription(obj, this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.notifyService.showSuccess('Successfully updated', 'Success')
          this.subscriptionService.getAllSubscriptions();
          this.modalClose('editModal')
          this.editId = null
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

  deleteForm(id) {
    this.deleteId = id
  }

  deleteSubscription() {
    this.subscriptionService.deleteSubscription(this.deleteId).subscribe(
      (res) => {
        if (res['success']) {
          this.rows = this.rows.filter(
            (subscription) => subscription['_id'] !== this.deleteId
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
    this.subscriptionService.subscriptionData$.next([]);
  }
}
