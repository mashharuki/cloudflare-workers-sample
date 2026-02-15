/**
 * PostFormコンポーネントは、ユーザーが新しい投稿を作成するためのフォームを提供します。
 */
export const PostForm = () => {
  <form method="POST" action="/posts">
    <label>
      Title:
      <input type="text" name="title" required />
    </label>
    <label>
      Body:
      <textarea name="body" required></textarea>
    </label>
    <button type="submit">Create Post</button>
  </form>
}