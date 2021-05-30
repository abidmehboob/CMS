import { CategoryService } from './../core/services/category-service/category.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubcategoryService } from '../core/services/subcategory-service/subcategory.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../core/services/listing-service/listing.service';


@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css',
    '../subadmin-detail/subadmin-detail.component.css']
})

export class SubcategoryComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;
  viewOption: string
  rows: any = [];
  temp = []
  action = "Add";
  categories: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null;
  editId: string = null
  imageUrl: string = null;
  mode = 1;

  name: string = null;
  numberOfSeats: string = '';
  driverRequired : Boolean = false;
  fuel : Boolean = false;
  type: string = null;
  perDayRate: string = null;
  description: string = null;

  nameE: string = null;
  shortDescE: string = null;
  categoryIdE: string = null;
  productForm: FormGroup;
  isClassification: Boolean = false
  isClassificationE: Boolean = false
  productFormE: FormGroup

  paramCategoryId: string = null
  paramCategoryName: string = ''
  showLoader: Boolean = false;
  images : Array<Object> = [];
  viewData : Array<Object> = [];
  showImages : Array<Object> = [];
  imgBase = "";
  perPage = 0;
  totalElements = 0;
  saveDisabled = false;
  btn = "Submit";
  



  constructor(
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private listingService: ListingService


  ) {
    this.viewOption = this.activatedRoute.snapshot.data.viewOption
    console.log(this.viewOption)
    this.imgBase = environment.imageBase+"file_uploads/sight_seeing_images/";

    this.subcategoryService.getAllPrivateVehicle(0,'');

    if(this.viewOption === 'category-subcategories'){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.paramCategoryId = params.get('categoryId');
      })
      this.subcategoryService.getSubcategoriesAgainstCategory(this.paramCategoryId)
    }
    else if(this.viewOption === 'subcategory'){
      this.subcategoryService.getAllPrivateVehicle(0,'');
    }
    this.subscriptions[0] = this.subcategoryService.subcategoryData$.subscribe(
      (data) => {
        console.log(data)
        if (data) {
          this.totalElements = data.numberOfElements;
          this.rows = data['content'];
          this.temp = data['content'];

        }
      }
    );
    
    if(this.viewOption === 'subcategory'){
    //  this.categoryService.getAllCategories()
      this.subscriptions[1] = this.categoryService.categoryData$.subscribe(data => {
        if (data && data.length > 0) {
          this.categories = data;
          console.log('this.category)', this.categories);
        }
      });
    }
    
  }
  pageChange(e){
    console.log("e",e.page);
    this.subcategoryService.getAllPrivateVehicle(e.page-1,'');

  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
      if(val.length === 0){
          this.subcategoryService.getAllPrivateVehicle(0,'');

      }else if(val.length > 3){
         setTimeout(() => {
          this.subcategoryService.getAllPrivateVehicle(0,val);

         }, 500); 
      }

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

  quantities(): FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  quantitiesE(): FormArray {
    return this.productFormE.get("quantitiesE") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      name: '',
      type: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }
  addQuantityE() {
    this.quantitiesE().push(this.newQuantity());
  }
  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  removeQuantityE(i: number) {
    this.quantitiesE().removeAt(i);
  }
  onSubmit() {
    this.resetHighlight();
    if (this.name == null) {
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
    this.saveDisabled = true;
    this.btn = "Please Wait ";

    const obj = {
      "description": this.description,
      "images":images,
      "driver_required": this.driverRequired,
      "fuel": this.fuel,
      "name": this.name,
      "number_of_seat": this.numberOfSeats,
      "per_day_rate": this.perDayRate,
      "type": this.type
    }
    if(this.mode === 1){
      this.subcategoryService.createPrivateHire(obj).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          this.saveDisabled = false;
          this.btn = "Submit";
        
          if (res) {
            this.modalClose('createModal');
            this.subcategoryService.getAllPrivateVehicle(0,'');
  
            this.notifyService.showSuccess(
              'Added successfully',
              'Success'
            );
            $('.form-control').val('');
            $('.form-c').val('');
            this.productForm = this.fb.group({
              quantities: this.fb.array([]),
            });
          } else {
            this.notifyService.showWarning(
              'Failed to add ',
              'Error!'
            );
          }
        },
        (err) => {
          console.error('err', err.error.error);
          this.saveDisabled = false;
          this.btn = "Submit";
        
          this.notifyService.showWarning(err.error.error, 'Error');
        }
      );
  
    }else{
      //this.editId
      this.saveDisabled = true;
      this.btn = "Please Wait ";
  
      let newobj = {
        "description": this.description,
        "driver_required": this.driverRequired,
        "fuel": this.fuel,
        "name": this.name,
        "number_of_seat": this.numberOfSeats,
        "per_day_rate": this.perDayRate,
        "type": this.type,
        "private_hired_id" : this.editId
      }
      this.subcategoryService.editPrivateHire(newobj).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          this.saveDisabled = false;
          this.btn = "Submit";
        
          if (res) {
            this.modalClose('createModal');
            this.subcategoryService.getAllPrivateVehicle(0,'');
  
            this.notifyService.showSuccess(
              'Edit successfully',
              'Success'
            );
            $('.form-control').val('');
            $('.form-c').val('');
            this.productForm = this.fb.group({
              quantities: this.fb.array([]),
            });
          } else {
            this.notifyService.showWarning(
              'Failed to add ',
              'Error!'
            );
          }
        },
        (err) => {
          console.error('err', err.error.error);
          this.saveDisabled = false;
          this.btn = "Submit";
        
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
    this.subcategoryService.changeStatus(id, object);
  }

  // change(q){
  //   console.log('q',q)
  // }
  cm(){
    this.action = "Add";
    this.mode = 1;
    this.description = null;
    this.driverRequired = false;
    this.fuel = false;
    this.name = null;
    this.numberOfSeats = "";
    this.perDayRate = "";
    this.type = null;
    this.images = [];
    
  }
  editForm(id, i) {
    this.mode = 2;
    this.editId = id;
    console.log("id",id);
    console.log("this.rows",this.rows);

    this.action = "Edit ";
    const editData = this.rows.find(row => row.private_hired_id === id);
      console.log("editData",editData);
    this.description = editData.description;
    this.driverRequired = editData.driver_required;
    this.fuel = editData.fuel;
    this.name = editData.name;
    this.numberOfSeats = editData.number_of_seat;
    this.perDayRate = editData.per_day_rate
    this.type = editData.type;

  }

  onSubmitEdit() {

    this.resetHighlight();

    if (this.nameE == null) {
      this.notifyService.showWarning('Subcategory Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDescE == null) {
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if(this.viewOption === 'subcategory'){
      if (this.categoryIdE == null) {
        this.notifyService.showWarning('Select Category', 'Error');
        this.showHighlight('categoryIdE');
        return false;
      }
    }
    console.log(this.isClassificationE, this.productFormE.value.quantitiesE.length )
    if (this.isClassificationE && this.productFormE.value.quantitiesE.length == 0) {
      this.notifyService.showWarning("Please add classification", "Error");
      return false;
    }
    const obj = {
      name: this.nameE,
      shortDesc: this.shortDescE,
      categoryId: this.viewOption === 'subcategory' ? this.categoryIdE : this.paramCategoryId,
      isClassification: this.isClassificationE,
      classification: this.productFormE.value.quantitiesE
    }
    this.subcategoryService.editSubcategory(obj, this.editId)
      .subscribe(res => {
        console.log(res);
        if(this.viewOption === 'category-subcategories'){
          this.subcategoryService.getSubcategoriesAgainstCategory(this.paramCategoryId)
        }
        else {
     //     this.subcategoryService.getAllSubcategories();
        }
        this.modalClose('editModal')
        this.editId = null
        this.nameE = null;
        this.shortDescE = null;
        this.categoryIdE = null
      })
  }

  deleteForm(id) {
    this.deleteId = id
  }
  getImg(img){
    if(img == "" || img == null){
     return "http://68.183.96.85:3000/uploads/267-398/no-image.png";

    }else{
     let i = img.split(',');
     if(i.length >0){
       return    this.imgBase+i[0];
     }else{
      return     this.imgBase+img;

     }

    }
}

  deleteSubcategory() {
    this.subcategoryService.deleteSubcategory(this.deleteId).subscribe(
      (res) => {
        if (res) {
          this.rows = this.rows.filter(
            (model) => model['private_hired_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
        } else {
          this.rows = this.rows.filter(
            (model) => model['private_hired_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
          
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.notifyService.showWarning(errObj, 'Error');
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
      formData.append('module', 'PRIVATE_HIRED_IMAGE');
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subcategoryService.subcategoryData$.next([]);
  }
  viewSingle(id){
    this.showImages = [];

    this.temp.forEach(resp=>{
        if(resp.private_hired_id == id){
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
