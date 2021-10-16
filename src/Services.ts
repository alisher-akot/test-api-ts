import { Post, User } from "./model";

class Services {
  public posts: Post[] | null = null;
  public users: User[] | null = null;
  public errors: Error[] = [];

  private fetching = async <T>(url: string): Promise<T | null> => {
    try {
      const resp = await fetch(url);
      return await resp.json();
    } catch (e) {
      this.errors.push(new Error("e"));
      return null;
    }
  };

  public getPosts = async () => {
    const url = "https://jsonplaceholder.typicode.com/posts/";
    const data = await this.fetching<Post[]>(url);
    this.posts = data;
    return;
  };

  public getUsers = async () => {
    const url = "https://jsonplaceholder.typicode.com/users/";
    const data = await this.fetching<User[]>(url);
    this.users = data;
    return;
  };
}

export default new Services();
