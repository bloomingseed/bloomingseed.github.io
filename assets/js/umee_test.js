document.addEventListener('DOMContentLoaded', function() {

const { createApp, ref, computed } = Vue
var { useVuelidate } = window.Vuelidate;
var { required, email, minLength } = window.VuelidateValidators;
// TESTING ONLY
const POST_URL = "https://script.google.com/macros/s/AKfycbxAwRbJbJW6AI8_1oU9QewuMuTVhBilFcy_934fDiSUCSdajc1GFjHwd5-SPWHfW99nkA/exec";

createApp({
    setup() {
        const step = ref(1);
        const formData = ref({
            name: '',
            email: '',
            question1: '',
            question2: '',
            question3: []
        });

        const rules = computed(() => ({
            name: { required, minLength: minLength(3) },
            email: { required, email },
            question1: step.value === 1
                ? {}
                : { required, minLength: minLength(5) },
            question2: step.value === 1
                ? {}
                : { required },
        }));


        const v$ = useVuelidate(rules, formData);

        const nextStep = async () => {
            const result = await v$.value.$validate();
            console.log('Step1  validation result: ', result)   // DEBUG
            if (result) {
             step.value++;
            }
        };

        const prevStep = () => {
            step.value--;
        };

        const submitForm = async () => {
            const result = await v$.value.$validate();
            debugger;
            if (result) {
                console.log('Form Data:', formData.value);
                try {
                    const response = await fetch(POST_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json', // Or 'multipart/form-data' if needed
                        },
                        mode: "no-cors",
                        body: JSON.stringify(formData.value) // Or use FormData if you need multipart
                    });

                    if (response.ok) {
                        console.log('Form submitted successfully!');
                        // Optionally reset the form
                        formData.value = {
                            name: '',
                            email: '',
                            question1: '',
                            question2: '',
                            question3: []
                        };
                    } else {
                        console.error('Form submission failed:', response.status, response.statusText);
                        alert('Form submission failed.');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('An error occurred while submitting the form.');
                }
            }
        };

        return {
            step,
            formData,
            v$,
            nextStep,
            prevStep,
            submitForm,
        };
    },
}).mount('#app')

})