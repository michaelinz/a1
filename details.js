
// get product id from url

// call api with the product id

// display info
window.addEventListener('load',()=>{
  let id = getId()
  getProduct(id).then(productObj => displayDetails(productObj))
})

// get id from url
function getId() {
  let urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('id')
}

// get product from api
async function getProduct(id) {
  try {
    const res = await fetch(`https://luxedreameventhire.co.nz:5001/api/Products/${id}`)
    return res.json()
  } catch (err) {
    console.error(err)
  }
}

// show Details
function  displayDetails(productObj) {
  renderDetails = `
  <div class="row">

    <div class="col-5">
      <img class="mt-5" src="${imageUrl+productObj.productMedia[0].url}" alt="">
    </div>
    
    <div class="col-7 mt-5 detailsContent">
      <h2>Product name: ${productObj.title}</h2>
      <h3>Category: ${productObj.category.categoryName}</h3>    
      <h3>Price: $ ${productObj.price}</h3>
      <h3>AvailableStock: ${productObj.availableStock}</h3>
      <br/>
      <h3>Description: ${productObj.description}</h3>
    </div>

  </div>
  `
  let detailsContainer = document.querySelector(".detailsContainer")
  detailsContainer.innerHTML = renderDetails
}



// initial variable declaration 
let renderDetails = ''
let imageUrl = 'https://storage.googleapis.com/luxe_media/wwwroot/'