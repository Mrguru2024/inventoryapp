type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`ℹ️ [INFO] ${message}`, data || '');
    }
  },
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ [WARN] ${message}`, data || '');
  },
  error: (message: string, error?: any) => {
    console.error(`🔴 [ERROR] ${message}`, error || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`🔧 [DEBUG] ${message}`, data || '');
    }
  }
};

export default logger; 