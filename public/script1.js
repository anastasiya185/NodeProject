var cartArr = []

const getProducts = async (filter) => {
    //init cartArr when sorting or opening index3.html
    cartArr = []
    localStorage.setItem('cartArr', JSON.stringify(cartArr))
    url = ''
    if (filter === undefined) {
      url = '/products1'
    }
    else {
      url = `/products1?filter=${filter}`
    }
    const res = await fetch(url, {
      method: "GET"
    })
    let products = await res.json()
    let container = document.getElementById('container')
  
    let existingTable = document.getElementById('products')
    if (existingTable !== null) {
      container.removeChild(existingTable)
    }
  
    let table = document.createElement('table')
    table.id = 'products'
  
    products.forEach(element => {
      const tr = document.createElement('tr')
      tr.addEventListener('click', (event) => {
        console.log(`Name: ${event.currentTarget.cells[0].innerHTML}, Price: ${event.currentTarget.cells[1].innerHTML}`)
        cartArr.push({ 'name': event.currentTarget.cells[0].innerHTML, 'price': parseInt(event.currentTarget.cells[1].innerHTML) })
        localStorage.setItem('cartArr', JSON.stringify(cartArr))
      })
      const name = document.createElement('td')
      name.innerHTML = element.name
      name.className = 'name'
      const price = document.createElement('td')
      price.innerHTML = element.price
  
      tr.appendChild(name)
      tr.appendChild(price)
      table.appendChild(tr)
    });
  
    container.appendChild(table)
    createBuyButton()
  }
  
  const createBuyButton = () => {
    let container = document.getElementById('container')
    const exisitingBuyDiv = document.getElementById('buy')
    if (exisitingBuyDiv !== null) {
      container.removeChild(exisitingBuyDiv)
    }
  
    const div = document.createElement('div')
    div.className = 'grid-item-buy'
    div.id = 'buy'
    const button = document.createElement('button')
    button.className = 'buy-btn'
    button.innerHTML = 'Buy'
    
    button.addEventListener('click', async (event) => {
      window.location.href = "/buy";
    })
  
    div.appendChild(button)
  
    container.appendChild(div)
  }
  
  const getCartDetails = () => {
    const cart = document.getElementById('cart')
  
    let cartLocalStorage = JSON.parse(localStorage.getItem('cartArr') ?? '[]')
  
  
  
    const countOfProducts = document.createElement('div')
    countOfProducts.innerHTML = `Total Products: ${cartLocalStorage.length}`
  
    let sum = 0
    cartLocalStorage.forEach(product => {
      sum += product.price
    })
  
    const sumOfProducts = document.createElement('div')
    sumOfProducts.innerHTML = `Total Products: ${sum}`
  
    cart.appendChild(countOfProducts)
    cart.appendChild(sumOfProducts)
  }
  
  const approve = async () => {
    let cartLocalStorage = JSON.parse(localStorage.getItem('cartArr') ?? '[]')
    let email = "oshratush1996@gmail.com"
    if (cartLocalStorage.length === 0) {
      alert('the cart is empty!')
    }
    else {
      const response = await fetch("/purchase", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'email': email, 'cart': cartLocalStorage }),
      })
      
      if (response.status === 200) {
        cartArr = []
        localStorage.setItem('cartArr', JSON.stringify(cartArr))
        window.location.href = "/";
      }
      else{
        alert('Error on server!')
      }
    }
  
  }
  
  const sort = () => {
    const sortSelect = document.getElementById('sortSelect')
    if (sortSelect.value === '1') {
      getProducts('name')
    }
    else if (sortSelect.value === '2') {
      getProducts('price')
    }
    else {
      getProducts()
    }
  }
  
  const getOrders=async ()=>{
    const res = await fetch('/orders?admin=true', {
      method: "GET"
    })
    let orders = await res.json()
    let container = document.getElementById('container')
  
    let table = document.createElement('table')
    let trHeader=document.createElement('tr')
    let thEmail=document.createElement('th')
    thEmail.innerHTML='Email'
    let thCount=document.createElement('th')
    thCount.innerHTML='Count'
    let thSum=document.createElement('th')
    thSum.innerHTML='Sum'
  
    trHeader.appendChild(thEmail)
    trHeader.appendChild(thCount)
    trHeader.appendChild(thSum)
  
    table.appendChild(trHeader)
  
    orders.forEach(element => {
      const tr = document.createElement('tr')
  
      const email = document.createElement('td')
      email.innerHTML = element.email
      const countOfProducts = document.createElement('td')
      countOfProducts.innerHTML = element.cart.length
  
      const sumOfProduct = document.createElement('td')
      sum=0
      element.cart.forEach(cartProduct=>{
        sum+=cartProduct.price
      })
      sumOfProduct.innerHTML = sum
  
      tr.appendChild(email)
      tr.appendChild(countOfProducts)
      tr.appendChild(sumOfProduct)
      table.appendChild(tr)
    });
  
    container.appendChild(table)
  }