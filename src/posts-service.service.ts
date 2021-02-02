import { Injectable, OnInit } from '@angular/core';
import { Post } from './app/posts/post.model';
import { Subject } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PostsServiceService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();



  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string, posts: any[] }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        }))
      .subscribe(mappedPosts => {
        this.posts = mappedPosts;
        console.log('con', this.posts);
        this.postsUpdated.next([...this.posts]);


      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>('http://localhost:3000/api/posts/' + id);

  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
  getPostUpdatedLister() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title, content };

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    console.log('postData', postData)
    this.http.
      post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(postData => {
        const post: Post = { id: postData.post.id, title: title, content: content, imagePath: postData.post.imagePath }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      });

  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(deletedPost => {
        console.log(deletedPost);
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);

      });

  }
}
