module.exports = {
    apps: [
        {
            name: 'tiktok-live-ai-studio',
            script: 'src/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
                PORT: 3000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            // Configurações de monitoramento
            watch: false,
            max_memory_restart: '1G',
            min_uptime: '10s',
            max_restarts: 10,

            // Configurações de log
            log_file: './logs/combined.log',
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

            // Configurações de restart
            autorestart: true,
            restart_delay: 4000,

            // Configurações de cluster
            kill_timeout: 5000,
            listen_timeout: 3000,

            // Configurações de health check
            health_check_grace_period: 3000,

            // Variáveis de ambiente específicas
            env_file: '.env'
        }
    ],

    deploy: {
        production: {
            user: 'deploy',
            host: 'your-server.com',
            ref: 'origin/main',
            repo: 'git@github.com:seu-usuario/tiktok-live-ai-studio.git',
            path: '/var/www/tiktok-live-ai-studio',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
}; 