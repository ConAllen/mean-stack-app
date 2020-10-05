import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsServiceService } from 'src/posts-service.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';


  post: Post;
  private mode = 'create';
  private postId: string;

  constructor( public postService: PostsServiceService, public route: ActivatedRoute ) {}

  // find if you have a post id parameter
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.post = this.postService.getPost(this.postId);
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }


onAddPost(form: NgForm) {
  if (form.invalid) {
    return;
  }


  this.postService.addPost(form.value.title, form.value.content);
  form.resetForm();

}
}



