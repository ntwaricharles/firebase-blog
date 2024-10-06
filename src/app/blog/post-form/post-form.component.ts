import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  postId: string | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  authorEmail: string = 'Anonymous';

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    // Get the post ID from the route if we are editing a post
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
      if (this.postId) {
        this.loadPost(this.postId);
      }
    });

    // Get the logged-in user's email and set it as the author, otherwise 'Anonymous'
    this.authService.getUser().subscribe((user) => {
      this.authorEmail = user?.email || 'Anonymous';
    });
  }

  // Load post for editing
  loadPost(id: string) {
    this.blogService.getPostById(id).subscribe((post) => {
      if (post) {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
        });
      }
    });
  }

  // Handle form submission for both creating and editing a post
  handleSubmit() {
    this.loading = true;

    if (this.postForm.invalid) {
      this.loading = false;
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    const postData = {
      ...this.postForm.value,
      author: this.authorEmail,
      createdAt: new Date(),
    };

    if (this.postId) {
      // Update post
      this.blogService
        .updatePost(this.postId, postData)
        .then(() => {
          this.loading = false;
          this.toastr.success('Post updated successfully!');
          this.router.navigate(['/blog']);
        })
        .catch(() => {
          this.loading = false;
          this.toastr.error('Failed to update post.');
        });
    } else {
      // Create new post
      this.blogService
        .createPost(postData)
        .then(() => {
          this.loading = false;
          this.toastr.success('Post created successfully!');
          this.router.navigate(['/blog']);
        })
        .catch(() => {
          this.loading = false;
          this.toastr.error('Failed to create post.');
        });
    }
  }
}
