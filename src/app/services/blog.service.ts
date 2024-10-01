import { Injectable } from '@angular/core';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
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
  private dbPath = '/blogs'; // Path in Realtime Database
  blogsRef: AngularFireList<BlogPost>;

  constructor(private db: AngularFireDatabase) {
    this.blogsRef = db.list(this.dbPath);
  }

  // Create a new blog post
  createPost(post: BlogPost): Promise<string> {
    const newPost = { ...post, createdAt: new Date() };
    return this.blogsRef
      .push(newPost)
      .then((result) => {
        if (result.key) {
          return result.key; 
        } else {
          throw new Error('Failed to create post: key is null');
        }
      })
      .catch((error) => {
        console.error('Error creating post:', error);
        throw error;
      });
  }

  // Retrieve all blog posts (with IDs)
  getPosts(): Observable<BlogPost[]> {
    return this.blogsRef.snapshotChanges().pipe(
      map(
        (changes) =>
          changes
            .map((c) => ({
              id: c.payload.key,
              title: c.payload.val()?.title || 'Untitled Post',
              content: c.payload.val()?.content || 'No content available',
              author: c.payload.val()?.author || 'Unknown Author',
              createdAt: c.payload.val()?.createdAt || new Date(), 
            }))
            .filter((post) => post.id !== null) // Filter out posts with null id
      )
    );
  }

  // Retrieve a single blog post by ID
  getPostById(id: string): Observable<BlogPost | null> {
    return this.db.object<BlogPost>(`${this.dbPath}/${id}`).valueChanges();
  }

  // Update a blog post by ID
  updatePost(key: string, value: Partial<BlogPost>): Promise<void> {
    return this.blogsRef.update(key, value).catch((error) => {
      console.error('Error updating post:', error);
      throw error;
    });
  }

  // Delete a blog post by ID
  deletePost(key: string): Promise<void> {
    return this.blogsRef.remove(key).catch((error) => {
      console.error('Error deleting post:', error);
      throw error;
    });
  }

  // Delete all blog posts
  deleteAll(): Promise<void> {
    return this.blogsRef.remove().catch((error) => {
      console.error('Error deleting all posts:', error);
      throw error;
    });
  }
}
