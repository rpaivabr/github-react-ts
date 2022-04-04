import { FormEvent, useState } from "react";

export type SearchFormProps = {
  onSearch: (value: string) => void;
  onClear: () => void;
};

function SearchForm({ onSearch, onClear }: SearchFormProps) {
  const [searchInput, setSearchInput] = useState<string>("");

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();
  }

  return (
    <form className="container py-4" onSubmit={handleSubmit}>
      <label htmlFor="basic-url" className="form-label">
        Please fill some valid username:
      </label>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon3">
          https://github.com/
        </span>
        <input
          type="text"
          className="form-control"
          id="basic-url"
          onChange={(e) => setSearchInput(e.target.value.trim())}
          aria-describedby="basic-addon3"
          onKeyUp={(e) => e.key === "Enter" && onSearch(searchInput)}
        />
        <button
          className="btn btn-outline-success"
          type="button"
          id="button-addon2"
          onClick={() => searchInput && onSearch(searchInput)}
        >
          Search
        </button>
        <button
          className="btn btn-outline-warning"
          type="button"
          id="button-addon2"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
export default SearchForm;
