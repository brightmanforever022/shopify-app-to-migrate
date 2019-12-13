import { initializeCart, getCart, addCart, removeCart, plusCartItem, minusCartItem } from '@/api/cart'
import { getWishlist } from '@/api/wishlist'
import { getDiscount } from '@/api/discount'
import { createOrder } from '@/api/order'
import { checkDiscountPeriodValidation, getFreightShippingPrice } from '@/helpers'

const cart = {
  namespaced: true,
  state: {
    line_items: [],
    discount_data: {},
    freight_shipping: 1,
  },
  actions: {
    initCart ({commit}) {
      initializeCart()
      commit('SET_CART', [])
      return []
    },
    get ({commit}) {
      var currentLineItems = getCart()
      commit('SET_CART', currentLineItems)
      return currentLineItems
    },
		async addCart ({commit}, cartData) {
      var cartDataWithID = cartData
      // get wishlist
      const wishList = await getWishlist()
      // Check if this data exists in wishlist
      var dataExists = false
      var existId = ''
      wishList.map(wishItem => {
        if (cartData.variant_id == wishItem.variant_id && JSON.stringify(cartData.custom_options) == JSON.stringify(wishItem.custom_options)) {
          dataExists = true
          existId = wishItem.wishId
        }
      })
      if (dataExists) {
        cartDataWithID.lineId = existId
      } else {
        var d = new Date()
        cartDataWithID.lineId = d.getTime()
      }
      
      var newLineItems = addCart(cartDataWithID)
      commit('SET_CART', newLineItems)
      return newLineItems
		},
		removeCart ({commit}, lineId) {
      var newLineItems = removeCart(lineId)
      commit('SET_CART', newLineItems)
      return newLineItems
		},
		plusCart ({commit}, lineId) {
      var newLineItems = plusCartItem(lineId)
      commit('SET_CART', newLineItems)
      return newLineItems
		},
		minusCart ({commit}, lineId) {
      var newLineItems = minusCartItem(lineId)
      commit('SET_CART', newLineItems)
      return newLineItems
    },
    async getDiscountAmount ({commit}, discountCode) {
      try {
        const priceRules = await getDiscount(discountCode)
        var discount = {}
        if (priceRules.data.discounts.data) {
          priceRules.data.discounts.data.priceRules.edges.map(discountItem => {
            if (discountItem.node.title == discountCode) {
              discount = discountItem.node
            }
          })
        }
        
        commit('SET_DISCOUNT', discount)
      } catch (error) {
        console.log(error)
      }
    },
    setFreightShipping ({commit}, shippingId) {
      commit('SET_FREIGHT_SHIPPING', shippingId)
    },
    async createDraftOrder ({commit, state, getters}) {
      try {
        const orderDiscount = getters.get_discount.toFixed(2)
        const orderFreightShipping = getFreightShippingPrice(state.freight_shipping).toFixed(2)
        const orderTax = (getters.get_sub_total * 0.08625).toFixed(2)
        const draftOrder = await createOrder({lineItems: state.line_items, discountRule: state.discount_data, orderFreightShipping: orderFreightShipping, orderTax: orderTax})
        // Make cart empty
        commit('SET_CART', [])
        return draftOrder.data.draft_order.invoice_url
      } catch (err) {
        console.log(err)
      }
    }
  },
  mutations: {
    SET_CART: (state, data) => {
			state.line_items = data
    },
    SET_DISCOUNT: (state, data) => {
      state.discount_data = data
    },
    SET_FREIGHT_SHIPPING: (state, id) => {
      state.freight_shipping = id
    }
  },
  getters: {
    line_length (state) {
      return state.line_items.length
    },
    get_line_items (state) {
      return state.line_items
    },
    get_quantity_by_id: (state) => (lineId) => {
      var lineQuantity = 0
      state.line_items.map(lineItem => {
        if (lineItem.lineId == lineId) {
          lineQuantity = lineItem.quantity
        }
      })
      return lineQuantity
    },
    get_options_by_id: (state) => (lineId) => {
      var options = {}
      state.line_items.map(lineItem => {
        if (lineItem.lineId == lineId) {
          options = {original: lineItem.selected_options, custom: lineItem.custom_options, quantity: lineItem.quantity}
        }
      })
      return options
    },
    get_sub_total (state) {
      var totalPrice = 0
      state.line_items.map(lineItem => {
        totalPrice += lineItem.calculated_price
      })
      return totalPrice
    },
    get_freight_shipping_price (state) {
      var price = getFreightShippingPrice(state.freight_shipping)
      return {id: state.freight_shipping, shipping_price: price}
    },
    get_discount (state) {
      var totalPrice = 0
      var discountAmount = 0.0
      var validPeriod = checkDiscountPeriodValidation(state.discount_data.startsAt, state.discount_data.endsAt)
      state.line_items.map(lineItem => {
        totalPrice += lineItem.calculated_price
      })
      if (state.discount_data.title != '' && state.discount_data.status == 'ACTIVE' && validPeriod) {
        if (state.discount_data.itemEntitlements.targetAllLineItems) {
          if (state.discount_data.valueV2.percentage) {
            discountAmount = totalPrice * parseFloat(state.discount_data.valueV2.percentage) / 100
          } else {
            discountAmount = parseFloat(state.discount_data.valueV2.amount)
          }
        } else {
          state.line_items.map(lineItem => {
            if (state.discount_data.itemEntitlements.collections.edges.length > 0) {
              state.discount_data.itemEntitlements.collections.edges.map(collectionDiscount => {
                lineItem.collections.map(lineItemCollection => {
                  if (collectionDiscount.node.id.includes(lineItemCollection)) {
                    if (state.discount_data.valueV2.percentage) {
                      discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                    } else {
                      discountAmount += parseFloat(state.discount_data.valueV2.amount)
                    }
                  }
                })
              })
            } else if (state.discount_data.itemEntitlements.products.edges.length > 0) {
              state.discount_data.itemEntitlements.products.edges.map(productDiscount => {
                if (productDiscount.node.id.includes(lineItem.product_id)) {
                  if (state.discount_data.valueV2.percentage) {
                    discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                  } else {
                    discountAmount += parseFloat(state.discount_data.valueV2.amount)
                  }
                }
              })
            } else if (state.discount_data.itemEntitlements.productVariants.edges.length > 0) {
              state.discount_data.itemEntitlements.productVariants.edges.map(productVariantDiscount => {
                if (productVariantDiscount.node.id.includes(lineItem.variant_id)) {
                  if (state.discount_data.valueV2.percentage) {
                    discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                  } else {
                    discountAmount += parseFloat(state.discount_data.valueV2.amount)
                  }
                }
              })
            }
          })
        }
      }
      return discountAmount
    },
    get_total (state) {
      var totalPrice = 0
      var discountAmount = 0
      var freight_shipping_price = getFreightShippingPrice(state.freight_shipping)
      var validPeriod = checkDiscountPeriodValidation(state.discount_data.startsAt, state.discount_data.endsAt)
      state.line_items.map(lineItem => {
        totalPrice += lineItem.calculated_price
      })
      if (state.discount_data.title != '' && state.discount_data.status == 'ACTIVE' && validPeriod) {
        if (state.discount_data.itemEntitlements.targetAllLineItems) {
          if (parseFloat(state.discount_data.valueV2.percentage)) {
            discountAmount = totalPrice * parseFloat(state.discount_data.valueV2.percentage) / 100
          } else {
            discountAmount = parseFloat(state.discount_data.valueV2.amount)
          }
        } else {
          state.line_items.map(lineItem => {
            if (state.discount_data.itemEntitlements.collections.edges.length > 0) {
              state.discount_data.itemEntitlements.collections.edges.map(collectionDiscount => {
                lineItem.collections.map(lineItemCollection => {
                  if (collectionDiscount.node.id.includes(lineItemCollection)) {
                    if (state.discount_data.valueV2.percentage) {
                      discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                    } else {
                      discountAmount += parseFloat(state.discount_data.valueV2.amount)
                    }
                  }
                })
              })
            } else if (state.discount_data.itemEntitlements.products.edges.length > 0) {
              state.discount_data.itemEntitlements.products.edges.map(productDiscount => {
                if (productDiscount.node.id.includes(lineItem.product_id)) {
                  if (state.discount_data.valueV2.percentage) {
                    discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                  } else {
                    discountAmount += parseFloat(state.discount_data.valueV2.amount)
                  }
                }
              })
            } else if (state.discount_data.itemEntitlements.productVariants.edges.length > 0) {
              state.discount_data.itemEntitlements.productVariants.edges.map(productVariantDiscount => {
                if (productVariantDiscount.node.id.includes(lineItem.variant_id)) {
                  if (state.discount_data.valueV2.percentage) {
                    discountAmount += lineItem.calculated_price * parseFloat(state.discount_data.valueV2.percentage) / 100
                  } else {
                    discountAmount += parseFloat(state.discount_data.valueV2.amount)
                  }
                }
              })
            }
          })
        }
      }
      return totalPrice * 1.08625 + discountAmount + freight_shipping_price
    },

  }
}

export default cart
