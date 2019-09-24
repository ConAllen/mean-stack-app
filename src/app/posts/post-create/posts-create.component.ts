import { Component } from '@angular/core';

@Component ({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: [ './posts-create.component.css' ]
})
export class PostCreateComponent {
  enteredValue = '';
  newPost = 'No Content';

  onAddPost() {
    // console.dir(postInput);
    this.newPost = this.enteredValue;

  }

}
