import { Notify } from 'notiflix';
import { fetchPictures } from './axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formBtn: document.querySelector('.btn'),
  loadMoreBtn: document.querySelector('.load-more'),
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
};

let maxPage = 0;
let page = 1;
let formData = '';
let gallery;
let count = 40;
let isFetching = false;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(e) {
  e.preventDefault();
  removeLoadMoreBtn();
  pageReset();

  count = 40;
  isFetching = true;
  formData = e.target.searchQuery.value;

  fetchPictures(formData, page).then(response => {
    if (!response.data.hits.length) {
      removeLoadMoreBtn();
      refs.gallery.innerHTML = '';

      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    getPicturesMarkup(response.data.hits);
    addLoadMoreBtn();
    Notify.success(`"Hooray! We found ${response.data.totalHits} images."`);
    maxPage = Math.ceil(response.data.totalHits / count);
  });
}

function getPicturesMarkup(pictures) {
  isFetching = false;

  const markup = pictures
    .map(picture => {
      return `
    <div class='foto-card'>
      <a href="${picture.largeImageURL}" alt="${picture.tags}">
          <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" width="360px" height="280px"/>
      </a>
      <div class="info">
      <p class="info-item">
       <b>Likes:</b>
       ${picture.likes}
       </p>
       <p class="info-item">
       <b>Views:</b>
      ${picture.views}
       </p>
      <p class="info-item">
      <b>Comments:</b>
      ${picture.comments}
       </p>
       <p class="info-item">
      <b>Downloads:</b>
      ${picture.downloads}
       </p>
    </div>
  </div>
`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  gallery = new SimpleLightbox('.gallery a');
}

function onLoadMoreBtnClick() {
  page += 1;

  if (page > maxPage) return;

  isFetching = true;
  fetchPictures(formData, page).then(response => {
    getPicturesMarkup(response.data.hits);
    smoothScrole();

    count += response.data.hits.length;

    if (count >= response.data.totalHits) {
      refs.loadMoreBtn.classList.remove('btn-js');

      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });

  gallery.refresh();
}

function pageReset() {
  page = 1;
  refs.gallery.innerHTML = '';
}

function smoothScrole() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.1,
    behavior: 'smooth',
  });
}

function removeLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('btn-js');
}

function addLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('btn-js');
}

window.addEventListener('scroll', async () => {
  if (isFetching) return;

  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    await onLoadMoreBtnClick();
  }
});
