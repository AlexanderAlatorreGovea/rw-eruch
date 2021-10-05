const storiesReducer = (state, action) => {
  if (action.type === "SET_STORIES") {
    return action.payload;
  } else {
    throw new Error();
  }
};
