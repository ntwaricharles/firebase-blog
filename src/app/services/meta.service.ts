import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  constructor(private meta: Meta, private titleService: Title) {}

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  setDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateMetaTags(tags: { name: string; content: string }[]) {
    tags.forEach((tag) => this.meta.updateTag(tag));
  }

  clearMetaTags() {
    this.meta.getTags('name').forEach((tag) => this.meta.removeTagElement(tag));
  }
}
