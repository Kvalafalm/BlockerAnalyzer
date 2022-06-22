import { createStore } from "redux";

import { reducers } from "./reducers";
import { middlewares } from './middleware'

export const store = createStore(reducers, middlewares);