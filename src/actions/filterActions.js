const FILTER_HEROES = 'filter/FILTER_HEROES';

export const filterActions = {
  FILTER_HEROES,
};

export const filterHeroes = payload => ({
  type: FILTER_HEROES,
  payload,
});

