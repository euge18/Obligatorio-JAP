var  cart = [];

// Eliminar producto 
function eliminarArticulo(indice) {
    if (cart.length > 0) {
        cart.splice(indice, 1);
        showCart(cart);
    }
}

// Mostar el carrito con dos artíclos pre-cargados.
function showCart(array) {

         let htmlContentToAppend = "";
            for (let i = 0; i < array.length; i++) {
                let article = array[i];
                
                htmlContentToAppend += `
                    <div id="productBox" class="container">
                    <div class="row">
                    <div class = "col-sm">
                    <img  id="imgProd" src=" ` + article.src + `" class="img-fluid img-thumbnail" width="200">
                    <p><b>Nombre:</b> ` + article.name + `</p>
                    <p><b>Cantidad: </b><input type="number" value="`+ article.count +`" class="productCount"></p>
                    <p><b>Precio unitario:</b> ` + article.unitCost + `</p>
                    <p><b>Moneda:</b> ` + article.currency + `</p>
                    <p><b> Subtotal: </b><span class="subTotal"></span></p>
                    <td><button class="btn btn-danger" onclick="eliminarArticulo(`+ i +`);">Eliminar</button></td>
                    <hr>
                    </div>
                    </div>
                    </div>
                    
                    `

            }
            document.getElementById("cartField").innerHTML = htmlContentToAppend;
    subtotalCost();
    
}

// Obtener el subtotal de los artículos que están en el carrito.
function subtotalCost() {
    
    let finalTotal = 0;
    let almostTotal = 0;
    let sub = document.getElementsByClassName("subTotal"); // Especifico donde voy a colocar el resultado del subtotal
    let count = document.getElementsByClassName("productCount");// Especifico de dónde voy a obtener el dato de la cantidad de productos
    let send = document.getElementById("sendProduct").value;
    
    for (let i = 0; i < cart.length; i++) {
        let result; // Resultado del subtotal
        let result2; // Resultado del total final 
        
        let cost = cart[i].unitCost;// Variable que contiene el costo unitario de los productos.
        cart[i].count = count[i].value;// Variable que contiene el value del input de la cantidad de productos.
        
        // Si la moneda del costo del producto es en USD, se pasa a pesos, multiplicandolo por 40, sino solo se hace precio por cantidad.
        if (cart[i].currency == 'USD') {
            result = cost * cart[i].count * 40;
        } else {
            result = cost * cart[i].count;
        }
        
        sub[i].innerHTML = result + " UYU"; // Agrega el subtotal al html
        almostTotal += result; 

        // Calcula el precio de envío según el porcentaje seleccionado.
        if (send == 1) {
            result2 = result + (result * 0.05); // Satndard
        } else if (send == 2) {
            result2 = result + (result * 0.07); // Express
        } else if (send == 3) {
            result2 = result + (result * 0.15); // Premium
        } else {
            result2 = result;
        }

        finalTotal += result2;
    
    }
    document.getElementById("casiTotal").innerHTML = almostTotal;// Agrega el total al html.
    document.getElementById("finalTotal").innerHTML = finalTotal;
    
}

//Validacion direccion y redirigir home.html
function ok() {
    let pais = document.getElementById("pais").value;
    let calle = document.getElementById("calle").value;
    let numero = document.getElementById("numero").value;
    let esquina = document.getElementById("esquina").value;

    if (pais != '' && calle != '' && numero != '' && esquina != '') {
        location.href = "home.html";
    }
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART_INFO_URL_2).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cart = resultObj.data.articles;


            showCart(cart);
        }
        
        let prodCount = document.getElementsByClassName("productCount");

        // Cada vez que agrego un número en la cantidad de productos(input) me realiza la función de subtotal.
        for (let i = 0; i < prodCount.length; i++) {
            prodCount[i].addEventListener("input", function () {
                subtotalCost();
                
            });
        
        }
    
    });

    document.getElementById('formaDePago').addEventListener('change', function () {

        let metodoPago = document.getElementById('formaDePago').value;
        let div = document.getElementById('div-formaDePago');

        if (metodoPago == 'transferencia') {
            div.innerHTML = `
                <div id="transferencia">
                    <div class="form-group">
                        <select class="form-control transferencia" required>
                            <option>BROU</option>
                            <option>Santander</option>
                            <option>Itau</option>
                            <option>BBVA</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control tarjeta" placeholder="Nombre del titular" required>
                        <div class="invalid-feedback">
                            Ingrese el nombre del titular por favor
                        </div>
                    </div>
                    <div class="form-group">
                        <input type="text" class="form-control tarjeta" placeholder="Número de cuenta" pattern="[0-9]+" required>
                        <div class="invalid-feedback">
                            Ingrese el número por favor
                        </div>
                    </div>
                </div>
            `;
        } else if (metodoPago == 'tarjeta') {
            div.innerHTML = `
            <div id="tarjeta">
                <div class="form-group">
                    <input type="text" class="form-control tarjeta"
                        placeholder="Numero de tarjeta (sin espacios)" pattern="[0-9]{16}" required>
                    <div class="invalid-feedback">
                        Ingrese su numero de tarjeta por favor
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control tarjeta" placeholder="Vencimiento (MM/YYYY)"
                        pattern="[0-9]{2}/[0-9]{4}" required>
                    <div class="invalid-feedback">
                        Ingrese el vencimiento de su tarjeta por favor
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control tarjeta" placeholder="Código de seguridad" required>
                    <div class="invalid-feedback">
                        Ingrese el codigo de seguridad de su tarjeta por favor
                    </div>
                </div>
            </div>
        `;
        }
    });

});