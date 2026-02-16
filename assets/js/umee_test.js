document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, onMounted, computed } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbzXj0ENb3pMrd-mT_sUryxeXL5gD4drczlyN4g1M-vbxBjFTB-2jVk5II_TjExV4gjsIQ/exec";

const RatingQuestion = {
  template: `
    <div class="qblock mb-4">
      <label class="block text-gray-700 font-bold mb-3 required qtitle">
        <span class="qnumber">Q1. </span>{{ label }}
      </label>
      <div class="flex justify-center items-center sm:gap-2 select-none">
        <span
          v-for="n in rangeArray"
          :key="n"
          class="cursor-pointer transition transform hover:scale-110"
          :style="iconStyle(n)"
          @click="select(n)"
          @mouseover="hoverValue = n"
          @mouseleave="hoverValue = null"
        >
          {{ getIcon() }}
        </span>
      </div>

      <!-- Error message -->
      <p v-if="validation.$error" class="text-red-500 text-sm italic">
        <span v-if="validation.required.$invalid">Please select an option.</span>
      </p>
    </div>
  `,
  props: {
    modelValue: Number,
    label: String,
    validation: {
      type: Object,
      default: () => ({ $error: false, required: { $invalid: false } })
    },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 5 },
    icon: { type: String, default: "star" },
    size: { type: Number, default: 24 }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const hoverValue = ref(null)

    const rangeArray = computed(() => {
      return Array.from(
        { length: props.max - props.min + 1 },
        (_, i) => i + props.min
      )
    })

    const select = (value) => {
      emit("update:modelValue", value)
    }

    const isActive = (n) => {
      const current = hoverValue.value ?? props.modelValue
      return n <= current
    }

    const iconStyle = (n) => ({
      fontSize: props.size + "px",
      cursor: "pointer",
      color: isActive(n) ? "#f5b301" : "#ccc",
      transition: "color 0.2s"
    })

    const getIcon = () => {
      const icons = {
        star: "★",
        heart: "❤",
        circle: "●",
        square: "■",
        like: "👍",
        smile: "😊"
      }
      return icons[props.icon] || "★"
    }

    return { hoverValue, rangeArray, select, iconStyle, getIcon }
  }
}


const app = createApp({
    setup() {
        const audioQ4 = ref(null)

        const audioSources = {
            q4: '/assets/mp3/listening1.mp3',
            // q4: 'https://drive.usercontent.google.com/download?id=1iR3wlltVx2jzafNQmTX2xINblrVK1OKY&export=download'
        }

        const playAudio = (key) => {
            const audioMap = {
                q4: audioQ4.value
            }

            const audio = audioMap[key]
            // debugger;
            if (!audio) return

            audio.currentTime = 0 // replay from start
            audio.play()
        }

        const step = ref(1);
        const formData = ref({
            name: '',
            question2: '',
            favoriteShoe: '',
            myRating: '',
            beginTimestamp: '',
            submissionTimestamp: '',
        });
        const rowNumber = ref(-1);    // store the submitted row result
        const isSubmitting = ref(false)
        const shoeOptions = [
          {
            value: 'A',
            imageSrc: '/assets/images/t1q1a.jpg',
          },
          {
            value: 'B',
            imageSrc: '/assets/images/t1q1b.jpg',
          }
        ];

        const radioOptions = [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ];

        // Load data from session storage on component initialization
        if (sessionStorage.getItem('rowNumber')) {
            rowNumber.value = parseInt(sessionStorage.getItem('rowNumber'));
        }

        const rules = computed(() => ({
            name: { required, minLength: minLength(3) },
            favoriteShoe:  { required },
            myRating:  { required },
            question2: { required },
        }));


        const v$ = useVuelidate(rules, formData);

        const validateNextStep = async () => {
            const result = await v$.value.$validate();
            if (result) {
             step.value++;
            }
        };

        const prevStep = () => {
            step.value--;
        };

        const startNewSubmission = () => {
          formData.value = {
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: [],
            question4: '',
            beginTimestamp: Date.now(), // record time begin the survey
            submissionTimestamp: '',
          };
          // Clear existing data
          sessionStorage.removeItem('rowNumber');
          rowNumber.value = 0;
          step.value++;
        };

        const submitForm = async () => {
            const result = await v$.value.$validate();
            if (result) {
                console.log('Form Data:', formData.value); // DEBUG
                formData.value.submissionTimestamp = Date.now();
                isSubmitting.value = true;
                try {
                    const response = await fetch(POST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify(formData.value)
                    });

                    if (response.ok) {
                        console.log('Form submitted successfully!');
                        resp = await response.json();
                        rowNumber.value = resp.row;
                        sessionStorage.setItem('rowNumber', rowNumber.value.toString()); // Persist rowNumber
                        step.value++;
                    } else {
                        console.error('Form submission failed:', response.status, response.statusText);
                        alert('Form submission failed.');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('An error occurred while submitting the form.');
                } finally {
                    isSubmitting.value = false;
                }
            }
        };

        return {
            audioQ4,
            audioSources,
            playAudio,
            step,
            formData,
            v$,
            rowNumber,
            isSubmitting,
            shoeOptions,
            radioOptions,
            validateNextStep,
            prevStep,
            startNewSubmission,
            submitForm,
        };
    },
})

app.component('ListeningQuestion', ListeningQuestion) // registering components
app.component('ImageQuestion', ImageQuestion) // registering components
app.component('ImageRadioQuestion', ImageRadioQuestion) // registering components
app.component('RatingQuestion', RatingQuestion) // registering components
app.component('TextInputQuestion', TextInputQuestion) // registering components
app.component('RadioButtonQuestion', RadioButtonQuestion) // registering components
app.mount('#app')

})