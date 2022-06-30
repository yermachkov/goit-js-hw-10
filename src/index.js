import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const form = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

form.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function clearMarkup(element) {
  return element.innerHTML = "";
}

function onSearchInput(event) {
  const inputText = event.target.value.trim();

  if (!inputText) {
    clearMarkup(countriesList);
    clearMarkup(countryInfo);
    return;
  }

  fetchCountries(inputText).then(data => {
    if (data.length > 10) {
      Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
      clearMarkup(countriesList);
      clearMarkup(countryInfo);
      return;
    } else if (data.length >= 2 && data.length <= 10) {
      clearMarkup(countryInfo);
      countriesList.innerHTML = createCountriesListMarkup(data);
    }
    else {
      clearMarkup(countriesList);
      countryInfo.innerHTML = createCountryInfoMarkup(data);
      console.log(createCountryInfoMarkup(data));
    };
  })
    .catch(error => {
      clearMarkup(countriesList);
      clearMarkup(countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name')
  })
}


function createCountriesListMarkup(data) {
  return data.map(({ flags, name }) =>
    `<li>
      <div class="countries-data-wrap">
        <img src="${flags.svg}" alt="flag of ${name.official}">
        <p>${name.official}</p>
      </div>
    </li>`)
    .join('');
}
  
function createCountryInfoMarkup(data) {
  return data.map(({ name, capital, population, flags, languages }) =>
`
  <div class="counry-header-wrap">
  <img src="${flags.svg}" alt="flag of ${name.official}">
  <h1>${name.official}</h1>
  </div>

  <p><b>Capital:</b> ${capital}</p>
  <p><b>Population:</b> ${population}</p>
  <p><b>Languages:</b> ${Object.values(languages)}</p>
  `
  ).join('');
}