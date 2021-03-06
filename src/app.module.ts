import { RolesGuard } from './authorization/roles.guard';
import { UsersRepository } from './users/users.repository';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { CategoriesModule } from './categories/categories.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsModule } from './uploads/uploads.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ItemsModule } from './items/items.module';
import { FlashsalesModule } from './flashsales/flashsales.module';
import { ItemFlashsalesModule } from './item-flashsales/item-flashsales.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { OrdersModule } from './orders/orders.module';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { CronjobService } from './cronjob/cronjob.service';
import { CronjobModule } from './cronjob/cronjob.module';
// RolesGuard
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'ecommerce',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        service: 'gmail',
        ignoreTLS: false,
        secure: false,
        auth: {
          user: 'bot.sendmail.99@gmail.com',
          pass: 'Tung99.123',
        },
      },
      defaults: {
        from: '"Ecommerce" <tungplatin@gmail.com>',
      },
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './files',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    CategoriesModule,
    NestjsFormDataModule,
    UploadsModule,
    ItemsModule,
    FlashsalesModule,
    ItemFlashsalesModule,
    VouchersModule,
    OrdersModule,
    CronjobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    CronjobService,
  ],
})
export class AppModule {}
