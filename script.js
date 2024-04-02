const btnCart=document.querySelector('#cart-icon');
const cart=document.querySelector('.cart');
const btnClose=document.querySelector('#cart-close');

document.addEventListener('DOMContentLoaded', () => {
    // Initially hide the cart
    cart.classList.remove('cart-active');

    // Event listener to show the cart on button click
    btnCart.addEventListener('click', () => {
        cart.classList.add('cart-active');
    });

    // Event listener to hide the cart on close button click
    btnClose.addEventListener('click', () => {
        cart.classList.remove('cart-active');
    });

    
    LoadFood();
});


document.addEventListener('DOMContentLoaded',LoadFood);

function LoadFood(){

    LoadContent();

}

function LoadContent(){
//remove food items from cart
let btnRemove=document.querySelectorAll('.cart-remove');

btnRemove.forEach((btn)=>{
    btn.addEventListener('click',removeItem);
});

// product item qty change event

let qtyElements=document.querySelectorAll('.cart-quantity');

qtyElements.forEach((input)=>{
    input.addEventListener('change',changeQty);
});

//Product cart click
let cartbtn=document.querySelectorAll('.add-cart');
cartbtn.forEach((btn)=>{
    btn.addEventListener('click',addcart);
});

updateTotal();
}


//remove Items
function removeItem(){
    if(confirm("Are You Sure Remove This Item?")){
        // permanant remove some cart item into array
        let title=this.parentElement.querySelector('.cart-food-title').innerHTML; 
        itemList=itemList.filter(el=>el.title!=title);                 
    this.parentElement.remove();
    LoadContent();
    }
}
//chage quantity
function changeQty(){
    if(isNaN(this.value) || this.value<1){
        this.value=1
    }
    LoadContent()
}

let itemList=[];

//add cart
function addcart(){
    //storing cart product values
   let food=this.parentElement;
   let title=food.querySelector(".food-title").innerHTML;

   let price=food.querySelector(".food-price").innerHTML;

   let imgsrc=food.querySelector(".food-img").src;
     //storing cart product values end

   let newProduct={title,price,imgsrc}


   // js code change div
   let newProductElement=createCartProduct(title,price,imgsrc)

   
   //check prduct alredy exist in cart
   if(itemList.find((el)=>el.title==newProduct.title))
   {
    alert('Product Already Added In Your Cart!');
    return;
   }
   else{
    itemList.push(newProduct);
   }

   //cart item code to change element

   let element=document.createElement('div');
   element.innerHTML=newProductElement;

   let cartBasket=document.querySelector(".cart-content");

   cartBasket.append(element);

   LoadContent(); 

}
   function createCartProduct(title,price,imgsrc){
    return `
    <div class="cart-box">
            <img src="${imgsrc}" class="cart-img">
            <div class="detail-box">
              <div class="cart-food-title">${title}</div>
              <div class="price-box">
                <div class="cart-price">${price}</div>
                <div class="cart-amt">${price}</div>
              </div>
              <input type="number" value="1" class="cart-quantity">
            </div>
            <ion-icon name="trash-outline" class="cart-remove"></ion-icon>
          </div>
        </div> 
      `;
   }

   function updateTotal()
   {
        const cartItem=document.querySelectorAll('.cart-box');
        const totalValue=document.querySelector('.total-price');

        let total=0;

        cartItem.forEach((product)=>{

            let priceElement=product.querySelector('.cart-price');
            let price=parseFloat(priceElement.innerHTML.replace("Rs.","")); //parsefloat is change string into floatnumber , replace is remove tha 'Rs' string value
            let qty=product.querySelector('.cart-quantity').value;
            total+=(price*qty); // qty*price value store in Total.

            product.querySelector('.cart-amt').innerText="Rs."+(price*qty); // element right side total value
        })
 
        totalValue.innerHTML='Rs.'+total;  // over all total value

        // add product count cart Icon

        const cartCount=document.querySelector('.cart-cound');
        let count=itemList.length;
        cartCount.innerHTML=count;

        // cart icon showing and hidden event
        if(count==0)
        {
            cartCount.style.display='none'; 
        }
        else
        {
            cartCount.style.display='block'; 
        }
   }
// shiping form order now button
const orderbtn=document.querySelector('#Orderbtn');

orderbtn.addEventListener('click',(e)=>{
  e.preventDefault();
  alert('Order Placed !!');
  window.location.assign("index.html");
 
});



          