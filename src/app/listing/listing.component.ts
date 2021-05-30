import { ListingService } from './../core/services/listing-service/listing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../core/services/notification-service/notification.service';
import { ApiResponse } from '../shared/models/response.model';
import { environment } from './../../environments/environment';
import * as $ from 'jquery';
declare var $: any;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { NgxSpinnerService } from "ngx-spinner";
import { SigninService } from './../core/services/signin-service/signin.service';


@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css',
  '../subadmin-detail/subadmin-detail.component.css']
})
export class ListingComponent implements OnInit {
  
  @ViewChild('myTable') table: DatatableComponent;

  rows: any = [];
  temp = []
  subscriptions: Subscription[] = [];
  deleteId: string = null; 
  editId: string = null
  imageUrl: string = null;
  saveDisabled = false;
  btn = "Submit";

  name: string = null;
  email: string = null;
  phone: string = null;
  accountNumber: string = null;
  addressLine: string = null;
  backgroundImage: string = null;
  businessType: string = "Hotel";
  city: string = 'Karachi';
  description: string = '';
  latitude: string = '';
  logo: string = '';
  longitude: string = '';
  postcode: string = '';
  registerFrom: string = '';
  singleRoomCharges: string = '';
  doubleRoomCharges: string = '';
  town: string = '';
  district: string = '';
  cities : any;
  images : Array<Object> = [];
  viewData : Array<Object> = [];
  showImages : Array<Object> = [];
  imgBase = ""
  showRoomType = true;
  managerType = 0;
  hotelId = "";
  imageBase = "";
  showLoader: Boolean = false;
  bgImg = "";
  productForm: FormGroup;
  vName : string = null;
  variationData : any;
  action = "Add";
  mode = 1;
  totalElements = 0;
  viewMenuF = false;
  menuName = "";
  menuCharges = "";
  menuDescription = "";
  menuImage = "";
  menuData : Array<Object> = [];
  menuHotelId = "";

  constructor(
    private notifyService: NotificationService,
    private listingService: ListingService,
    private fb:FormBuilder ,
    private spinner: NgxSpinnerService,
    private  signinService :SigninService

  ) {
    this.hotelId = localStorage.getItem('ih') ? localStorage.getItem('ih') : "";
    this.bgImg = localStorage.getItem('mg') ? localStorage.getItem('mg') : "";
    this.imgBase = environment.imageBase+"file_uploads/hotel_images/";


      console.log("this.images",this.images);
    this.imageUrl = environment.imageBase;
    
    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
    });

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
      }
      ,{"name":"Karachi"},{"name":"Lahore"},{"name":"Sialkot City"},{"name":"Faisalabad"},{"name":"Rawalpindi"},{"name":"Peshawar"},{"name":"Saidu Sharif"},{"name":"Multan"},{"name":"Gujranwala"},{"name":"Islamabad"},{"name":"Quetta"},{"name":"Bahawalpur"},{"name":"Sargodha"},{"name":"New Mirpur"},{"name":"Chiniot"},{"name":"Sukkur"},{"name":"Larkana"},{"name":"Shekhupura"},{"name":"Jhang City"},{"name":"Rahimyar Khan"},{"name":"Gujrat"},{"name":"Kasur"},{"name":"Mardan"},{"name":"Mingaora"},{"name":"Dera Ghazi Khan"},{"name":"Nawabshah"},{"name":"Sahiwal"},{"name":"Mirpur Khas"},{"name":"Okara"},{"name":"Mandi Burewala"},{"name":"Jacobabad"},{"name":"Saddiqabad"},{"name":"Kohat"},{"name":"Muridke"},{"name":"Muzaffargarh"},{"name":"Khanpur"},{"name":"Gojra"},{"name":"Mandi Bahauddin"},{"name":"Abbottabad"},{"name":"Dadu"},{"name":"Khuzdar"},{"name":"Pakpattan"},{"name":"Tando Allahyar"},{"name":"Vihari"},{"name":"Jaranwala"},{"name":"Kamalia"},{"name":"Kot Addu"},{"name":"Nowshera"},{"name":"Swabi"},{"name":"Dera Ismail Khan"},{"name":"Chaman"},{"name":"Charsadda"},{"name":"Kandhkot"},{"name":"Hasilpur"},{"name":"Muzaffarabad"},{"name":"Mianwali"},{"name":"Jalalpur Jattan"},{"name":"Bhakkar"},{"name":"Zhob"},{"name":"Kharian"},{"name":"Mian Channun"},{"name":"Jamshoro"},{"name":"Pattoki"},{"name":"Harunabad"},{"name":"Toba Tek Singh"},{"name":"Shakargarh"},{"name":"Hujra Shah Muqim"},{"name":"Kabirwala"},{"name":"Mansehra"},{"name":"Lala Musa"},{"name":"Nankana Sahib"},{"name":"Bannu"},{"name":"Timargara"},{"name":"Parachinar"},{"name":"Gwadar"},{"name":"Abdul Hakim"},{"name":"Hassan Abdal"},{"name":"Tank"},{"name":"Hangu"},{"name":"Risalpur Cantonment"},{"name":"Karak"},{"name":"Kundian"},{"name":"Umarkot"},{"name":"Chitral"},{"name":"Dainyor"},{"name":"Kulachi"},{"name":"Kotli"},{"name":"Gilgit"},{"name":"Hyderabad City"},{"name":"Narowal"},{"name":"Khairpur Mir’s"},{"name":"Khanewal"},{"name":"Jhelum"},{"name":"Haripur"},{"name":"Shikarpur"},{"name":"Rawala Kot"},{"name":"Hafizabad"},{"name":"Lodhran"},{"name":"Malakand"},{"name":"Attock City"},{"name":"Batgram"},{"name":"Matiari"},{"name":"Ghotki"},{"name":"Naushahro Firoz"},{"name":"Alpurai"},{"name":"Bagh"},{"name":"Daggar"},{"name":"Bahawalnagar"},{"name":"Leiah"},{"name":"Tando Muhammad Khan"},{"name":"Chakwal"},{"name":"Khushab"},{"name":"Badin"},{"name":"Lakki"},{"name":"Rajanpur"},{"name":"Dera Allahyar"},{"name":"Shahdad Kot"},{"name":"Pishin"},{"name":"Sanghar"},{"name":"Upper Dir"},{"name":"Thatta"},{"name":"Dera Murad Jamali"},{"name":"Kohlu"},{"name":"Mastung"},{"name":"Dasu"},{"name":"Athmuqam"},{"name":"Loralai"},{"name":"Barkhan"},{"name":"Musa Khel Bazar"},{"name":"Ziarat"},{"name":"Gandava"},{"name":"Sibi"},{"name":"Dera Bugti"},{"name":"Eidgah"},{"name":"Turbat"},{"name":"Uthal"},{"name":"Khuzdar"},{"name":"Chilas"},{"name":"Kalat"},{"name":"Panjgur"},{"name":"Gakuch"},{"name":"Qila Saifullah"},{"name":"Kharan"},{"name":"Aliabad"},{"name":"Awaran"},{"name":"Dalbandin"}];
      this.spinner.show();

    this.listingService.getAllHotel(0,'');
    this.subscriptions[0] = this.listingService.listingData$.subscribe(
      (data) => {

        if (data) {
          this.totalElements = data.totalElements;
          console.log('s',data)
          console.log('data',data['content'])
  
            this.rows = data['content'];
            this.temp = data['content'];
            if(this.rows && this.managerType == 1){
              this.rows.forEach(element => {
                      console.log("element.hotel_id",element.hotel_id+"*********"+this.hotelId);
                    if(element.hotel_id == this.hotelId){
                       this.rows = [element];
                    }
              });
             }


  //        this.temp = [...this.rows]
        }
      }
    );
    /*

    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
    */
  }
  pageChange(e){
    console.log("e",e.page);
    this.listingService.getAllHotel(e.page-1,'');

  }
    
  viewMenuForm(){
     this.viewMenuF = (this.viewMenuF)? false : true;
  }

  deleteMenu(i,id){
      
    /*  
    this.menuData = this.menuData.filter(
        (model) => model[i] !== i
      );
      */
      this.listingService.deleteMenu(id).subscribe(
        (res) => {
          if (res) {
            this.menuData = this.menuData.filter(
              (model) => model[i] !== i
            );
                  this.notifyService.showSuccess('Successfully Deleted', 'Success')
            this.deleteId = null
  
          } else {
            this.menuData = this.menuData.filter(
              (model) => model[i] !== i
            );
                  this.notifyService.showSuccess('Successfully Deleted', 'Success')
            this.deleteId = null
            
          }
        },
        (err) => {
          const errObj = err.error.error;
          this.menuData = this.menuData.filter(
            (model) => model[i] !== i
          );
              this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
      }
      );
  

  } 

  saveMenuForm(){
    this.resetHighlight();
    
    if(this.menuName === ""){
      this.notifyService.showWarning('Menu Name required', 'Error');
      this.showHighlight('menuName');
      return false;

    }
    else if(this.menuCharges === ""){
      this.notifyService.showWarning('Menu charges', 'Error');
      this.showHighlight('menuCharges');
      return false;

    }
    else if(this.menuDescription === ""){
      this.notifyService.showWarning('Menu description required', 'Error');
      this.showHighlight('menuDescription');
      return false;
      
    }else{
      let menu = {
        name : this.menuName,
        charges : this.menuCharges,
        description : this.menuDescription,
        image : this.menuImage,
        hotel_id : this.menuHotelId
      };

      this.listingService.createHotelMenu(menu).subscribe(
        (res: ApiResponse) => {
          console.log(res);
          if (res) {
            this.saveDisabled = false;
            this.listingService.getAllHotel(0,'');
          } else {
          
            this.notifyService.showWarning(
              'Failed to add the Hotel',
              'Error!'
            );
          }
        },
        (err) => {
          this.notifyService.showWarning(err.error.error, 'Error');
        }
      );

       console.log("here we go",menu);
      this.menuData.push(menu);
      console.log("this.menuData",this.menuData);
       this.viewMenuF = false;
       this.menuImage = "";
       this.menuName = "";
       this.menuCharges = "";
       this.menuDescription = "";
    }
  
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
      if(val.length === 0){
          this.listingService.getAllHotel(0,'');

      }else if(val.length > 3){
         setTimeout(() => {
          this.listingService.getAllHotel(0,val);

         }, 500); 
      }

  }  
  
  modalClose(modalId) {
    $(`#${modalId}`).trigger('click');
  }

  changeStatus(e, id) {
    let status = e.target.checked ? 'active' : 'pending';
    const object = {
      status,
    };
    this.listingService.changeStatus(id, object);
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
  viewSingle(id){
     this.showImages = [];
    this.temp.forEach(resp=>{
        if(resp.hotel_id == id){
          this.viewData = [{}];
           console.log("resp",resp);
           for (let key in resp){
            if(resp.hasOwnProperty(key)){
              let  n = key.split("_");
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
  
  menuHotelIdSave(id){
      this.menuHotelId = id;
      let index = this.rows.map(function(e) { return e.hotel_id; }).indexOf(id);
      this.menuData = this.rows[index].food_menu;
        

      
  }
  createHotel(){

    this.resetHighlight();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.name === null) {
      this.notifyService.showWarning('Name required', 'Error');
      this.showHighlight('name');
      return false;
    }

    if (this.email === null) {
      this.notifyService.showWarning('Email required', 'Error');
      this.showHighlight('email');
      return false;
    }
    if (!re.test(String(this.email).toLowerCase())) {
      this.notifyService.showWarning('valid email required', 'Error');
      this.showHighlight('email');
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
  
    let hotelObject = {
      "account_number": this.accountNumber,
      "images":images,
      "address_line": this.addressLine,
      "business_type": this.businessType,
      "city": this.city,
      "description": this.description,
      "double_room_charges": this.doubleRoomCharges,
      "email": this.email,
      "latitude": this.latitude,
      "logo": "string",
      "longitude": this.longitude,
      "name": this.name,
      "phone": this.phone,
      "postcode": this.postcode,
      "register_from": "superadmin",
      "district": this.district,
      "single_room_charges": this.singleRoomCharges,
      "town": this.town,
      "room_types" : this.productForm.value.quantities
  }
      console.log("hotelObject",hotelObject);
      if(this.mode === 1){
        this.listingService.createHotel(hotelObject).subscribe(
          (res: ApiResponse) => {
            console.log(res);
            if (res['hotel_id']) {
              this.saveDisabled = false;
              this.btn = "Submit";
            
              this.listingService.getAllHotel(0,'');
      
              this.modalClose('createModal');
              $('.form-control').val('');
            } else {
              this.saveDisabled = false;
              this.btn = "Submit";
            
              this.notifyService.showWarning(
                'Failed to add the Hotel',
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
    
        let newObj = {
          "account_number": this.accountNumber,
          "address_line": this.addressLine,
          "business_type": this.businessType,
          "city": this.city,
          "description": this.description,
          "double_room_charges": this.doubleRoomCharges,
          "email": this.email,
          "latitude": this.latitude,
          "logo": "string",
          "longitude": this.longitude,
          "name": this.name,
          "phone": this.phone,
          "postcode": this.postcode,
          "register_from": "superadmin",
          "district": this.district,
          "single_room_charges": this.singleRoomCharges,
          "town": this.town,
          "hotel_id" : this.editId
      }
    
        this.listingService.editHotel(newObj).subscribe(
          (res: ApiResponse) => {
            console.log(res);
            if (res['hotel_id']) {
              this.saveDisabled = false;
              this.btn = "Submit";
            
              this.listingService.getAllHotel(0,'');
      
              this.modalClose('createModal');
              $('.form-control').val('');
            } else {
              this.saveDisabled = false;
              this.btn = "Submit";
            
              this.notifyService.showWarning(
                'Failed to add the Hotel',
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
  

  deleteForm(id) {
    this.deleteId = id
  }


  deleteListing() {
    this.listingService.deleteListing(this.deleteId).subscribe(
      (res) => {
        if (res) {
          this.rows = this.rows.filter(
            (model) => model['hotel_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null

        } else {
          this.rows = this.rows.filter(
            (model) => model['hotel_id'] !== this.deleteId
          );
          this.notifyService.showSuccess('Successfully Deleted', 'Success')
          this.deleteId = null
          
        }
      },
      (err) => {
        const errObj = err.error.error;
        this.rows = this.rows.filter(
          (model) => model['hotel_id'] !== this.deleteId
        );
        this.notifyService.showSuccess('Successfully Deleted', 'Success')
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
    formData.append('module', 'HOTEL_IMAGE');
    formData.append('fileExtension', 'png');
     

    this.listingService.uploadFile(formData).subscribe(
      (res: ApiResponse) => {
       this.showLoader = false;
       if (res['path']) {
         let image = res['path'];
         //console.log("image",image);
         this.images.push({"image" : image});
         console.log("this.images",this.images);
         this.menuImage = image;
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
removeMenuImg(){
  this.menuImage = "";
}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.listingService.listingData$.next([]);
  }
  ngOnInit(): void {
    this.subscriptions[2] =  this.signinService.roles$.subscribe(resp=>{
      if(resp){
         console.log("resp.permission of hotel",resp);
         if(resp.type == 'HotelManager'){
            this.managerType = 1;
          
         }
         if(resp.type == 'SuperAdmin'){
           this.managerType = 0;
         
       }

      }
    });
  
  }

  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }
   
  newQuantity(): FormGroup {
    return this.fb.group({
      charges: '',
      type: '',
    })
  }
   
  addQuantity() {
    this.quantities().push(this.newQuantity());
  }
   
  removeQuantity(i:number) {
    this.quantities().removeAt(i);
  }
  
  onSubmits() {
    console.log(this.productForm.value.quantities);
  }
  cm(){
    this.action = "Add";
    this.mode = 1;
 
  }
  bType(){
    if(this.businessType === 'Restaurant'){
      this.showRoomType = false;
    }else{
      this.showRoomType = true;

    }
  }
  editForm(id,i) {
    this.mode = 2;
    this.editId = id;
    this.action = "Edit";

    let data =  this.rows[i];   
    this.name  = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.accountNumber = data.account_number;
    this.addressLine = data.address_line;
    this.backgroundImage = data.background_image;
    this.businessType = data.business_type;
    this.city = data.city;
    this.description = data.description;
    this.latitude = data.latitude;
    this.logo = data.logo;
    this.longitude = data.longitude;
    this.postcode = data.postcode;
    this.singleRoomCharges = data.single_room_charges;
    this.doubleRoomCharges = data.double_room_charges;
    this.town = data.town;
    this.district = data.district;
  
  }

  
}
