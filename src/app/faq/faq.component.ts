import { CategoryService } from './../core/services/category-service/category.service';
import { FaqService } from './../core/services/faq-service/faq.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css', 
  '../subadmin-detail/subadmin-detail.component.css']
})
export class FaqComponent implements OnInit {

  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  categories: any = []
  subscriptions: Subscription[] = [];
  deleteId: string = null;
  editId: string = null

  question: string = null;
  answer: string = null;
  categoryId: string = null;

  questionE: string = null;
  answerE: string = null;
  
  categoryIdE: string = null;

  constructor(
    private notifyService: NotificationService,
    private faqService: FaqService,
    private categoryService: CategoryService
  ) {
    this.faqService.getAllFaqs();
    this.subscriptions[0] = this.faqService.faqData$.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.rows = data;
          this.temp = [...data]
        }
      }
    );
    //this.categoryService.getAllCategories()
    this.subscriptions[1] = this.categoryService.categoryData$.subscribe(data => {
      if (data && data.length > 0) {
        this.categories = data;
        console.log('this.category)',this.categories);
      }
    });
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return ((d.question.toLowerCase().indexOf(val) !== -1 || d.answer.toLowerCase().indexOf(val) !== -1 || !val));
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
    if (this.question == null) {
      this.notifyService.showWarning('Question required', 'Error');
      this.showHighlight('question');
      return false;
    }
    if (this.answer == null) {
      this.notifyService.showWarning('Answer required', 'Error');
      this.showHighlight('answer');
      return false;
    }
    if (this.categoryId == null) {
      this.notifyService.showWarning('Select Category', 'Error');
      this.showHighlight('categoryId');
      return false;
    }
    const obj = {
      question: this.question,
      answer: this.answer,
      categoryId: this.categoryId
    }
    this.faqService.createFaq(obj).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        if (res.success) {
          console.log(this.faqService.faqData$.getValue())
          // const data = this.faqService.faqData$.getValue();
          // data.push(res['data']);
          // this.faqService.faqData$.next(data);
          this.faqService.getAllFaqs();
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

  changeStatus(id, e) {
    let status = e.target.checked ? 'active' : 'blocked';
    const object = {
      status,
    };
    this.faqService.changeStatus(id, object);
  }

  editForm(id, i) {
    const editData =  this.rows.find(row => row._id === id);
    console.log('editData', editData);
    this.questionE = editData.question;
    this.answerE = editData.answer;
    this.categoryIdE  = editData.categoryId._id;
    this.editId = editData._id;
  }

  onSubmitEdit() {
    this.resetHighlight();

    if (this.questionE == null) {
      this.notifyService.showWarning("Question required", "Error");
      this.showHighlight('questionE');
      return false;
    }
    if (this.answerE == null) {
      this.notifyService.showWarning("Answer required", "Error");
      this.showHighlight('answerE');
      return false;
    }
    if (this.categoryIdE == null) {
      this.notifyService.showWarning("Select Category", "Error");
      this.showHighlight('categoryIdE');
      return false;
    }
    const obj = {
      question: this.questionE,
      answer: this.answerE,
      categoryId: this.categoryIdE
    }
    this.faqService.editFaq(obj, this.editId)
      .subscribe(res => {
        if(res['success']){
          console.log(res);
          this.faqService.getAllFaqs();
          this.modalClose('editModal')
          this.editId = null
          this.questionE = null;
          this.answerE = null;
          this.categoryIdE = null
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

  deleteForm(id) {
    this.deleteId = id
  }

  deleteFaq() {
    this.faqService.deleteFaq(this.deleteId).subscribe(
      (res) => {
        if (res['success']) {
          this.rows = this.rows.filter(
            (faq) => faq['_id'] !== this.deleteId
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
    this.faqService.faqData$.next([]);
  }
}