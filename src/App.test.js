import { render, screen, fireEvent, act } from "@testing-library/react";
import TypescriptComp, {
  storiesReducer,
  SearchForm,
  InputWithLabel,
  List,
  Item,
} from "./components/TypescriptComp/TypescriptComp";

import axios from "axios";

jest.mock("axios");

const storyOne = {
  title: "React",
  url: "https://reactjs.org/",
  author: "Jordan Walke",
  num_comments: 3,
  points: 4,
  objectID: 0,
};

const storyTwo = {
  title: "Redux",
  url: "https://redux.js.org/",
  author: "Dan Abramov, Andrew Clark",
  num_comments: 2,
  points: 5,
  objectID: 1,
};

const stories = [storyOne, storyTwo];

describe("storiesReducer", () => {
  test("removes a story from all stories", () => {
    const action = { type: "REMOVE_STORY", payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false };

    const newState = storiesReducer(state, action);

    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false,
    };

    expect(newState).toStrictEqual(expectedState);
  });
});

//use screen.debug() for testing
describe("Item", () => {
  test("renders all properties", () => {
    render(<Item item={storyOne} />);
    //screen.debug();
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.getByText("React")).toHaveAttribute(
      "href",
      "https://reactjs.org/"
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders a clickable dismiss button", () => {
    render(<Item item={storyOne} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("renders a clickable dismiss button calls the callback handler", () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe("SearchForm", () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  test("renders the input filed with its value", () => {
    render(<SearchForm {...searchFormProps} />);
    //screen.debug();
    expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
  });

  test("calls onSearchInput on input field change", () => {
    render(<SearchForm {...searchFormProps} />);
    //screen.debug();
    fireEvent.change(screen.getByDisplayValue("React"), {
      target: { value: "Redux" },
    });

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test("calls onSearchSubmit on button submit click", () => {
    render(<SearchForm {...searchFormProps} />);

    fireEvent.submit(screen.getByRole("button"));

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});

/* INTEGRATION TESTS */
