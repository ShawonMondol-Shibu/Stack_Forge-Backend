import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { auth } from '../lib/auth/auth';

type AuthUser = Record<string, unknown>;

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    request.user = session.user;

    return true;
  }
}
