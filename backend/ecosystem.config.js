module.exports = {
  apps: [{
    name: 'prantik-api',
    cwd: '/home/ubuntu/projects/ticketing/backend',
    script: './dist/index.js',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    kill_timeout: 5000,
    
    env: {
      NODE_ENV: 'production',
      PORT: 5501
    },

    error_file: '/home/ubuntu/.pm2/logs/prantik-api-error.log',
    out_file: '/home/ubuntu/.pm2/logs/prantik-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
