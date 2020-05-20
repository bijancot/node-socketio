module.exports = {
  apps : [{
    name: 'Lets Connect',
    script: 'build/main.js',
    node_args : '-r dotenv/config',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '16G',
  }],
};
