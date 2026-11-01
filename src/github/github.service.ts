import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { auth } from '../lib/auth/auth';
import { db } from '../lib/database/db';
import { account } from '../lib/database/schema/auth-schema';
import { eq, and } from 'drizzle-orm';

const GITHUB_API = 'https://api.github.com';
const REQUEST_TIMEOUT_MS = 10_000;
const REPOS_PER_PAGE = 100;
const MAX_REPO_PAGES = 5; // up to 500 repositories

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

// Thrown when GitHub rejects the stored token (revoked / expired).
class GithubUnauthorizedError extends Error {}

const DISCONNECTED = {
  connected: false,
  profile: null,
  repositories: [],
  activity: [],
};

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  async getDashboard(userId: string, headers: GithubHeaders) {
    const [githubAccount] = await db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, userId), eq(account.providerId, 'github')))
      .limit(1);

    if (!githubAccount) {
      return DISCONNECTED;
    }

    let accessToken: string | undefined;
    try {
      const tokens = await auth.api.getAccessToken({
        body: { accountId: githubAccount.id },
        headers: this.toHeaders(headers),
      });
      accessToken = tokens?.accessToken;
    } catch (error) {
      this.logger.warn(
        `getAccessToken failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (!accessToken) {
      throw new ServiceUnavailableException(
        'GitHub access token is unavailable',
      );
    }

    const githubHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      const [profile, allRepositories] = await Promise.all([
        this.githubFetch<GithubUser>('/user', githubHeaders),
        this.fetchAllRepositories(githubHeaders),
      ]);

      const activity = await this.githubFetch<GithubEvent[]>(
        `/users/${encodeURIComponent(profile.login)}/events?per_page=30`,
        githubHeaders,
      );

      const repositories = allRepositories
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
        }));

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
          // Derived from the same filtered list the UI shows, so the
          // "Repositories" card and "Public repos" never disagree.
          publicRepos: repositories.filter((repo) => !repo.private).length,
          followers: profile.followers,
          following: profile.following,
        },
        repositories,
        activity: activity.map((event) => ({
          id: event.id,
          type: event.type,
          repository: event.repo.name,
          createdAt: event.created_at,
        })),
      };
    } catch (error) {
      // Token revoked or expired: send the user back to the Connect GitHub card.
      if (error instanceof GithubUnauthorizedError) {
        return DISCONNECTED;
      }

      this.logger.error(
        error instanceof Error ? error.message : 'GitHub API request failed',
      );
      throw new ServiceUnavailableException(
        error instanceof Error ? error.message : 'GitHub API request failed',
      );
    }
  }

  // Nest gives us a plain object (IncomingHttpHeaders); better-auth wants
  // a web `Headers` instance, so convert it and skip undefined values.
  private toHeaders(source: GithubHeaders): Headers {
    const headers = new Headers();

    for (const [key, value] of Object.entries(source)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        for (const item of value) headers.append(key, item);
      } else {
        headers.set(key, value);
      }
    }

    return headers;
  }

  private async fetchAllRepositories(headers: Record<string, string>) {
    const repositories: GithubRepo[] = [];

    for (let page = 1; page <= MAX_REPO_PAGES; page++) {
      const batch = await this.githubFetch<GithubRepo[]>(
        `/user/repos?sort=updated&direction=desc&per_page=${REPOS_PER_PAGE}&page=${page}&affiliation=owner,collaborator`,
        headers,
      );

      repositories.push(...batch);

      if (batch.length < REPOS_PER_PAGE) break;
    }

    return repositories;
  }

  private async githubFetch<T>(path: string, headers: Record<string, string>) {
    const response = await fetch(`${GITHUB_API}${path}`, {
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 401) {
      throw new GithubUnauthorizedError('GitHub token rejected');
    }

    if (!response.ok) {
      // Full body stays in the server logs, not in the client response.
      this.logger.warn(
        `GitHub ${response.status} on ${path}: ${await response.text()}`,
      );
      throw new Error(`GitHub API request failed (${response.status})`);
    }

    return (await response.json()) as T;
  }
}
