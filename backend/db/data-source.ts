import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/user.entity';
import { Clients } from 'src/clients/clients.entity';
import { Providers } from 'src/providers/provider.entity';
import { Beneficiaries } from 'src/beneficiaries/beneficiaries.entity';
import { movements } from 'src/payments/payments.entity';
import { Catalog } from 'src/catalog/catalog.enity';
import { Clasification } from 'src/clasification/clasification.entity';
import { Reservation } from 'src/reservation/reservation.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Users,
    Clients,
    Providers,
    Beneficiaries,
    movements,
    Catalog,
    Clasification,
    Reservation,
  ],
  migrations: [],
  logging: true,
  synchronize: false,
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
