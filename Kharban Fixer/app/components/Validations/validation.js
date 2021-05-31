//***** Validation rules for input fields */
const validation = {
  mobile: {
    presence: {
      message: "Please enter your mobile number",
    },
    format: {
      // pattern: /^[0-9]{6,20}$/,
      pattern: /^([+]\d{2}[ ])?\d{6,20}$/,
      message:
        "Please enter a valid mobile number and it should be numeric with 6 to 20 digits.",
    },
  },
  service_type: {
    presence: {
      message: "Please select service type.",
    },
  },
  iban: {
    presence: {
      message: "Please enter your IBAN Number",
    },
    format: {
      pattern: /^([a-zA-Z0-9]){1,49}$/,
      message: "Please enter valid IBAN, it should be of 2 to 50 characters.",
    },
  },
  price: {
    presence: {
      message: "Please enter receipt amount",
    },
    format: {
      pattern: /^[1-9]\d{0,4}(\.\d{1,4})?$/,
      message: "Please enter a valid amount.",
    },
  },
  job_status: {
    presence: {
      message: "Please select job status.",
    },
  },
  name: {
    presence: {
      message: "Please enter your name",
    },
    format: {
      pattern: /^(?!\s*$|\s).[a-z A-Z]{1,49}$/,
      message: "Please enter valid name, it should be of 2 to 50 characters.",
    },
  },
  id: {
    presence: {
      message: "Please enter your ID Number",
    },
    format: {
      pattern: /^([a-zA-Z0-9]){1,49}$/,
      message: "Please enter valid ID, it should be of 2 to 50 characters.",
    },
  },
};

export default validation;
