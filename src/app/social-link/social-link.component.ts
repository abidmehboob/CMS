import { CategoryService } from './../core/services/category-service/category.service';
import { SocialLinkService } from './../core/services/social-link-service/social-link.service'
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-social-link',
  templateUrl: './social-link.component.html',
  styleUrls: ['./social-link.component.css']
})
export class SocialLinkComponent implements OnInit {

  
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  editId: string = null

  nameE: string = null
  linkE: string = null;
  
  constructor(
    private notifyService: NotificationService,
    private socialLinkService: SocialLinkService,
    private categoryService: CategoryService
  ) {
    this.socialLinkService.getAllSocialLinks();
    this.subscriptions[0] = this.socialLinkService.socialLinkData$.subscribe(
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
      return ((d.link.toLowerCase().indexOf(val) !== -1 || d.name.toLowerCase().indexOf(val) !== -1 || !val));
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
 
  editForm(id, i) {
    const editData =  this.rows.find(row => row._id === id);
    console.log('editData', editData);
    this.linkE = editData.link;
    this.nameE = editData.name;
    this.editId = editData._id;
  }

  onSubmitEdit() {
    this.resetHighlight();
    if (this.nameE == null) {
      this.notifyService.showWarning('Name required', 'Error');
      this.showHighlight('nameE');
      return false;
    }
    if (this.linkE == null) {
      this.notifyService.showWarning('Link required', 'Error');
      this.showHighlight('linkE');
      return false;
    }
    
    const obj = {
      name: this.nameE,
      link: this.linkE,
    }
    this.socialLinkService.editSocialLink(obj, this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.socialLinkService.getAllSocialLinks();
          this.modalClose('editModal')
          this.editId = null
          this.nameE = null
          this.linkE = null;
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
    this.socialLinkService.socialLinkData$.next([]);
  }

}
