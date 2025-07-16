// Remover dependência do tone.js para funcionar no servidor
// const Tone = require('tone');
const { v4: uuidv4 } = require('uuid');

class AIVoiceSynthesizer {
    constructor() {
        this.isInitialized = false;
        this.voices = {};
        this.currentVoice = 'default';
        this.settings = {
            volume: 0.7,
            rate: 1.0,
            pitch: 1.0,
            filter: 2000
        };
        this.speechQueue = [];
        this.isSpeaking = false;
        this.voicePersonalities = {};
    }

    async initialize() {
        try {
            // Inicializar vozes
            this.initializeVoices();

            this.isInitialized = true;
            console.log('🎤 Síntese de voz AI inicializada (modo simplificado)');
        } catch (error) {
            console.error('❌ Erro ao inicializar síntese de voz:', error);
            throw error;
        }
    }

    initializeVoices() {
        // Voz padrão
        this.voices.default = {
            name: 'Default',
            pitch: 1.0,
            rate: 1.0,
            filter: 2000,
            effects: ['reverb']
        };

        // Voz de robô
        this.voices.robot = {
            name: 'Robot',
            pitch: 0.8,
            rate: 0.9,
            filter: 1500,
            effects: ['distortion', 'filter']
        };

        // Voz de criança
        this.voices.child = {
            name: 'Child',
            pitch: 1.3,
            rate: 1.2,
            filter: 3000,
            effects: ['reverb']
        };

        // Voz de monstro
        this.voices.monster = {
            name: 'Monster',
            pitch: 0.6,
            rate: 0.7,
            filter: 800,
            effects: ['distortion', 'reverb']
        };

        // Voz de alienígena
        this.voices.alien = {
            name: 'Alien',
            pitch: 1.5,
            rate: 0.8,
            filter: 4000,
            effects: ['filter', 'reverb']
        };

        // Personalidades de voz
        this.voicePersonalities = {
            excited: {
                pitch: 1.2,
                rate: 1.3,
                volume: 0.9
            },
            calm: {
                pitch: 0.9,
                rate: 0.8,
                volume: 0.6
            },
            mysterious: {
                pitch: 0.7,
                rate: 0.6,
                volume: 0.5
            },
            energetic: {
                pitch: 1.1,
                rate: 1.4,
                volume: 0.8
            }
        };
    }

    async speak(text, options = {}) {
        if (!this.isInitialized) {
            throw new Error('Sintetizador não inicializado');
        }

        const speechId = uuidv4();
        const speechData = {
            id: speechId,
            text: text,
            voice: options.voice || this.currentVoice,
            personality: options.personality || 'default',
            priority: options.priority || 'normal',
            timestamp: Date.now()
        };

        // Adicionar à fila
        this.speechQueue.push(speechData);

        // Ordenar por prioridade
        this.speechQueue.sort((a, b) => {
            const priorityOrder = { high: 3, normal: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        // Processar fila
        if (!this.isSpeaking) {
            this.processSpeechQueue();
        }

        return speechId;
    }

    async processSpeechQueue() {
        if (this.speechQueue.length === 0) {
            this.isSpeaking = false;
            return;
        }

        this.isSpeaking = true;
        const speechData = this.speechQueue.shift();

        try {
            await this.synthesizeSpeech(speechData);
        } catch (error) {
            console.error('Erro na síntese de fala:', error);
        }

        // Processar próximo item da fila
        setTimeout(() => this.processSpeechQueue(), 100);
    }

    async synthesizeSpeech(speechData) {
        const voice = this.voices[speechData.voice] || this.voices.default;
        const personality = this.voicePersonalities[speechData.personality] || {};

        // Aplicar configurações de voz
        const settings = {
            pitch: personality.pitch || voice.pitch || this.settings.pitch,
            rate: personality.rate || voice.rate || this.settings.rate,
            volume: personality.volume || this.settings.volume,
            filter: voice.filter || this.settings.filter
        };

        // Simular síntese de fala (em produção, usar Web Speech API no frontend)
        console.log(`🎤 [${voice.name}] ${speechData.text}`);

        // Simular tempo de fala baseado no comprimento do texto
        const speechDuration = speechData.text.length * 50; // 50ms por caractere
        await this.delay(speechDuration);

        // Emitir evento de conclusão
        this.emitSpeechComplete(speechData);
    }

    emitSpeechComplete(speechData) {
        // Emitir via Socket.IO se disponível
        if (global.io) {
            global.io.emit('speech-complete', {
                id: speechData.id,
                text: speechData.text,
                voice: speechData.voice,
                timestamp: Date.now()
            });
        }
    }

    setVoice(voiceName) {
        if (this.voices[voiceName]) {
            this.currentVoice = voiceName;
            console.log(`🎤 Voz alterada para: ${this.voices[voiceName].name}`);
        }
    }

    setPersonality(personalityName) {
        if (this.voicePersonalities[personalityName]) {
            console.log(`🎭 Personalidade alterada para: ${personalityName}`);
        }
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
    }

    getAvailableVoices() {
        return Object.keys(this.voices);
    }

    getAvailablePersonalities() {
        return Object.keys(this.voicePersonalities);
    }

    clearQueue() {
        this.speechQueue = [];
        this.isSpeaking = false;
    }

    stopSpeaking() {
        this.isSpeaking = false;
        this.clearQueue();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async speakComment(comment) {
        const voice = this.currentVoice;
        const personality = 'excited';

        return await this.speak(comment.text, {
            voice: voice,
            personality: personality,
            priority: 'high'
        });
    }

    async speakGift(gift) {
        const voice = this.currentVoice;
        const personality = 'energetic';

        const message = `Obrigado pelo presente ${gift.name}!`;
        return await this.speak(message, {
            voice: voice,
            personality: personality,
            priority: 'high'
        });
    }

    async speakMilestone(milestone) {
        const voice = this.currentVoice;
        const personality = 'excited';

        const message = `Incrível! Alcançamos ${milestone.type}: ${milestone.value}!`;
        return await this.speak(message, {
            voice: voice,
            personality: personality,
            priority: 'high'
        });
    }
}

module.exports = AIVoiceSynthesizer; 