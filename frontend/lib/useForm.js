import { useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);

  function handleChange(e) {
    // destructure variables
    let { value, name, type } = e.target;
    // if type is number then convert from string to number
    if (type === 'number') {
      value = parseInt(value);
    }
    // for file uploads, set first item of array to files
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      // update the piece of state
      [name]: value,
    });
  }

  // reset form to initial values
  function resetForm() {
    setInputs(initial);
  }

  // clear all form values to blank
  // 1. map over all object properties and convert to an array using Object.from()
  // 2. set each array property to nothing
  // 3. then map over the newly created array and convert back into an object using Object.fromEntries().
  //
  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
