import { AppBootstrap } from './infrastructure/bootstrap/app.bootstrap';

const bootstrap = async (): Promise<void> => {
  try {
    console.log('Starting application bootstrap...');
    const app = new AppBootstrap();

    await app.initialize();
    await app.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

bootstrap();