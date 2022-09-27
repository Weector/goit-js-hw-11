import axios from 'axios';
import { Notify } from 'notiflix';

export async function fetchPictures(value, page) {
  try {
    return await axios.get(
      `https://pixabay.com/api/?key=30186548-cb697292edee32826731eafdb&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
  } catch (error) {
    Notify.failure(`${error}`);
  }
}
