import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPostComponent } from './blog/blog-post/blog-post.component';
import { PostDetailComponent } from './blog/post-detail/post-detail.component';
import { PostFormComponent } from './blog/post-form/post-form.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'blog', component: BlogPostComponent },
  { path: 'blog/:id', component: PostDetailComponent },
  { path: 'edit-post/:id', component: PostFormComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create-post', component: PostFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
