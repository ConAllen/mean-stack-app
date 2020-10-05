import { Injectable, OnInit } from '@angular/core';
import { Post } from './app/posts/post.model';
import { Subject } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PostsServiceService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();



  constructor(private http: HttpClient) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: any[] }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map( postData => {
        return postData.posts.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe( mappedPosts => {
        this.posts = mappedPosts;
        console.log('con', this.posts);
        this.postsUpdated.next([...this.posts]);


      });
  }

getPost(id: string) {
  // returns a clone of hte obj we return. we use
  //the spread operator to pull our all details of the object so we dont change the innitial obj
  return {...this.posts.find( p => p.id === id )};

}


  getPostUpdatedLister() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };
    this.http.
    post<{ message: string, postId: string }>('http://localhost:3000/api/posts', post)
    .subscribe(postData => {
      const postId = postData.postId;
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });

  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId).subscribe(deletedPost => {
      console.log(deletedPost);
      const updatedPost = this.posts.filter( post => post.id !== postId);
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);

    });

  }
}
