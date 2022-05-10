import { DecreaseItemDto } from './dto/decrease-item.dto';
import { ItemsRepository } from './items.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
// import { ApiTags, ApiConsumes}
@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: diskStorage({
          destination: './files',
          filename: function (req, file, cb) {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + '-' + file.originalname);
          },
        }),
        fileFilter: function (req, file, callback) {
          if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
      },
    ),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // categoryId: {
        //   type: 'string',
        // },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        name: {
          type: 'string',
        },
        barcode: {
          type: 'string',
        },
        importPrice: {
          type: 'number',
        },
        price: {
          type: 'number',
        },
        weight: {
          type: 'number',
        },
        quantity: {
          type: 'Number',
        },
        avatar: {
          // items: {
          type: 'string',
          format: 'binary',
          // },
        },
        description: {
          type: 'string',
        },
        status: {
          type: 'string',
        },
      },
    },
  })
  create(
    @Body() createItemDto: CreateItemDto,
    @Param('id') categoryId: string,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File;
      images?: Express.Multer.File[];
    },
  ) {
    return this.itemsService.create(createItemDto, categoryId, files);
  }
  @Get('/test')
  test() {
    console.log('asdfasdvv cv rtger fewfvbv ');
    return this.itemsService.getRealPrice();
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('itemAvatar', {
      storage: diskStorage({
        destination: './avatar',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      fileFilter: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() itemAvatar: Express.Multer.File,
  ) {
    return this.itemsService.update(id, updateItemDto, itemAvatar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Patch('/order/:id')
  // @ApiConsumes('multipart/form-data')
  decreaseItemQuantity(
    @Param('id') id: string,
    @Body() decreaseItemDto: DecreaseItemDto,
  ) {
    console.log(decreaseItemDto);

    return this.itemsService.decreaseItemQuantity(id, decreaseItemDto);
  }
}
