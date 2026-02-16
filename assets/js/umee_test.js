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
          {{ label }}
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
            <span v-html="getIcon(n)"></span>
          </span>
        </div>

        <!-- Error message -->
        <p v-if="validation.$error" class="text-red-500 text-sm italic text-center">
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

      const likeSvg = `
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" 
            width="${props.size}" 
            height="${props.size}">
          <g>
            <path d="M38,17H31l.4-3.3C32,8.8,31,4.9,27.8,4h-.3A2,2,0,0,0,26,5.2s-5.7,12-9,14.4V40h1.3a1.6,1.6,0,0,1,1.2.4c1.4,1,6.1,3.6,8.5,3.6h5c5.9,0,11-4,11.5-11.9l.5-8A6.7,6.7,0,0,0,38,17Z"/>
            <path d="M3,22V38a2,2,0,0,0,2,2h8V20H5A2,2,0,0,0,3,22Z"/>
          </g>
        </svg>
        `

      const isActive = (n) => {
        const current = hoverValue.value ?? props.modelValue
        return n <= current
      }

      const iconStyle = (n) => ({
        fontSize: props.size + "px",
        cursor: "pointer",
        transition: "color 0.2s"
      })

      const getIcon = (n) => {
        let color = isActive(n) ? getColor(props.icon) : "#ccc"

        const icons = {
          star: `<span style="color: ${color};">★</span>`,
          heart: `<span style="color: ${color};">❤</span>`,
          circle: `<span style="color: ${color};">●</span>`,
          square: `<span style="color: ${color};">■</span>`,
          like: `
          <span style="display:inline-flex; color:${color}; fill:${color}">
            ${likeSvg}
          </span>
          `,
          smile: `<span style="color: ${color};">😊</span>`
        }
        return icons[props.icon] || `<span style="color: ${color};">★</span>`
      }

      const getColor = (iconType) => {
        if (iconType === "heart") {
          return "red"
        } else if (iconType === "like") {
          return "#0b57d0"
        } else {
          return "#f5b301" // Default color
        }
      }

      return { hoverValue, rangeArray, select, iconStyle, getIcon }
    }
  }


const app = createApp({
    setup() {
        const step = ref(3);
        const formData = ref({
            beginTimestamp: '',
            submissionTimestamp: '',
        });
        const formData2 = ref({
            beginTimestamp: '',
            submissionTimestamp: '',
        });
        const formData3 = ref({
            beginTimestamp: '',
            submissionTimestamp: '',
        });
        const rowNumber = ref(-1);    // store the submitted row result
        const isSubmitting = ref(false)
        const audioStates = ref({
          step0: {},
          step1: {},
          step2: {},
          step3: {},
        })

        // Load data from session storage on component initialization
        if (sessionStorage.getItem('rowNumber')) {
            rowNumber.value = parseInt(sessionStorage.getItem('rowNumber'));
        }

        const rules = computed(() => ({
            'Hiện tại, bạn có gặp vấn đề sinh lý hoặc bệnh nào liên quan có ảnh hưởng đến thính giác khi nghe chọn đáp án không?': {required},
            'Giới tính của bạn:': {required},
            'Bạn là người vùng miền nào?': {required},
            'Mã số tỉnh thành quê quán của bạn (VD: 92 CT)': {required},
            'STT khảo sát của bạn/ 您的被试偏号:': {required},
            // 'Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': {required},
            'Q1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': {required},
            // myRating:  { required },
        }));
        const rules2 = computed(() => ({
            '1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': {required},
            
        }));
        const rules3 = computed(() => ({
            'Hiện tại, bạn có gặp vấn đề sinh lý hoặc bệnh nào liên quan có ảnh hưởng đến thính giác khi nghe chọn đáp án không?': {required},
            'Giới tính của bạn:': {required},
            'Bạn là người vùng miền nào?': {required},
            'Mã số tỉnh thành quê quán của bạn (VD: 92 CT)': {required},
            'STT khảo sát của bạn/ 您的被试偏号:': {required},
            // 'Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': {required},
            'Q1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': {required},
            // myRating:  { required },
        }));


        const v$ = useVuelidate(rules, formData);
        const v2$ = useVuelidate(rules2, formData2);
        const v3$ = useVuelidate(rules3, formData3);

        const validateNextStep = async () => {
          var result = null;
          if(step.value === 0 || step.value === 1)
            result = await v$.value.$validate();
          else if(step.value === 2)
            result = await v2$.value.$validate();
          else if(step.value === 3)
            result = await v3$.value.$validate();
          if (result) {
            step.value++;
          }
        };

        const prevStep = () => {
            step.value--;
        };

        const startNewSubmission = () => {
          formData.value = {
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
            audioStates,
            step,
            formData,
            formData2,
            formData3,
            v$,
            v2$,
            v3$,
            rowNumber,
            isSubmitting,
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