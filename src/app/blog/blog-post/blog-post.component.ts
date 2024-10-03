import { Component, OnInit } from '@angular/core';
import { BlogService, BlogPost } from '../../services/blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent implements OnInit {
  posts: BlogPost[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    // Fetch all blog posts
    this.blogService.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  // Navigate to the post-edit form and pass post data to the form
  editPost(post: BlogPost) {
    this.router.navigate(['/edit-post'], { state: { post } });
  }

  // Delete a post by ID
  deletePost(postId: string | null) {
    if (postId) {
      this.blogService
        .deletePost(postId)
        .then(() => {
          alert('Post deleted successfully!');
          // Reload posts after deletion
          this.blogService.getPosts().subscribe((posts) => {
            this.posts = posts;
          });
        })
        .catch((error) => {
          console.error('Error deleting post:', error);
          alert('Failed to delete post');
        });
    }
  }

  // Public method to navigate to the post details page
  navigateToPost(postId: string | null) {
    if (postId) {
      this.router.navigate(['/blog', postId]);
    }
  }
}
