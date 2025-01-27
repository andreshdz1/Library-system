import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Catalog } from './catalog.enity';
import { createBookDto } from './dto/createBook.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private CatalogRepository: Repository<Catalog>,
  ) {}
  async findAll(): Promise<Catalog[]> {
    return this.CatalogRepository.find();
  }

  async create(createBookDto: createBookDto): Promise<Catalog> {
    //check if book already exist
    const exist = await this.findByIsbn(createBookDto.isbn);
    if (exist) {
      if (
        exist.title === createBookDto.title &&
        exist.author === createBookDto.author &&
        exist.editorial === createBookDto.editorial &&
        exist.edition === createBookDto.edition &&
        exist.conditions === createBookDto.conditions &&
        exist.clasification === createBookDto.clasification &&
        exist.price === createBookDto.price
      ) {
        this.sumStock(exist.id);
        return exist;
      }
    }
    const book = new Catalog();
    book.isbn = createBookDto.isbn;
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.editorial = createBookDto.editorial;
    book.edition = createBookDto.edition;
    book.conditions = createBookDto.conditions;
    book.clasification = createBookDto.clasification;
    book.location = createBookDto.location;
    book.amount = createBookDto.amount;
    book.price = createBookDto.price;
    return this.CatalogRepository.save(book);
  }

  async createQueue(createBookDto: createBookDto): Promise<Catalog> {
    const exist = await this.findByIsbn(createBookDto.isbn);
    if (exist) {
      if (
        exist.title === createBookDto.title &&
        exist.author === createBookDto.author &&
        exist.editorial === createBookDto.editorial &&
        exist.edition === createBookDto.edition &&
        exist.conditions === createBookDto.conditions &&
        exist.clasification === createBookDto.clasification &&
        exist.price === createBookDto.price
      ) {
        this.sumStock(exist.id);
        return exist;
      }
    }
    const book = new Catalog();
    book.isbn = createBookDto.isbn;
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.editorial = createBookDto.editorial;
    book.edition = createBookDto.edition;
    book.conditions = createBookDto.conditions;
    book.clasification = createBookDto.clasification;
    book.location = createBookDto.location;
    book.amount = createBookDto.amount;
    book.price = createBookDto.price;
    book.queue = true;
    return this.CatalogRepository.save(book);
  }
  async sumStock(id: number): Promise<void> {
    await this.CatalogRepository.increment({ id }, 'amount', 1);
  }
  async remove(id: number): Promise<void> {
    await this.CatalogRepository.delete(id);
  }
  //edit book
  async editbook(id: number, createBookDto: createBookDto): Promise<Catalog> {
    const book = await this.CatalogRepository.findOneBy({ id });
    if (book) {
      book.isbn = createBookDto.isbn;
      book.title = createBookDto.title;
      book.author = createBookDto.author;
      book.editorial = createBookDto.editorial;
      book.edition = createBookDto.edition;
      book.conditions = createBookDto.conditions;
      book.clasification = createBookDto.clasification;
      book.location = createBookDto.location;
      book.amount = createBookDto.amount;
      book.price = createBookDto.price;
      book.queue = false;
      return this.CatalogRepository.save(book);
    }
    throw new Error('book not found');
  }
  //FIND
  async findByIsbn(isbn: string): Promise<Catalog | null> {
    return await this.CatalogRepository.findOne({
      where: { isbn },
    });
  }
  async findByTitle(title: string): Promise<Catalog | null> {
    return await this.CatalogRepository.findOne({
      where: { title },
    });
  }
  async decreaseStock(id: number): Promise<void> {
    try {
      await this.CatalogRepository.decrement({ id }, 'amount', 1);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          'DB constrain violation',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  async findAllQueue(): Promise<Catalog[]> {
    return this.CatalogRepository.find({ where: { queue: true } });
  }
  async increaseStock(id: number): Promise<void> {
    try {
      await this.CatalogRepository.increment({ id }, 'amount', 1);
      console.log('stock increased: ', id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new HttpException(
          'DB constrain violation',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
  }
  async createBackup(): Promise<void> {
    const command = 'pg_dump -U postgres -d libreria > backup_file.sql';
    try {
      await execAsync(command);
      console.log('Backup created successfully');
    } catch (error) {
      console.error('Backup creation failed', error);
    }
  }

  async restoreBackup(): Promise<void> {
    const command = 'psql -U postgres -d libreria < backup_file.sql';
    try {
      await execAsync(command);
      console.log('Backup restored successfully');
    } catch (error) {
      console.error('Backup restoration failed', error);
    }
  }
}
