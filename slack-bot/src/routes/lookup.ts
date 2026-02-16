import { Hono } from 'hono';
import { Issue } from '../types';
import { fetchGithubIssue, parseGhIssueString } from '../utils/github';
import { constructGhIssueSlackMessage } from '../utils/slack';

const app = new Hono();

app.post('/', async (c) => {
  // Slackからのリクエストを処理
	const { text } = await c.req.parseBody();
	if (typeof text !== 'string') {
		return c.notFound();
	}

  // GitHubのIssue情報を取得して、Slackのメッセージブロックを構築
	const { owner, repo, issue_number } = parseGhIssueString(text);
  // GitHub APIからIssue情報を取得
	const response = await fetchGithubIssue(owner, repo, issue_number);
  // APIからのレスポンスをJSONとしてパース
	const issue = await response.json<Issue>();
	const blocks = constructGhIssueSlackMessage(issue, text);

	return c.json({
		blocks,
		response_type: 'in_channel',
	});
});

app.onError((_e, c) => {
	return c.text(
		"Uh-oh! We couldn't find the issue you provided. " +
			'We can only find public issues in the following format: `owner/repo#issue_number`.'
	);
});

export default app;