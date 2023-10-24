import Search from "antd/es/input/Search";
import React from "react";

const SearchInput = ({ text }) => {
  return (
    <div>
      <Search
        placeholder={text}
        allowClear
        style={{
          width: 200,
          marginBottom: 20,
        }}
      />
    </div>
  );
};

export default SearchInput;
