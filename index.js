// Initialise or Refresh
window.addEventListener('load',()=>{
  getApiData()
})

// go forward or go back
window.addEventListener('popstate',()=>{
  displayAll()
})


// Get data from API
function getApiData() {
  fetch('https://luxedreameventhire.co.nz:5001/api/products')
    .then(response => response.json())
    .then(data => {
      initialData = data
      categoryList()
      displayAll()
    });
}

// display Data
function displayAll(){
  getParams()
  renderParams()
}

// gether the categories and render them
function categoryList() {
  displayCategories = `<option value=0 id="category0">All</option> `
  initialData.forEach(data => {
    // get categoryid
    // if the categoryid does not yet exist on the categroy array, we push this id to the array
    if (data.category && data.category.categoryId) {
      if (!categoryArray.find(category => category.id == data.category.categoryId)) {
        categoryArray.push({
          id: data.category.categoryId,
          name: data.category.categoryName,
        })
      }
    }
  });

  categoryArray.sort(function(a,b) {
    let x = a.name.toLowerCase();
    let y = b.name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  })

  categoryArray.map(
    data => {
      displayCategories = displayCategories + `<option value=${data.id} id="category${data.id}">${data.name}</option> `
    }
  )
  
  categorySelection = document.getElementById('categorySelection')

  categorySelection.innerHTML = displayCategories
}

// filter the product from choosen category
function categoryFilter() {
  displayContent = ""
  dataArray = []
  initialData.forEach(data => {
    if (!data.productMedia[0] || data.prodId == 1) {
      return
    } 
    else if(categoryChoosen == '' && data.price){
      dataArray.push(data)
      return
    } 
    else if (categoryChoosen == 0 || data.categoryId == categoryChoosen && data.price){
      dataArray.push(data)
      return
    }
  });
  dataFilteredByRange = dataArray
  dataSortByPrice = dataArray
}

// change the catergory
function categorySelectChange(obj) {
  categoryChoosen = obj.value
  currentPage = 1
  categoryFilter()
  addToUrl()
  getParams()
  renderParams()
}

// change the price range option
function priceSelectChange(obj) {
  priceChoosen = obj.value
  currentPage = 1
  priceSelectFilter()
  addToUrl()
  getParams()
  renderParams()
}

// filter the product through price range
function priceSelectFilter(){
  displayPriceRange = ""
  dataFilteredByRange = []

  if (priceChoosen == 'All'){
    dataFilteredByRange = dataArray
    return
  }

  if (priceChoosen == '400') {
    dataFilteredByRange = dataArray.filter(data => data.price > priceChoosen)
    return
  }

  dataFilteredByRange = dataArray.filter(data => data.price >= priceChoosen && data.price < (100 + parseInt(priceChoosen)))

}

// change sort option
function sortByPrice(obj){
  sortChoosen = obj.value
  currentPage = 1
  sortByPriceFilter()
  addToUrl()
  getParams()
  renderParams()
}

// reorder the product through sort option
function sortByPriceFilter(){
  dataSortByPrice = [...dataFilteredByRange]
  switch (sortChoosen) {
    case 'default':
      dataSortByPrice = dataFilteredByRange
      break;

    case 'ascend':
      dataSortByPrice.sort(function(a,b){return a.price-b.price})
      break;
    
    case 'descend':
      dataSortByPrice.sort(function(a,b){return b.price-a.price})
  }
}

// click search button
function search(){
  currentPage = 1
  searchFilter()
  addToUrl()
  getParams()
  renderParams()
}

// filter the product through searchinput
function searchFilter(){
  
  let searchInput = document.querySelector("#searchInput")
  searchInputValue = searchInput.value
  searchArr = dataSortByPrice.filter(data => 
    data.title.toLowerCase().search(searchInputValue.toLowerCase()) !== -1
  )
}

// add params to url
function addToUrl(){
  history.pushState({}, '', url + `?category=${categoryChoosen}&range=${priceChoosen}&sort=${sortChoosen}&search=${searchInputValue}&page=${currentPage}`)
}

// get params which is in URL
function getParams(){
  urlParams = new URLSearchParams(window.location.search)
  
  category = urlParams.get('category') == null ? 0 : urlParams.get('category')
  price = urlParams.get('range') == null ? "All" : urlParams.get('range')
  sort = urlParams.get('sort') == null ? "default" : urlParams.get('sort')
  searchValue = urlParams.get('search') == null ? '' : urlParams.get('search')
  currentPage = urlParams.get('page') == null ? 1 : urlParams.get('page')

  categoryChoosen = category
  priceChoosen = price
  sortChoosen = sort
}

// change the seleted options
function changeSelected(){
  let categorySelector = document.querySelector(`#category${category}`)
  categorySelector ? categorySelector.selected=true : ''

  let rangeSelector = document.querySelector(`#range${price}`)
  rangeSelector ? rangeSelector.selected=true : ''

  let sortSelector = document.querySelector(`#${sort}`)
  sortSelector ? sortSelector.selected=true : ''

  let searchContent = document.querySelector(`#searchInput`)
  searchContent.value = searchValue
}

// filter the data and render it
function renderParams() {
  changeSelected()
  categoryFilter()
  priceSelectFilter()
  sortByPriceFilter()
  searchFilter()
  renderData(searchArr)
}

// trigger search when press enter
function searchEvent(event) {
  if (event.keyCode == 13){
    search()
  }
}

// render the filtered array
function renderData(array) {
  
  if (array.length == 0) {
    contentContainer.innerHTML = `<div>No Product Found</div>`
    pageBarContainer.innerHTML = ''
    return
  }

  let temp = groupedArray(array, num)
  paginatedArray = temp.newArray
  totalPage = temp.totalPage

  renderPage(paginatedArray, currentPage, totalPage)
}

// groupedArray
function groupedArray(array, n) {
  let len = array.length;
  let totalPage = len / n === 0 ? len / n : Math.floor( (len / n) + 1 )
  let newArray = [];
  for (let i = 0; i < totalPage; i++) {
    let temp = array.slice(i*n, (i+1)*n)
    newArray.push([...temp])
  }
  return ({newArray,totalPage})
}

// renderPage
function renderPage(paginatedArray, currentPage, totalPage) {
  let displayProduct = '' 
  paginatedArray[currentPage-1].forEach( data => {
    displayProduct = displayProduct + 
      `
      <div class="col-md-6 col-lg-3 mb-5 productContainer">
        <img class="mb-2" src="${data.productMedia[0]?imageUrl+data.productMedia[0].url:''}" alt="image">
        <a href="./details.html?id=${data.prodId}" ><h5 class="title">${data.title}</h5></a>
        <h5 class="price">Price: $ ${data.price ? data.price : ''}</h5>
      </div>
      `
  })

  contentContainer = document.getElementById('contentContainer')
  contentContainer.innerHTML = displayProduct

  let pageBar = ''
  let pageNav = ''

  for ( let i = 0; i < totalPage; i++ ) {
    pageNav = pageNav + `<a href="" id="page${i+1}">${i+1} </a>`
  }

  pageBar = `
    <div class="col-12 pagebar" id="pageBar">
      <a href="javascript:" id="prevButton">&lt;Previous&gt; </a>
      <span id="pageNumContainer">${pageNav}</span>
      <a href="javascript:" id="nextButton"> &lt;Next&gt; </a>
      <span>Current Page / Total Page: ${currentPage} / ${totalPage}</span>
    </div>
    `
  pageBarContainer = document.querySelector('#pageBarContainer')
  pageBarContainer.innerHTML = pageBar

  addEventToPageBar(paginatedArray)
}

// add click event to pageBar
function addEventToPageBar(paginatedArray){

  // add click event to pageNum
  let pageNumContainer = document.querySelector('#pageNumContainer')
  pageNumContainer.addEventListener('click', (evt)=>{
    evt.preventDefault()
    // get id from the event
    currentPage = evt.target.id.substring(4)
    addToUrl()
    renderPage(paginatedArray, currentPage, totalPage)
  })

  // add click event to previous button
  let prevButton = document.querySelector('#prevButton')
  prevButton.addEventListener('click', (evt)=>{
    currentPage = currentPage == 1 ? 1 : parseInt(currentPage) - 1
    addToUrl()
    renderPage(paginatedArray, currentPage, totalPage)
  })
  
  // add click event to next button
  let nextButton = document.querySelector('#nextButton')
  nextButton.addEventListener('click', (evt)=>{
    currentPage = currentPage == totalPage ? totalPage : parseInt(currentPage) + 1
    addToUrl()
    renderPage(paginatedArray, currentPage, totalPage)
  })
}

// initial variable declaration 
let initialData = []
let displayCategories = ""
let displayContent = ""
let categoryChoosen = 0
let categoryArray = []
let dataArray = []
let priceChoosen = "All"
let displayPriceRange = ""
let dataFilteredByRange = []
let sortChoosen = "default"
let dataSortByPrice = []
let categorySelection = null
let searchArr = []
let contentContainer = ''
let pageBarContainer = ''
let searchInputValue = ''
let urlParams = ''
let category = ''
let range = ''
let sort = ''
let searchValue = ''

// set up how many products in one page
let num = 12

let currentPage = 1
let totalPage = 0
let paginatedArray = []

let imageUrl = 'https://storage.googleapis.com/luxe_media/wwwroot/'
let url = window.document.location.pathname






