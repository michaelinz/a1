// Get data from API
(function getApiData1() {
  fetch('https://luxedreameventhire.co.nz:5001/api/products')
      .then(response => response.json())
      .then(data => {
          // console.log(data)
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
  const re = new RegExp(searchInput.value,'i');
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
    display = display + `<div class="col-md-6 col-lg-3 mb-4 ">` + data.title + `<br> Price: $` + (data.price ? data.price : '') + '</div>'
  })
  contentContainer = document.getElementById('contentContainer')
  contentContainer.innerHTML = display
}


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




