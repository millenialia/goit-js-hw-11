import axios from 'axios';

const searchBtn = document.querySelector('#search')
const searchForm = document.querySelector('.search-form')
const galleryEl = document.querySelector('.gallery')
const loadMoreBtn = document.querySelector('.load-more')


const APIKEY = '37129638-ec213efed10419ab76c2321de'
const url = 'https://pixabay.com/api/'
const maxPhotos = 40
let keyword = ''
let pageNum = 0

searchForm.addEventListener('submit', onSearch)
loadMoreBtn.addEventListener('click', onLoadMore)

loadMoreBtn.classList.add('is-hidden')

function onSearch(event) {
  event.preventDefault()
  galleryEl.innerHTML = ''
  pageNum = 1
  keyword = event.currentTarget.elements[0].value;
  fetchPhotoByKeyword(keyword)
  loadMoreBtn.classList.remove('is-hidden')
}

function onLoadMore(event) {
  pageNum += 1
  fetchPhotoByKeyword(keyword)
}


async function fetchPhotoByKeyword(keyword) {
  try {
    const response = await axios.get('', {
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
    await renderPhotosCard(response.data.hits)
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

    const renderCard = `<div class='photo-card'><img src=${smallImg} alt=${alt} class='img'>
    <div class='list'>
    <p><b>Likes</b><br>${likes}</p>
    <p><b>Views</b><br>${views}</p>
    <p><b>Comments</b><br>${comments}</p>
    <p><b>Downloads</b><br>${downloads}</p>
    </div></div>`

    galleryEl.innerHTML += renderCard
  }
}
