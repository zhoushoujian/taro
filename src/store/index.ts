import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { home } from './home';
import { login } from './login';
import { user } from './user';

const combineReducers11 = combineReducers({
  home,
  user,
  login,
});

const composeEnhancers = compose;

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
);

export default function configStore() {
  const store = createStore(combineReducers11, enhancer);
  return store;
}
