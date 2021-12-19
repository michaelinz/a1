// Get data from API
(function getApiData1() {
  fetch('https://luxedreameventhire.co.nz:5001/api/products')
      .then(response => response.json())
      .then(data => {
        initalData = data
        displayAll()
      });
})()



// method 2 
async function getApiData2() {
  try {
    const res = await fetch('https://luxedreameventhire.co.nz:5001/api/products');
    console.log(res.json())
  } catch (err) {
    console.error(err)
  }
}


function displayAll(){
  displayClass()
  displayData()
}

function displayClass() {
  displayCategories = `<option value='All'>All</option> `
  initalData.forEach(data => {
    // get categoryid
    // if the categoryid does not yet exist on the categroy array, we push this id to the array
    if (data.category && data.category.categoryId) {
      if (!categoryArray.find(category => category.id == data.category.categoryId)) {
        categoryArray.push({
            id: data.category.categoryId,
            name: data.category.categoryName,
        })

        displayCategories = displayCategories + `<option value=${data.category.categoryId}>${data.category.categoryName}</option> `
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

  initalData.forEach(data => {
    console.log(data.productMedia[0]?imageUrl+data.productMedia[0].url:'')
    if(categoryChoosen == '' && data.price){
      dataArray.push(data)
      return
    }

    if (categoryChoosen == "All" || data.categoryId == categoryChoosen && data.price){
      dataArray.push(data)
      return
    }
  });
  dataFilteredByRange = dataArray
  renderData(dataArray)
}

// Inject the content into html


function categorySelectChange(obj) {
  // console.log(obj.value)
  categoryChoosen = obj.value
  displayData()
}

function priceSelectChange(obj) {
  priceChoosen = obj.value
  displayPriceRange = ""
  dataFilteredByRange = []

  if (priceChoosen == 'All'){
    dataFilteredByRange = dataArray
    renderData(dataFilteredByRange)
    return
  }

  if (priceChoosen == '400') {
    dataFilteredByRange = dataArray.filter(data => data.price > priceChoosen)
    renderData(dataFilteredByRange)
    return
  }

  dataFilteredByRange = dataArray.filter(data => data.price >= priceChoosen && data.price < (100 + parseInt(priceChoosen)))
  renderData(dataFilteredByRange)
}

function sortByPrice(obj){
  sortChoosen = obj.value
  dataSortByPrice = [...dataFilteredByRange]
  if (sortChoosen == 'default') {
    dataSortByPrice = dataFilteredByRange
    renderData(dataSortByPrice)
  }

  if (sortChoosen == 'ascend'){
    dataSortByPrice.sort(function(a,b){return a.price-b.price})
    renderData(dataSortByPrice)
    return
  }

  if (sortChoosen == 'descend'){
    dataSortByPrice.sort(function(a,b){return b.price-a.price})
    renderData(dataSortByPrice)
    return
  }
}

function search(){
  const searchInput = document.querySelector("#searchInput")

  const re = new RegExp(searchInput.value, 'i');
  searchArr = dataFilteredByRange.filter(data => 
    data.title.search(re) !== -1
  )

  renderData(searchArr)
  console.log(searchArr)
  searchInput.value = ''
  if (searchArr.length == 0) {
    contentContainer.innerHTML = `<div>No Product Found</div>`
  }
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
let initalData = null
let displayCategories = ""
let displayContent = ""

let categoryChoosen = 0
let categoryArray = []
let dataArray = []
let priceChoosen = 0
let displayPriceRange = ""
let dataFilteredByRange = []
let sortChoosen = ""
let dataSortByPrice = []
let categorySelection = null
let contentContainer = null

let imageUrl = 'https://storage.googleapis.com/luxe_media/wwwroot/'





