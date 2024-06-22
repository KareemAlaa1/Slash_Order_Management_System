# Order Management System


## Description

### Order Management
1. **Create Order: Users can create new orders.**
2. **Retrieve Orders: Users can view their order history.**
3. **Update Order Status: Admins can update the status of an order (e.g., from 'Pending' to 'Shipped').**
4. **Apply Coupon: Users can apply discount coupons to their orders.**

### Cart Management
1. **Add to Cart: Users can add products to their shopping cart.**
2. **Update Cart: Users can update quantities of products in their cart.**
3. **Remove from Cart: Users can remove products from their cart.**
4. **Retrieve Cart: Users can view the contents of their current cart.**

## Installation
1. **Clone the repository:**
   ```bash
    git clone https://github.com/KareemAlaa1/Slash_Order_Management_System.git
    cd Slash_Order_Management_System
    ```
2. ```bash
    npm install
    ```
3. **if there are some errors you can use**
   ```bash
    npm update 
    ``` 
4. ```bash
    npx prisma migrate dev
    npx prisma generate 
    ```
## Start the application
  ```bash
   npm run start:dev
```

## Start the tests
  ```bash
   npm run test
   ```

## API Documentation
https://app.swaggerhub.com/apis-docs/kareemalaa555/Slash/1.0.0#/
