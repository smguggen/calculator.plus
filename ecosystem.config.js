module.exports = {
  apps : [{
    name: 'calculator.plus',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    cwd: '/var/www/calc/source/',
    exec_mode: "cluster"
  }],

  deploy : {
    production : {
      user : 'calc',
      host : ['167.99.152.26'],
      ref  : 'origin/master',
      repo : 'git@github.com:smguggen/calculator.plus.git',
      path : '/var/www/calc/',
      'post-deploy': 'npm install && npm run build && pm2 startOrRestart ./ecosystem.config.js',
      key  : '~/.ssh/id_rsa'
    }
  }
};
