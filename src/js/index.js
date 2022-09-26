import Notiflix from 'notiflix';
import { getPictures } from './axios';

const refs = {
  button: document.querySelector('.btn'),
  form: document.querySelector('#search-form'),
};

refs.button.addEventListener('click', onBtnClick);

function onBtnClick(e) {
  e.target.style.backgroundColor = 'gray';
}
getPictures();
