import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostCreateComponent {

  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated =  new EventEmitter<Post>();


  onAddPost() {
      const post: Post = {
        title: this.enteredTitle,
        content: this.enteredContent,
      };
      this.postCreated.emit(post);
  }

}
