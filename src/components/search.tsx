import React from "react";

type Props = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Search: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
