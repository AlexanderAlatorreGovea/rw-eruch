import "./App.css";
import { useState } from "react";
import DataFetching from "./components/DataFetching/DataFetching";
import DataFetchingOnClick from "./components/DataFetchingOnClick/DataFetchingOnClick";
import TypescriptComp from "./components/TypescriptComp/TypescriptComp";
import Sorting from './components/Advanced/Sorting'

const App = () => {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = useState("React");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Sorting/>
      {/* <DataFetching/> */}
      {/* <DataFetchingOnClick/>  */}
      {/* <TypescriptComp/> */}
      {/* <h1>My Hacker Stories</h1>
      <Search search={searchTerm} onSearch={handleSearch} />
        
      <hr />

      <List list={searchedStories} /> */}
    </div>
  );
};

const Search = (props) => (
  <div>
    <label htmlFor="search">Search: </label>
    <input
      id="search"
      type="text"
      value={props.search}
      onChange={props.onSearch}
    />
  </div>
);

const List = ({ list }) => (
  <ul>
    {list.map(({objectID, ...item}) => (
      <Item key={objectID} {...item} />
    ))}
  </ul>
);

const Item = ({ title, url, author, num_comments, points }) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span>{author}</span>
    <span>{num_comments}</span>
    <span>{points}</span>
  </li>
);

export default App;
