import axios from 'axios';

export async function getPictures() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=30186548-cb697292edee32826731eafdb&q=yellow+flowers&image_type=photo`
    );
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
