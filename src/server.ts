import 'reflect-metadata';
import { AppBootstrap } from './shared/infrastructure/bootstrap/app.bootstrap';
import { Container } from './shared/infrastructure/bootstrap/container';

const bootstrap = async (): Promise<void> => {
  try {
    console.log('Starting application bootstrap...');
    const container = new Container();
    await container.initiliaze();

    const app = new AppBootstrap(container.messageBus);

    await app.initialize();
    await app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

bootstrap();
