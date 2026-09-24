#  Neuffer Frontend Developer Test Task: Shopping Cart Page Implementation

## Description

Implement a responsive shopping cart page based on the provided design mockup. **The mockup serves as a guide for the overall layout, structure, and general appearance; pixel-perfect replication is not required.** However, the final result should visually resemble the mockup reasonably closely.

The task involves fetching initial product data from a public API, displaying cart items with quantity controls, calculating totals, and allowing item removal. You should use **modern Vue.js (e.g., Vue 3 with Composition API preferred)** and **Tailwind CSS** for styling, language **TypeScript**. Your implementation choices regarding state management, component structure, and specific reactivity features will be part of the evaluation.

[Figma](https://www.figma.com/design/2mppTVDIBBU2h7JLmUhmNs/Test-Task-Cart?node-id=0-1&t=G88ScS1O8oBju1zB-1)


## Objectives (Core Functionality)

1.  **Project Setup:**
    *   Set up a modern **Vue.js** project with **TypeScript** (e.g., using **Vite**).
    *   Integrate Tailwind CSS for styling.
2.  **Data Fetching:**
    *   On component mount, fetch product data from the **FakeStoreAPI**. Use **GET** endpoint from `https://fakestoreapi.com/docs#tag/Products` to get few products.
    *   Use this fetched data to populate the initial state of the shopping cart.
3.  **Cart Item Display:**
    *   Render the list of cart items based on the fetched data, generally matching the layout shown (image, title, price, quantity, item total). Use relevant fields from the API response.
4.  **Cart Interactivity:**
    *   Implement controls to allow users to **adjust the quantity** of each item.
    *   Implement functionality to **remove an individual item** from the cart (e.g., via the 'X' button).
    *   Implement the **"Clear Cart"** button functionality to remove all items.
    *   Implement the **"Add Item"** button functionality to add some product to card using **POST** at `https://fakestoreapi.com/docs#tag/Products`:
        ```javascript
        const product = { title: 'New Product', price: 29 }; // this will be in response
        fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => console.log(data)); 
        ```
5.  **Calculations & Summary:**
    *   Dynamically calculate and display the overall **Subtotal** for the items in the cart.
    *   Display the **Total** in the "Cart Totals" section + **tax 20%**.
    *   Include the static "Proceed to Checkout" button (no functionality needed, simple notification is enough).
6.  **Styling & Responsiveness:**
    *   Use **Tailwind CSS** utilities to style the component, aiming for a look that follows the structure and general appearance of the provided mockup.
    *   Ensure the layout is **responsive** and usable on common screen sizes (mobile, desktop).

## (Optional)

*   **Shipping Calculation & State Management:**
    *   Implement the "Calculate Shipping" section UI. Shipping Calculation can be mocked (e.g. generate a random cost on button click).
    *   Integrate a dedicated state management library like **Pinia** to manage the cart state.
    *   Update the "Cart Totals" section to reflect the Subtotal, Shipping cost, and the final Total (Subtotal + Shipping + VAT).
*   **Enhanced Validation:** Add more robust input validation (e.g., for direct quantity input if you choose to implement it).
*   **Unit/Component Tests:** Write tests for key logic (e.g., calculations, state management actions/getters).


## Additional requirements

*   Upload the final Project to a public github repository.
*   Send us a link to the repository so that we may review it.
*   (Optional but nice) Link to a deployed version (e.g., using Netlify, Vercel, GitHub Pages).

## Evaluation Criteria

*   **Functionality:** Does the application meet the core objectives? Is the cart logic correct?
*   **Code Quality & Best Practices:** Is the code clean, readable, maintainable, and follow modern Vue.js and TypeScript standards? (Composition API usage is preferred).
*   **Styling & Responsiveness:** Does the UI reasonably match the mockup guide using Tailwind? Is it responsive?
*   **State Management:** Is component state managed effectively? If Pinia (or another library) is used for the bonus, is it implemented correctly?
*   **Bonus Features:** Assessment of any attempted bonus points.


## Any questions?

Feel free to ask any questions related to the task
