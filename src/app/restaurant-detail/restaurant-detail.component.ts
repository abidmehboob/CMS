import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantService } from '../core/services/restaurant-service/restaurant.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css', '../subadmin-detail/subadmin-detail.component.css']
})
export class RestaurantDetailComponent implements OnInit {
  
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = []
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: String = null
  editId: string = null; 
  imageUrl: string = null;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  nameE : string = null;
  shortDescE: string = null;
  taglineE: string = null;
  imageE: string = null;
  previewUrlE: any = null;


  constructor(private restaurantService: RestaurantService, private notifyService: NotificationService) { 
    this.imageUrl = environment.imageBase;
    
    this.restaurantService.getAllRestaurants()
    this.subscriptions[0] = this.restaurantService.restaurantData$.subscribe(data => {
      if (data && data.length > 0) {
        this.rows = data;
        this.temp = [...data]
      }
    });
  }

  ngOnInit(): void {
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.name.toLowerCase().indexOf(val) !== -1 || !val));
    });
    console.log(temp)
    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }  


  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }

  preview() {
    // Show preview
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrlE = reader.result;
    };
  }

  removeImg(){
    this.previewUrlE = null;
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
  
  deleteForm(id) {
    this.deleteId = id
  }

  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  changeStatus(id, e){
    let status = e.target.checked ? "active" : "blocked"
    const object = {
      status
    }
    this.restaurantService.changeStatus(id, object)
  }
  
  // deliveryStatus(id, e){
  //   const object = {
  //     deliveryAvailable: e.target.checked
  //   }
  //   this.restaurantService.deliveryStatus(id, object)
  // }

  deleteRestaurant(){
    this.restaurantService.deleteRestaurant(this.deleteId)
    .subscribe((res) => {
      if (res['success']) {
        this.rows = this.rows.filter((restaurant) => restaurant['_id'] !== this.deleteId)
        this.notifyService.showSuccess('Successfully Deleted', 'Success')
        this.deleteId = null
      } else {
        this.notifyService.showWarning('Something went wrong', 'Error');
      }
    },
    (err) => {
      const errObj = err.error.error;
      this.notifyService.showWarning(errObj, 'Error');
    })
    this.modalClose('deleteModal')
  }

  editForm(id, i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.nameE  = editData.name;
    this.shortDescE = editData.shortDesc;
    this.taglineE = editData.tagline;
    this.imageE = editData.image;
    this.editId = editData._id;
    this.previewUrlE = this.imageUrl+editData.image;
  }

  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
  
    this.resetHighlight();
    if(this.nameE == null){
      this.notifyService.showWarning("item required", "Error");
      this.showHighlight('nameE');
      return false;
    }
    if(this.shortDescE == null){
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if(this.taglineE == null){
      this.notifyService.showWarning("Price required", "Error");
      this.showHighlight('taglineE');
      return false;
    }
    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('name', this.nameE);
      formData.append('shortDesc', this.shortDescE);
      formData.append('tagline', this.taglineE);
      formData.append('image', this.imageE);
  
      this.restaurantService.editRestaurant(formData,this.editId)
      .subscribe(res => {
        console.log(res);
       this.restaurantService.getAllRestaurants();
       this.modalClose('editModal')
       this.editId = null
       this.fileData = null;
       this.nameE = null;
       this.shortDescE = null;
       this.taglineE = null;
      })  
  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
    this.restaurantService.restaurantData$.next(null)
  }
}


