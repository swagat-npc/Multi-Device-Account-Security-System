import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: any
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
        const request = context.switchToHttp().getRequest();
        const { authorization }: any = request.headers;
        if (!authorization || !authorization.startsWith('Bearer ') || authorization.trim() === '') {
            throw new UnauthorizedException('Missing or invalid token');
        }
        const authToken = authorization.replace('Bearer ', '').trim();
        const resp = await this.authService.validateToken(authToken);
        request.decodeData = resp;
        return true;
    } catch (error: any) {
        throw new ForbiddenException(error.message || 'session expired! Please sign In');        
    }
  }
}