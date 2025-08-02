import { 
  createBackendPlugin,
  coreServices,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

export const keninDutyBackendPlugin = createBackendPlugin({
  pluginId: 'keninduty',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.rootConfig,
      },
      async init({ httpRouter, logger, config }) {
        const router = await createRouter({
          logger,
          config,
        });
        httpRouter.use(router);
        logger.info('KeninDuty backend plugin initialized');
      },
    });
  },
});

export default keninDutyBackendPlugin; 