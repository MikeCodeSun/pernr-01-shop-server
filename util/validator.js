const registerValidator = (name, email, password) => {
  const error = {};
  if (name.trim() === "") {
    error.name = "Name must not be Empty!";
  }
  if (email.trim() === "") {
    error.email = "Email must not be Empty!";
  } else {
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      error.email = "Email not valid";
    }
  }
  if (password.trim() === "") {
    error.password = "Password must not be Empty";
  } else {
    if ([...password].length < 6) {
      error.password = "Password must more than 6";
    }
  }

  return {
    valid: Object.keys(error) < 1,
    error,
  };
};

const loginValidator = (email, password) => {
  const error = {};
  if (email.trim() === "") {
    error.email = "Name must not be Empty!";
  }
  if (password.trim() === "") {
    error.password = "Password must not be Empty";
  }
  return {
    valid: Object.keys(error) < 1,
    error,
  };
};

const updateProductValidator = (name, price, description, image) => {
  const error = {};
  if (name.trim() === "") {
    error.email = "Name must not be Empty!";
  }
  if (price.trim() === "") {
    error.email = "Price must not be Empty!";
  }
  if (description.trim() === "") {
    error.email = "Description must not be Empty!";
  }
  if (image.trim() === "") {
    error.email = "Image must not be Empty!";
  }
  return {
    valid: Object.keys(error) < 1,
    error,
  };
};

module.exports = { registerValidator, loginValidator };
