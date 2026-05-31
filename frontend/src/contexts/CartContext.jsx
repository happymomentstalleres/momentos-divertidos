import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

// Acciones del carrito
const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_DRAWER: 'TOGGLE_DRAWER',
}

const initialState = {
  items: [],
  isOpen: false,
}

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const existing = state.items.find(i => i._id === action.payload._id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter(i => i._id !== action.payload) }
    case ACTIONS.UPDATE_QUANTITY:
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i._id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] }
    case ACTIONS.TOGGLE_DRAWER:
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Persistir carrito en sessionStorage
    try {
      const saved = sessionStorage.getItem('cart')
      return saved ? { ...init, items: JSON.parse(saved) } : init
    } catch { return init }
  })

  // Guardar en sessionStorage cuando cambian los items
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product) => dispatch({ type: ACTIONS.ADD_ITEM, payload: product })
  const removeItem = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: id })
  const updateQuantity = (id, quantity) => dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } })
  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART })
  const toggleDrawer = (val) => dispatch({ type: ACTIONS.TOGGLE_DRAWER, payload: val })

  const itemCount = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      toggleDrawer,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
