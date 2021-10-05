const Comp = () => {
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <InputWithLabel
      id="search"
      label="Search"
      value={searchTerm}
      onInputChange={handleSearch}
    />
  );
};

//we are setting up a default inputtype
const InputWithLabel = ({ id, label, value, type = "text", onInputChange }) => (
  <>
    <label htmlFor={id}>{label}</label>
    &nbsp;
    <input id={id} type={type} value={value} onChange={onInputChange} />
  </>
);
