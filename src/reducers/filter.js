import { filterActions } from 'actions';

export default (state = [], action) => {
  switch (action.type) {
    case filterActions.FILTER_HEROES: {
      const data = state.filter(hero => hero.games > action.payload);
      return {
        ...state,
        data,
      };
    }
    default:
      return state;
  }
};
