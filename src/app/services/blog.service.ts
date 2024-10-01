import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

export interface BlogPost {
  id?: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private dbPath = '/blogs';
  blogsRef: AngularFireList<BlogPost>;

  constructor(
    private firestore: AngularFirestore,
    private db: AngularFireDatabase
  ) {
    this.blogsRef = db.list(this.dbPath);
  }

  // Create a new blog post using AngularFireDatabase
  createPost(post: BlogPost): Promise<void> {
    // Add createdAt timestamp to the post
    const newPost = { ...post, createdAt: new Date() };
    return this.blogsRef.push(newPost).then(() => {
      // No need to return anything here; the valueChanges() will update automatically
    });
  }

  // Read all blog posts using AngularFireDatabase
  getPosts(): Observable<BlogPost[]> {
    return this.blogsRef.valueChanges();
  }

  // Update a blog post using AngularFireDatabase
  updatePost(key: string, value: Partial<BlogPost>): Promise<void> {
    return this.blogsRef.update(key, value);
  }

  // Delete a blog post using AngularFireDatabase
  deletePost(key: string): Promise<void> {
    return this.blogsRef.remove(key);
  }

  // Delete all blog posts
  deleteAll(): Promise<void> {
    return this.blogsRef.remove();
  }
}
