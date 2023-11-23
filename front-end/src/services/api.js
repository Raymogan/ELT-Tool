import axios from "axios";

export const uploadFile = async (file, onSuccess, onError) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      import.meta.env.VITE_APP_UPLOAD_API,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    onSuccess(response.data, file.name);
    return response.data; // Make sure to return the entire response object
  } catch (error) {
    onError(error);
    return { error: "An error occurred during file upload." }; // Handle errors and return a valid response
  }
};

export const applyTransformations = async (fileName, transformation) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_APP_TRANSFORMATIONS,
      {
        file_name: fileName,
        transformation,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(import.meta.env.VITE_APP_SIGN_IN, {
      email,
      password,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (formData) => {
  try {
    const response = await fetch(import.meta.env.VITE_APP_SIGN_UP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: formData.get("firstName"),
        last_name: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (response.ok) {
      return true; // Registration successful
    } else {
      const responseData = await response.json();
      throw new Error(`Registration failed: ${JSON.stringify(responseData)}`);
    }
  } catch (error) {
    throw new Error(`Error during registration: ${error.message}`);
  }
};
