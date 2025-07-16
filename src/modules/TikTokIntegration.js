const WebSocket = require('ws');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

class TikTokIntegration {
    constructor() {
        this.isConnected = false;
        this.ws = null;
        this.roomId = null;
        this.sessionId = null;
        this.viewerCount = 0;
        this.totalLikes = 0;
        this.totalGifts = 0;
        this.comments = [];
        this.gifts = [];
        this.likes = [];
        this.callbacks = {
            comment: [],
            gift: [],
            like: [],
            follow: [],
            share: [],
            join: []
        };
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000;
    }

    async initialize() {
        try {
            console.log('📱 Inicializando integração com TikTok...');

            // Configurar listeners de eventos
            this.setupEventListeners();

            this.isInitialized = true;
            console.log('✅ Integração com TikTok inicializada');
        } catch (error) {
            console.error('❌ Erro ao inicializar integração TikTok:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Eventos de comentário
        this.on('comment', (comment) => {
            this.comments.push(comment);
            if (this.comments.length > 100) {
                this.comments.shift();
            }

            // Emitir via Socket.IO
            if (global.io) {
                global.io.emit('tiktok-comment', comment);
            }
        });

        // Eventos de presente
        this.on('gift', (gift) => {
            this.gifts.push(gift);
            this.totalGifts += gift.value;

            if (this.gifts.length > 50) {
                this.gifts.shift();
            }

            // Emitir via Socket.IO
            if (global.io) {
                global.io.emit('tiktok-gift', gift);
            }
        });

        // Eventos de like
        this.on('like', (like) => {
            this.likes.push(like);
            this.totalLikes += like.count;

            if (this.likes.length > 200) {
                this.likes.shift();
            }

            // Emitir via Socket.IO
            if (global.io) {
                global.io.emit('tiktok-like', like);
            }
        });
    }

    async connectToRoom(roomId) {
        try {
            this.roomId = roomId;
            console.log(`🎬 Conectando à sala: ${roomId}`);

            // Simular conexão WebSocket (em produção, usar API real do TikTok)
            await this.simulateConnection();

            this.isConnected = true;
            this.reconnectAttempts = 0;
            console.log('✅ Conectado à sala do TikTok');

            // Iniciar simulação de eventos
            this.startEventSimulation();

        } catch (error) {
            console.error('❌ Erro ao conectar à sala:', error);
            this.handleReconnect();
        }
    }

    async simulateConnection() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.sessionId = uuidv4();
                resolve();
            }, 1000);
        });
    }

    startEventSimulation() {
        if (!this.isConnected) return;

        // Simular comentários
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.simulateComment();
            }
        }, 2000);

        // Simular likes
        setInterval(() => {
            if (Math.random() > 0.5) {
                this.simulateLike();
            }
        }, 1000);

        // Simular presentes
        setInterval(() => {
            if (Math.random() > 0.9) {
                this.simulateGift();
            }
        }, 5000);

        // Simular mudanças no número de espectadores
        setInterval(() => {
            this.simulateViewerChange();
        }, 3000);
    }

    simulateComment() {
        const comments = [
            "Que legal! 🔥",
            "Incrível! 👏",
            "Show de bola! ⭐",
            "Muito bom! 💯",
            "Amei! ❤️",
            "Demais! 🚀",
            "Fantástico! 🌟",
            "Perfeito! ✨",
            "Sensacional! 🎉",
            "Maravilhoso! 🌈"
        ];

        const users = [
            "user123", "tiktoker456", "live_fan789", "stream_lover",
            "content_creator", "social_media", "digital_nomad", "tech_enthusiast",
            "creative_mind", "innovation_lover", "future_now", "trend_setter"
        ];

        const comment = {
            id: uuidv4(),
            author: users[Math.floor(Math.random() * users.length)],
            text: comments[Math.floor(Math.random() * comments.length)],
            timestamp: Date.now(),
            type: 'comment'
        };

        this.emit('comment', comment);
    }

    simulateLike() {
        const like = {
            id: uuidv4(),
            count: Math.floor(Math.random() * 10) + 1,
            timestamp: Date.now(),
            type: 'like'
        };

        this.emit('like', like);
    }

    simulateGift() {
        const gifts = [
            { name: "Rose", value: 1, icon: "🌹" },
            { name: "Heart", value: 5, icon: "💖" },
            { name: "Diamond", value: 10, icon: "💎" },
            { name: "Crown", value: 50, icon: "👑" },
            { name: "Rocket", value: 100, icon: "🚀" },
            { name: "Unicorn", value: 200, icon: "🦄" },
            { name: "Galaxy", value: 500, icon: "🌌" },
            { name: "Dragon", value: 1000, icon: "🐉" }
        ];

        const users = [
            "generous_fan", "big_spender", "vip_viewer", "premium_user",
            "diamond_member", "crown_holder", "rocket_launcher", "unicorn_lover"
        ];

        const gift = {
            id: uuidv4(),
            sender: users[Math.floor(Math.random() * users.length)],
            ...gifts[Math.floor(Math.random() * gifts.length)],
            timestamp: Date.now(),
            type: 'gift'
        };

        this.emit('gift', gift);
    }

    simulateViewerChange() {
        const change = (Math.random() - 0.5) * 20;
        this.viewerCount = Math.max(0, this.viewerCount + change);

        if (global.io) {
            global.io.emit('viewer-count', { count: Math.floor(this.viewerCount) });
        }
    }

    disconnect() {
        this.isConnected = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        console.log('🔌 Desconectado do TikTok');
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Tentativa de reconexão ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

            setTimeout(() => {
                if (this.roomId) {
                    this.connectToRoom(this.roomId);
                }
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Máximo de tentativas de reconexão atingido');
        }
    }

    // Sistema de eventos
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    off(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
        }
    }

    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erro no callback do evento ${event}:`, error);
                }
            });
        }
    }

    // Métodos de análise
    getAnalytics() {
        return {
            viewerCount: Math.floor(this.viewerCount),
            totalLikes: this.totalLikes,
            totalGifts: this.totalGifts,
            totalComments: this.comments.length,
            recentComments: this.comments.slice(-10),
            recentGifts: this.gifts.slice(-5),
            recentLikes: this.likes.slice(-20),
            isConnected: this.isConnected,
            sessionId: this.sessionId
        };
    }

    getTopGifters() {
        const gifters = {};

        this.gifts.forEach(gift => {
            if (gifters[gift.sender]) {
                gifters[gift.sender] += gift.value;
            } else {
                gifters[gift.sender] = gift.value;
            }
        });

        return Object.entries(gifters)
            .map(([sender, value]) => ({ sender, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }

    getTopCommenters() {
        const commenters = {};

        this.comments.forEach(comment => {
            commenters[comment.author] = (commenters[comment.author] || 0) + 1;
        });

        return Object.entries(commenters)
            .map(([author, count]) => ({ author, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }

    // Métodos de interação
    sendMessage(message) {
        if (!this.isConnected) {
            console.warn('⚠️ Não conectado ao TikTok');
            return false;
        }

        // Em produção, enviar mensagem real para o TikTok
        console.log(`💬 Mensagem enviada: ${message}`);
        return true;
    }

    // Métodos de configuração
    setAutoResponse(enabled, responses = []) {
        this.autoResponse = {
            enabled,
            responses: responses.length > 0 ? responses : [
                "Obrigado pelo comentário! 😊",
                "Que legal! 👏",
                "Valeu! 🙏",
                "Show! 🔥",
                "Incrível! ⭐"
            ]
        };
    }

    // Métodos de gamificação
    getMilestones() {
        const milestones = [
            { type: '100_likes', target: 100, achieved: this.totalLikes >= 100 },
            { type: '500_likes', target: 500, achieved: this.totalLikes >= 500 },
            { type: '1000_likes', target: 1000, achieved: this.totalLikes >= 1000 },
            { type: '10_gifts', target: 10, achieved: this.totalGifts >= 10 },
            { type: '50_gifts', target: 50, achieved: this.totalGifts >= 50 },
            { type: '100_gifts', target: 100, achieved: this.totalGifts >= 100 },
            { type: '50_viewers', target: 50, achieved: this.viewerCount >= 50 },
            { type: '100_viewers', target: 100, achieved: this.viewerCount >= 100 }
        ];

        return milestones.filter(m => !m.achieved);
    }

    checkMilestones() {
        const milestones = this.getMilestones();
        const newlyAchieved = milestones.filter(m => m.achieved);

        newlyAchieved.forEach(milestone => {
            if (global.io) {
                global.io.emit('milestone-achieved', milestone);
            }
        });

        return newlyAchieved;
    }
}

module.exports = TikTokIntegration; 