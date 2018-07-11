import React, { createContext } from "react";
import Option from "./Option";

export const { Provider, Consumer } = createContext();

export const OptionWithConsumer = props => {
  return <Consumer>{context => <Option {...context} {...props} />}</Consumer>;
};
