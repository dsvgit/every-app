import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import reducers from './duck';

const store = createStore(reducers, undefined, compose(
  applyMiddleware(thunk)
));

export default store;
