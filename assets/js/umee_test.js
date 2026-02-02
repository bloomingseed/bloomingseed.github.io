document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, computed, watch, onMounted  } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbzXj0ENb3pMrd-mT_sUryxeXL5gD4drczlyN4g1M-vbxBjFTB-2jVk5II_TjExV4gjsIQ/exec";

const app = createApp({
    setup() {
        const audioQ4 = ref(null)

        const audioSources = {
            q4: '/assets/mp3/listening1.mp3'
        }

        const playAudio = (key) => {
            const audioMap = {
                q4: audioQ4.value
            }

            const audio = audioMap[key]
            if (!audio) return

            audio.currentTime = 0 // replay from start
            audio.play()
        }

        const step = ref(0);
        const formData = ref({
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: [],
            question4: '',
            question5: '',
        });
        const rowNumber = ref(-1);    // store the submitted row result
        const isSubmitting = ref(false)

        // Load data from session storage on component initialization
        if (sessionStorage.getItem('formData')) {
            formData.value = JSON.parse(sessionStorage.getItem('formData'));
        }
        if (sessionStorage.getItem('rowNumber')) {
            rowNumber.value = parseInt(sessionStorage.getItem('rowNumber'));
        }

        const rules = computed(() => ({
            name: { required, minLength: minLength(3) },
            email: { required, email },
            question1: step.value === 1
                ? {}
                : { required, minLength: minLength(5) },
            question2: step.value === 1
                ? {}
                : { required },
            question4:  step.value === 1
                ? {}
                : { required },
            question5:  step.value === 1
                ? {}
                : { required },
        }));


        const v$ = useVuelidate(rules, formData);

        const nextStep = async () => {
            step.value++;
        };

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
          // Clear existing data
          formData.value = {
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: [],
            question4: '',
          };
          sessionStorage.removeItem('formData');
          rowNumber.value = 0;
          sessionStorage.removeItem('rowNumber');
          step.value++;
        };

        const submitForm = async () => {
            const result = await v$.value.$validate();
            if (result) {
                console.log('Form Data:', formData.value);
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
                        nextStep();
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

        // Watch formData for changes and persist to session storage
        watch(
            formData,
            (newFormData) => {
                sessionStorage.setItem('formData', JSON.stringify(newFormData));
            },
            { deep: true } // Deep watch for nested objects/arrays
        );

        return {
            audioQ4,
            audioSources,
            playAudio,
            step,
            formData,
            v$,
            rowNumber,
            isSubmitting,
            nextStep,
            validateNextStep,
            prevStep,
            startNewSubmission,
            submitForm,
        };
    },
})

app.component('ListeningQuestion', ListeningQuestion) // registering components
app.component('ImageQuestion', ImageQuestion) // registering components
app.mount('#app')

})