let cv = null;
try {
    cv = require('opencv4nodejs');
} catch (e) {
    console.warn('⚠️ Módulo opencv4nodejs não encontrado. Detecção de movimento avançada desativada.');
}

let tf = null;
try {
    tf = require('@tensorflow/tfjs-node');
} catch (e) {
    console.warn('⚠️ Módulo @tensorflow/tfjs-node não encontrado. Funcionalidades de AI desativadas.');
}

const { v4: uuidv4 } = require('uuid');

class MotionDetector {
    constructor() {
        this.isInitialized = false;
        this.camera = null;
        this.backgroundSubtractor = null;
        this.motionThreshold = 0.3;
        this.lastFrame = null;
        this.motionHistory = [];
        this.callbacks = [];
        this.isRunning = false;
        this.cvAvailable = !!cv;
        this.tfAvailable = !!tf;
    }

    async initialize() {
        if (!this.cvAvailable) {
            console.warn('⚠️ Detecção de movimento desativada: opencv4nodejs não está instalado.');
            return;
        }
        try {
            // Carregar modelo de detecção de movimento
            this.backgroundSubtractor = cv.createBackgroundSubtractorMOG2({
                history: 500,
                varThreshold: 16,
                detectShadows: true
            });

            // Inicializar câmera
            this.camera = new cv.VideoCapture(0);

            // Configurar resolução
            this.camera.set(cv.CAP_PROP_FRAME_WIDTH, 1280);
            this.camera.set(cv.CAP_PROP_FRAME_HEIGHT, 720);
            this.camera.set(cv.CAP_PROP_FPS, 30);

            this.isInitialized = true;
            console.log('📹 Detector de movimento inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar detector de movimento:', error);
            throw error;
        }
    }

    startDetection() {
        if (!this.cvAvailable) {
            console.warn('⚠️ Detecção de movimento não disponível.');
            return;
        }
        if (!this.isInitialized) {
            throw new Error('Detector não inicializado');
        }

        this.isRunning = true;
        this.detectLoop();
        console.log('🎯 Detecção de movimento iniciada');
    }

    stopDetection() {
        this.isRunning = false;
        console.log('⏹️ Detecção de movimento parada');
    }

    async detectLoop() {
        if (!this.cvAvailable) return;
        while (this.isRunning) {
            try {
                const frame = this.camera.read();
                if (frame.empty) continue;

                // Redimensionar frame para melhor performance
                const resizedFrame = frame.resize(640, 480);

                // Aplicar filtros para melhorar detecção
                const blurred = resizedFrame.gaussianBlur(new cv.Size(21, 21), 0);

                // Aplicar background subtractor
                const fgMask = this.backgroundSubtractor.apply(blurred);

                // Encontrar contornos
                const contours = fgMask.findContours(
                    cv.RETR_EXTERNAL,
                    cv.CHAIN_APPROX_SIMPLE
                );

                // Analisar movimento
                const motionData = this.analyzeMotion(contours, resizedFrame);

                if (motionData.hasMotion) {
                    this.processMotion(motionData);
                }

                // Aguardar próximo frame
                await new Promise(resolve => setTimeout(resolve, 33)); // ~30 FPS
            } catch (error) {
                console.error('Erro na detecção:', error);
            }
        }
    }

    analyzeMotion(contours, frame) {
        let totalArea = 0;
        let motionRegions = [];

        contours.forEach(contour => {
            const area = contour.area;
            if (area > 500) { // Filtrar ruído
                totalArea += area;
                const boundingRect = contour.boundingRect();
                motionRegions.push({
                    x: boundingRect.x,
                    y: boundingRect.y,
                    width: boundingRect.width,
                    height: boundingRect.height,
                    area: area
                });
            }
        });

        const motionIntensity = totalArea / (frame.rows * frame.cols);
        const hasMotion = motionIntensity > this.motionThreshold;

        return {
            hasMotion,
            intensity: motionIntensity,
            regions: motionRegions,
            timestamp: Date.now(),
            id: uuidv4()
        };
    }

    processMotion(motionData) {
        // Adicionar ao histórico
        this.motionHistory.push(motionData);
        if (this.motionHistory.length > 100) {
            this.motionHistory.shift();
        }

        // Notificar callbacks
        this.callbacks.forEach(callback => {
            try {
                callback(motionData);
            } catch (error) {
                console.error('Erro no callback de movimento:', error);
            }
        });

        // Emitir evento via Socket.IO se disponível
        if (global.io) {
            global.io.emit('motion-detected', motionData);
        }
    }

    onMotion(callback) {
        this.callbacks.push(callback);
    }

    setMotionThreshold(threshold) {
        this.motionThreshold = Math.max(0.1, Math.min(1.0, threshold));
    }

    getMotionHistory() {
        return this.motionHistory;
    }

    getMotionStats() {
        if (this.motionHistory.length === 0) {
            return { averageIntensity: 0, totalMotions: 0 };
        }

        const totalIntensity = this.motionHistory.reduce((sum, motion) =>
            sum + motion.intensity, 0);

        return {
            averageIntensity: totalIntensity / this.motionHistory.length,
            totalMotions: this.motionHistory.length,
            lastMotion: this.motionHistory[this.motionHistory.length - 1]
        };
    }

    // Detecção de gestos específicos
    detectGesture(motionData) {
        const regions = motionData.regions;

        if (regions.length === 0) return null;

        // Detectar gestos baseados no padrão de movimento
        const largestRegion = regions.reduce((largest, region) =>
            region.area > largest.area ? region : largest);

        // Análise de direção do movimento
        const centerX = largestRegion.x + largestRegion.width / 2;
        const centerY = largestRegion.y + largestRegion.height / 2;

        // Classificar gestos
        if (largestRegion.area > 10000) {
            if (largestRegion.width > largestRegion.height * 1.5) {
                return 'WAVE_HORIZONTAL';
            } else if (largestRegion.height > largestRegion.width * 1.5) {
                return 'WAVE_VERTICAL';
            } else {
                return 'CLAP';
            }
        }

        return null;
    }

    // Calibração automática
    calibrate() {
        console.log('🔧 Iniciando calibração do detector de movimento...');

        // Coletar amostras de movimento
        const samples = [];
        const calibrationTime = 5000; // 5 segundos

        return new Promise((resolve) => {
            const startTime = Date.now();

            const calibrationCallback = (motionData) => {
                if (motionData.hasMotion) {
                    samples.push(motionData.intensity);
                }

                if (Date.now() - startTime > calibrationTime) {
                    this.callbacks = this.callbacks.filter(cb => cb !== calibrationCallback);

                    if (samples.length > 0) {
                        const avgIntensity = samples.reduce((sum, intensity) => sum + intensity, 0) / samples.length;
                        this.motionThreshold = avgIntensity * 1.2; // 20% acima da média
                        console.log(`✅ Calibração concluída. Threshold: ${this.motionThreshold.toFixed(3)}`);
                    }

                    resolve();
                }
            };

            this.callbacks.push(calibrationCallback);
        });
    }
}

module.exports = MotionDetector; 