const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

class LiveAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.metrics = {
            viewerCount: 0,
            peakViewers: 0,
            totalLikes: 0,
            totalGifts: 0,
            totalComments: 0,
            totalShares: 0,
            totalFollows: 0,
            totalJoins: 0,
            averageWatchTime: 0,
            engagementRate: 0
        };

        this.realTimeData = {
            viewerHistory: [],
            likeHistory: [],
            giftHistory: [],
            commentHistory: [],
            engagementHistory: []
        };

        this.events = [];
        this.heatmap = new Map();
        this.performance = {
            fps: 0,
            latency: 0,
            quality: 'high'
        };

        this.callbacks = {
            milestone: [],
            alert: [],
            report: []
        };

        this.milestones = [
            { type: 'viewers', value: 10, achieved: false },
            { type: 'viewers', value: 50, achieved: false },
            { type: 'viewers', value: 100, achieved: false },
            { type: 'viewers', value: 500, achieved: false },
            { type: 'viewers', value: 1000, achieved: false },
            { type: 'likes', value: 100, achieved: false },
            { type: 'likes', value: 500, achieved: false },
            { type: 'likes', value: 1000, achieved: false },
            { type: 'likes', value: 5000, achieved: false },
            { type: 'gifts', value: 10, achieved: false },
            { type: 'gifts', value: 50, achieved: false },
            { type: 'gifts', value: 100, achieved: false },
            { type: 'gifts', value: 500, achieved: false }
        ];
    }

    initialize() {
        this.startDataCollection();
        this.startPeriodicAnalysis();
        console.log('📊 Sistema de analytics inicializado');
    }

    startDataCollection() {
        // Coletar dados a cada segundo
        setInterval(() => {
            this.collectRealTimeData();
        }, 1000);

        // Análise detalhada a cada 5 minutos
        setInterval(() => {
            this.performDetailedAnalysis();
        }, 300000);
    }

    startPeriodicAnalysis() {
        // Verificar marcos a cada 30 segundos
        setInterval(() => {
            this.checkMilestones();
        }, 30000);

        // Gerar relatório a cada hora
        setInterval(() => {
            this.generateHourlyReport();
        }, 3600000);
    }

    collectRealTimeData() {
        const timestamp = Date.now();

        // Adicionar dados ao histórico
        this.realTimeData.viewerHistory.push({
            timestamp,
            count: this.metrics.viewerCount
        });

        this.realTimeData.likeHistory.push({
            timestamp,
            count: this.metrics.totalLikes
        });

        this.realTimeData.giftHistory.push({
            timestamp,
            count: this.metrics.totalGifts
        });

        this.realTimeData.commentHistory.push({
            timestamp,
            count: this.metrics.totalComments
        });

        // Manter apenas os últimos 3600 pontos (1 hora de dados)
        const maxHistoryLength = 3600;
        Object.keys(this.realTimeData).forEach(key => {
            if (this.realTimeData[key].length > maxHistoryLength) {
                this.realTimeData[key] = this.realTimeData[key].slice(-maxHistoryLength);
            }
        });

        // Calcular taxa de engajamento
        this.calculateEngagementRate();
    }

    calculateEngagementRate() {
        const totalInteractions = this.metrics.totalLikes + this.metrics.totalGifts + this.metrics.totalComments;
        const totalViews = this.metrics.viewerCount || 1;

        this.metrics.engagementRate = (totalInteractions / totalViews) * 100;

        this.realTimeData.engagementHistory.push({
            timestamp: Date.now(),
            rate: this.metrics.engagementRate
        });
    }

    trackViewerCount(count) {
        this.metrics.viewerCount = count;

        if (count > this.metrics.peakViewers) {
            this.metrics.peakViewers = count;
            this.emit('peak-viewers', { count, timestamp: Date.now() });
        }
    }

    trackLike(likeData) {
        this.metrics.totalLikes += likeData.count || 1;
        this.addEvent('like', likeData);
    }

    trackGift(giftData) {
        this.metrics.totalGifts += giftData.value || 1;
        this.addEvent('gift', giftData);
    }

    trackComment(commentData) {
        this.metrics.totalComments += 1;
        this.addEvent('comment', commentData);
    }

    trackShare(shareData) {
        this.metrics.totalShares += 1;
        this.addEvent('share', shareData);
    }

    trackFollow(followData) {
        this.metrics.totalFollows += 1;
        this.addEvent('follow', followData);
    }

    trackJoin(joinData) {
        this.metrics.totalJoins += 1;
        this.addEvent('join', joinData);
    }

    addEvent(type, data) {
        const event = {
            id: uuidv4(),
            type,
            data,
            timestamp: Date.now()
        };

        this.events.push(event);

        // Manter apenas os últimos 1000 eventos
        if (this.events.length > 1000) {
            this.events = this.events.slice(-1000);
        }
    }

    checkMilestones() {
        this.milestones.forEach(milestone => {
            if (!milestone.achieved) {
                const currentValue = this.metrics[milestone.type];

                if (currentValue >= milestone.value) {
                    milestone.achieved = true;
                    milestone.achievedAt = Date.now();

                    this.emit('milestone', {
                        type: milestone.type,
                        value: milestone.value,
                        achievedAt: milestone.achievedAt
                    });

                    console.log(`🎯 Marco atingido: ${milestone.value} ${milestone.type}!`);
                }
            }
        });
    }

    performDetailedAnalysis() {
        const analysis = {
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.sessionStart,
            viewerGrowth: this.calculateViewerGrowth(),
            engagementTrend: this.calculateEngagementTrend(),
            peakHours: this.findPeakHours(),
            topPerformers: this.getTopPerformers(),
            recommendations: this.generateRecommendations()
        };

        this.emit('analysis', analysis);
        return analysis;
    }

    calculateViewerGrowth() {
        if (this.realTimeData.viewerHistory.length < 2) return 0;

        const recent = this.realTimeData.viewerHistory.slice(-10);
        const older = this.realTimeData.viewerHistory.slice(-20, -10);

        const recentAvg = recent.reduce((sum, item) => sum + item.count, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.count, 0) / older.length;

        return olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    }

    calculateEngagementTrend() {
        if (this.realTimeData.engagementHistory.length < 10) return 'stable';

        const recent = this.realTimeData.engagementHistory.slice(-5);
        const older = this.realTimeData.engagementHistory.slice(-10, -5);

        const recentAvg = recent.reduce((sum, item) => sum + item.rate, 0) / recent.length;
        const olderAvg = older.reduce((sum, item) => sum + item.rate, 0) / older.length;

        if (recentAvg > olderAvg * 1.1) return 'increasing';
        if (recentAvg < olderAvg * 0.9) return 'decreasing';
        return 'stable';
    }

    findPeakHours() {
        const hourlyData = new Array(24).fill(0);
        const hourlyCount = new Array(24).fill(0);

        this.realTimeData.viewerHistory.forEach(item => {
            const hour = new Date(item.timestamp).getHours();
            hourlyData[hour] += item.count;
            hourlyCount[hour]++;
        });

        const hourlyAverages = hourlyData.map((sum, hour) => ({
            hour,
            average: hourlyCount[hour] > 0 ? sum / hourlyCount[hour] : 0
        }));

        return hourlyAverages
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);
    }

    getTopPerformers() {
        const performers = {
            commenters: {},
            gifters: {},
            likers: {}
        };

        this.events.forEach(event => {
            switch (event.type) {
                case 'comment':
                    const author = event.data.author;
                    performers.commenters[author] = (performers.commenters[author] || 0) + 1;
                    break;
                case 'gift':
                    const sender = event.data.sender;
                    performers.gifters[sender] = (performers.gifters[sender] || 0) + (event.data.value || 1);
                    break;
                case 'like':
                    // Likes são anônimos, não há performers específicos
                    break;
            }
        });

        return {
            topCommenters: Object.entries(performers.commenters)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count })),
            topGifters: Object.entries(performers.gifters)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, value]) => ({ name, value }))
        };
    }

    generateRecommendations() {
        const recommendations = [];

        // Recomendações baseadas em engajamento
        if (this.metrics.engagementRate < 5) {
            recommendations.push({
                type: 'engagement',
                priority: 'high',
                message: 'Taxa de engajamento baixa. Tente interagir mais com a audiência.',
                action: 'increase_interaction'
            });
        }

        // Recomendações baseadas em crescimento
        const viewerGrowth = this.calculateViewerGrowth();
        if (viewerGrowth < -10) {
            recommendations.push({
                type: 'growth',
                priority: 'high',
                message: 'Audiência diminuindo. Considere mudar o conteúdo ou horário.',
                action: 'content_strategy'
            });
        }

        // Recomendações baseadas em tempo
        const sessionDuration = Date.now() - this.sessionStart;
        if (sessionDuration > 7200000 && this.metrics.viewerCount > 50) { // 2 horas
            recommendations.push({
                type: 'timing',
                priority: 'medium',
                message: 'Live longa com boa audiência. Considere fazer uma pausa.',
                action: 'take_break'
            });
        }

        return recommendations;
    }

    generateHourlyReport() {
        const report = {
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.sessionStart,
            metrics: { ...this.metrics },
            milestones: this.milestones.filter(m => m.achieved),
            analysis: this.performDetailedAnalysis(),
            recommendations: this.generateRecommendations()
        };

        this.emit('hourly-report', report);
        console.log('📋 Relatório horário gerado');

        return report;
    }

    getAnalytics() {
        return {
            current: {
                viewerCount: this.metrics.viewerCount,
                totalLikes: this.metrics.totalLikes,
                totalGifts: this.metrics.totalGifts,
                totalComments: this.metrics.totalComments,
                engagementRate: this.metrics.engagementRate,
                sessionDuration: Date.now() - this.sessionStart
            },
            historical: {
                peakViewers: this.metrics.peakViewers,
                viewerHistory: this.realTimeData.viewerHistory.slice(-60), // Últimos 60 segundos
                engagementHistory: this.realTimeData.engagementHistory.slice(-60)
            },
            milestones: this.milestones.filter(m => m.achieved),
            performance: this.performance
        };
    }

    getViewerCount() {
        return this.metrics.viewerCount;
    }

    getTotalLikes() {
        return this.metrics.totalLikes;
    }

    getTotalGifts() {
        return this.metrics.totalGifts;
    }

    getSessionDuration() {
        return Date.now() - this.sessionStart;
    }

    getEngagementRate() {
        return this.metrics.engagementRate;
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
            global.io.emit(`analytics-${event}`, data);
        }
    }

    // Métodos de exportação
    exportData(format = 'json') {
        const data = {
            session: {
                start: this.sessionStart,
                end: Date.now(),
                duration: Date.now() - this.sessionStart
            },
            metrics: this.metrics,
            events: this.events,
            milestones: this.milestones,
            realTimeData: this.realTimeData
        };

        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'csv':
                return this.convertToCSV(data);
            default:
                return data;
        }
    }

    convertToCSV(data) {
        // Implementação básica de conversão para CSV
        const headers = ['timestamp', 'viewer_count', 'total_likes', 'total_gifts', 'engagement_rate'];
        const rows = this.realTimeData.viewerHistory.map(item => {
            const likeData = this.realTimeData.likeHistory.find(l => l.timestamp === item.timestamp);
            const giftData = this.realTimeData.giftHistory.find(g => g.timestamp === item.timestamp);
            const engagementData = this.realTimeData.engagementHistory.find(e => e.timestamp === item.timestamp);

            return [
                new Date(item.timestamp).toISOString(),
                item.count,
                likeData ? likeData.count : 0,
                giftData ? giftData.count : 0,
                engagementData ? engagementData.rate.toFixed(2) : 0
            ].join(',');
        });

        return [headers.join(','), ...rows].join('\n');
    }

    // Métodos de reset
    resetSession() {
        this.sessionStart = Date.now();
        this.metrics = {
            viewerCount: 0,
            peakViewers: 0,
            totalLikes: 0,
            totalGifts: 0,
            totalComments: 0,
            totalShares: 0,
            totalFollows: 0,
            totalJoins: 0,
            averageWatchTime: 0,
            engagementRate: 0
        };

        this.realTimeData = {
            viewerHistory: [],
            likeHistory: [],
            giftHistory: [],
            commentHistory: [],
            engagementHistory: []
        };

        this.events = [];
        this.milestones.forEach(m => {
            m.achieved = false;
            m.achievedAt = null;
        });

        console.log('🔄 Analytics resetado para nova sessão');
    }
}

module.exports = LiveAnalytics; 