 import {CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD} from '../constance/cartConstance'

export const cartReducer = ( state = { cartItems2: [], shippingAddress: {}}, action) => {
    switch(action.type){
        case CART_ADD_ITEM:

            const item = action.payload
            console.log(item)
            const existItem= state.cartItems2.find(x => x.product === item.product)  // It exists 
            console.log(existItem)
            console.log(state)
            if(existItem)
            {
                return{
                ...state,
                cartItems2: state.cartItems2.map(x => x.product === existItem.product ? item : x) //what
            }
        }
            else
            {
                return{
                    ...state,
                    cartItems2: [...state.cartItems2,item]
                }
            }

            case CART_REMOVE_ITEM:
                return{
                    ...state,
                    cartItems2: state.cartItems2.filter(x=>x.product !== action.payload)
                }

                case CART_SAVE_SHIPPING_ADDRESS:
                    return {
                      ...state,
                      shippingAddress: action.payload,
                    }

                    
                case CART_SAVE_PAYMENT_METHOD:
                    return {
                      ...state,
                      paymentMethod: action.payload,
                    }
        default:
                return state
    }
}