export class CreateProfileDto {
  userId!: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  website: string;
  avatarUrl: string;
  coverUrl: string;
  availability: 'open' | 'busy' | 'unavailable';
}
