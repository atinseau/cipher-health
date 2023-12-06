// import * as request from 'supertest';
// import { Test } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import { AuthModule } from '@/adapters/auth/auth.module';
// import { ConfigModule } from '@nestjs/config';
// import { RedisModule } from '@/common/redis/redis.module';
// import { LoggerModule } from '@/common/logger/logger.module';
// import { PrismaModule } from '@/common/database/prisma.module';
// import { UserModule } from '@/adapters/user/user.module';
// import { ClientModule } from '@/adapters/client/client.module';


// describe('AuthController (e2e)', () => {
//   let app: INestApplication;

//   // let prismaService

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [
//         ConfigModule.forRoot({
//           isGlobal: true
//         }),
//         RedisModule,
//         LoggerModule,
//         PrismaModule,
//         UserModule,
//         AuthModule,
//       ],
//     })
//       .compile();

//     app = moduleRef.createNestApplication();
//     await app.init();
//   });

//   it('/GET auth health check', () => {
//     return request(app.getHttpServer())
//       .get('/auth/health')
//       .expect(200)
//       .expect('OK')
//   })

//   afterAll(async () => {
//     await app.close();
//   })
// })