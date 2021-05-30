import { ContentService } from './../core/services/content-service/content.service';
import { CategoryService } from './../core/services/category-service/category.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  editId: string = null

  name: string = null;
  content: string = null;

  nameE: string = null;
  contentE: string = null;
  

  constructor(
    private notifyService: NotificationService,
    private contentService: ContentService,
  ) {
    this.contentService.getAllContents();
    this.subscriptions[0] = this.contentService.contentData$.subscribe(
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
      return ((d.name.toLowerCase().indexOf(val) !== -1 ||d.content.toLowerCase().indexOf(val) !== -1 || !val));
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

  onSubmit() {

    this.resetHighlight();
    if (this.name == null) {
      this.notifyService.showWarning('Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.content == null) {
      this.notifyService.showWarning('Content required', 'Error');
      this.showHighlight('content');
      return false;
    }
    const obj = {
      name: this.name,
      content: this.content,
    }
    console.log(obj)
    this.contentService.createContent(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          console.log(this.contentService.contentData$.getValue())
          // const data = this.contentService.contentData$.getValue();
          // data.push(res['data']);
          // this.contentService.contentData$.next(data);
          this.contentService.getAllContents();
          this.modalClose('createModal');
          $('.form-control').val('');
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


  editForm(id, i) {
    const editData =  this.rows.find(row => row._id === id);
    console.log('editData', editData);
    this.nameE = editData.name;
    this.contentE = editData.content;
    this.editId = editData._id;
  }

  onSubmitEdit() {
    this.resetHighlight();

    if (this.nameE == null) {
      this.notifyService.showWarning("Name required", "Error");
      this.showHighlight('nameE');
      return false;
    }
    if (this.contentE == null) {
      this.notifyService.showWarning("Content required", "Error");
      this.showHighlight('contentE');
      return false;
    }
    const obj = {
      name: this.nameE,
      content: this.contentE,
    }
    this.contentService.editContent(obj, this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.contentService.getAllContents();
          this.modalClose('editModal')
          this.editId = null
          this.nameE = null;
          this.contentE = null;
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.contentService.contentData$.next([]);
  }

}
