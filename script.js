// Get data from API
function getApiData1() {
  fetch('https://luxedreameventhire.co.nz:5001/api/products')
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      initialData = data
      displayAll()
    });
}

// method 2 
async function getApiData2() {
  try {
    const res = await fetch('https://luxedreameventhire.co.nz:5001/api/products');
    console.log(res.json())
  } catch (err) {
    console.error(err)
  }
}

// Initialise or Refresh
window.addEventListener('load',()=>{
  getApiData1()
})

// go forward or go back
window.addEventListener('popstate',()=>{
  getParams()
})


function storeData(){
  window.sessionStorage.setItem("category", category)
  window.sessionStorage.setItem("range", range)
  window.sessionStorage.setItem("sort", sort)
  window.sessionStorage.setItem("search", searchValue)
}

function getStoreData(){
  categoryChoosen = window.sessionStorage.getItem("category") == null ? 0 : window.sessionStorage.getItem("category")
  priceChoosen = window.sessionStorage.getItem("range") == null ? "All" : window.sessionStorage.getItem("range")
  sortChoosen = window.sessionStorage.getItem("sort") == null ? "default" : window.sessionStorage.getItem("sort")
  searchInputValue = window.sessionStorage.getItem("search") == null ? "" : window.sessionStorage.getItem("search")
}


function displayAll(){
  displayClass()
  displayData()
  getStoreData()
  addToUrl()
  getParams()
}

function displayClass() {
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

        displayCategories = displayCategories + `<option value=${data.category.categoryId} id="category${data.category.categoryId}">${data.category.categoryName}</option> `
      }
    }
  });
  categorySelection = document.getElementById('categorySelection')
  categorySelection.innerHTML = displayCategories
  // console.log(categoryArray)
}

function displayData() {
  displayContent = ""
  dataArray = []
  // console.log(initialData)
  initialData.forEach(data => {
    // console.log(data.productMedia[0].url?imageUrl+data.productMedia[0].url:'')
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
  // search()
}

// Inject the content into html


function categorySelectChange(obj) {
  categoryChoosen = obj.value
  displayData()
  addToUrl()
  getParams()
}

function priceSelectChange(obj) {
  priceChoosen = obj.value
  priceSelectFilter()
  addToUrl()
  getParams()
}

function priceSelectFilter(){
  // console.log(priceChoosen)
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

function sortByPrice(obj){
  sortChoosen = obj.value
  sortByPriceFilter()
  addToUrl()
  getParams()
}

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

function search(){
  searchFilter()
  addToUrl()
  getParams()
}

function searchFilter(){
  let searchInput = document.querySelector("#searchInput")
  searchInputValue = searchInput.value
  // const re = new RegExp(searchInputValue, 'i');
  searchArr = dataSortByPrice.filter(data => 
    data.title.toLowerCase().search(searchInputValue.toLowerCase()) !== -1
  )
  if (searchArr.length == 0) {
    contentContainer.innerHTML = `<div>No Product Found</div>`
  }
}

function addToUrl(){
  history.pushState({}, '', url + `?category=${categoryChoosen}&range=${priceChoosen}&sort=${sortChoosen}&search=${searchInputValue}`)
}


function getParams(){
  urlParams = new URLSearchParams(window.location.search)

  category = urlParams.get('category')
  range = urlParams.get('range')
  sort = urlParams.get('sort')
  searchValue = urlParams.get('search')

  categoryChoosen = category
  priceChoosen = range
  sortChoosen = sort

  changeSelected()
  storeData()
  renderParams()
}

function changeSelected(){
  let categorySelector = document.querySelector(`#category${category}`)
  categorySelector ? categorySelector.selected=true : ''

  let rangeSelector = document.querySelector(`#range${range}`)
  rangeSelector ? rangeSelector.selected=true : ''

  let sortSelector = document.querySelector(`#${sort}`)
  sortSelector ? sortSelector.selected=true : ''

  let searchContent = document.querySelector(`#searchInput`)
  searchContent.value = searchValue
}

function renderParams() {
  displayData()
  priceSelectFilter()
  sortByPriceFilter()
  searchFilter()
  renderData(searchArr)

}



function searchEvent(event) {
  if (event.keyCode == 13){
    search()
  }
}

function renderData(array) {
  let display = ''
  array.forEach( data => {
    display = display + 
      `
      <div class="col-md-6 col-lg-3 mb-5 productContainer">
          <img class="mb-2"src="${data.productMedia[0]?imageUrl+data.productMedia[0].url:''}" alt="image">
          <h5 class="title">${data.title}</h5>
          <h5 class="price">Price: $ ${data.price ? data.price : ''}</h5>
      </div>
      `
  })
  contentContainer = document.getElementById('contentContainer')
  contentContainer.innerHTML = display
}



// 1. URL to store state => function to append url params 
  //  1a. Add searchvalue=x1 , category = x2
  //  1b. Append them to the URL


  // 2. Get the state from the URL (this runs on initialisation)
  // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

  // 3. According to the state, filter the datas. 




  // Pagination
  // [{}, {}, {}, {}]
  // [[{},{}], [{},{}], [{},{}]]
  // 1. Split array into even chucks 100 / 12 
  //     1a. have a array of chunk arrays

  // 2. Get which small array to use, from query param, Send the small array (page array) into Render data

  // 3. Render data


  // UI 
  // . Get total number of pages based on how many small arrays are there
        // . Enable next and previous pages

     




// initial variable declaration 
let initialData = null
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
let contentContainer = ''
let searchInputValue = ''
let urlParams = ''
let category = ''
let range = ''
let sort = ''
let searchValue = ''
let imageUrl = 'https://storage.googleapis.com/luxe_media/wwwroot/'
let url = 'C:/Users/Administrator/Desktop/new/a1/index.html'






