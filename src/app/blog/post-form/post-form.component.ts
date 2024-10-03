import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]], 
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.postId = params['id'];
      if (this.postId) {
        this.loadPost(this.postId);
      }
    });
  }

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

  handleSubmit() {
    this.loading = true;

    console.log('Title:', this.postForm.value.title);
    console.log('Content:', this.postForm.value.content);

    if (this.postForm.invalid) {
      this.loading = false;
      this.toastr.error('Please fill in all required fields correctly.');
      return;
    }

    if (this.postId) {
      this.blogService
        .updatePost(this.postId, this.postForm.value)
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
      this.blogService
        .createPost({
          ...this.postForm.value,
          author: 'Anonymous',
          createdAt: new Date(),
        })
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
