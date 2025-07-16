// Versão simplificada para funcionar no servidor Node.js
// const THREE = require('three'); // Removido para evitar problemas no servidor
// const { gsap } = require('gsap'); // Removido para evitar problemas no servidor
const { v4: uuidv4 } = require('uuid');

class VisualEffectsEngine {
    constructor() {
        this.isInitialized = false;
        this.effects = {};
        this.activeEffects = [];
        this.effectQueue = [];
        this.isProcessing = false;
        this.effectHistory = [];
    }

    async initialize() {
        try {
            // Carregar efeitos
            this.loadEffects();

            this.isInitialized = true;
            console.log('🎨 Motor de efeitos visuais inicializado (modo servidor)');
        } catch (error) {
            console.error('❌ Erro ao inicializar motor de efeitos:', error);
            throw error;
        }
    }

    loadEffects() {
        // Efeitos disponíveis (simulados no servidor)
        this.effects = {
            particleExplosion: this.createParticleExplosion.bind(this),
            rainbowTrail: this.createRainbowTrail.bind(this),
            starField: this.createStarField.bind(this),
            fireworks: this.createFireworks.bind(this),
            lightning: this.createLightning.bind(this),
            portal: this.createPortal.bind(this),
            hologram: this.createHologram.bind(this),
            matrix: this.createMatrix.bind(this),
            neon: this.createNeon.bind(this),
            cosmic: this.createCosmic.bind(this),
            like: this.createLikeEffect.bind(this),
            gift: this.createGiftEffect.bind(this),
            comment: this.createCommentEffect.bind(this),
            motion: this.createMotionEffect.bind(this)
        };
    }

    triggerEffect(effectType, data = {}) {
        const effectId = uuidv4();
        const effectData = {
            id: effectId,
            type: effectType,
            data: data,
            timestamp: Date.now(),
            duration: data.duration || 3000
        };

        this.effectQueue.push(effectData);
        this.effectHistory.push(effectData);

        // Manter apenas os últimos 100 efeitos
        if (this.effectHistory.length > 100) {
            this.effectHistory.shift();
        }

        if (!this.isProcessing) {
            this.processEffectQueue();
        }

        // Emitir evento via Socket.IO
        if (global.io) {
            global.io.emit('effect-triggered', {
                id: effectId,
                type: effectType,
                data: data,
                timestamp: Date.now()
            });
        }

        return effectId;
    }

    async processEffectQueue() {
        if (this.effectQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const effectData = this.effectQueue.shift();

        try {
            if (this.effects[effectData.type]) {
                await this.effects[effectData.type](effectData);
            } else {
                console.warn(`Efeito não encontrado: ${effectData.type}`);
            }
        } catch (error) {
            console.error('Erro ao processar efeito:', error);
        }

        // Processar próximo efeito
        setTimeout(() => this.processEffectQueue(), 100);
    }

    // Efeitos simulados (no servidor apenas registram o evento)
    async createParticleExplosion(effectData) {
        console.log('🎆 Efeito: Explosão de Partículas', effectData.data);
        await this.delay(100);
    }

    async createRainbowTrail(effectData) {
        console.log('🌈 Efeito: Trilha Arco-íris', effectData.data);
        await this.delay(100);
    }

    async createStarField(effectData) {
        console.log('⭐ Efeito: Campo de Estrelas', effectData.data);
        await this.delay(100);
    }

    async createFireworks(effectData) {
        console.log('🎇 Efeito: Fogos de Artifício', effectData.data);
        await this.delay(100);
    }

    async createLightning(effectData) {
        console.log('⚡ Efeito: Raio', effectData.data);
        await this.delay(100);
    }

    async createPortal(effectData) {
        console.log('🌀 Efeito: Portal', effectData.data);
        await this.delay(100);
    }

    async createHologram(effectData) {
        console.log('👁️ Efeito: Holograma', effectData.data);
        await this.delay(100);
    }

    async createMatrix(effectData) {
        console.log('💻 Efeito: Matrix', effectData.data);
        await this.delay(100);
    }

    async createNeon(effectData) {
        console.log('💡 Efeito: Neon', effectData.data);
        await this.delay(100);
    }

    async createCosmic(effectData) {
        console.log('🌌 Efeito: Cósmico', effectData.data);
        await this.delay(100);
    }

    // Efeitos específicos para interações
    async createLikeEffect(effectData) {
        console.log('❤️ Efeito: Like', effectData.data);
        await this.delay(50);
    }

    async createGiftEffect(effectData) {
        console.log('🎁 Efeito: Presente', effectData.data);
        await this.delay(200);
    }

    async createCommentEffect(effectData) {
        console.log('💬 Efeito: Comentário', effectData.data);
        await this.delay(50);
    }

    async createMotionEffect(effectData) {
        console.log('🎭 Efeito: Movimento', effectData.data);
        await this.delay(100);
    }

    getAvailableEffects() {
        return Object.keys(this.effects);
    }

    getEffectHistory() {
        return this.effectHistory;
    }

    getActiveEffects() {
        return this.activeEffects;
    }

    clearAllEffects() {
        this.effectQueue = [];
        this.activeEffects = [];
        console.log('🗑️ Todos os efeitos foram limpos');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = VisualEffectsEngine; 