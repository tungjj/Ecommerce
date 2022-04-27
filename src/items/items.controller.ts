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
  UseInterceptors,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
// import { ApiTags, ApiConsumes}
@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
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
        descript: {
          type: 'number',
        },
        status: {
          type: 'string',
        },
      },
    },
  })
  create(
    @Body() createItemDto: CreateItemDto,
    categoryId: string,
    @UploadedFiles() files: {
      avatar?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return this.itemsService.create(createItemDto, categoryId, files);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
