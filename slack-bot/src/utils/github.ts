const ghIssueRegex = /(?<owner>[\w.-]*)\/(?<repo>[\w.-]*)\#(?<issue_number>\d*)/;

/**
 * イシュー文字列をパースして、owner, repo, issue_numberを抽出
 * @param text 
 * @returns 
 */
export const parseGhIssueString = (text: string) => {
	const match = text.match(ghIssueRegex);
	return match ? match.groups ?? {} : {};
};

/**
 * GitHuからIssue情報を取得
 * @param owner 
 * @param repo 
 * @param issue_number 
 * @returns 
 */
export const fetchGithubIssue = (owner: string, repo: string, issue_number: string) => {
	const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`;
	const headers = { 'User-Agent': 'simple-worker-slack-bot' };
	return fetch(url, { headers });
};