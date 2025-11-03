export function getAuthorizationURL(): string {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "false",
  }).toString();

  return `${baseUrl}?${params}`;
}

export function getAccessTokenURL(code: string): string {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  return `${baseUrl}?${params}`;
}

export async function getAccessToken(code: string): Promise<string | null> {
  const url = getAccessTokenURL(code);

  const { error, access_token } = await (
    await fetch(url, {
      headers: { Accept: "application/json" },
      method: "POST",
    })
  ).json();
  if (error) {
    return null;
  }

  return access_token;
}

interface GithubUserRaw {
  login: string;
  id: string;
  avatar_url: string;
}

interface GithubEmail {
  email: string;
  verified: boolean;
  primary: boolean;
  visibility: "public" | "private" | null;
}

type GithubUser = GithubUserRaw & { email: string | null };

export async function getProfile(access_token: string): Promise<GithubUser> {
  // todo: error handling depending on the response status code
  const userResponse = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${access_token}` },
    method: "GET",
  });
  const { login, id, avatar_url }: GithubUserRaw = await userResponse.json();

  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${access_token}` },
    method: "GET",
  });
  const emails: GithubEmail[] = await emailResponse.json();

  let email = null;
  for (const emailObj of emails) {
    if (!emailObj.verified) continue;

    if (emailObj.primary) {
      email = emailObj.email;
      break;
    }

    if (!email && emailObj.visibility === "public") {
      email = emailObj.email;
    }
  }

  return { login, id, avatar_url, email };
}
