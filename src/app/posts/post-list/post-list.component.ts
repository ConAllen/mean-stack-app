import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsServiceService } from 'src/posts-service.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']

})
export class PostListComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  posts: Post[] = [];
  private postsSub: Subscription;

  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 100];



  constructor(public postService: PostsServiceService) {

  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdatedLister().subscribe((postData: { posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
      console.log('total', postData)
    });

  }

  onChangePate(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);


  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }


  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId)
    .subscribe(( ) => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)

    });

  }

}
