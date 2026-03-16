let jewelryDataList = []; // To hold the original data
let cartItems = []; // To hold the cart data on the client-side

$(document).ready(function() {
    getJewelryList(); // Fetch initial data

    // Listen for input changes in the search bar
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val(); // Get the user's input
        filterJewelry(searchTerm); // Call filter function
    });

    $('#addToCartButton').on('click', function() {
        updateJSONValues();
        getCartItems(); // Refresh cart display after adding to cart
    });

    // Listen for the Clear Cart button click
    $('#clearCartButton').on('click', function() {
        clearCartOnServer(); // Call the function to clear the cart on the server
    });

    if (window.location.pathname.includes('cart.html')) {
        getCartItems(); // Load the cart items when on cart page
    }
});

function getJewelryList() {
    $.get("/getList", {}, function(data) {
        jewelryDataList = data; // Store the original list globally
        updateJewelry(data); // Display the full list initially
    });
}

function filterJewelry(searchTerm) {
    const filteredData = jewelryDataList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter based on name
    );
    updateJewelry(filteredData); // Update the displayed list with filtered results
}

function updateJewelry(jsonData) {
    $('#jewelryList').empty(); // Clear the existing list

    const row = $("<div></div>").addClass("row"); // Create a Bootstrap row

    for (let i = 0; i < jsonData.length; i++) {
        const jewelryData = jsonData[i];

        const col = $("<div></div>").addClass("col-2 mb-4"); // Create a Bootstrap column (5 columns per row)

        const card = $("<div></div>").addClass("card"); // Optional: Add a card for better styling
        const image = $("<img>")
            .attr("src", jewelryData.image)
            .attr("alt", jewelryData.name)
            .addClass("card-img-top")
            .css({
                "cursor": "pointer"
            })
            .data("id", jewelryData.idx) // Store the id in data attribute
            .on("click", function() {
                $(this).toggleClass("selected"); // Toggle the selected class
            });

        const cardBody = $("<div></div>").addClass("card-body text-center");
        const text = $("<h5></h5>").addClass("card-title").text(jewelryData.name);

        cardBody.append(text);
        card.append(image).append(cardBody);
        col.append(card);
        row.append(col);
    }

    $('#jewelryList').append(row); // Append the row to the list container
}


function updateJSONValues() {
    $('#jewelryList img.selected').each(function() {
        const selectedId = $(this).data("id");

        for (let i = 0; i < jewelryDataList.length; i++) {
            if (jewelryDataList[i].idx === selectedId) {
                jewelryDataList[i].inCart = true;
            }
        }
    });

    updateCartOnServer(); // Send updated cart to the server
}

function updateCartOnServer() {
    $.ajax({
        url: '/updateCart',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ data: jewelryDataList }),
        success: function(response) {
            console.log(response.message);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function getCartItems() {
    $.get('/cart', function(cartData) {
        if (cartData.length === 0) {
            $('#cartItems').html('<p>Your cart is empty.</p>');
        } else {//Handle received cart data and update the UI 
            $('#cartItems').empty();
            cartData.forEach(function(item) {
                const listItem = $("<li></li>");
                const image = $("<img>")
                    .attr("src", item.image)
                    .attr("alt", item.name)
                    .css({
                        "width": "100px",
                        "height": "100px", 
                        "margin-right": "10px"
                    });

                const text = $("<span></span>").text(item.name);

                listItem.append(image).append(text);
                $("#cartItems").append(listItem);
            });
        }
    }).fail(function(xhr, status, error) {
        console.error("Error fetching cart items:", error);
    });
}

// Function to clear the cart on the server and on the client-side
function clearCartOnServer() {
    $.ajax({
        url: '/clearCart',
        method: 'POST',
        success: function(response) {
            console.log(response.message); // Show success message

            // Clear client-side cart data
            cartItems = []; // Reset the cartItems array

            // Refresh the cart display
            getCartItems();
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
