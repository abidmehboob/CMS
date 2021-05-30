import { CategoryService } from './../core/services/category-service/category.service';
import { environment } from './../../environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService } from '../core/services/menu-service/menu.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css', '../subadmin-detail/subadmin-detail.component.css'],
  providers: [MenuService]
})

export class MenuDetailComponent implements OnInit {
  
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = []
  temp = []
  categories: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null
  editId: string = null; 
  imageUrl: string = null;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  categoryIdE : string = null;
  itemNameE : string = null;
  shortDescE: string = null;
  priceE: string;
  imageE: string = null;
  previewUrlE: any = null;

  constructor(private menuService: MenuService, private notifyService: NotificationService, private categoryService: CategoryService) { 
    this.imageUrl = environment.imageBase;

    this.menuService.getAllMenus()
    this.subscriptions[0] = this.menuService.menuData$.subscribe(data => {
      if (data && data.length > 0) {
        this.rows = data;
        this.temp = [...data]
        console.log('this.menu)',this.rows);
      }
    });

   // this.categoryService.getAllCategories()
    this.subscriptions[1] = this.categoryService.categoryData$.subscribe(data => {
      if (data && data.length > 0) {
        this.categories = data;
        console.log('this.category)',this.categories);
      }
    });
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
    let status = e.target.checked ? "active" : "pending"
    const object = {
      status
    }
    this.menuService.changeStatus(id, object)
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


  editForm(id , i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.categoryIdE  = editData.categoryId._id;
    this.itemNameE  = editData.name;
    this.shortDescE = editData.shortDesc;
    this.priceE = editData.price;
    this.imageE = editData.image;
    this.editId = editData._id;
    this.previewUrlE = this.imageUrl+editData.image;
  }

  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
    this.resetHighlight();
    if(this.categoryIdE == null){
      this.notifyService.showWarning("category required", "Error");
      this.showHighlight('categoryIdE');
      return false;
    }
    if(this.itemNameE == null){
      this.notifyService.showWarning("item required", "Error");
      this.showHighlight('itemNameE');
      return false;
    }
    if(this.shortDescE == null){
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if(this.priceE == "" || !Number(this.priceE)){
      this.notifyService.showWarning("Price required", "Error");
      this.showHighlight('priceE');
      return false;
    }
    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('categoryId',this.categoryIdE);
      formData.append('name', this.itemNameE);
      formData.append('shortDesc', this.shortDescE);
      formData.append('price', this.priceE);
      formData.append('image', this.imageE);
  
      this.menuService.editMenu(formData,this.editId)
      .subscribe(res => {
        console.log(res);
       this.menuService.getAllMenus();
       this.modalClose('editModal')
       this.editId = null
       this.fileData = null;
       this.categoryIdE = null;
       this.itemNameE = null;
       this.shortDescE = null;
       this.priceE = "";
      })  
  }
  
  deleteMenu(){
    this.menuService.deleteMenu(this.deleteId)
    .subscribe((res) => {
      if (res['success']) {
        this.rows = this.rows.filter((menu) => menu['_id'] !== this.deleteId)
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

  ngOnInit() {}
  
  ngOnDestroy(){
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe()
    })
    this.menuService.menuData$.next(null)
    this.categoryService.categoryData$.next(null)
  }
}