import toml from 'toml';
import fs from 'fs';
import path from 'path';
import { Logger } from 'tslog';
import { z } from 'zod';

const Log = new Logger({ name: 'config_loader' });

const logConfigSchema = z.object({
    type: z.enum(['json', 'pretty', 'hidden']).default('pretty'),
    hide_log_position: z.boolean().default(false),
    min_level: z.string().default('info'),
    pretty_log_time_zone: z.enum(['UTC', 'local']).optional()
});

const databaseConfigSchema = z.object({
    driver: z.union([
        z.literal("mysql"), z.literal("postgres"), z.literal("cockroachdb"),
        z.literal("sap"), z.literal("mariadb"), z.literal("sqlite"),
        z.literal("cordova"), z.literal("react-native"), z.literal("nativescript"),
        z.literal("sqljs"), z.literal("oracle"), z.literal("mssql"),
        z.literal("mongodb"), z.literal("aurora-mysql"), z.literal("aurora-postgres"),
        z.literal("expo"), z.literal("better-sqlite3"), z.literal("capacitor"),
        z.literal("spanner")
    ]),
    host: z.string(),
    port: z.number().int().positive().default(3306),
    user: z.string(),
    password: z.string(),
    database: z.string()
});

const sslConfigSchema = z.object({
    key: z.string(),
    cert: z.string()
});

const baseConfigSchema = z.object({
    port: z.number().int().positive().default(3000),
    cors_origin: z.string().default("*"),
    mode: z.enum(['http', 'https']).default('http'),
    env: z.enum(['development', 'production', 'test']).default('development')
});

const rateConfigSchema = z.object({
    limit: z.number().int().positive().default(100),
    window_ms: z.number().int().positive().default(15)
});

const middlewaresConfigSchema = z.object({
    rate_limiter: z.boolean().default(true),
    helmet: z.boolean().default(true),
    request_logger: z.object({
        logger: z.boolean().default(true),
        slient: z.boolean().default(true)
    })
});

const serverConfigSchema = z.object({
    base: baseConfigSchema,
    rate: rateConfigSchema,
    ssl: sslConfigSchema,
    database: databaseConfigSchema,
    log: logConfigSchema.default({
        type: 'pretty',
        hide_log_position: false,
        min_level: 'info'
    })
});

const optionsConfigSchema = z.object({
    middlewares: middlewaresConfigSchema,
})

const configSchema = z.object({
    server: serverConfigSchema,
    options: optionsConfigSchema
});

type LogConfig = z.infer<typeof logConfigSchema>;
type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
type SSLConfig = z.infer<typeof sslConfigSchema>;
type RateConfig = z.infer<typeof rateConfigSchema>;
type BaseConfig = z.infer<typeof baseConfigSchema>;
type ServerConfig = z.infer<typeof serverConfigSchema>;
type Config = z.infer<typeof configSchema>;

const CONFIG_FILE = path.join(__dirname, 'config.toml');

const defaultConfigTemplate = `# Server Configuration

[server]

    [server.base]
    port = 3000
    cors_origin = "*"
    mode = "http" # or "https"
    env = "development" # "development", "production", or "test"

    [server.rate]
    limit = 100
    window_ms = 15

    [server.ssl]
    key = "path/to/private-key.pem"
    cert = "path/to/certificate.pem"

    [server.database]
    driver = "mysql" # or "postgresql", etc. via typeorm
    host = "localhost"
    port = 3306
    user = "your_username"
    password = "your_password"
    database = "your_database_name"

    [server.log]
    type = "pretty" # "json", "pretty", or "hidden"
    hide_log_position = false
    min_level = "info" # "trace", "debug", "info", "warn", "error", "fatal"
    pretty_log_time_zone = "local" # "UTC" or "local"

[options]

    [options.middlewares]
    rate_limiter = true
    helmet = true

    [options.middlewares.request_logger]
        logger = true
        slient = true
`;

let parsedConfig: any;

if (!fs.existsSync(CONFIG_FILE)) {
    Log.warn(`Config file not found. Creating template at ${CONFIG_FILE}`);
    try {
        fs.writeFileSync(CONFIG_FILE, defaultConfigTemplate, 'utf-8');
        Log.info('Default config template created. Please update it with your settings and restart the application.');
        process.exit(0);
    } catch (writeError) {
        Log.fatal(`Failed to create config template: ${writeError}`);
        process.exit(1);
    }
}

try {
    parsedConfig = toml.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
} catch (error) {
    Log.fatal(`Failed to parse config file: ${error}`);
    process.exit(1);
}

const result = configSchema.safeParse(parsedConfig);

if (!result.success) {
    Log.fatal('Configuration validation failed:');
    result.error.issues.forEach(issue => {
        Log.fatal(`- ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
}

const isHttpsMode = parsedConfig.server?.base?.mode === 'https';

const requiredCriticalPaths = [
    'server.database.driver',
    'server.database.host',
    'server.database.user',
    'server.database.password',
    'server.database.database',
    ...(isHttpsMode ? ['server.ssl.key', 'server.ssl.cert'] : [])
];

const missingCriticalItems: string[] = [];

function checkNestedProperty(obj: any, path: string): boolean {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
        if (current === undefined || current === null || !(part in current)) {
            return false;
        }
        current = current[part];
    }

    return true;
}

for (const path of requiredCriticalPaths) {
    if (!checkNestedProperty(parsedConfig, path)) {
        missingCriticalItems.push(path);
    }
}

if (missingCriticalItems.length > 0) {
    Log.fatal(`Missing critical configuration items: ${missingCriticalItems.join(', ')}`);
    Log.fatal('Application cannot start without these critical configuration items');
    process.exit(1);
}

export const serverConfig: Config = parsedConfig as Config;

Log.info('Configuration loaded successfully');