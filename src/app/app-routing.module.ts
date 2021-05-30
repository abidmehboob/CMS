import { ContentComponent } from './content/content.component';
import { SocialLinkComponent } from './social-link/social-link.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { ListingComponent } from './listing/listing.component';
import { ChildSubcategoryComponent } from './child-subcategory/child-subcategory.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { BannerComponent } from './banner/banner.component';
import { ModelComponent } from './model/model.component';
import { MakeComponent } from './make/make.component';
import { FaqComponent } from './faq/faq.component';
import { EventComponent } from './event/event.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ProfileAdminComponent } from './profile-admin/profile-admin.component';
import { RestaurantOrdersComponent } from './restaurant-orders/restaurant-orders.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { CategoryComponent } from './category/category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { SigninComponent } from './signin/signin.component';
import { OrdersComponent } from './orders/orders.component';
import { SubadminDetailComponent } from './subadmin-detail/subadmin-detail.component';
import { AuthGuard } from './core/auth/auth.guard';
import { SubcategoryComponent } from './subcategory/subcategory.component';
import { DealsComponent } from './deals/deals.component';

import { HotelBookingComponent } from './hotel-booking/hotel-booking.component';
import { SightBookingComponent } from './sight-booking/sight-booking.component';
import { RestaurantBookingComponent } from './restaurant-booking/restaurant-booking.component';
import { PrivatehiredBookingComponent } from './privatehired-booking/privatehired-booking.component';
import { CustomerComponent } from './customer/customer.component';

import { DealsBookingComponent } from './deals-booking/deals-booking.component';

import { AllBookingComponent } from './all-booking/all-booking.component';

const routes: Routes = [
  {
    path:'',
    component: SigninComponent
  },
  {
    path:'dashboard',
    component: DashboardComponent ,canActivate: [AuthGuard]
  },
  {
    path:'restaurant',
    component: RestaurantDetailComponent , canActivate: [AuthGuard]
  },
  {
    path:'customers',
    component: CustomerComponent , canActivate: [AuthGuard]
  },

  {
    path:'menu',
    component: MenuDetailComponent , canActivate: [AuthGuard]
  },
  {
    path:'sightseeing',
    component: CategoryComponent , canActivate: [AuthGuard]
  },
  {
    path: 'customer',
    component: CustomerDetailComponent ,canActivate: [AuthGuard]
  },
  {
    path: 'customer/:id',
    component: CustomerEditComponent , canActivate: [AuthGuard]
  },
  {
    path: 'menu/:name/:id',
    component: RestaurantMenuComponent , canActivate: [AuthGuard]
  },
  {
    path: 'restaurant/:id',
    component: RestaurantOrdersComponent, canActivate: [AuthGuard]
  },
  {
    path: 'order',
    component: OrdersComponent , canActivate: [AuthGuard]
  },
  {
    path: 'employees',
    component: SubadminDetailComponent , canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileAdminComponent, canActivate: [AuthGuard]
  },
  {
    path: 'subscription',
    component: SubscriptionComponent, canActivate: [AuthGuard]
  },
  {
    path: 'social-link',
    component: SocialLinkComponent, canActivate: [AuthGuard]
  },
  {
    path: 'content',
    component: ContentComponent, canActivate: [AuthGuard]
  },
  {
    path: 'event',
    component: EventComponent, canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    component: FaqComponent, canActivate: [AuthGuard]
  },
  {
    path: 'deals',
    component: DealsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'hotel-booking',
    component: HotelBookingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sight-booking',
    component: SightBookingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'restaurant-booking',
    component: RestaurantBookingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'privatehired-booking',
    component: PrivatehiredBookingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'make',
    children: [
      { path: '', component: MakeComponent, canActivate: [AuthGuard], data: { viewOption: 'make' } },
      { path: ':subcategoryId', component: MakeComponent, canActivate: [AuthGuard], data: { viewOption: 'subcategory-makes' }},
    ]
  },
  {
    path: 'model',
    children: [
      { path: '', component: ModelComponent, canActivate: [AuthGuard], data: { viewOption: 'model' } },
      { path: ':makeId', component: ModelComponent, canActivate: [AuthGuard], data: { viewOption: 'make-models' }},
    ]
  },
  {
    path: 'banner',
    component: BannerComponent, canActivate: [AuthGuard]
  },
  {
    path: 'contact-us',
    component: ContactUsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'private-vehicle',
    children: [
      { path: '', component: SubcategoryComponent, canActivate: [AuthGuard], data: { viewOption: 'subcategory' } },
      { path: ':categoryId', component: SubcategoryComponent, canActivate: [AuthGuard], data: { viewOption: 'category-subcategories' }},
    ]
  },
  {
    path: 'child-subcategory',
    component: ChildSubcategoryComponent, canActivate: [AuthGuard]
  },
  {
    path: 'hotel',
    component: ListingComponent, canActivate: [AuthGuard]
  },
  {
    path: 'deal-booking',
    component: DealsBookingComponent, canActivate: [AuthGuard]
  }
  ,
  {
    path: 'all-booking',
    component: AllBookingComponent, canActivate: [AuthGuard]
  }

  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
