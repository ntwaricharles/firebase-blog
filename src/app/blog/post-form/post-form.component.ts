import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BlogPost } from '../../services/blog.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
})
export class PostFormComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() loading: boolean = false;
  @Input() successMessage: string | undefined;
  @Input() errorMessage: string | undefined;
  @Input() validationError: string | undefined;
  @Output() submitPost = new EventEmitter<BlogPost>();

  handleSubmit() {
    if (!this.title || !this.content) {
      this.validationError = 'Both title and content are required.';
      return;
    }
    this.submitPost.emit({
      title: this.title,
      content: this.content,
      author: 'Anonymous',
      createdAt: new Date(),
    });
  }

  resetMessages() {
    this.validationError = undefined;
    this.errorMessage = undefined;
    this.successMessage = undefined;
  }
}
