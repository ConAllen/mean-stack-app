import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsServiceService } from 'src/posts-service.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';


  constructor( public postService: PostsServiceService ) {}

ngOnInit() {

}


onAddPost(form: NgForm) {
  if (form.invalid) {
    return;
  }


  this.postService.addPost(form.value.title, form.value.content);

}
}



