import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlogService, BlogPost } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { User as FirebaseUser } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Timestamp } from 'firebase/firestore'; // Ensure you import Timestamp

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: BlogPost | undefined;
  user$: Observable<FirebaseUser | null>;
  user: FirebaseUser | null = null;
  comments: any[] = [];
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.user$ = this.authService.user$;
    this.commentForm = this.fb.group({
      email: [''], // This will be set later to logged-in user's email
      body: [''],
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPostDetails(postId);
    }

    this.user$.subscribe((user) => {
      this.user = user;
      // Set the email field to the logged-in user's email
      this.commentForm.patchValue({ email: user?.email });
    });
  }

  loadPostDetails(id: string): void {
    this.blogService.getPostById(id).subscribe((post) => {
      if (post) {
        this.post = {
          ...post,
          // Convert createdAt from Timestamp to Date
          createdAt:
            post.createdAt instanceof Timestamp
              ? post.createdAt.toDate()
              : post.createdAt,
        };
        this.comments = post?.comments || [];
      }
    });
  }

  // Check if the 'likes' field is an array
  isArrayOfStrings(likes: any): likes is string[] {
    return Array.isArray(likes);
  }

  // Add comment handling logic
  addComment(): void {
    if (this.commentForm.valid && this.post) {
      const newComment = {
        ...this.commentForm.value,
        date: new Date().toISOString(),
        blogId: this.post.id!,
      };

      this.blogService.addCommentToPost(this.post.id!, newComment).then(() => {
        this.comments.push(newComment);
        this.commentForm.reset();
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
