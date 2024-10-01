import { Component, OnInit } from '@angular/core';
import { BlogService, BlogPost } from '../../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  title = '';
  content = '';
  posts: BlogPost[] = [];
  post: BlogPost | undefined;
  comments: any[] = [];
  editingPostId: string | undefined;
  loading = false;
  successMessage: string | undefined;
  errorMessage: string | undefined;
  validationError: string | undefined;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    public router: Router // Change to public
  ) {}

  ngOnInit() {
    this.blogService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(postId);
    }
  }

  logPostId(postId: string | undefined) {
    if (postId) {
      console.log('Navigating to post ID:', postId);
      this.router.navigate(['/blog', postId]);
    } else {
      console.error('Post ID is undefined or null!');
    }
  }

  loadPostDetails(postId: string) {
    this.blogService.getPostById(postId).subscribe((post: BlogPost | null) => {
      if (post) {
        this.post = post;
      }
    });
  }

  handleSubmitPost(newPost: BlogPost) {
    this.loading = true;
    if (this.editingPostId) {
      this.blogService
        .updatePost(this.editingPostId, newPost)
        .then(() => {
          this.resetForm();
          this.successMessage = 'Post updated successfully!';
          this.loading = false;
        })
        .catch((error) => {
          this.errorMessage = 'Failed to update post.';
          this.loading = false;
        });
    } else {
      this.blogService
        .createPost(newPost)
        .then(() => {
          this.resetForm();
          this.successMessage = 'Post created successfully!';
          this.loading = false;
        })
        .catch((error) => {
          this.errorMessage = 'Failed to create post.';
          this.loading = false;
        });
    }
  }

  deletePost(postId: string | null | undefined) {
    if (postId) {
      this.blogService
        .deletePost(postId)
        .then(() => alert('Post deleted!'))
        .catch((error) => alert('Failed to delete post: ' + error.message));
    } else {
      alert('Error: Post ID is undefined or null.');
    }
  }

  editPost(post: BlogPost) {
    if (post.id) {
      this.router.navigate(['/edit-post', post.id]);
    } else {
      alert('Error: Post ID is missing.');
    }
  }

  resetForm() {
    this.title = '';
    this.content = '';
    this.editingPostId = undefined;
    this.successMessage = undefined;
    this.errorMessage = undefined;
    this.validationError = undefined;
  }
}
