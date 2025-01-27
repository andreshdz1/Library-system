import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { createBookDto } from './dto/createBook.dto';
import { Catalog } from './catalog.enity';
import { emptyToNull } from 'src/utils/emptyToNull';

@Controller('Catalog')
export class CatalogController {
  constructor(private CatalogService: CatalogService) {}
  @Post()
  create(@Body() createBookDto: createBookDto): Promise<Catalog> {
    const transfomed = emptyToNull(createBookDto);
    return this.CatalogService.create(transfomed);
  }
  @Post('queue')
  createQueue(@Body() createBookDto: createBookDto): Promise<Catalog> {
    return this.CatalogService.createQueue(createBookDto);
  }

  @Get()
  async findAll(): Promise<Catalog[]> {
    return this.CatalogService.findAll();
  }

  @Get('queue')
  async findAllQueue(): Promise<Catalog[]> {
    return this.CatalogService.findAllQueue();
  }
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.CatalogService.remove(id);
  }
  //edit book
  @Post('editCatalog/:id')
  async editCatalog(
    @Param('id') id: number,
    @Body() createBookDto: createBookDto,
  ): Promise<Catalog> {
    const transfomed = emptyToNull(createBookDto);
    return this.CatalogService.editbook(id, transfomed);
  }
  //FIND BY ISBN
  @Post('findByIsbn')
  async findByIsbn(
    @Body() createBookDto: createBookDto,
  ): Promise<Catalog | null> {
    return this.CatalogService.findByIsbn(createBookDto.isbn);
  }
  //FIND BY TITLE
  @Post('findByTitle')
  async findByTitle(
    @Body() createBookDto: createBookDto,
  ): Promise<Catalog | null> {
    return this.CatalogService.findByTitle(createBookDto.title);
  }
  //DECREASE STOCK
  @Post('stock')
  async decreaseStock(@Body('id') id: number, @Res() res: any): Promise<void> {
    try {
      await this.CatalogService.decreaseStock(id);
      res.status(HttpStatus.OK).send();
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: error.message || 'Internal server error',
      });
    }
  }
  //INCREASE STOCK
  @Post('stockInc')
  async increaseStock(@Body('id') id: number, @Res() res: any): Promise<void> {
    try {
      await this.CatalogService.increaseStock(id);
      res.status(HttpStatus.OK).send();
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: error.message || 'Internal server error',
      });
    }
  }

  //BACKUP
  @Post('backup')
  async backup(@Res() res: any): Promise<void> {
    try {
      await this.CatalogService.createBackup();
      res.status(HttpStatus.OK).send();
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: error.message || 'Internal server error',
      });
    }
  }
  //RESTORE
  @Post('restore')
  async restore(@Res() res: any): Promise<void> {
    try {
      await this.CatalogService.restoreBackup();
      res.status(HttpStatus.OK).send();
    } catch (error) {
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        statusCode: status,
        message: error.message || 'Internal server error',
      });
    }
  }
}
