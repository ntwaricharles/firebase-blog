import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | null = null;
  comments: any[] = [];
  commentForm: FormGroup;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private fb: FormBuilder 
  ) {
    this.commentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(postId);
    } else {
      console.error('Post ID is missing from the route.');
    }
  }

  loadPostDetails(postId: string) {
    this.blogService.getPostById(postId).subscribe((post) => {
      if (post) {
        this.post = post;
        if (post.id) {
          this.loadComments(post.id);
        } else {
          console.error('Post does not have a valid ID.');
        }
      } else {
        console.error('Post not found.');
        this.post = null;
      }
    });
  }

  loadComments(postId: string | null | undefined) {
    if (!postId) {
      console.error('Invalid post ID provided for loading comments.');
      return;
    }

    this.blogService.getCommentsByPostId(postId).subscribe(
      (comments) => {
        this.comments = comments || []; 
        if (!comments) {
          console.log('No comments found for the post.');
        }
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  addComment() {
    const postId = this.post?.id;

    if (postId && this.commentForm.valid) {
      // Proceed to add the comment
      this.blogService
        .addCommentToPost(postId, this.commentForm.value)
        .then(() => {
          this.commentForm.reset(); 
          this.loadComments(postId);
        })
        .catch((error) => {
          console.error('Failed to add comment:', error);
        });
    } else {
      console.error('Post ID is not available or form is invalid.');
    }
  }
}
