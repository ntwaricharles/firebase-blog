import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BlogService, BlogPost } from '../../services/blog.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  posts: BlogPost[] = [];
  currentUserEmail: string | null = null;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Fetch all blog posts
    this.blogService.getPosts().subscribe((posts) => {
      this.posts = posts;

      // Get current user email
      this.authService.getUser().subscribe((user) => {
        this.currentUserEmail = user?.email || null; // Use fallback to null
      });
    });
  }

  editPost(post: BlogPost) {
    this.router.navigate(['/edit-post', post.id], { state: { post } });
  }

  deletePost(post: BlogPost) {
    if (post.author === this.currentUserEmail) {
      // Check if the current user is the author
      this.blogService
        .deletePost(post.id!)
        .then(() => {
          this.toastr.success('Post deleted successfully!');
          // Reload posts after deletion
          this.blogService.getPosts().subscribe((posts) => {
            this.posts = posts;
          });
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
          this.toastr.error('Failed to delete post');
        });
    } else {
      this.toastr.error('You can only delete your own posts.');
    }
  }

  navigateToPost(postId: string | null) {
    if (postId) {
      this.router.navigate(['/blog', postId]);
    }
  }
}
