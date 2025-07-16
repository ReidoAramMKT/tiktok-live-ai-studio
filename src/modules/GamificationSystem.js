const { v4: uuidv4 } = require('uuid');

class GamificationSystem {
    constructor() {
        this.players = new Map();
        this.achievements = new Map();
        this.leaderboard = [];
        this.totalPoints = 0;
        this.sessionStart = Date.now();
        this.levelMultiplier = 1.5;
        this.pointDecay = 0.95; // Decaimento de pontos por hora
        this.callbacks = {
            levelUp: [],
            achievement: [],
            milestone: [],
            reward: []
        };
    }

    initialize() {
        this.setupAchievements();
        this.setupRewards();
        this.startPeriodicUpdates();
        console.log('🎮 Sistema de gamificação inicializado');
    }

    setupAchievements() {
        // Conquistas de engajamento
        this.achievements.set('first_comment', {
            id: 'first_comment',
            name: 'Primeiro Comentário',
            description: 'Recebeu o primeiro comentário da live',
            points: 50,
            icon: '💬',
            type: 'engagement'
        });

        this.achievements.set('first_like', {
            id: 'first_like',
            name: 'Primeiro Like',
            description: 'Recebeu o primeiro like da live',
            points: 25,
            icon: '❤️',
            type: 'engagement'
        });

        this.achievements.set('first_gift', {
            id: 'first_gift',
            name: 'Primeiro Presente',
            description: 'Recebeu o primeiro presente da live',
            points: 100,
            icon: '🎁',
            type: 'engagement'
        });

        // Conquistas de movimento
        this.achievements.set('motion_master', {
            id: 'motion_master',
            name: 'Mestre do Movimento',
            description: 'Detectou 100 movimentos',
            points: 200,
            icon: '🎯',
            type: 'motion',
            requirement: { type: 'motion_count', value: 100 }
        });

        this.achievements.set('dance_king', {
            id: 'dance_king',
            name: 'Rei da Dança',
            description: 'Detectou movimento por 5 minutos seguidos',
            points: 300,
            icon: '💃',
            type: 'motion',
            requirement: { type: 'motion_duration', value: 300000 }
        });

        // Conquistas de audiência
        this.achievements.set('crowd_gatherer', {
            id: 'crowd_gatherer',
            name: 'Reunidor de Multidões',
            description: 'Atingiu 50 espectadores simultâneos',
            points: 500,
            icon: '👥',
            type: 'audience',
            requirement: { type: 'viewer_count', value: 50 }
        });

        this.achievements.set('viral_sensation', {
            id: 'viral_sensation',
            name: 'Sensação Viral',
            description: 'Atingiu 1000 likes',
            points: 1000,
            icon: '🔥',
            type: 'engagement',
            requirement: { type: 'total_likes', value: 1000 }
        });

        // Conquistas de tempo
        this.achievements.set('marathon_runner', {
            id: 'marathon_runner',
            name: 'Corredor de Maratona',
            description: 'Ficou ao vivo por 1 hora',
            points: 400,
            icon: '⏰',
            type: 'time',
            requirement: { type: 'live_duration', value: 3600000 }
        });

        this.achievements.set('all_nighter', {
            id: 'all_nighter',
            name: 'Madrugador',
            description: 'Ficou ao vivo por 4 horas',
            points: 800,
            icon: '🌙',
            type: 'time',
            requirement: { type: 'live_duration', value: 14400000 }
        });

        // Conquistas especiais
        this.achievements.set('effect_master', {
            id: 'effect_master',
            name: 'Mestre dos Efeitos',
            description: 'Usou todos os tipos de efeitos visuais',
            points: 600,
            icon: '✨',
            type: 'special',
            requirement: { type: 'effects_used', value: 10 }
        });

        this.achievements.set('voice_artist', {
            id: 'voice_artist',
            name: 'Artista da Voz',
            description: 'Usou todas as vozes disponíveis',
            points: 400,
            icon: '🎤',
            type: 'special',
            requirement: { type: 'voices_used', value: 5 }
        });
    }

    setupRewards() {
        this.rewards = {
            level_5: {
                name: 'Efeito Especial Desbloqueado',
                description: 'Novo efeito visual disponível',
                type: 'effect',
                value: 'neon'
            },
            level_10: {
                name: 'Voz Premium',
                description: 'Nova voz AI disponível',
                type: 'voice',
                value: 'alien'
            },
            level_15: {
                name: 'Modo Holograma',
                description: 'Efeito holograma desbloqueado',
                type: 'effect',
                value: 'hologram'
            },
            level_20: {
                name: 'Voz de Monstro',
                description: 'Voz de monstro disponível',
                type: 'voice',
                value: 'monster'
            }
        };
    }

    addPoints(action, points, playerId = 'streamer') {
        const player = this.getOrCreatePlayer(playerId);
        const oldLevel = player.level;

        // Aplicar multiplicador de nível
        const levelMultiplier = 1 + (player.level * 0.1);
        const finalPoints = Math.floor(points * levelMultiplier);

        player.points += finalPoints;
        player.totalPoints += finalPoints;
        this.totalPoints += finalPoints;

        // Verificar level up
        const newLevel = this.calculateLevel(player.points);
        if (newLevel > oldLevel) {
            this.handleLevelUp(player, oldLevel, newLevel);
        }

        // Verificar conquistas
        this.checkAchievements(player, action, points);

        // Atualizar leaderboard
        this.updateLeaderboard();

        // Emitir evento
        this.emit('pointsAdded', {
            playerId,
            action,
            points: finalPoints,
            totalPoints: player.points,
            level: player.level
        });

        return {
            points: finalPoints,
            totalPoints: player.points,
            level: player.level,
            levelUp: newLevel > oldLevel
        };
    }

    getOrCreatePlayer(playerId) {
        if (!this.players.has(playerId)) {
            this.players.set(playerId, {
                id: playerId,
                points: 0,
                totalPoints: 0,
                level: 1,
                achievements: new Set(),
                joinDate: Date.now(),
                lastActivity: Date.now(),
                stats: {
                    comments: 0,
                    likes: 0,
                    gifts: 0,
                    motions: 0,
                    effects: 0,
                    voices: 0
                }
            });
        }
        return this.players.get(playerId);
    }

    calculateLevel(points) {
        return Math.floor(Math.sqrt(points / 100)) + 1;
    }

    handleLevelUp(player, oldLevel, newLevel) {
        player.level = newLevel;

        // Verificar recompensas de nível
        const reward = this.rewards[`level_${newLevel}`];
        if (reward) {
            player.rewards = player.rewards || [];
            player.rewards.push(reward);

            this.emit('reward', {
                playerId: player.id,
                reward: reward,
                level: newLevel
            });
        }

        this.emit('levelUp', {
            playerId: player.id,
            oldLevel: oldLevel,
            newLevel: newLevel,
            reward: reward
        });

        console.log(`🎉 ${player.id} subiu para o nível ${newLevel}!`);
    }

    checkAchievements(player, action, points) {
        this.achievements.forEach((achievement, achievementId) => {
            if (player.achievements.has(achievementId)) return;

            if (this.hasAchievementRequirement(player, achievement)) {
                this.unlockAchievement(player, achievement);
            }
        });
    }

    hasAchievementRequirement(player, achievement) {
        if (!achievement.requirement) return false;

        const { type, value } = achievement.requirement;

        switch (type) {
            case 'motion_count':
                return player.stats.motions >= value;
            case 'motion_duration':
                return this.getMotionDuration() >= value;
            case 'viewer_count':
                return this.getCurrentViewerCount() >= value;
            case 'total_likes':
                return player.stats.likes >= value;
            case 'live_duration':
                return Date.now() - this.sessionStart >= value;
            case 'effects_used':
                return player.stats.effects >= value;
            case 'voices_used':
                return player.stats.voices >= value;
            default:
                return false;
        }
    }

    unlockAchievement(player, achievement) {
        player.achievements.add(achievement.id);
        player.points += achievement.points;
        player.totalPoints += achievement.points;

        this.emit('achievement', {
            playerId: player.id,
            achievement: achievement,
            points: achievement.points
        });

        console.log(`🏆 ${player.id} desbloqueou: ${achievement.name}!`);
    }

    updateLeaderboard() {
        this.leaderboard = Array.from(this.players.values())
            .sort((a, b) => b.points - a.points)
            .slice(0, 10)
            .map((player, index) => ({
                ...player,
                rank: index + 1,
                achievements: Array.from(player.achievements)
            }));
    }

    getLeaderboard() {
        return this.leaderboard;
    }

    getPlayerStats(playerId) {
        const player = this.players.get(playerId);
        if (!player) return null;

        return {
            ...player,
            achievements: Array.from(player.achievements),
            nextLevelPoints: this.getNextLevelPoints(player.points),
            progressToNextLevel: this.getProgressToNextLevel(player.points)
        };
    }

    getNextLevelPoints(currentPoints) {
        const currentLevel = this.calculateLevel(currentPoints);
        const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
        return nextLevelPoints;
    }

    getProgressToNextLevel(currentPoints) {
        const currentLevel = this.calculateLevel(currentPoints);
        const currentLevelPoints = Math.pow(currentLevel - 1, 2) * 100;
        const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
        const progress = (currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints);
        return Math.min(1, Math.max(0, progress));
    }

    getTotalPoints() {
        return this.totalPoints;
    }

    getSessionStats() {
        const sessionDuration = Date.now() - this.sessionStart;
        const activePlayers = Array.from(this.players.values()).length;

        return {
            sessionDuration,
            totalPoints: this.totalPoints,
            activePlayers,
            topPlayer: this.leaderboard[0] || null,
            achievementsUnlocked: this.getTotalAchievementsUnlocked()
        };
    }

    getTotalAchievementsUnlocked() {
        let total = 0;
        this.players.forEach(player => {
            total += player.achievements.size;
        });
        return total;
    }

    // Métodos auxiliares (serão conectados com outros módulos)
    getMotionDuration() {
        // Será conectado com MotionDetector
        return 0;
    }

    getCurrentViewerCount() {
        // Será conectado com TikTokIntegration
        return 0;
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

        // Emitir via Socket.IO se disponível
        if (global.io) {
            global.io.emit(`gamification-${event}`, data);
        }
    }

    // Atualizações periódicas
    startPeriodicUpdates() {
        setInterval(() => {
            this.applyPointDecay();
            this.updateLeaderboard();
        }, 60000); // A cada minuto
    }

    applyPointDecay() {
        const decayFactor = Math.pow(this.pointDecay, 1 / 60); // Decaimento por minuto

        this.players.forEach(player => {
            player.points = Math.floor(player.points * decayFactor);
        });

        this.totalPoints = Array.from(this.players.values())
            .reduce((sum, player) => sum + player.points, 0);
    }

    // Métodos de reset e limpeza
    resetSession() {
        this.sessionStart = Date.now();
        this.totalPoints = 0;

        this.players.forEach(player => {
            player.points = 0;
            player.achievements.clear();
            player.rewards = [];
        });

        this.updateLeaderboard();
        console.log('🔄 Sessão de gamificação resetada');
    }

    clearAllData() {
        this.players.clear();
        this.leaderboard = [];
        this.totalPoints = 0;
        this.sessionStart = Date.now();
        console.log('🗑️ Todos os dados de gamificação limpos');
    }
}

module.exports = GamificationSystem; 