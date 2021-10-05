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
      isFocused
    >
      <strong>Search:</strong>
    </InputWithLabel>
  );
};

//we are setting up a default inputtype
//usiong isFocused as an attribute is the same as isFocused={true}
//autoFocus={isFocused}
const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};