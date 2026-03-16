//actionType
const USERNAME = 'login/username';
const TOKEN = 'login/token';

// initialSate
const initialState = () => ({
  username: '',
  token: '',
});

// Reducer
export const login = function reducer(state = initialState(), action) {
  switch (action.type) {
    case USERNAME:
      return Object.assign({}, state, { username: action.data });
    case TOKEN:
      return Object.assign({}, state, { token: action.data });
    default:
      return state;
  }
};

// update
export const updateUsername = (data) => ({
  type: USERNAME,
  data,
});

export const updateToken = (data) => ({
  type: TOKEN,
  data,
});
