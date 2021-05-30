import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../core/services/category-service/category.service';
import { ListingService } from '../core/services/listing-service/listing.service';

import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-deals',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null; 
  editId: string = null
  showLoader: Boolean = false;
  
  advertised : Boolean = false;
  deal_amount : string = "";
  description: string = "";
  hot_sight : Boolean = false
  hotel_id: string = "";
  name: string = "";
  new_arrival : Boolean = false;
  sight_seeing_id: string = "";
  cities : any;
  hotels : any;
  sightseens : any;
  images : Array<Object> = [];
  viewData : Array<Object> = [];
  showImages : Array<Object> = [];
  imgBase = "";
  totalElements = 0;
  perPage = 20;
  balance  = 0;
  walletEdit = false;

  
  nameE : string = null;
  shortDescE: string = null;
  action = "Add";
  mode = 1;
  walletId = "";
  payment_receipt = "";


  constructor(
    private notifyService: NotificationService,
    private categoryService: CategoryService,
    private listingService: ListingService

  ) { 
    this.categoryService.getAllCustomer(0,'');
    
    this.imgBase = environment.imageBase+"file_uploads/deal_images/"
    this.subscriptions[2] = this.categoryService.customerData$.subscribe(
      (data) => {
        if (data) {
          this.totalElements = data.totalElements;

          this.rows = data['content'];
        }
      });
      
  }

  

  ngOnInit(): void {
  }
  editWallet(){
    this.walletEdit = (this.walletEdit)? false : true;  
  }
  editWalletSave(){
     let v =  $("#walletV").val();
      if(v == ""){
        return false;
      }
     let obj = {
      "balance": v
    };
    
    this.categoryService.saveWallet(this.walletId,obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res) {
  
          this.modalClose('viewModal');
          this.walletEdit = false;
          $('.form-control').val('');
        } else {
          this.notifyService.showWarning(
            'Wallet updated',
            'Success!'
          );
        }
      },
      (err) => {
        console.error('err', err.error.error);
        this.notifyService.showWarning(err.error.error, 'Error');
      }
    );    

  }
  viewWallet(customer_id){
    
    this.categoryService.getWallet(customer_id).subscribe(
      (res) => {
        if (res) {
              console.log("res",res);
              this.payment_receipt = "";
                this.balance = res['balance'];
                this.walletId = res['id'];
                if(res['payment_receipt'] != null && res['payment_receipt'] != 'string'){
                  this.payment_receipt =   environment.imageBase+"file_uploads/customer_payment_images/"+res['payment_receipt'];
 
                }
        } 
      },
      (err) => {
        const errObj = err.error.error;
        if(errObj.includes('No data found')){
          console.log(errObj)
        }
        else{
          this.notifyService.showWarning(errObj, 'Error');
        }
      }
    );

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
      if(val.length === 0){
        this.categoryService.getAllCustomer(0,'');

      }else if(val.length > 3){
         setTimeout(() => {
          this.categoryService.getAllCustomer(0,val);

         }, 500); 
      }

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
    if (this.name === null) {
      this.notifyService.showWarning('Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    let images = [];
    if(this.images.length > 0){
        this.images.forEach(r=>{
          let p = r['image'].split('images/');
          console.log("p",p);
          images.push(p[1]);
        })
    }

    let object = {
      "advertised": this.advertised,
      "images":images,
      "deal_amount": this.deal_amount,
      "description": this.description,
      "hot_sight": this.hot_sight,
      "hotel_id": this.hotel_id,
      "name": this.name,
      "new_arrival": this.new_arrival,
      "sight_seeing_id": this.sight_seeing_id
    }
    if(this.mode == 1){

      this.listingService.createDeals(object).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          if (res) {
            this.categoryService.getAllDeals(0,'');
    
            this.modalClose('createModal');
            $('.form-control').val('');
          } else {
            this.notifyService.showWarning(
              'Failed to add the deals',
              'Error!'
            );
          }
        },
        (err) => {
          console.error('err', err.error.error);
          this.notifyService.showWarning(err.error.error, 'Error');
        }
      );    
    
    }else{

      let newObject = {
        "advertised": this.advertised,
        "images":images,
        "deal_amount": this.deal_amount,
        "description": this.description,
        "hot_sight": this.hot_sight,
        "hotel_id": this.hotel_id,
        "name": this.name,
        "new_arrival": this.new_arrival,
        "sight_seeing_id": this.sight_seeing_id,
        "deal_id" : this.editId
      }
      this.listingService.editDeals(newObject).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          if (res) {
            this.categoryService.getAllDeals(0,'');
    
            this.modalClose('createModal');
            $('.form-control').val('');
          } else {
            this.notifyService.showWarning(
              'Failed to add the deals',
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
  }

  changeStatus(id, e) {
    let status = e.target.checked ? 'active' : 'blocked';
    const object = {
      status,
    };
    this.categoryService.changeStatus(id, object);
  }
  cm(){
    this.action = "Add";
    this.mode = 1;
    this.advertised = false;
    this.deal_amount = "";
    this.description = null;
    this.hot_sight = false;
    this.hotel_id = "";
    this.name = null;
    this.new_arrival = false;
    this.sight_seeing_id = "";
    this.images = [];

  }
  pageChange(e){
    console.log("e",e.page);
    this.categoryService.getAllDeals(e.page-1,'');
 
  }

  

  editForm(id , i){
    this.mode = 2;
    this.editId = id;
    this.action = "Edit";

    const editData =  this.rows.find(row => row.deal_id === id);

      this.advertised = editData.advertised;
      this.deal_amount = editData.deal_amount;
      this.description = editData.description;
      this.hot_sight = editData.hot_sight;
      this.hotel_id = editData.hotel_id;
      this.name = editData.name;
      this.new_arrival = editData.new_arrival;
      this.sight_seeing_id = editData.sight_seeing_id;

  }

  onSubmitEdit() {
  
    this.resetHighlight();

    if(this.nameE == null){
      this.notifyService.showWarning('Category Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if(this.shortDescE == null){
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    const formData = new FormData();
      formData.append('name', this.nameE);
      formData.append('shortDesc', this.shortDescE);
      
      this.categoryService.editCategory(formData,this.editId)
      .subscribe(res => {
        console.log(res);
       this.categoryService.getAllSightseeing(0,'');
       this.modalClose('editModal')
       this.editId = null
       this.nameE = null;
       this.shortDescE = null;
      })  
  }
  
  deleteForm(id) {
    this.deleteId = id
  }

  deleteCategory() {
    this.categoryService.deleteCategory(this.deleteId).subscribe(
      (res) => {
        if (res) {
          this.rows = this.rows.filter(
            (category) => category['deal_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
        } else {
          this.rows = this.rows.filter(
            (category) => category['deal_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showSuccess('Successfully Deleted', 'Success')
        this.rows = this.rows.filter(
          (category) => category['deal_id'] !== this.deleteId
        );
        this.deleteId = null

      }
    );
    this.modalClose('deleteModal');
  }
  onImageSelect(event: any): void {
    this.showLoader = true;
  
   // const file: File = event.addedFiles[0];
    const file1: File[] = event.addedFiles;
    for (let i = 0; i < file1.length; i++) {
      const formData: FormData = new FormData();
      formData.append('file', file1[i]);
      formData.append('module', 'DEAL_IMAGE');
      formData.append('fileExtension', 'png');
       
  
      this.listingService.uploadFile(formData).subscribe(
        (res: ApiResponse) => {
         this.showLoader = false;
         if (res['path']) {
           let image = res['path'];
           //console.log("image",image);
           this.images.push({"image" : image});
           console.log("this.images",this.images);
          /*
          const photosArray: FormArray = this.aircraftMediaForm.get(
              'photos'
            ) as FormArray;
            photosArray.push(new FormControl({ imageName: res.data, orderBy: 1 }));
            console.log('photosArray', photosArray);
            */
          }else{
            alert("Something went wrong");
          }
        },
        (err) => {
          console.error('err', err);
        }
      );
  
    }
  
  }
  removeRecource(i){
  
  }
  getImg(img){
    if(img == "" || img == null){
     return "http://68.183.96.85:3000/uploads/267-398/no-image.png";

    }else{
     let i = img.split(',');
     if(i.length >0){
       return     this.imgBase+i[0];
     }else{
      return     this.imgBase+img;

     }

    }
}
  viewSingle(id){
    this.showImages = [];

    this.temp.forEach(resp=>{
        if(resp.deal_id == id){
          this.viewData = [{}];
           console.log("resp",resp);
           for (let key in resp){
            if(resp.hasOwnProperty(key)){
              let  n = key.split("_");
              console.log("n",n);
              let newkey = "";
               if(n.length == 3){
                newkey = n[0].toLocaleUpperCase()+' '+n[1].toLocaleUpperCase()+' '+n[2].toLocaleUpperCase();
               }else if(n.length == 2){
                newkey = n[0].toLocaleUpperCase()+' '+n[1].toLocaleUpperCase();

               }else{
                newkey = n[0].toLocaleUpperCase();

               }

               if(key == "images"){
                if(resp[key] != ""){
                  this.showImages = resp[key].split(",");
                   console.log("this.showImages",this.showImages);
                }
         }else{
          this.viewData.push({
            newkey,
            value : resp[key]
          })

         }
              
            }
         }           
        }
    })
  } 

}
