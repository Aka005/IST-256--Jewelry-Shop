// File: createJewelryCollection.js

// Select the database to use
use('newJewelryDatabase');

// Create the Jewelry collection with initial documents
db.getCollection('jewelry').insertMany([
    {
        "idx": 0,
        "name": "Cartier Love Bracelet",
        "type": "Bracelet",
        "metal": "18k Yellow Gold",
        "cost": "$6,900",
        "image": "images/CartierLoveBracelet.jpg",
        "inCart": false
    },
    {
        "idx": 1,
        "name": "Tiffany & Co. Soleste Ring",
        "type": "Ring",
        "metal": "Platinum",
        "cost": "$12,000",
        "image": "images/Tiffany&CoSolesteRing.jpg",
        "inCart": false
    },
    // ... Other items omitted for brevity
]);

// File: findSalesOnApril4th.js

// Select the database to use
use('newJewelryDatabase');

// Find and count sales on April 4th, 2014
const salesOnApril4th = db.getCollection('sales').find({
    date: { $gte: new Date('2014-04-04'), $lt: new Date('2014-04-05') }
}).count();

// Print the result to the console
console.log(`${salesOnApril4th} sales occurred in 2014.`);

// File: aggregateSales2014.js

// Select the database to use
use('newJewelryDatabase');

// Aggregate sales data for 2014
db.getCollection('sales').aggregate([
    { $match: { date: { $gte: new Date('2014-01-01'), $lt: new Date('2015-01-01') } } },
    { $group: { _id: '$item', totalSaleAmount: { $sum: { $multiply: ['$price', '$quantity'] } } } }
]);
