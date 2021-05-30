import { EventService } from './../core/services/event-service/event.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css', 
  '../subadmin-detail/subadmin-detail.component.css']
})
export class EventComponent implements OnInit {
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null;
  editId: string = null

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  
  eventName: string = null;
  details: string = null;
  link: string = null;
  addedBy: string = null;
  imageUrl: string = null;

  eventNameE: string = null;
  detailsE: string = null;
  linkE: string = null;
  addedByE: string = null;
  imageE: string = null;
  previewUrlE: any = null;

  constructor(
    private notifyService: NotificationService,
    private eventService: EventService,
  ) {
    this.imageUrl = environment.imageBase;
    this.eventService.getAllEvents();
    this.subscriptions[0] = this.eventService.eventData$.subscribe(
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
      return ((d.eventName.toLowerCase().indexOf(val) !== -1 || d.details.toLowerCase().indexOf(val) !== -1 || !val));
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

  onSubmit() {
    console.log('this.fileData', this.fileData);

    this.resetHighlight();
    if (this.eventName == null) {
      this.notifyService.showWarning('Event Name required', 'Error');
      this.showHighlight('eventName');
      return false;
    }
    if (this.details == null) {
      this.notifyService.showWarning('details required', 'Error');
      this.showHighlight('details');
      return false;
    }
    if (this.link == null) {
      this.notifyService.showWarning('link required', 'Error');
      this.showHighlight('link');
      return false;
    }
    if (this.fileData == null) {
      this.notifyService.showWarning('Image required', 'Error');
      return false;
    }
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('eventName', this.eventName);
    formData.append('details', this.details);
    formData.append('link', this.link);
    formData.append('addedBy', this.addedBy);

    this.eventService.createEvent(formData).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          // const data = this.eventService.eventData$.getValue();
          // data.push(res['data']);
          // this.eventService.eventData$.next(data);
          this.eventService.getAllEvents();
          this.notifyService.showSuccess(
            'Added Successfully',
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
    this.eventService.changeStatus(id, object);
  }

  editForm(id , i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.eventNameE  = editData.eventName;
    this.detailsE = editData.details;
    this.linkE = editData.link;
    this.addedByE = editData.addedBy;
    this.imageE = editData.image;
    this.editId = editData._id;
    this.previewUrlE = this.imageUrl+editData.image;
  }

  onSubmitEdit() {
    console.log('this.fileData',this.fileData);
  
    this.resetHighlight();

    if(this.eventNameE == null){
      this.notifyService.showWarning('Event Name required', 'Error');
      this.showHighlight('eventName');
      return false;
    }
    if(this.detailsE == null){
      this.notifyService.showWarning("details required", "Error");
      this.showHighlight('detailsE');
      return false;
    }
    if(this.linkE == null){
      this.notifyService.showWarning("link required", "Error");
      this.showHighlight('linkE');
      return false;
    }
      const formData = new FormData();
      formData.append('file', this.fileData);
      formData.append('eventName', this.eventNameE);
      formData.append('details', this.detailsE);
      formData.append('link', this.linkE);
      formData.append('addedBy', this.addedByE);
      formData.append('image', this.imageE);
      console.log(formData)
      this.eventService.editEvent(formData,this.editId)
      .subscribe(res => {
        console.log(res);
       this.eventService.getAllEvents();
       this.modalClose('editModal')
       this.editId = null
       this.fileData = null;
       this.eventNameE = null;
       this.detailsE = null;
       this.link = null
       this.addedBy = null
      })  
  }
  
  deleteForm(id) {
    this.deleteId = id
  }

  deleteEvent() {
    this.eventService.deleteEvent(this.deleteId).subscribe(
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
    this.eventService.eventData$.next([]);
  }

}
