import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsServiceService } from 'src/posts-service.service';
import { Subscription} from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']

})
export class PostListComponent implements OnInit, OnDestroy{

  posts: Post[] = [];
  private postsSub: Subscription;

  constructor( public postService: PostsServiceService ) {

  }

  ngOnInit() {

   this.postService.getPosts();
   this.postsSub = this.postService.getPostUpdatedLister().subscribe((posts: Post[]) => {

    this.posts = posts;

   });

  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }


  onDelete(postId: string) {
    this.postService.deletePost(postId);

  }

}
