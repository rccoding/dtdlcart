// Initial hardcoded cart items
const initialCartItems = [
    { id: 1, name: 'Item 1', price: 10 },
    { id: 2, name: 'Item 2', price: 15 },
    { id: 3, name: 'Item 3', price: 20 },
  ];
  
  // Function to add an item to the cart
  export const addItemToCart = (cartItems, itemToAdd) => {
    return [...cartItems, itemToAdd];
  };
  
  // Function to remove an item from the cart
  export const removeItemFromCart = (cartItems, itemIdToRemove) => {
    return cartItems.filter(item => item.id !== itemIdToRemove);
  };
  
  export { initialCartItems };