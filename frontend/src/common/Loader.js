import React from "react";
import { Spinner } from "reactstrap";

const Loader = () => {
  return (
    <div
      className="d-flex justify-content-center modal"
      style={{ alignItems: "center" }}
    >
      <Spinner
        // color="dark"
        style={{
          height: "4rem",
          width: "4rem",
        }}
      >
        Loading...
      </Spinner>
    </div>
  );
};

export default Loader;
