import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onSearchInput, DEBOUNCE_DELAY)
);

function clearInput() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

function onSearchInput(evt) {
    clearInput();
  if (evt.target.value.trim() === '') {
    return;
  }
  const result = fetchCountries(evt.target.value.trim());
  result.then(countries => {
    renderMarkup(countries);
  }).catch(error => {Notiflix.Notify.failure("Oops, there is no country with that name");})
}

function renderMarkup(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.warning(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length <= 10 && countries.length > 1) {
    countries.map(country =>
      renderListMarkup(country.flags.svg, country.name.official)
    );
  } else if (countries.length === 1) {
    renderCardMarkup(countries[0]);
  }
}

function renderListMarkup(flag, name) {
  const listMarkup = `<li class="country-item"><span class="country-wrapper"><img class="country-img" src="${flag}"></span><p class="country-name">${name}</p></li>`;
  refs.countryList.insertAdjacentHTML('beforeend', listMarkup);
}

function renderCardMarkup(country) {
  const { flags, name, capital, languages, population } = country;
  const cardMarkup = `<div class="card-header"><img class="card-img" src="${
    flags.svg
  }"><h1 class="card-name">${
    name.official
  }</h1></div><p class="card-text">capital: ${capital}<br>languages: ${Object.values(
    languages
  )}<br>population: ${population}</p><p></p><p></p>`;
  refs.countryInfo.insertAdjacentHTML('beforeend', cardMarkup);
}
