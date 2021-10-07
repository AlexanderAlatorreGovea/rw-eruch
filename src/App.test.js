import { render, screen, fireEvent, act } from "@testing-library/react";
import DataFetchingOnClick, {
  storiesReducer,
  SearchForm,
  InputWithLabel,
  List,
  Item,
} from "./components/DataFetchingOnClick/DataFetchingOnClick";

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

/* INTEGRATION TESTS W/ ASYNC DATA */

describe("DataFetchingOnClick", () => {
  test("succeeds fetching data", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<DataFetchingOnClick />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Redux")).toBeInTheDocument();
    expect(screen.getAllByText("Dismiss").length).toBe(2);
  });

  test("fails fetching data", async () => {
    const promise = Promise.reject();

    axios.get.mockImplementationOnce(() => promise);

    render(<DataFetchingOnClick />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();

    try {
      await act(() => promise);
    } catch (error) {
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }
  });

  test("removes a story", async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    axios.get.mockImplementationOnce(() => promise);

    render(<DataFetchingOnClick />);

    await act(() => promise);

    expect(screen.getAllByText("Dismiss").length).toBe(2);
    expect(screen.getByText("Jordan Walke")).toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Dismiss")[0]);

    expect(screen.getAllByText("Dismiss").length).toBe(1);
    expect(screen.queryByText("Jordan Walke")).toBeNull();
  });

  test("searches for specific stories", async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories,
      },
    });

    const anotherStory = {
      title: "JavaScript",
      url: "https://en.wikipedia.org/wiki/JavaScript",
      author: "Brendan Eich",
      num_comments: 15,
      points: 10,
      objectID: 3,
    };

    const javascriptPromise = Promise.resolve({
      data: {
        hits: [anotherStory],
      },
    });

    axios.get.mockImplementation((url) => {
      if (url.includes("React")) {
        return reactPromise;
      }

      if (url.includes("JavaScript")) {
        return javascriptPromise;
      }

      throw Error();
    });

    // Initial Render

    render(<DataFetchingOnClick />);

    // First Data Fetching

    await act(() => reactPromise);

    expect(screen.queryByDisplayValue("React")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("JavaScript")).toBeNull();

    expect(screen.queryByText("Jordan Walke")).toBeInTheDocument();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeInTheDocument();
    expect(screen.queryByText("Brendan Eich")).toBeNull();

    // User Interaction -> Search

    fireEvent.change(screen.queryByDisplayValue("React"), {
      target: {
        value: "JavaScript",
      },
    });

    expect(screen.queryByDisplayValue("React")).toBeNull();
    expect(screen.queryByDisplayValue("JavaScript")).toBeInTheDocument();

    fireEvent.submit(screen.queryByText("Submit"));

    // Second Data Fetching

    await act(() => javascriptPromise);

    expect(screen.queryByText("Jordan Walke")).toBeNull();
    expect(screen.queryByText("Dan Abramov, Andrew Clark")).toBeNull();
    expect(screen.queryByText("Brendan Eich")).toBeInTheDocument();
  });
});

describe('SearchFrom', () => {
  const searchFormProps = {
    searchTerm: "React",
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };
  test('renders snapshot', () => {
    const { container } = render(<SearchForm {...searchFormProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });
})