import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalog } from './catalog.enity';
@Module({
  imports: [TypeOrmModule.forFeature([Catalog])],
  providers: [CatalogService],
  controllers: [CatalogController],
  exports: [TypeOrmModule, CatalogService],
})
export class CatalogModule {}
