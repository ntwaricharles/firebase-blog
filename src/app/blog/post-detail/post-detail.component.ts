import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService, BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | null = null; // Ensure post is initialized as null
  comments: any[] = [];
  newComment: { name: string; email: string; body: string } = {
    name: '',
    email: '',
    body: '',
  };

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(postId);
    } else {
      console.error('Post ID is missing from the route.');
    }
  }

  // Load the post details based on post ID
  loadPostDetails(postId: string) {
    this.blogService.getPostById(postId).subscribe((post) => {
      if (post) {
        this.post = post;
        if (post.id) {
          this.loadComments(post.id); // Load comments only if post.id exists
        } else {
          console.error('Post does not have a valid ID.');
        }
      } else {
        console.error('Post not found.');
        this.post = null; // Set post to null to handle the absence of a valid post
      }
    });
  }

  // Load comments for the current post
  // Load comments for the current post
  loadComments(postId: string | null | undefined) {
    if (!postId) {
      console.error('Invalid post ID provided for loading comments.');
      return;
    }

    this.blogService.getCommentsByPostId(postId).subscribe(
      (comments) => {
        if (comments) {
          this.comments = comments;
        } else {
          this.comments = []; // Fallback to an empty array if no comments found
          console.log('No comments found for the post.');
        }
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  // Add a new comment
  // Add a new comment
  addComment() {
    // Safely check if post and post.id are defined
    const postId = this.post?.id;

    if (postId) {
      // Proceed to add the comment
      this.blogService
        .addCommentToPost(postId, this.newComment)
        .then(() => {
          this.newComment = { name: '', email: '', body: '' }; // Reset the form
          this.loadComments(postId); // Reload comments
        })
        .catch((error) => {
          console.error('Failed to add comment:', error);
        });
    } else {
      // Log error if postId is not available
      console.error('Post ID is not available, cannot add comment.');
    }
  }
}
