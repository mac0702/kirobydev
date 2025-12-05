/**
 * SWIFT.HAUNT - Haunted Sound System
 * Creates eerie ambient banking sounds using Web Audio API
 */

const HauntedSound = {
    audioContext: null,
    masterGain: null,
    isPlaying: false,
    oscillators: [],

    /**
     * Initialize audio context
     */
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.12; // Low volume for ambient
            this.masterGain.connect(this.audioContext.destination);

            console.log('🏦💀 Haunted banking sound system initialized');
        } catch (error) {
            console.warn('Audio not supported:', error);
        }
    },

    /**
     * Start haunted ambient sound
     */
    start() {
        if (!this.audioContext || this.isPlaying) return;

        // Resume audio context (required by browsers)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;

        // Create multiple layers of eerie banking sounds
        this.createVaultHum();
        this.createDistantAlarm();
        this.createCreepyDrone();

        // Occasional random effects
        this.scheduleRandomEffects();
    },

    /**
     * Stop all sounds
     */
    stop() {
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) { }
        });
        this.oscillators = [];
        this.isPlaying = false;
    },

    /**
     * Create vault/safe hum sound
     */
    createVaultHum() {
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate white noise
        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;
        noise.loop = true;

        // Filter to make it sound like vault machinery
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        const vaultGain = this.audioContext.createGain();
        vaultGain.gain.value = 0.04;

        noise.connect(filter);
        filter.connect(vaultGain);
        vaultGain.connect(this.masterGain);

        noise.start();
        this.oscillators.push(noise);

        // Slowly modulate vault hum
        this.modulateGain(vaultGain.gain, 0.03, 0.06, 10);
    },

    /**
     * Create distant alarm/warning sound
     */
    createDistantAlarm() {
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 220; // Low frequency

        const alarmGain = this.audioContext.createGain();
        alarmGain.gain.value = 0.02;

        osc.connect(alarmGain);
        alarmGain.connect(this.masterGain);

        osc.start();
        this.oscillators.push(osc);

        // Slowly vary the pitch (like distant siren)
        this.modulateFrequency(osc.frequency, 200, 240, 15);
        this.modulateGain(alarmGain.gain, 0.01, 0.04, 12);
    },

    /**
     * Create creepy banking drone
     */
    createCreepyDrone() {
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 65; // Very low

        const droneGain = this.audioContext.createGain();
        droneGain.gain.value = 0.015;

        // Add some reverb-like effect
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;

        osc.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(this.masterGain);

        osc.start();
        this.oscillators.push(osc);

        this.modulateGain(droneGain.gain, 0.01, 0.03, 18);
    },

    /**
     * Modulate gain over time
     */
    modulateGain(gainNode, min, max, duration) {
        const modulate = () => {
            if (!this.isPlaying) return;

            const target = min + Math.random() * (max - min);
            const time = this.audioContext.currentTime;
            gainNode.linearRampToValueAtTime(target, time + duration);

            setTimeout(modulate, duration * 1000);
        };
        modulate();
    },

    /**
     * Modulate frequency over time
     */
    modulateFrequency(freqNode, min, max, duration) {
        const modulate = () => {
            if (!this.isPlaying) return;

            const target = min + Math.random() * (max - min);
            const time = this.audioContext.currentTime;
            freqNode.linearRampToValueAtTime(target, time + duration);

            setTimeout(modulate, duration * 1000);
        };
        modulate();
    },

    /**
     * Schedule random spooky banking effects
     */
    scheduleRandomEffects() {
        if (!this.isPlaying) return;

        const scheduleNext = () => {
            if (!this.isPlaying) return;

            // Random delay between effects (15-40 seconds)
            const delay = 15000 + Math.random() * 25000;

            setTimeout(() => {
                const effects = [
                    () => this.playCashRegister(),
                    () => this.playVaultDoor(),
                    () => this.playDistantScream()
                ];

                const randomEffect = effects[Math.floor(Math.random() * effects.length)];
                randomEffect();

                scheduleNext();
            }, delay);
        };

        scheduleNext();
    },

    /**
     * Play cash register sound
     */
    playCashRegister() {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        osc.type = 'square';
        osc.frequency.value = 800;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.08;

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.audioContext.currentTime;
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    },

    /**
     * Play vault door creak
     */
    playVaultDoor() {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 100;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.06;

        osc.connect(gain);
        gain.connect(this.masterGain);

        const now = this.audioContext.currentTime;
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

        osc.start(now);
        osc.stop(now + 1.0);
    },

    /**
     * Play distant scream
     */
    playDistantScream() {
        if (!this.audioContext) return;

        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.6, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < buffer.length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / buffer.length * 2);
        }

        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1500;

        const gain = this.audioContext.createGain();
        gain.gain.value = 0.05;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start();
    },

    /**
     * Toggle sound on/off
     */
    toggle() {
        if (this.isPlaying) {
            this.stop();
            return false;
        } else {
            this.start();
            return true;
        }
    },

    /**
     * Set volume
     */
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }
};

// Auto-start on user interaction (required by browsers)
if (typeof window !== 'undefined') {
    document.addEventListener('click', () => {
        if (!HauntedSound.audioContext) {
            HauntedSound.init();
            HauntedSound.start();
        }
    }, { once: true });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HauntedSound;
}
