import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environment/environment';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PostDetailComponent } from './blog/post-detail/post-detail.component';
import { CommentsSectionComponent } from './blog/comments-section/comments-section.component';
import { PostFormComponent } from './blog/post-form/post-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    BlogPostComponent,
    PostDetailComponent,
    CommentsSectionComponent,
    PostFormComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000, 
      positionClass: 'toast-top-right', 
      preventDuplicates: true,
    }),
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}


