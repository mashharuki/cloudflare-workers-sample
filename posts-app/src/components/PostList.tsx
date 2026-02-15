
export type Post = {
  title: string;
  body: string;
}

/**
 * PostListコンポーネントは、投稿のリストを表示するためのReactコンポーネントです。
 */
export const PostList = ({ posts }: { posts: Post[] }) => {
  <div>
    {posts.map((post, index) => (
      <div key={index}>
        <h2>Title: {post.title}</h2>
        <div>Body: {post.body}</div>
        <hr />
      </div>
    ))}{}
  </div>
};