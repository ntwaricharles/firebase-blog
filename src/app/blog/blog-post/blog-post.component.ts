import { Component } from '@angular/core';
import { BlogService, BlogPost } from '../../services/blog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent {
  title = '';
  content = '';
  posts$: Observable<BlogPost[]>;
  editingPostId: string | undefined;

  constructor(private blogService: BlogService) {
    this.posts$ = this.blogService.getPosts();
  }

  createPost() {
    const newPost: BlogPost = {
      title: this.title,
      content: this.content,
      author: 'Anonymous',
      createdAt: new Date(),
    };
    this.blogService.createPost(newPost).then(() => {
      this.resetForm();
      alert('Post created!');
    });
  }

  editPost(post: BlogPost) {
    this.title = post.title;
    this.content = post.content;
    this.editingPostId = post.id;
  }

  deletePost(postId: string | undefined) {
    if (postId) {
      this.blogService.deletePost(postId).then(() => alert('Post deleted!'));
    } else {
      alert('Error: Post ID is undefined.');
    }
  }

  resetForm() {
    this.title = '';
    this.content = '';
    this.editingPostId = undefined;
  }
}

