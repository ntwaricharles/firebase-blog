import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

// BlogPost interface
export interface BlogPost {
  id?: string | null;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  likes?: string[];
  comments?: string[];
}

// Comment interface
export interface Comment {
  body: string | null;
  email: string;
  date: string;
  blogId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogCollection: AngularFirestoreCollection<BlogPost>;
  private commentsCollection: AngularFirestoreCollection<Comment>;
  private commentsPath = 'comments';

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.blogCollection = this.firestore.collection<BlogPost>('blog');
    this.commentsCollection = this.firestore.collection<Comment>(
      this.commentsPath
    );
  }

  // Create a new blog post
  createPost(post: BlogPost): Promise<void> {
    const id = this.firestore.createId();
    const newPost = {
      ...post,
      id,
      createdAt: new Date(), // Change from Timestamp to Date
    };
    return this.blogCollection.doc(id).set(newPost);
  }

  // Retrieve all blog posts (with IDs)
  getPosts(): Observable<BlogPost[]> {
    return this.blogCollection.valueChanges({ idField: 'id' });
  }

  // Retrieve a single blog post by ID
  getPostById(id: string): Observable<BlogPost | undefined> {
    return this.blogCollection.doc<BlogPost>(id).valueChanges();
  }

  // Get comments by post ID (from the top-level comments collection)
  getCommentsByPostId(postId: string): Observable<Comment[]> {
    return this.firestore
      .collection<Comment>(this.commentsPath, (ref) =>
        ref.where('blogId', '==', postId)
      )
      .valueChanges();
  }

  // Add a new comment to a blog post (store in the top-level comments collection)
  addCommentToPost(postId: string, comment: Comment): Promise<void> {
    const commentWithBlogId = {
      ...comment,
      blogId: postId,
      date: new Date().toISOString(),
    };
    return this.commentsCollection.add(commentWithBlogId).then(() => {});
  }

  // Like a blog post
  async likePost(postId: string, userEmail: string): Promise<void> {
    const post = await this.getPostById(postId).toPromise();
    const likes = post?.likes || [];

    // If the user hasn't liked the post yet, add their email
    if (!likes.includes(userEmail)) {
      return this.blogCollection.doc(postId).update({
        likes: [...likes, userEmail],
      });
    }
  }

  // Unlike a blog post
  async unlikePost(postId: string, userEmail: string): Promise<void> {
    const post = await this.getPostById(postId).toPromise();
    const likes = post?.likes || [];

    // If the user has liked the post, remove their email
    if (likes.includes(userEmail)) {
      const updatedLikes = likes.filter((email) => email !== userEmail);
      return this.blogCollection.doc(postId).update({
        likes: updatedLikes,
      });
    }
  }

  // Check if a user has liked a post
  userHasLiked(post: BlogPost | null, userEmail: string): boolean {
    return Array.isArray(post?.likes) ? post.likes.includes(userEmail) : false;
  }

  // Update a blog post by ID
  updatePost(id: string, value: Partial<BlogPost>): Promise<void> {
    return this.blogCollection
      .doc(id)
      .update(value)
      .catch((error) => {
        console.error('Error updating post:', error);
        throw error;
      });
  }

  // Delete a blog post by ID
  deletePost(id: string): Promise<void> {
    return this.blogCollection
      .doc(id)
      .delete()
      .catch((error) => {
        console.error('Error deleting post:', error);
        throw error;
      });
  }

  // Get current user email
  getCurrentUserEmail(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map((user) => (user ? user.email : null))
    );
  }
}
