import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerService } from '../core/services/banner-service/banner.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css',
  '../subadmin-detail/subadmin-detail.component.css']
})
export class BannerComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null; 
  editId: string = null
  imageUrl: string = null;
  
  pageName: string = null;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  
  pageNameE : string = null;
  imageE: string = null;
  previewUrlE: any = null;

  constructor(
    private notifyService: NotificationService,
    private bannerService: BannerService,
  ) {
    this.imageUrl = environment.imageBase;
    this.bannerService.getAllBanners();
    this.subscriptions[0] = this.bannerService.bannerData$.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.pageName.toLowerCase().indexOf(val) !== -1 || !val));
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
      this.previewUrl = reader.result;
      this.previewUrlE = reader.result;
    };
  }

  removeImg(){
    this.previewUrlE = null;
  }
  cancel(){
    this.previewUrl = null;
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
    console.log('this.fileData', this.fileData);

    this.resetHighlight();
    if (this.pageName == null) {
      this.notifyService.showWarning('Banner Name required', 'Error');
      this.showHighlight('pageName');
      return false;
    }
    if (this.fileData == null) {
      this.notifyService.showWarning('Image required', 'Error');
      return false;
    }
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('pageName', this.pageName);
    
    this.bannerService.createBanner(formData).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          // const data = this.bannerService.bannerData$.getValue();
          // data.push(res['data']);
          // this.bannerService.bannerData$.next(data);
          this.bannerService.getAllBanners();
          this.notifyService.showSuccess(
            'Added successfully',
            'Success'
          );
          $('.form-control').val('');
          $('.form-c').val('');
          this.previewUrl = null
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
    this.bannerService.changeStatus(id, object);
  }

  

  editForm(id , i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.pageNameE  = editData.pageName;
    this.imageE = editData.image;
    this.editId = editData._id;
    this.previewUrlE = this.imageUrl+editData.image;
  }

  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
  
    this.resetHighlight();

    if(this.pageNameE == null){
      this.notifyService.showWarning('Banner Name required', 'Error');
      this.showHighlight('pageName');
      return false;
    }
    const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('pageName', this.pageNameE);
      formData.append('image', this.imageE);
    
      this.bannerService.editBanner(formData,this.editId)
      .subscribe(res => {
        console.log(res);
       this.bannerService.getAllBanners();
       this.modalClose('editModal')
       this.editId = null
       this.fileData = null;
       this.pageNameE = null;
      })  
  }
  
  deleteForm(id) {
    this.deleteId = id
  }

  deleteBanner() {
    this.bannerService.deleteBanner(this.deleteId).subscribe(
      (res) => {
        if (res['success']) {
          this.rows = this.rows.filter(
            (banner) => banner['_id'] !== this.deleteId
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
    this.bannerService.bannerData$.next([]);
  }


}
