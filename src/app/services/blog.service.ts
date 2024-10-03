import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

export interface BlogPost {
  id?: string | null; // Optional, since we get it from Firebase
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogCollection: AngularFirestoreCollection<BlogPost>;
  private commentsPath = 'comments';

  constructor(private firestore: AngularFirestore) {
    this.blogCollection = this.firestore.collection<BlogPost>('blog');
  }

  // Create a new blog post
  createPost(post: BlogPost): Promise<void> {
    const id = this.firestore.createId();
    const newPost = { ...post, id, createdAt: new Date() };
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

  // Get comments by post ID
  getCommentsByPostId(postId: string): Observable<any[]> {
    return this.firestore
      .collection<any>(`${this.commentsPath}/${postId}`)
      .valueChanges();
  }

  // Add a new comment to the post
  addCommentToPost(
    postId: string,
    comment: { name: string; email: string; body: string }
  ): Promise<void> {
    return this.firestore
      .collection(`${this.commentsPath}/${postId}`)
      .add(comment)
      .then(() => {});
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
}
