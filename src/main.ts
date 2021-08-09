import consoleStamp from 'console-stamp';
import { agentConfig } from './config';
import { Agent } from './Agent';

consoleStamp(console, {
  format: ':date(yyyy-mm-dd HH:MM:ss.l)',
});

const agent = new Agent(agentConfig);
agent
  .main()
  .then(() => {
    console.log('initialized');
  })
  .catch((e) => {
    console.error(e);
  });
