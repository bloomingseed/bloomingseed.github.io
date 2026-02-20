document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, onMounted, computed } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbwJEjsnxEkyUhGmOu30Mq4elKW5rOLfAppPesgk33yPgGuksUoQ1rWD_VA-t4snpSu5Hw/exec";

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
            class="flex flex-col items-center cursor-pointer transition transform hover:scale-110"
            @click="select(n)"
            @mouseover="hoverValue = n"
            @mouseleave="hoverValue = null"
          >
            <span class="text-sm text-gray-500 my-2">{{ n }}</span>
            <span :style="iconStyle(n)" v-html="getIcon(n)"></span>
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
        const formData0 = ref({
            startTimestamp: '',
          });
        const formData = ref({
            startTimestamp: '',
        });
        const formData2 = ref({
            startTimestamp: '',
        });
        const formData3 = ref({
            startTimestamp: '',
        });
        const formDataSubmission = ref({
            startTimestamp: '',
        })
        const rowNumber = ref(-1);    // store the submitted row result
        const showConfirmation = ref(false);  // whether to show step confirmation dialog. initially false
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

        const rules0 = computed(() => ({
            'Hiện tại, bạn có gặp vấn đề sinh lý hoặc bệnh nào liên quan có ảnh hưởng đến thính giác khi nghe chọn đáp án không?': { required },
            'Giới tính của bạn:': { required },
            'Bạn là người vùng miền nào?': { required },
            'Mã số tỉnh thành quê quán của bạn (VD: 92 CT)': { required },
            'STT khảo sát của bạn/ 您的被试偏号:': { required },
            'Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
        }))

        const rules = computed(() => ({
            '1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '2. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '3. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '4. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '5. Người nói vừa phát âm từ NGHĨ phải không?': { required },
            '6. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '7. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '8. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '9. Người nói vừa phát âm từ RỂ phải không?': { required },
            '10. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '11. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '12. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '13. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '14. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '15. Người nói vừa phát âm từ NGHỈ phải không?': { required },
            '16. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '17. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '18. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '19. Người nói vừa phát âm từ RỄ phải không?': { required },
            '20. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            // 'Vui lòng đánh giá giọng phát âm của người nói dựa trên cảm nhận khách quan của bạn!': { required },
            // 'Đánh giá mức độ khó của bài khảo sát này:': { required },
            // 'Dựa trên thanh điểm 10, sau khi hoàn thành khảo sát bạn tự tin mình làm đúng được khoảng bao nhiêu phần trăm?': { required },
            // myRating:  { required },
        }));
        const rules2 = computed(() => ({
            '1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '2. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '3. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '5. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '6. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '7. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '8. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '9. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '10. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '11. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '12. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '13. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '14. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '15. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '16. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '17. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '18. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            '19. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '20. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            // 'Vui lòng đánh giá giọng phát âm của người nói dựa trên cảm nhận khách quan của bạn!': { required },
            // 'Đánh giá mức độ khó của bài khảo sát này:': { required },
            // 'Dựa trên thanh điểm 10, sau khi hoàn thành khảo sát bạn tự tin mình làm đúng được khoảng bao nhiêu phần trăm?': { required },
        }));
        const rules3 = computed(() => ({
            '1. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '2. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '3. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '4. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '5. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            '6. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '7. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '8. Người nói vừa phát âm từ CÃI VÃ phải không?': { required },
            '9. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '10. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            '11. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '12. Người nói vừa phát âm từ GIỎI phải không?': { required },
            '13. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '14. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '15. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            '16. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '17. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '18. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '19. Chọn đáp án phù hợp nhất dựa trên file nghe sau đây:': { required },
            '20. Điền từ phù hợp nhất vào đáp án dựa trên file nghe sau đây': { required },
            'Vui lòng đánh giá giọng phát âm của người nói dựa trên cảm nhận khách quan của bạn!': { required },
            'Đánh giá mức độ khó của bài khảo sát này:': { required },
            'Dựa trên thanh điểm 10, sau khi hoàn thành khảo sát bạn tự tin mình làm đúng được khoảng bao nhiêu phần trăm?': { required },
        }));


        const v0$ = useVuelidate(rules0, formData0);
        const v$ = useVuelidate(rules, formData);
        const v2$ = useVuelidate(rules2, formData2);
        const v3$ = useVuelidate(rules3, formData3);


        const attemptNextStep = async () => {
          // 1. Validate
          var validationResult = await validateCurrentStep();

          // 2. If validation succeeds, show confirmation
          if (validationResult) {
            showConfirmation.value = true;
          }
          // else do nothing, the validation should display the errors
        };

        const validateCurrentStep = async () => {
          // validate
          if (step.value === 0)
            return await v0$.value.$validate();
          else if (step.value === 1)
            return await v$.value.$validate();
          else if (step.value === 2)
            return await v2$.value.$validate();
          else if (step.value === 3)
            return await v3$.value.$validate();
          return false; // default
        };

        const cancelNextStep = () => {
          showConfirmation.value = false;
        };
        
        const doNextStep  = async () => {
          // important: assuming validateCurrentStep() has returned true
          step.value++;
          debouncedScrollToTop();

          if(step.value === 1)
            formData.value = {
              startTimestamp: Date.now(), // record time begin the survey
            };
          else if(step.value === 2)
            formData2.value = {
              startTimestamp: Date.now(), // record time begin the survey
            };
          else if(step.value === 3)
            formData3.value = {
              startTimestamp: Date.now(), // record time begin the survey
            };
          else if(step.value === 4)
            formDataSubmission.value = {
              startTimestamp: Date.now(), // record time begin the survey
            };
          showConfirmation.value = false; // close the confirmation dialog
        };

        const scrollToTop = () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth' // For a smooth scrolling animation
          });
        };

        // Debounce the scrollToTop function using Lodash
        const debouncedScrollToTop = _.debounce(scrollToTop, 100); // Debounce for 100ms

        const prevStep = () => {
            step.value--;
        };

        const startNewSubmission = () => {
          formData0.value = {
            startTimestamp: Date.now(), // record time begin the survey
          };
          // Clear existing data
          sessionStorage.removeItem('rowNumber');
          rowNumber.value = 0;
          step.value++;
        };

        const submitForm = async () => {
            isSubmitting.value = true;
            try {
              var payload = {
                'Form Data 0': {...formData0.value},
                'Form Data 1': {...formData.value},
                'Form Data 2': {...formData2.value},
                'Form Data 3': {...formData3.value},
                'Form Data Submission': {...formDataSubmission.value},
              };

              const response = await fetch(POST_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'text/plain',
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
              }

              const resp = await response.json();
              if (resp.error) {
                throw new Error(`[${resp.error.title}] ${resp.error.message}`);
              }
              console.log(resp);
              rowNumber.value = resp.row[0];
              sessionStorage.setItem('rowNumber', rowNumber.value.toString()); // Persist rowNumber
              step.value++;

            } catch (error) {
              console.error('Error submitting form:', error);
              alert(`An error occurred while submitting the form: ${error.message}`);
            } finally {
              isSubmitting.value = false;
            }
        };

        return {
            audioStates,
            step,
            formData0,
            formData,
            formData2,
            formData3,
            formDataSubmission,
            v0$,
            v$,
            v2$,
            v3$,
            rowNumber,
            isSubmitting,
            showConfirmation,
            attemptNextStep,
            cancelNextStep,
            doNextStep,
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