import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService, BlogPost, Comment } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { User as FirebaseUser } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | undefined;
  user$: Observable<FirebaseUser | null>;
  user: FirebaseUser | null = null;
  comments: Comment[] = []; 
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private fb: FormBuilder,
    private metaService: MetaService
  ) {
    this.user$ = this.authService.user$;
    this.commentForm = this.fb.group({
      email: [''],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(postId);
      this.loadComments(postId); 
    }

    // Subscribe to the logged-in user
    this.user$.subscribe((user) => {
      this.user = user;
      if (user) {
        this.commentForm.patchValue({ email: user.email });
      }
    });
  }

  // Fetch post details and set meta tags
  loadPostDetails(id: string): void {
    this.blogService.getPostById(id).subscribe((post) => {
      if (post) {
        this.post = {
          ...post,
          createdAt:
            post.createdAt instanceof Timestamp
              ? post.createdAt.toDate()
              : post.createdAt,
        };
        // Set dynamic meta tags based on the post data
        this.metaService.setTitle(post.title);
        this.metaService.setDescription(post.content.slice(0, 150));
        this.metaService.updateMetaTags([
          { name: 'author', content: post.author || 'Anonymous' },
        ]);
      }
    });
  }

  // Fetch comments for the current post
  loadComments(postId: string): void {
    this.blogService.getCommentsByPostId(postId).subscribe((comments) => {
      this.comments = comments;
    });
  }

  // Add comment handling logic
  addComment(): void {
    if (this.commentForm.valid && this.post) {
      const newComment: Comment = {
        ...this.commentForm.value,
        date: new Date().toISOString(),
        blogId: this.post.id!,
      };

      this.blogService.addCommentToPost(this.post.id!, newComment).then(() => {
        this.comments.push(newComment);
        this.commentForm.reset();
        this.commentForm.patchValue({ email: this.user?.email || '' });
      });
    }
  }

  // Like post logic
  likePost(): void {
    if (this.user && this.post) {
      this.blogService.likePost(this.post.id!, this.user.email!).then(() => {
        console.log('Post liked!');
      });
    }
  }

  // Unlike post logic
  unlikePost(): void {
    if (this.user && this.post) {
      this.blogService.unlikePost(this.post.id!, this.user.email!).then(() => {
        console.log('Post unliked!');
      });
    }
  }
}
