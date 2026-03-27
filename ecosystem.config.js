// PM2 Ecosystem — ORION Mintaka/Naledi
export default {
  apps: [
    {
      name: 'mintaka',
      script: 'index.js',
      watch: false,
      autorestart: true,
      restart_delay: 5000,   // Wait 5s before restart
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      merge_logs: true,
    },
  ],
}
