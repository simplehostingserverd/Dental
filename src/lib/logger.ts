/**
 * Centralized logging system for the application
 * Provides structured logging with different log levels and context
 */

import { isProduction } from "@/env";

export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: unknown;
}

class Logger {
  private minLevel: LogLevel;
  
  constructor() {
    // In production, only log warnings and errors by default
    this.minLevel = isProduction ? LogLevel.WARN : LogLevel.DEBUG;
  }

  /**
   * Set the minimum log level
   */
  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  /**
   * Log an error message
   */
  public error(message: string, context?: LogContext, error?: unknown): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a warning message
   */
  public warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an info message
   */
  public info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a debug message
   */
  public debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log a message with the specified level
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
    // Skip logging if below minimum level
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    this.writeLog(logEntry);
  }

  /**
   * Check if the given log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const minLevelIndex = levels.indexOf(this.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex <= minLevelIndex;
  }

  /**
   * Write the log entry to the appropriate output
   */
  private writeLog(entry: LogEntry): void {
    if (isProduction) {
      // In production, format logs for easier parsing
      const output = JSON.stringify(entry);
      
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(output);
          break;
        case LogLevel.WARN:
          console.warn(output);
          break;
        case LogLevel.INFO:
          console.info(output);
          break;
        case LogLevel.DEBUG:
          console.debug(output);
          break;
      }
    } else {
      // In development, format logs for better readability
      const timestamp = `[${entry.timestamp.split('T')[1]?.split('.')[0] || 'unknown'}]`;
      const level = `[${entry.level.toUpperCase()}]`;
      const message = entry.message;
      
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(timestamp, level, message);
          if (entry.context) console.error("Context:", entry.context);
          if (entry.error) console.error("Error:", entry.error);
          break;
        case LogLevel.WARN:
          console.warn(timestamp, level, message);
          if (entry.context) console.warn("Context:", entry.context);
          break;
        case LogLevel.INFO:
          console.info(timestamp, level, message);
          if (entry.context) console.info("Context:", entry.context);
          break;
        case LogLevel.DEBUG:
          console.debug(timestamp, level, message);
          if (entry.context) console.debug("Context:", entry.context);
          break;
      }
    }
  }
}

// Singleton logger instance
export const logger = new Logger();