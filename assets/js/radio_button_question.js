const RadioButtonQuestion = {
  props: {
    label: {
      type: String,
      default: "Question:"
    },
    options: {
      type: Array,
      default: () => [
        { value: "Option 1", label: "Option 1" },
        { value: "Option 2", label: "Option 2" }
      ]
    },
    modelValue: {
      type: String,
      default: ""
    },
    validation: {
      type: Object,
      default: () => ({ $error: false, required: { $invalid: false } })
    },
    audioSrc: {
      type: String,
      default: ""
    },
    countdownSeconds: {
      type: Number,
      default: 10
    }
  },

  emits: ['update:modelValue', 'blur'],

  data() {
    return {
      isPlaying: false,
      audioProgress: 0,
      timeLeft: this.countdownSeconds,
      countdownTimer: null,
      countdownText: 'Time limit: '
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
      this.countdownText = 'Time left: '
    },

    updateAudioProgress() {
      const audio = this.$refs.audio
      if (!audio.duration) return

      this.audioProgress =
        (audio.currentTime / audio.duration) * 100
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
        }
      }, 1000)
    }
  },

  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  template: `
    <div class="qblock mb-4">

      <label class="block text-gray-700 font-bold mb-2 required qtitle">
        <span class="qnumber">Q1. </span>{{ label }}
      </label>

      <!-- AUDIO -->
      <audio
        ref="audio"
        :src="audioSrc"
        @timeupdate="updateAudioProgress"
        @ended="onAudioEnded"
      ></audio>

      <!-- CONTROLS -->
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

        <div
          class="countdown-text"
          :class="{ expired: timeLeft === 0 }"
        >
          {{ countdownText }} {{ timeLeft }}s
        </div>

      </div>

      <!-- AUDIO PROGRESS BAR -->
      <div class="progress-track">
        <div
          class="progress-fill audio"
          :class="{ locked: timeLeft === 0 }"
          :style="{ width: audioProgress + '%' }"
        ></div>
      </div>

      <!-- RADIO OPTIONS -->
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center mb-2"
      >
        <input
          type="radio"
          :id="'radio-' + option.value"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="mr-2 leading-tight"
          @blur="$emit('blur')"
        />
        <label
          :for="'radio-' + option.value"
          class="text-gray-700"
        >
          {{ option.label }}
        </label>
      </div>

      <p v-if="validation.$error" class="text-red-500 text-sm italic">
        <span v-if="validation.required.$invalid">
          Please select an option.
        </span>
      </p>

    </div>
  `
}
