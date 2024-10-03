import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import FormBuilder, FormGroup, and 
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup; // Create a FormGroup
  postId: string | null = null; // Initialize postId
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    // Initialize the form group with controls
    this.postForm = this.fb.group({
      title: ['', Validators.required], // Title control with required validation
      content: ['', Validators.required], // Content control with required validation
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
        // Set values to the form
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
        });
      }
    });
  }

  handleSubmit() {
    this.loading = true;

    // Log the form values
    console.log('Title:', this.postForm.value.title);
    console.log('Content:', this.postForm.value.content);

    if (this.postId) {
      // Update the existing post
      this.blogService
        .updatePost(this.postId, this.postForm.value)
        .then(() => {
          this.loading = false;
          this.successMessage = 'Post updated successfully!';
          this.router.navigate(['/blog']);
        })
        .catch((error) => {
          this.errorMessage = 'Failed to update post.';
          this.loading = false;
        });
    } else {
      // Create a new post
      this.blogService
        .createPost({
          ...this.postForm.value,
          author: 'Anonymous',
          createdAt: new Date(),
        })
        .then(() => {
          this.loading = false;
          this.successMessage = 'Post created successfully!';
          this.router.navigate(['/blog']);
        })
        .catch((error) => {
          this.errorMessage = 'Failed to create post.';
          this.loading = false;
        });
    }
  }
}
