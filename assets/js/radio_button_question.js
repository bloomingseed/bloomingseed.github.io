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
      default: 6
    },
    audioState: {                // ✅ NEW
      type: Object,
      required: true
    }
  },

  emits: ['update:modelValue', 'blur'],
  data() {
    return {
      questionId: this.generateRandomHex(8) // Generate a random hex string as this question's ID
    };
  },
  methods: {
    generateRandomHex(length = 8) {
      if (length <= 0) {
        return "";
      }

      let randomNumber = Math.floor(Math.random() * Math.pow(16, length));
      let hexString = randomNumber.toString(16).padStart(length, '0');

      return hexString;
    },
    optionId(option) {
      return `radio-${this.questionId}-${option.value}`;
    },
    optionKey(option) {
      return `radio-${this.questionId}-${option.value}`;
    },
    play() {
      if (!this.state || this.state.timeLeft === 0) return

      if (!this.state.timer) {
        this.startCountdown()
      }

      this.state.isPlaying = true
      this.state.audioProgress = 0

      const audio = this.$refs.audio
      audio.currentTime = 0
      audio.play()
    },

    updateAudioProgress() {
      const audio = this.$refs.audio
      if (!audio.duration) return

      this.state.audioProgress =
        (audio.currentTime / audio.duration) * 100
    },

    onAudioEnded() {
      if (this.state) {
        this.state.isPlaying = false
      }
    },

    startCountdown() {
      if (!this.state || this.state.timer) return

      this.state.timer = setInterval(() => {
        if (this.state.timeLeft > 0) {
          this.state.timeLeft--
        }

        if (this.state.timeLeft === 0) {
          clearInterval(this.state.timer)
          this.state.timer = null
        }
      }, 1000)
    }
  },
  computed: {
    audioKey() {
      return this.label
    },
    state() {
      return this.audioState[this.audioKey]
    },
    countdownText() {
      return this.state?.timeLeft === 0
        ? 'Time expired:'
        : 'Time left:'
    }
  },

  mounted() {
    if (!this.audioState[this.audioKey]) {
      this.audioState[this.audioKey] = {
        timeLeft: this.countdownSeconds,
        isPlaying: false,
        audioProgress: 0,
        timer: null
      }
    }
  },

  beforeUnmount() {
    if (this.state?.timer) {
      clearInterval(this.state.timer)
      this.state.timer = null
    }
  },

  template: `
    <div class="qblock mb-4">

      <label class="block text-gray-700 font-bold mb-2 required qtitle">
        {{ label }}
      </label>
      <!-- AUDIO SECTION (only if audioSrc exists) -->
      <div class="qbody">
        <template v-if="audioSrc">
          <!-- AUDIO -->
          <audio
              ref="audio"
              :src="audioSrc"
              @timeupdate="updateAudioProgress"
              @ended="onAudioEnded"
          ></audio>
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <!-- PLAY -->
            <button
              type="button"
              @click="play"
              :disabled="!state || state.isPlaying || state.timeLeft === 0"
              :class="[
                'play-btn flex-shrink-0',
                { locked: state?.timeLeft === 0, playing: state?.isPlaying }
              ]"
            >
              ▶ Play
            </button>
            <!-- PROGRESS -->
            <div class="progress-track flex-1 min-w-[120px] max-w-xs">
              <div
                class="progress-fill audio"
                :class="{ locked: state?.timeLeft === 0 }"
                :style="{ width: (state?.audioProgress || 0) + '%' }"
              ></div>
            </div>
            <!-- TIMER -->
            <div
              class="countdown-text text-sm ml-auto w-full sm:w-auto sm:ml-2 text-left"
              :class="{ expired: state?.timeLeft === 0 }"
            >
              {{ countdownText }} {{ state?.timeLeft ?? countdownSeconds }}s
            </div>
          </div>
        </template>
        <!-- RADIO OPTIONS -->
        <div
          v-for="option in options"
          :key="optionKey(option)"
          class="flex items-center"
        >
          <input
            type="radio"
            :id="optionId(option)"
            :value="option.value"
            :checked="modelValue === option.value"
            @change="$emit('update:modelValue', option.value)"
            class="leading-tight"
            @blur="$emit('blur')"
          />
          <label
            :for="optionId(option)"
            class="text-gray-700 p-2"
          >
            {{ option.value }}
          </label>
        </div>
        <p v-if="validation.$error" class="text-red-500 text-sm italic">
          <span v-if="validation.required.$invalid">
            Please select an option.
          </span>
        </p>
      </div>

    </div>
  `
}