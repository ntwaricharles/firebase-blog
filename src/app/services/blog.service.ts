import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

// BlogPost interface
export interface BlogPost {
  id?: string | null;
  title: string;
  content: string;
  author: string;
  createdAt: firebase.firestore.Timestamp;
  likes?: string[]; // likes can be an array of strings representing user emails
  comments?: string[]; // Array to store comment references or actual comments
}

// Comment interface
export interface Comment {
  content: string | null;
  authorEmail: string;
  date: string;
  blogId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private blogCollection: AngularFirestoreCollection<BlogPost>;
  private commentsPath = 'comments'; // This should refer to the collection name

  constructor(private firestore: AngularFirestore) {
    this.blogCollection = this.firestore.collection<BlogPost>('blog');
  }

  // Create a new blog post
  createPost(post: BlogPost): Promise<void> {
    const id = this.firestore.createId();
    const newPost = { ...post, id, createdAt: firebase.firestore.Timestamp.fromDate(new Date()) }; // Use Firestore Timestamp
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
  getCommentsByPostId(postId: string): Observable<Comment[]> {
    // Adjusting the path to be 'blog/{postId}/comments' to correctly reference the comments subcollection
    return this.firestore
      .collection<Comment>(`blog/${postId}/comments`) // Ensure the path is correct
      .valueChanges();
  }

  // Add a new comment to a blog post
  addCommentToPost(postId: string, comment: Comment): Promise<void> {
    // Ensure you're adding to the correct comments subcollection
    return this.firestore
      .collection(`blog/${postId}/comments`) // Correct path to comments
      .add(comment)
      .then(() => {});
  }

  // Like a blog post
  async likePost(postId: string, userEmail: string): Promise<void> {
    const post = await this.getPostById(postId).toPromise();
    const likes = post?.likes || [];

    // If the user hasn't liked the post yet, add their email
    if (!likes.includes(userEmail)) {
      return this.blogCollection.doc(postId).update({
        likes: [...likes, userEmail], // Update likes array directly
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
        likes: updatedLikes, // Update likes array directly
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
}
