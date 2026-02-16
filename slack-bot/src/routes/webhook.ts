import { Hono } from 'hono';
import { Bindings, Issue } from '../types';
import { constructGhIssueSlackMessage } from '../utils/slack';

type JsonResponse = {
	action: string;
	issue: Issue;
	repository: {
		owner: {
			login: string;
		};
		name: string;
	};
};

const app = new Hono<{ Bindings: Bindings }>();

app.post('/', async (c) => {
  // GitHubからのWebhookリクエストを処理
	const { action, issue, repository } = await c.req.json<JsonResponse>();
  // Slackのメッセージブロックを構築
	const prefix_text = `An issue was ${action}:`;
	const issue_string = `${repository.owner.login}/${repository.name}#${issue.number}`;
	const blocks = constructGhIssueSlackMessage(issue, issue_string, prefix_text);
  // SlackのIncoming Webhookにメッセージを送信
	// 環境変数からSlackのWebhook URLを取得してPOSTリクエストを送信
	const fetchResponse = await fetch(c.env.SLACK_WEBHOOK_URL, {
		body: JSON.stringify({ blocks }),
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!fetchResponse.ok) throw new Error();

	return c.text('OK');
});

app.onError((_e, c) => {
	return c.text('Unable to handle webhook', 500);
});

export default app;