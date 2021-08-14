// common package
import consoleStamp from 'console-stamp';
import * as dotenv from 'dotenv';
dotenv.config({ encoding: 'utf8' });

// app package
import { agentConfig } from './config/agent.config';
import { Agent } from './controller/Agent';

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
