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
  form: FormGroup;

  imagePreview: string;

  isLoading: boolean = false;
  constructor(public postService: PostsServiceService, public route: ActivatedRoute) { }

  // find if you have a post id parameter
  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required]
      })
    })
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.isLoading = false;
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          })

        });
      } else {
        this.isLoading = false;
        this.mode = "create";
        this.postId = null;
      }
    });
  }


  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;


    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
      this.form.reset();
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content);
      this.form.reset();
    }

    this.postService.addPost(this.form.value.title, this.form.value.content);
    this.form.reset();

  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity();
    // console.log(file)
    // console.log(this.form);
    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}



