import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt/jwt.strategy';

@Global()
@Module({
  providers: [JwtStrategy, ConfigService],
  exports: [],
  imports: [],
})
export class AuthModule {}
