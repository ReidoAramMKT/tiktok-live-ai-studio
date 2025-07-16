const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Importar módulos do sistema
const MotionDetector = require('./modules/MotionDetector');
const AIVoiceSynthesizer = require('./modules/AIVoiceSynthesizer');
const VisualEffectsEngine = require('./modules/VisualEffectsEngine');
const TikTokIntegration = require('./modules/TikTokIntegration');
const GamificationSystem = require('./modules/GamificationSystem');
const LiveAnalytics = require('./modules/LiveAnalytics');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar módulos
let motionDetector, voiceSynthesizer, visualEffects, tiktokIntegration, gamification, analytics;

try {
    motionDetector = new MotionDetector();
} catch (error) {
    console.warn('⚠️ MotionDetector não pôde ser inicializado:', error.message);
    motionDetector = null;
}

try {
    voiceSynthesizer = new AIVoiceSynthesizer();
} catch (error) {
    console.warn('⚠️ AIVoiceSynthesizer não pôde ser inicializado:', error.message);
    voiceSynthesizer = null;
}

try {
    visualEffects = new VisualEffectsEngine();
} catch (error) {
    console.warn('⚠️ VisualEffectsEngine não pôde ser inicializado:', error.message);
    visualEffects = null;
}

try {
    tiktokIntegration = new TikTokIntegration();
} catch (error) {
    console.warn('⚠️ TikTokIntegration não pôde ser inicializado:', error.message);
    tiktokIntegration = null;
}

try {
    gamification = new GamificationSystem();
} catch (error) {
    console.warn('⚠️ GamificationSystem não pôde ser inicializado:', error.message);
    gamification = null;
}

try {
    analytics = new LiveAnalytics();
} catch (error) {
    console.warn('⚠️ LiveAnalytics não pôde ser inicializado:', error.message);
    analytics = null;
}

// Configuração do Socket.IO
io.on('connection', (socket) => {
    console.log('🎥 Novo cliente conectado:', socket.id);

    // Eventos de movimento
    socket.on('motion-detected', (data) => {
        if (motionDetector) motionDetector.processMotion(data);
        if (visualEffects) visualEffects.triggerEffect('motion', data);
        if (gamification) gamification.addPoints('motion', 10);
    });

    // Eventos de interação do TikTok
    socket.on('tiktok-comment', (comment) => {
        if (voiceSynthesizer) voiceSynthesizer.speak(comment.text);
        if (visualEffects) visualEffects.triggerEffect('comment', comment);
        if (gamification) gamification.addPoints('comment', 5);
        if (analytics) analytics.trackComment(comment);
    });

    socket.on('tiktok-gift', (gift) => {
        if (visualEffects) visualEffects.triggerEffect('gift', gift);
        if (gamification) gamification.addPoints('gift', gift.value);
        if (analytics) analytics.trackGift(gift);
    });

    socket.on('tiktok-like', (like) => {
        if (visualEffects) visualEffects.triggerEffect('like', like);
        if (gamification) gamification.addPoints('like', 1);
        if (analytics) analytics.trackLike(like);
    });

    // Controle de efeitos
    socket.on('trigger-effect', (effectData) => {
        if (visualEffects) visualEffects.triggerEffect(effectData.type, effectData.params);
    });

    // Configurações de voz
    socket.on('voice-settings', (settings) => {
        if (voiceSynthesizer) voiceSynthesizer.updateSettings(settings);
    });

    // Desconexão
    socket.on('disconnect', () => {
        console.log('👋 Cliente desconectado:', socket.id);
    });
});

// Rotas da API
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        viewers: analytics ? analytics.getViewerCount() : 'N/A',
        totalLikes: analytics ? analytics.getTotalLikes() : 'N/A',
        totalGifts: analytics ? analytics.getTotalGifts() : 'N/A',
        points: gamification ? gamification.getTotalPoints() : 'N/A'
    });
});

app.get('/api/effects', (req, res) => {
    res.json(visualEffects ? visualEffects.getAvailableEffects() : []);
});

app.get('/api/analytics', (req, res) => {
    res.json(analytics ? analytics.getAnalytics() : []);
});

app.get('/api/leaderboard', (req, res) => {
    res.json(gamification ? gamification.getLeaderboard() : []);
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Rotas para Termos e Privacidade
app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/terms.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/privacy.html'));
});

// Inicializar sistema
async function initializeSystem() {
    try {
        if (motionDetector) await motionDetector.initialize();
        if (voiceSynthesizer) await voiceSynthesizer.initialize();
        if (visualEffects) await visualEffects.initialize();
        if (tiktokIntegration) await tiktokIntegration.initialize();

        console.log('🚀 TikTok Live AI Studio inicializado com sucesso!');
        console.log('📱 Acesse: http://localhost:3000');
        console.log('🎮 Sistema de gamificação ativo');
        console.log('🎨 Efeitos visuais carregados');
        console.log('🎤 Síntese de voz AI pronta');
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema:', error);
    }
}

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🎬 Servidor rodando na porta ${PORT}`);
    initializeSystem();
});

module.exports = { app, io }; 