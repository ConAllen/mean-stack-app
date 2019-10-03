import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostCreateComponent {

  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated =  new EventEmitter();


  onAddPost() {
      const post = {
        title: this.enteredTitle,
        content: this.enteredContent,
      };
      this.postCreated.emit(post);
  }

}
