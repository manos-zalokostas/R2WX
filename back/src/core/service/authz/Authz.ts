import {Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException} from '@nestjs/common';
import {ACCESS} from "@core/config/app.constants";

@Injectable()
export class AuthzGuard implements CanActivate {

    private readonly secretKey: string;

    constructor() {
        // We get the secret from environment variables once, during startup.
        // this.secretKey = this.configSv.get<string>('ENV_SERVER_SECRET');
        // @ts-ignore
        this.secretKey = process.env.ENV_SERVER_SECRET

        if (!this.secretKey) throw new Error('INTERNAL_API_SECRET is not defined in environment variables.');
    }

    canActivate(context: ExecutionContext): boolean {
        try {

            const req = context.switchToHttp().getRequest();

            console.log("________________________________________________________", req.headers)
            const authHeader = req.headers['authorization'];

            if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException('Missing or malformed Authorization header.');

            const providedSecret = authHeader.substring(7); // Get the token part
            if (providedSecret !== this.secretKey) throw new UnauthorizedException('Invalid internal API secret.');


            const userRole = req.headers['x-user-role'];
            if (!userRole) throw new ForbiddenException('Missing X-User-Role header.');

            const accessLevel = ACCESS[userRole];
            console.log("________________________________________________________", {userRole, accessLevel})
            if (!accessLevel) throw new ForbiddenException('PROVIDED ACCESS-LEVEL INVALID.');

            req.userAccess = accessLevel;

            return true;

        } catch (err) {
            console.log("* * * * AUTHZ BLOCK:: ", err);
            return false;
        }
    }
}