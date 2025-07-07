import { createKeninDutyServer } from './server';
import * as winston from 'winston';

async function main() {
  // Create logger
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: 'kenin-duty-api' },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  try {
    const app = await createKeninDutyServer(logger);
    
    // Configuração de porta - prioridade: KENINDUTY_PORT > PORT > 7007
    const port = process.env.KENINDUTY_PORT || process.env.PORT || 7007;
    
    app.listen(port, () => {
      logger.info(`🚀 KeninDuty API server running on port ${port}`);
      logger.info(`🏥 Health check: http://localhost:${port}/health`);
      logger.info(`🔗 API base: http://localhost:${port}/api/keninduty`);
      logger.info(`📚 Swagger UI: http://localhost:${port}/swagger/index.html`);
      logger.info(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start KeninDuty API server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
} 