const ListeningQuestion = {
  props: {
    label: String,
    audioSrc: String,
    modelValue: String,
    countdownSeconds: {
      type: Number,
      default: 10
    }
  },
  emits: ['update:modelValue', 'blur'],
  template: `
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-3 required">
        {{ label }}
      </label>

      <!-- Audio -->
      <audio
        ref="audio"
        :src="audioSrc"
        @timeupdate="updateAudioProgress"
        @ended="onAudioEnded"
      ></audio>

      <!-- Controls -->
      <div class="flex justify-between gap-3 mb-3">
        <button
            type="button"
            @click="play"
            :disabled="isPlaying || timeLeft === 0"
            :class="[
                'play-btn',
                { locked: timeLeft === 0, playing: isPlaying }
            ]"
            >
            ▶ Play
            </button>

        <!-- Countdown timer -->
        <div
            class="countdown-text"
            :class="{ expired: timeLeft === 0 }"
            >
            {{ countdownText }} {{ timeLeft }}s
        </div>
      </div>

      <!-- Audio progress bar -->
      <div class="progress-track">
        <div
            class="progress-fill audio"
            :class="{ locked: timeLeft === 0 }"
            :style="{ width: audioProgress + '%' }"
        ></div>
      </div>

      <!-- Answer -->
      <textarea
        class="shadow appearance-none border rounded w-full py-2 px-3
               text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Type what you hear..."
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
      ></textarea>

      <slot name="error"></slot>
    </div>
  `,
  data() {
    return {
      isPlaying: false,
      audioProgress: 0,
      timeLeft: this.countdownSeconds,
      countdownTimer: null,
      countdownText: 'Time limit: ' // Initial text
    }
  },
  methods: {
    play() {
      if (this.timeLeft === 0) return

      // Start countdown only once
      if (!this.countdownTimer) {
        this.startCountdown()
      }

      this.isPlaying = true
      this.audioProgress = 0
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      this.countdownText = 'Time left: ' // Change text after first play
    },

    updateAudioProgress() {
      const audio = this.$refs.audio
      if (!audio.duration) return

      this.audioProgress = (audio.currentTime / audio.duration) * 100

      const mins = Math.floor(audio.currentTime / 60)
      const secs = Math.floor(audio.currentTime % 60)
    },

    onAudioEnded() {
      this.isPlaying = false
    },

    startCountdown() {
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        }

        if (this.timeLeft === 0) {
          clearInterval(this.countdownTimer)
          this.countdownTimer = null
        //   this.$refs.audio.pause()
        }
      }, 1000)
    }
  },
  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  }
}