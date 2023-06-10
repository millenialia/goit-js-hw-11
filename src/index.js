import axios from 'axios';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')

const APIKEY = '37129638-ec213efed10419ab76c2321de'
const url = 'https://pixabay.com/api/'
const maxPhotos = 40
let keyword = ''
let pageNum = 0
let lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearch)
loadMoreBtn.addEventListener('click', onLoadMore)

loadMoreBtn.classList.add('is-hidden')

async function onSearch(event) {
  loadMoreBtn.classList.add('is-hidden')
  event.preventDefault()
  galleryEl.innerHTML = ''
  pageNum = 1
  keyword = event.currentTarget.elements[0].value;
  if (keyword.trim() === '') {
    return
  }
  const  data = await fetchPhotoByKeyword(keyword);
  if (data.totalHits === 0) {
    loadMoreBtn.classList.add('is-hidden')
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
  else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderPhotosCard(data.hits)
    loadMoreBtn.classList.remove('is-hidden')
    lightbox.refresh()
  }
}

async function onLoadMore(event) {
  pageNum += 1
  const data = await fetchPhotoByKeyword(keyword);
  renderPhotosCard(data.hits)
  lightbox.refresh()
  const totalPages = Math.ceil(data.totalHits/maxPhotos)
  if (pageNum == totalPages) {
    loadMoreBtn.classList.add('is-hidden')
    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
  }
}

async function fetchPhotoByKeyword(keyword) {
  try {
    const {data} = await axios.get('', {
      baseURL: url,
      params: {
        key: APIKEY,
        q: keyword,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: maxPhotos,
        page: pageNum,
      }
    });

    return data

  } catch (error) {
    console.error(error);
  }

}

function renderPhotosCard(photosArray) {
  for (const photo of photosArray) {
    const smallImg = photo.webformatURL
    const largeImg = photo.largeImageURL
    const alt = photo.tags
    const likes = photo.likes
    const views = photo.views
    const comments = photo.comments
    const downloads = photo.downloads

    const renderCard = `<div class='photo-card'><a href=${largeImg}><img src=${smallImg} alt=${alt} class='img'></a>
    <div class='list'>
    <p><b>Likes</b><br>${likes}</p>
    <p><b>Views</b><br>${views}</p>
    <p><b>Comments</b><br>${comments}</p>
    <p><b>Downloads</b><br>${downloads}</p>
    </div></div>`

    galleryEl.insertAdjacentHTML("beforeend", renderCard)

  }
}
