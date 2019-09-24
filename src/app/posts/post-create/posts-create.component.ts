import { Component } from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
})
export class PostCreateComponent {
  onAddPost() {
    alert('post alert');

  }

}
