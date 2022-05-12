import React from "react";

const Category = ({ categ, filteredItems }) => {
  return (
    <div>
      {categ.map((x) => (
        <button onClick={() => filteredItems(categ)} key={x}>
          {x}
        </button>
      ))}
    </div>
  );
};

export default Category;
