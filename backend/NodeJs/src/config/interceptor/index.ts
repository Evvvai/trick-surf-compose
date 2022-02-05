import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Connection } from 'typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';
import { NODE_ENV } from '@environments';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection()
    private connection: Connection,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let request = context.switchToHttp().getRequest();

    if (!request) {
      request = GqlExecutionContext.create(context).getContext()?.req;
    }

    const ip =
      request?.headers['x-forwarded-for'] || request?.connection?.remoteAddress;
    const route = request?.route?.path || '/graphql';
    const body = JSON.stringify(request?.body);

    // ms
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;

        // if (NODE_ENV !== 'production')
        console.log('Request ' + ms + 'ms | ' + body.length);
        // if (NODE_ENV !== 'production') console.table([ip, route, ms]);
      }),
    );
  }
}
