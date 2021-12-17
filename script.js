// Get data from API
function getApiData1() {
    fetch('https://luxedreameventhire.co.nz:5001/api/products')
        .then(response => response.json())
        .then(data => {
            console.log(data),
            initalData = data
            displayData()
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


// Based on the data, 
// 1. see if we will use this data,
// 2. render content for that data
// 3. loop for category 
function displayData() {
    displayContent = ""

    initalData.forEach(data => {
        // get categoryid
        // if the categoryid does not yet exist on the categroy array, we push this id to the array

        if (data.category && data.category.categoryId) {
            if (!categoryArray.find(category => category.id == data.category.categoryId)) {
                categoryArray.push({
                    id: data.category.categoryId,
                    name: data.category.categoryName,
                })

                displayCategories = displayCategories + `<option value=${data.category.categoryId}>"${data.category.categoryName}"</option> `
            }
        }

        if (!data.price || categoryChoosen && data.categoryId != categoryChoosen) {
            return;
        }

        displayContent = displayContent + `<div class="col-md-6 col-lg-3 mb-4 ">` + data.title + `<br> Price: $` + (data.price ? data.price : '') +
            '</div>'
    });
    renderContent()
    console.log(categoryArray)

}

// Inject the content into html
function renderContent() {
    document.getElementById('contentContainer').innerHTML = displayContent
    document.getElementById('productSelection').innerHTML = displayCategories
}

// Triggered by change in HTML selection 
// If changed, go to displayData
function categorySelectChange(ob) {
    console.log(ob.value)
    categoryChoosen = ob.value
    displayData()
}

// initial variable declaration 
let initalData = null
let displayCategories = ""
let displayContent = ""
let categoryChoosen = 0
let categoryArray = []

getApiData1()

