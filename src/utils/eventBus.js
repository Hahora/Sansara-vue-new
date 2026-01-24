import { ref } from "vue";

export const bookingModalState = ref({
  visible: false,
  program: null,
  eventKey: "",
  title: "",
});

export const openBookingModal = (program = null, eventKey = "", title = "") => {
  console.log("EventBus: Opening booking modal", { program, eventKey, title });
  bookingModalState.value = {
    visible: true,
    program,
    eventKey,
    title,
  };
};

export const closeBookingModal = () => {
  console.log("EventBus: Closing booking modal");
  bookingModalState.value = {
    visible: false,
    program: null,
    eventKey: "",
    title: "",
  };
};
