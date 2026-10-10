
module.exports = {
  apps: [
    {
      name: "iconic-express-api",
      cwd: "/home/lokman/projects/ticketing-ovh/backend",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5501
      },
      autorestart: true,
      max_memory_restart: "512M",
      time: true
    }
  ]
};
