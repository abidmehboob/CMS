import { MakeService } from './../core/services/make-service/make.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModelService } from '../core/services/model-service/model.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css',
  '../subadmin-detail/subadmin-detail.component.css']
})
export class ModelComponent implements OnInit {

  
  @ViewChild('myTable') table: DatatableComponent;
  viewOption: string
  rows: any = [];
  temp = []
  makes: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null; 
  editId: string = null
  
  name: string = null;
  shortDesc: string = null;
  makeId: string = null;

  nameE : string = null;
  shortDescE: string = null;
  makeIdE: string = null;

  paramMakeId: string = null
  paramMakeName: string = ''

  constructor(
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private modelService: ModelService,
    private makeService: MakeService
  
  ) {
    this.viewOption = this.activatedRoute.snapshot.data.viewOption
    console.log(this.viewOption)
    if(this.viewOption === 'make-models'){
      this.activatedRoute.paramMap.subscribe((params) => {
        this.paramMakeId = params.get('makeId');
      })
      this.modelService.getModelsAgainstMake(this.paramMakeId)
    }
    else if(this.viewOption === 'model'){
      this.modelService.getAllModels();
    }
    this.subscriptions[0] = this.modelService.modelData$.subscribe(
      (data) => {
        console.log(data)
        if (data && data.length > 0) {
          this.rows = data;
          this.paramMakeName = this.viewOption === 'make-models' ? data[0].makeId.name : ""
          this.temp = [...data]
        }
      }
    );
    if(this.viewOption === 'model'){
    this.makeService.getAllMakes()
    this.subscriptions[1] = this.makeService.makeData$.subscribe(data => {
      if (data && data.length > 0) {
        this.makes = data;
        console.log('this.make)',this.makes);
      }
    });
  }
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
  
  onSubmit() {

    this.resetHighlight();
    if (this.name == null) {
      this.notifyService.showWarning('Model Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if (this.shortDesc == null) {
      this.notifyService.showWarning('Short Desc required', 'Error');
      this.showHighlight('shortDesc');
      return false;
    }
    if(this.viewOption === 'model'){
    if (this.makeId == null) {
      this.notifyService.showWarning('Select Make', 'Error');
      this.showHighlight('makeId');
      return false;
    }
  }
    const obj = {
      name: this.name,
      shortDesc: this.shortDesc,
      makeId: this.viewOption === 'model' ? this.makeId : this.paramMakeId
    }
    this.modelService.createModel(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          this.modalClose('createModal');
          // const data = this.modelService.modelData$.getValue();
          // data.push(res['data']);
          // this.modelService.modelData$.next(data);
          if(this.viewOption === 'make-models'){
            this.modelService.getModelsAgainstMake(this.paramMakeId)
          }
          else {
            this.modelService.getAllModels();
          }
          this.notifyService.showSuccess(
            'Added successfully',
            'Success'
          );
          $('.form-control').val('');
          $('.form-c').val('');
          this.makeId = null
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
    this.modelService.changeStatus(id, object);
  }

  

  editForm(id , i){
    const editData =  this.rows.find(row => row._id === id);

    console.log('editData',editData);
    this.nameE  = editData.name;
    this.shortDescE = editData.shortDesc;
    this.editId = editData._id;
    this.makeIdE = editData.makeId._id;
  }

  onSubmitEdit() {
  
    this.resetHighlight();

    if(this.nameE == null){
      this.notifyService.showWarning('Model Name required', 'Error');
      this.showHighlight('name');
      return false;
    }
    if(this.shortDescE == null){
      this.notifyService.showWarning("Short Desc required", "Error");
      this.showHighlight('shortDescE');
      return false;
    }
    if(this.viewOption === 'model'){
    if (this.makeIdE == null) {
      this.notifyService.showWarning('Select Make', 'Error');
      this.showHighlight('makeIdE');
      return false;
    }
  }
    const obj = {
      name: this.nameE,
      shortDesc: this.shortDescE,
      makeId: this.viewOption === 'model' ? this.makeIdE : this.paramMakeId
    
    };
      
      this.modelService.editModel(obj,this.editId)
      .subscribe(res => {
        console.log(res);
        if(this.viewOption === 'make-models'){
          this.modelService.getModelsAgainstMake(this.paramMakeId)
        }
        else {
          this.modelService.getAllModels();
        }
       this.modalClose('editModal')
       this.editId = null
       this.nameE = null;
       this.shortDescE = null;
       this.makeIdE = null
      })  
  }
  
  deleteForm(id) {
    this.deleteId = id
  }

  deleteModel() {
    this.modelService.deleteModel(this.deleteId).subscribe(
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
    this.modelService.modelData$.next([]);
  }
}
