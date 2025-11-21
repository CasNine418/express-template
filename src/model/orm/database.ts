import { serverConfig } from "../../../config";
import { Log } from "../log";
import { DatabaseType, DataSource } from "typeorm";

const log = new Log("dao:initializeDataSource");

const dataSource = new DataSource({
    type: 'mysql',
    host: serverConfig.server.database.host,
    port: serverConfig.server.database.port,
    username: serverConfig.server.database.user,
    password: serverConfig.server.database.password,
    database: serverConfig.server.database.database,
    entities: [],
    synchronize: false,
    logging: false,
});

// export async function initializeDataSource(): Promise<void> {
//     try{
//         await dataSource.initialize();
//         log.info("Data Source has been initialized!");
//     } catch (error) {
//         log.error("Error during Data Source initialization:", error);
//         process.exit(1);
//     }
// }

export function initializeDataSource() {
    dataSource.initialize()
        .then(() => {
            log.info("Data Source has been initialized!");
        })
        .catch((error) => {
            log.error("Error during Data Source initialization:", error);
            process.exit(1);
        });
}

export function getDataSource(): DataSource {
    return dataSource;
}