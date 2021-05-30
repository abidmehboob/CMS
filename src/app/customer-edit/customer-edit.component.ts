import { ListingService } from './../core/services/listing-service/listing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../core/services/customer-service/customer.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { environment } from './../../environments/environment';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import * as $ from 'jquery';
declare var $: any;

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css', '../subadmin-detail/subadmin-detail.component.css'],
})
export class CustomerEditComponent implements OnInit {
  subscriptions: Subscription[] = [];
  @ViewChild('myTable') table: DatatableComponent;

  countries = [];
  states = [];
  cities = [];

  firstNameE: string = null;
  lastNameE: string = null;
  sellerNameE: string= null
  emailE: string = null;
  phonePrefixE: string = '';
  phoneNumberE: string = '';
  altPhoneNumberE: string = '';
  faxE: string = null;
  isPilotE: string = '';
  isAircraftOwnerE: string = ''
  aircraftTypeE: string = null
  userNameE: string = null;
  address1E: string = null;
  address2E: string = null;
  countryE: string = null;
  stateE: string = null;
  cityE: string = null;
  zipCodeE: string = null;
  contactPreferenceE: string = '';
  packageE : any
  editId: String = '';
  rows: any = [];
  temp = []
  deleteId: string = null; 
  imageUrl: string = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private notifyService: NotificationService,
    private listingService: ListingService,
  ) {
    this.imageUrl = environment.imageBase;
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.customerService.getSingleCustomer(id).subscribe((res) => {
        if (res['success']) {
          const resp = res['data'];
          console.log(resp)
          this.firstNameE = resp['firstName'];
          this.lastNameE = resp['lastName'];
          this.userNameE = resp['userName'];
          this.emailE = resp['email'];
          this.sellerNameE = resp['sellerName'] 
          this.faxE = resp['fax']
          this.isAircraftOwnerE = resp['isAircraftOwner']
          this.isPilotE = resp['isPilot']
          this.aircraftTypeE = resp['aircraftType']
          this.phonePrefixE = resp['phonePrefix'];
          this.phoneNumberE = resp['phoneNumber'];
          this.altPhoneNumberE = resp['altPhoneNumber'];
          this.address1E = resp['address1'];
          this.address2E = resp['address2']
          this.editId = resp['_id'];
          this.countryE = resp['country'];
          this.stateE = resp['state'];
          this.cityE = resp['city'];
          this.zipCodeE = resp['zipCode'];
          this.contactPreferenceE = resp['contactPreference'];
          this.packageE = resp['packages'][0]
          this.customerService.getStates(this.countryE).subscribe((res) => {
            if (res['success']) {
              this.states = res['data'];
            }
          });

          this.customerService.getCities(this.stateE).subscribe((res) => {
            if (res['success']) {
              this.cities = res['data'];
            }
          });
        }
      });
      
    this.listingService.getCustomerListing(id);
    this.subscriptions[0] = this.listingService.listingData$.subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );
    });
    this.customerService.getAllCountries();
    this.subscriptions[0] = this.customerService.countryData$.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.countries = data;
          console.log(this.countries)
        }
      }
    );

  }

  ngOnInit(): void {}

  resetHighlight() {
    let elem = document.getElementsByClassName('form-control');
    //elem.style = "color:red; border: 1px solid red";
    $('.form-control').css('border', '');
  }

  showHighlight(e) {
    let elem: HTMLElement = document.getElementById(e);
    elem.setAttribute('style', 'border: 1px solid red;');
  }

  getStates(countryId) {
    this.customerService.getStates(countryId).subscribe(
      (res) => {
        if (res['success']) {
          this.states = res['data'];
          this.cities = []
        } else {
          this.states = [];
          this.cities = [];
        }
      },
      (err) => {
        this.states = [];
        this.cities = [];
      }
    );
  }

  getCities(stateId) {
    this.customerService.getCities(stateId).subscribe(
      (res) => {
        if (res['success']) {
          this.cities = res['data'];
        } else {
          this.cities = [];
        }
      },
      (err) => {
        this.cities = [];
      }
    );
  }
  onSubmitEdit() {
    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.firstNameE === null || this.firstNameE === '') {
      this.notifyService.showWarning('First name required', 'Error');
      this.showHighlight('firstNameE');
      return false;
    }
    if (this.lastNameE === null || this.lastNameE === '') {
      this.notifyService.showWarning('Last name required', 'Error');
      this.showHighlight('lastNameE');
      return false;
    }
    if (this.address1E === null || this.address1E === '') {
      this.notifyService.showWarning('address name required', 'Error');
      this.showHighlight('address1E');
      return false;
    }
    if (this.userNameE === null || this.userNameE === '') {
      this.notifyService.showWarning('user name required', 'Error');
      this.showHighlight('userNameE');
      return false;
    }
    if (!re.test(String(this.emailE).toLowerCase())) {
      this.notifyService.showWarning('valid email required', 'Error');
      this.showHighlight('emailE');
      return false;
    }
    if (this.phonePrefixE === '' || !Number(this.phonePrefixE)) {
      this.notifyService.showWarning('Phone no required', 'Error');
      this.showHighlight('phonePrefixE');
      return false;
    }
    if (this.phoneNumberE === '' || !Number(this.phoneNumberE)) {
      this.notifyService.showWarning('Phone no required', 'Error');
      this.showHighlight('phoneNumberE');
      return false;
    }
    if (this.countryE === null || this.countryE === '') {
      this.notifyService.showWarning('Country required', 'Error');
      this.showHighlight('countryE');
      return false;
    }
    if (this.stateE === null || this.stateE === '') {
      this.notifyService.showWarning('State required', 'Error');
      this.showHighlight('stateE');
      return false;
    }
    if (this.cityE === null || this.cityE === '') {
      this.notifyService.showWarning('City required', 'Error');
      this.showHighlight('cityE');
      return false;
    }
    if (this.zipCodeE === null || this.zipCodeE === '') {
      this.notifyService.showWarning('Zipcode required', 'Error');
      this.showHighlight('zipCodeE');
      return false;
    }
    if (this.contactPreferenceE === null || this.contactPreferenceE === '') {
      this.notifyService.showWarning('Contact Preference required', 'Error');
      return false;
    }
    console.log(this.contactPreferenceE)
    const obj = {
      firstName: this.firstNameE,
      lastName: this.lastNameE,
      email: this.emailE,
      phonePrefix: this.phonePrefixE,
      phoneNumber: this.phonePrefixE,
      userName: this.userNameE,
      address1: this.address1E,
      country: this.countryE,
      state: this.stateE,
      city: this.cityE,
      contactPreference: this.contactPreferenceE,
      zipCode: this.zipCodeE,
      sellerName: this.sellerNameE,
      address2: this.address2E,
      altPhoneNumber: this.altPhoneNumberE,
      fax: this.faxE,
      isPilot: this.isPilotE,
      isAircraftOwner: this.isAircraftOwnerE,
      aircraftType: this.aircraftTypeE,
    };
    this.customerService.editCustomer(obj, this.editId).subscribe(
      (res) => {
        if (res['success']) {
          console.log(res);
          this.notifyService.showSuccess(
            'User Profile Updated Successfully',
            'Success'
          );
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

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.listingTitle.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  
  
  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  changeStatus(e, id) {
    let status = e.target.checked ? 'active' : 'pending';
    const object = {
      status,
    };
    this.listingService.changeStatus(id, object);
  }
  
  featuredListing(e, id) {
    
    const editData =  this.rows.find(row => row.featuredListing === true);
    console.log(editData, e.target.className)
    if(editData){
      if(editData.featuredListing && e.target.className === 'far fa-star'){
        this.notifyService.showError('There can be only one featured listing', 'Error')
        return false
      }
    }
    
    if(e.target.className === 'far fa-star'){
      const obj = {
        featuredListing: true
      }
      this.listingService.featuredListing(obj, id)
    }
    else {
      this.listingService.featuredListing({ featuredListing: false } , id)
    }
 //   this.listingService.getAllListings()
  }

  deleteForm(id) {
    this.deleteId = id
  }

  deleteListing() {
    this.listingService.deleteListing(this.deleteId).subscribe(
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
    this.listingService.listingData$.next([]);
  }

}
