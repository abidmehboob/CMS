import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { SigninComponent } from './signin/signin.component';
import { LoaderComponent } from './layout/loader/loader.component';
import { RestaurantOwnerDetailComponent } from './restaurant-owner-detail/restaurant-owner-detail.component';
import { OrdersComponent } from './orders/orders.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SubadminDetailComponent } from './subadmin-detail/subadmin-detail.component';
import { CategoryComponent } from './category/category.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { ProfileAdminComponent } from './profile-admin/profile-admin.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SubscriptionComponent } from './subscription/subscription.component';
import { EventComponent } from './event/event.component';
import { FaqComponent } from './faq/faq.component';
import { MakeComponent } from './make/make.component';
import { ModelComponent } from './model/model.component';
import { BannerComponent } from './banner/banner.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { ChildSubcategoryComponent } from './child-subcategory/child-subcategory.component';
import { ListingComponent } from './listing/listing.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { SocialLinkComponent } from './social-link/social-link.component';
import { ContentComponent } from './content/content.component';
import { QuillModule } from 'ngx-quill';
import { DealsComponent } from './deals/deals.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HotelBookingComponent } from './hotel-booking/hotel-booking.component';
import { SightBookingComponent } from './sight-booking/sight-booking.component';
import { RestaurantBookingComponent } from './restaurant-booking/restaurant-booking.component';
import { PrivatehiredBookingComponent } from './privatehired-booking/privatehired-booking.component';
import { CustomerComponent } from './customer/customer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { DealsBookingComponent } from './deals-booking/deals-booking.component';
import { AllBookingComponent } from './all-booking/all-booking.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    CustomerDetailComponent,
    RestaurantDetailComponent,
    MenuDetailComponent,
    SigninComponent,
    LoaderComponent,
    RestaurantOwnerDetailComponent,
    OrdersComponent,
    FooterComponent,
    SubadminDetailComponent,
    CategoryComponent,
    RestaurantMenuComponent,
    RestaurantOrdersComponent,
    ProfileAdminComponent,
    SubscriptionComponent,
    EventComponent,
    FaqComponent,
    MakeComponent,
    ModelComponent,
    BannerComponent,
    ContactUsComponent,
    SubcategoryComponent,
    ChildSubcategoryComponent,
    ListingComponent,
    CustomerEditComponent,
    SocialLinkComponent,
    ContentComponent,
    DealsComponent,
    HotelBookingComponent,
    SightBookingComponent,
    RestaurantBookingComponent,
    PrivatehiredBookingComponent,
    CustomerComponent,
    DealsBookingComponent,
    AllBookingComponent
  ],
  imports: [BrowserModule, AppRoutingModule,FormsModule, HttpClientModule, BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NgxDatatableModule,
    ReactiveFormsModule,  
    QuillModule.forRoot(),
    NgxDropzoneModule,
    NgxSpinnerModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
