import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../core/services/category-service/category.service';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ListingService } from '../core/services/listing-service/listing.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: [
    './category.component.css',
    '../subadmin-detail/subadmin-detail.component.css',
  ],
})
export class CategoryComponent implements OnInit {
  
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null; 
  editId: string = null
  
  name: string = null;
  email: string = null;
  phone: string = null;
  accountNumber: string = null;
  addressLine: string = null;
  backgroundImage: string = null;
  seenType: string = "type1";
  city: string = 'Karachi';
  description: string = '';
  latitude: string = '';
  logo: string = '';
  longitude: string = '';
  postcode: string = '';
  registerFrom: string = '';
  singleRoomCharges: string = '';
  doubleRoomCharges: string = '';
  sightSeenFare : string = '';
  town: string = '';
  cities : any;
  viewData : Array<Object> = [];
  showImages : Array<Object> = [];
  imgBase = ""
  action = "Add";
  mode = 1;
  newArrival = false;
  totalElements = 0;
  perPage = 20;
  
  nameE : string = null;
  shortDescE: string = null;
  images : Array<Object> = [];
  showLoader: Boolean = false;
  saveDisabled = false;
  btn = "Submit";
 
  constructor(
    private notifyService: NotificationService,
    private categoryService: CategoryService,
    private listingService: ListingService

  ) {
      this.cities = [
        { "name" : "Kalam" }, 
        { "name" : "Kumrat" },
        { "name" : "Madyan" },
        { "name" : "Bahrain" },
        { "name" : "Marghazar" },
        { "name" : "Saidu sharif" },
        { "name" : "Mahodand" },
        { "name" : "Malam jabba" },
        { "name" : "Fizaggat" },
        { "name" : "Kundol" },
        { "name" : "Babuzai" },
        { "name" : "Matta" },
        { "name" : "Khwaza khela" },
        { "name" : "Barikot" },
        { "name" : "Kabal" },
        { "name" : "Charbagh" },
        { "name" : "Bahrain" },
        { "name" : "Bagh" },
        { "name" : "Bhimbar" },
        { "name" : "Hattian" },
        { "name" : "Haveli" },
        { "name" : "Kotli" },
        { "name" : "Mirpur" },
        { "name" : "Muzaffarabad" },
        { "name" : "Neelam valley" }, 
        { "name" : "Poonch" },
        { "name" : "Sudhanoti" },
        { "name" : "Rawalakot" },
        { "name" : "Shounter valley" },
        { "name" : "Bandala valley" },
        { "name" : "Jhelum valley" },
        { "name" : "Leepa valley" },
        { "name" : "Baboon valley" },
        { "name" : "Chilas" },
        { "name" : "Gilgit" },
        { "name" : "Jalalabad" },
        { "name" : "Hunza" },
        { "name" : "Karimabad" },
        { "name" : "Passu" },
        { "name" : "Skardu" },
        { "name" : "Ghanche" },
        { "name" : "Skardu" },
        { "name" : "Shigar" },
        { "name" : "Kharmang" },
        { "name" : "Roundu" },
        { "name" : "Ghizer" },
        { "name" : "Gupis-Yasin" },
        { "name" : "Nagar" },
        { "name" : "Astore" },
        { "name" : "Diamer" },
        { "name" : "Darel" },
        { "name" : "Tangir" },
        { "name" : "Aliabad" },
        { "name" : "Askole" },
        { "name" : "Bunji" },
        { "name" : "Chilas" },
        { "name" : "Dambudas" },
        { "name" : "Danyor" },
        { "name" : "Darel" },
        { "name" : "Eidghah" },
        { "name" : "Gulmit" },
        { "name" : "Naltar" },
        { "name" : "Totli" },
        { "name" : "Sust" },
        { "name" : "Shimshal" }        
        ,{
        "name" : "Murree"
      },
      {
        "name" : "Cirlcle bakote"
      },
      {
        "name" : "Bhurban"
      },
      {
        "name" : "Birote"
      },
      {
        "name" : "Dewal sharif"
      },
      {
        "name" : "Darya Gali"
      },
      {
        "name" : "Changla gali"
      },
      {
        "name" : "Dunga gali"
      },
      {
        "name" : "Ghora gali"
      },
      {
        "name" : "Bansra gali"
      },
      {
        "name" : "Jhika gali"
      },
      {
        "name" : "Khaira gali"
      },
      {
        "name" : "Mohra sharif"
      },
      {
        "name" : "Aliot"
      },
      {
        "name" : "Sehr bagla"
      },
      {
        "name" : "Patriata"
      },{"name":"Karachi"},{"name":"Lahore"},{"name":"Sialkot City"},{"name":"Faisalabad"},{"name":"Rawalpindi"},{"name":"Peshawar"},{"name":"Saidu Sharif"},{"name":"Multan"},{"name":"Gujranwala"},{"name":"Islamabad"},{"name":"Quetta"},{"name":"Bahawalpur"},{"name":"Sargodha"},{"name":"New Mirpur"},{"name":"Chiniot"},{"name":"Sukkur"},{"name":"Larkana"},{"name":"Shekhupura"},{"name":"Jhang City"},{"name":"Rahimyar Khan"},{"name":"Gujrat"},{"name":"Kasur"},{"name":"Mardan"},{"name":"Mingaora"},{"name":"Dera Ghazi Khan"},{"name":"Nawabshah"},{"name":"Sahiwal"},{"name":"Mirpur Khas"},{"name":"Okara"},{"name":"Mandi Burewala"},{"name":"Jacobabad"},{"name":"Saddiqabad"},{"name":"Kohat"},{"name":"Muridke"},{"name":"Muzaffargarh"},{"name":"Khanpur"},{"name":"Gojra"},{"name":"Mandi Bahauddin"},{"name":"Abbottabad"},{"name":"Dadu"},{"name":"Khuzdar"},{"name":"Pakpattan"},{"name":"Tando Allahyar"},{"name":"Vihari"},{"name":"Jaranwala"},{"name":"Kamalia"},{"name":"Kot Addu"},{"name":"Nowshera"},{"name":"Swabi"},{"name":"Dera Ismail Khan"},{"name":"Chaman"},{"name":"Charsadda"},{"name":"Kandhkot"},{"name":"Hasilpur"},{"name":"Muzaffarabad"},{"name":"Mianwali"},{"name":"Jalalpur Jattan"},{"name":"Bhakkar"},{"name":"Zhob"},{"name":"Kharian"},{"name":"Mian Channun"},{"name":"Jamshoro"},{"name":"Pattoki"},{"name":"Harunabad"},{"name":"Toba Tek Singh"},{"name":"Shakargarh"},{"name":"Hujra Shah Muqim"},{"name":"Kabirwala"},{"name":"Mansehra"},{"name":"Lala Musa"},{"name":"Nankana Sahib"},{"name":"Bannu"},{"name":"Timargara"},{"name":"Parachinar"},{"name":"Gwadar"},{"name":"Abdul Hakim"},{"name":"Hassan Abdal"},{"name":"Tank"},{"name":"Hangu"},{"name":"Risalpur Cantonment"},{"name":"Karak"},{"name":"Kundian"},{"name":"Umarkot"},{"name":"Chitral"},{"name":"Dainyor"},{"name":"Kulachi"},{"name":"Kotli"},{"name":"Gilgit"},{"name":"Hyderabad City"},{"name":"Narowal"},{"name":"Khairpur Mir’s"},{"name":"Khanewal"},{"name":"Jhelum"},{"name":"Haripur"},{"name":"Shikarpur"},{"name":"Rawala Kot"},{"name":"Hafizabad"},{"name":"Lodhran"},{"name":"Malakand"},{"name":"Attock City"},{"name":"Batgram"},{"name":"Matiari"},{"name":"Ghotki"},{"name":"Naushahro Firoz"},{"name":"Alpurai"},{"name":"Bagh"},{"name":"Daggar"},{"name":"Bahawalnagar"},{"name":"Leiah"},{"name":"Tando Muhammad Khan"},{"name":"Chakwal"},{"name":"Khushab"},{"name":"Badin"},{"name":"Lakki"},{"name":"Rajanpur"},{"name":"Dera Allahyar"},{"name":"Shahdad Kot"},{"name":"Pishin"},{"name":"Sanghar"},{"name":"Upper Dir"},{"name":"Thatta"},{"name":"Dera Murad Jamali"},{"name":"Kohlu"},{"name":"Mastung"},{"name":"Dasu"},{"name":"Athmuqam"},{"name":"Loralai"},{"name":"Barkhan"},{"name":"Musa Khel Bazar"},{"name":"Ziarat"},{"name":"Gandava"},{"name":"Sibi"},{"name":"Dera Bugti"},{"name":"Eidgah"},{"name":"Turbat"},{"name":"Uthal"},{"name":"Khuzdar"},{"name":"Chilas"},{"name":"Kalat"},{"name":"Panjgur"},{"name":"Gakuch"},{"name":"Qila Saifullah"},{"name":"Kharan"},{"name":"Aliabad"},{"name":"Awaran"},{"name":"Dalbandin"}];
      this.imgBase = environment.imageBase+"file_uploads/sight_seeing_images/";
    this.categoryService.getAllSightseeing(0,'');
    this.subscriptions[0] = this.categoryService.categoryData$.subscribe(
      (data) => {
        if (data) {
          this.totalElements = data.totalElements;
          this.rows = data['content'];
          this.temp = data['content'];

        }
      }
    );
  }
  pageChange(e){
    this.categoryService.getAllSightseeing(e.page-1,'');


  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
      if(val.length === 0){
          this.categoryService.getAllSightseeing(0,'');

      }else if(val.length > 3){
         setTimeout(() => {
          this.categoryService.getAllSightseeing(0,val);

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
    this.saveDisabled = true;
    this.btn = "Please Wait ";

    let object = {
      "address_line": this.addressLine,
      "city": this.city,
      "images":images,
      "latitude": this.latitude,
      "longitude": this.longitude,
      "name": this.name,
      "postcode": this.postcode,
      "sight_seeing_type": this.seenType,
      "sight_seen_fare" : this.sightSeenFare,
      "town": this.town,
      "new_arrival" : this.newArrival,
      "description": this.description
  }
  if(this.mode === 1){
    this.categoryService.createSightseeing(object).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        this.saveDisabled = false;
        this.btn = "Submit";
      
        if (res['sight_seeing_id']) {
          this.categoryService.getAllSightseeing(0,'');

          this.modalClose('createModal');
          $('.form-control').val('');
        } else {
          this.notifyService.showWarning(
            'Failed to add the Sightseeing',
            'Error!'
          );
        }
      },
      (err) => {
        this.saveDisabled = false;
        this.btn = "Submit";
      
        console.error('err', err.error.error);
        this.notifyService.showWarning(err.error.error, 'Error');
      }
    );    
  }else{
    this.saveDisabled = true;
    this.btn = "Please Wait ";

    let newObject = {
      "address_line": this.addressLine,
      "city": this.city,
      "latitude": this.latitude,
      "longitude": this.longitude,
      "name": this.name,
      "postcode": this.postcode,
      "sight_seeing_type": this.seenType,
      "sight_seen_fare" : this.sightSeenFare,
      "town": this.town,
      "description": this.description,
      "new_arrival" : this.newArrival,
      "sight_seeing_id" : this.editId
  }

    this.categoryService.editSightseeing(newObject).subscribe(
      (res: ApiResponse) => {
        console.log(res);
        this.saveDisabled = false;
        this.btn = "Submit";
      
        if (res['sight_seeing_id']) {
          this.categoryService.getAllSightseeing(0,'');

          this.modalClose('createModal');
          $('.form-control').val('');
        } else {
          this.notifyService.showWarning(
            'Failed to add the Sightseeing',
            'Error!'
          );
        }
      },
      (err) => {
        this.saveDisabled = false;
        this.btn = "Submit";
      
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
    this.addressLine = null; 
    this.city = 'Karachi';
    this.latitude = '';
    this.longitude = '';
    this.name = null;
    this.postcode = '';
    this.seenType = 'type1';
    this.sightSeenFare = '';
    this.town = '';
    this.newArrival = false;
    this.description = '';
    this.images = [];

  }
   

  editForm(id , i){
    this.mode = 2;
    this.editId = id;
    this.action = "Edit";

    const editData =  this.rows.find(row => row.sight_seeing_id === id);
    this.images = editData.images.split(",")

    console.log("this.images",this.images);
    this.addressLine = editData.address_line;
    this.city = editData.city;
    this.latitude = editData.latitude;
    this.longitude = editData.longitude;
    this.name = editData.name;
    this.postcode = editData.postcode;
    this.seenType = editData.sight_seeing_type;
    this.sightSeenFare = editData.sight_seen_fare
    this.town = editData.town;
    this.description = editData.description;


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
          this.rows = this.rows.filter(
            (category) => category['sight_seeing_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
        
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
      formData.append('module', 'SIGHT_SEEING_IMAGE');
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
  viewSingle(id){
    this.showImages = [];

    this.temp.forEach(resp=>{
        if(resp.name == id){
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.categoryService.categoryData$.next([]);
  }
}
