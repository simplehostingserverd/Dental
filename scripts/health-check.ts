/**
 * CLI script to check application health status
 * Useful for CI/CD pipelines and monitoring
 */

import fetch from 'node-fetch';
import chalk from 'chalk';

const baseUrl = process.env.APP_URL || 'http://localhost:3000';
const healthEndpoint = `${baseUrl}/api/health`;

async function checkHealth() {
  try {
    console.log(chalk.blue('Checking application health...'));
    
    const start = Date.now();
    const response = await fetch(healthEndpoint);
    const responseTime = Date.now() - start;
    
    const health = await response.json();
    
    if (health.status === 'ok') {
      console.log(
        chalk.green('✓ Application is healthy'),
        chalk.gray(`(${responseTime}ms)`)
      );
      
      console.log(chalk.gray('Environment:'), chalk.cyan(health.environment));
      console.log(chalk.gray('Version:'), chalk.cyan(health.version));
      console.log(chalk.gray('Uptime:'), chalk.cyan(`${health.uptime}s`));
      
      console.log('\nServices:');
      
      // Database status
      if (health.services.database.status === 'ok') {
        console.log(
          chalk.green('✓ Database:'),
          chalk.gray(`${health.services.database.latency}ms`)
        );
      } else {
        console.log(chalk.red('✗ Database: error'));
      }
      
      // API status
      if (health.services.api.status === 'ok') {
        console.log(chalk.green('✓ API'));
      } else {
        console.log(chalk.red('✗ API: error'));
      }
      
      process.exit(0);
    } else {
      console.log(chalk.red(`✗ Application health check failed: ${health.status}`));
      
      if (health.services) {
        console.log('\nServices:');
        
        // Database status
        if (health.services.database && health.services.database.status !== 'ok') {
          console.log(chalk.red('✗ Database: error'));
        }
        
        // API status
        if (health.services.api && health.services.api.status !== 'ok') {
          console.log(chalk.red('✗ API: error'));
        }
      }
      
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('Health check failed:'), error);
    process.exit(1);
  }
}

checkHealth();