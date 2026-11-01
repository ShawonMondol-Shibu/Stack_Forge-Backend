import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { auth } from '../lib/auth/auth';
import { db } from '../lib/database/db';
import { account } from '../lib/database/schema/auth-schema';

const GITHUB_API = 'https://api.github.com';

type GithubHeaders = Record<string, string | string[] | undefined>;

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
};

type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  private: boolean;
  archived: boolean;
  fork: boolean;
  topics?: string[];
  updated_at: string;
};

type GithubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
};

@Injectable()
export class GithubService {
  async getDashboard(userId: string, headers: GithubHeaders) {
    const [githubAccount] = await db
      .select({ id: account.id })
      .from(account)
      .where(
        and(eq(account.userId, userId), eq(account.providerId, 'github')),
      )
      .limit(1);

    if (!githubAccount) {
      return {
        connected: false,
        profile: null,
        repositories: [],
        activity: [],
      };
    }

    const tokens = await auth.api.getAccessToken({
      body: { accountId: githubAccount.id },
      headers,
    });

    if (!tokens?.accessToken) {
      throw new ServiceUnavailableException('GitHub access token is unavailable');
    }

    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokens.accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      const [profile, repositories] = await Promise.all([
        this.githubFetch<GithubUser>('/user', githubHeaders),
        this.githubFetch<GithubRepo[]>(
          '/user/repos?sort=updated&direction=desc&per_page=100&affiliation=owner,collaborator',
          githubHeaders,
        ),
      ]);

      const activity = await this.githubFetch<GithubEvent[]>(
        `/users/${encodeURIComponent(profile.login)}/events?per_page=30`,
        githubHeaders,
      );

      return {
        connected: true,
        profile: {
          login: profile.login,
          name: profile.name,
          avatarUrl: profile.avatar_url,
          profileUrl: profile.html_url,
          bio: profile.bio,
          company: profile.company,
          location: profile.location,
          website: profile.blog,
          publicRepos: profile.public_repos,
          followers: profile.followers,
          following: profile.following,
        },
        repositories: repositories
          .filter((repo) => !repo.archived)
          .map((repo) => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            issues: repo.open_issues_count,
            private: repo.private,
            fork: repo.fork,
            topics: repo.topics ?? [],
            updatedAt: repo.updated_at,
          })),
        activity: activity.map((event) => ({
          id: event.id,
          type: event.type,
          repository: event.repo.name,
          createdAt: event.created_at,
        })),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'GitHub API request failed';
      throw new ServiceUnavailableException(message);
    }
  }

  private async githubFetch<T>(path: string, headers: Record<string, string>) {
    const response = await fetch(`${GITHUB_API}${path}`, { headers });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub API ${response.status}: ${body || response.statusText}`);
    }

    return (await response.json()) as T;
  }
}
