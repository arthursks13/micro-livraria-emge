const grpc = require('@grpc/grpc-js');
const products = require('./products.json');
const protoLoader = require('@grpc/proto-loader');
const productsRepository = JSON.parse(JSON.stringify(products));

const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

AddProduct: (payload, callback) => {
        let id = 1;
        for (const item of products){
            if (item.id >= id) {
                id = item.id + 1;
            }}
    
        const product = payload.request;
        product.id = id;
        productsRepository.push(product);
        console.log(product);
        callback(null, product);
    },
        
// implementa os métodos do InventoryService
server.addService(inventoryProto.InventoryService.service, {
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products,
        });
    },
        SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },
    
    UpdateInventory: (payload, callback) => {
        let product = products.find((product) => product.id == payload.request.id)
        product.quantity--;
        console.log(product);
        callback(
            null,
            product
        );
    },
});

server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start();
});
