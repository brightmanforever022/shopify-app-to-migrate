import { initializeCart, getCart, plusNCartItem, addCart, removeCart, plusCartItem, minusCartItem, getFedexList } from '@/api/cart'
import { getWishlist } from '@/api/wishlist'
import { getDiscount } from '@/api/discount'
import { createOrder, createQuoteWithCart } from '@/api/order'
import { checkDiscountPeriodValidation, getFreightShippingPrice, getFedexShippingPrice, getDiscountByQuantity, getShippingPeriod, compareOptions } from '@/helpers'

const cart = {
  namespaced: true,
  state: {
    line_items: [],
    discount_data: {},
    freight_shipping: 1,
    freight_option_list: [],
    fedex_shipping: 'ground',
    fedex_shipping_list: {
      ground: 0,
      twoday: 0,
      threeday: 0,
      nextday: 0,
      shippingMarkup: 0,
    },
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
		async addCart ({dispatch, commit, state}, cartData) {
      var cartDataWithID = cartData
      var currentLineItems = state.line_items
      var existedLineIndex = -1
      currentLineItems.forEach((li, index) => {
        if (li.variant_id == cartData.variant_id && compareOptions(cartData.custom_options, li.custom_options)) {
          existedLineIndex = index
        }
      })
      if (existedLineIndex > -1) {
        currentLineItems = await dispatch('plusNCart', {id: currentLineItems[existedLineIndex].lineId, quantity: cartData.quantity})
        return currentLineItems
      } else {
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
      }
		},
		removeCart ({commit}, lineId) {
      var newLineItems = removeCart(lineId)
      commit('SET_CART', newLineItems)
      return newLineItems
    },
    async plusNCart ({commit}, data) {
      var newLineItems = await plusNCartItem(data.id, data.quantity)
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
    async fetchShippingList ({commit, state}, zipCode) {
      try {
        let shippingList = await getFedexList({zipCode: zipCode, lineItems: state.line_items})
        console.log('fedex shipping list: ', shippingList.data)
        commit('SET_SHIPPING_LIST', shippingList.data)
      } catch (error) {
        console.log(error)
      }
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
    setFreightOptionList ({ commit }, data) {
      commit('SET_FREIGHT_OPTION_LIST', data)
    },
    setFedexShipping ({commit}, fedexType) {
      commit('SET_FEDEX_SHIPPING', fedexType)
    },
    async createDraftOrder ({commit, state, getters}) {
      try {
        const orderDiscount = getters.get_discount.toFixed(2)
        const orderFreightShipping = getFreightShippingPrice(state.freight_option_list, state.freight_shipping).toFixed(2)
        const orderFedexShipping = getFedexShippingPrice(state.fedex_shipping_list, state.fedex_shipping).toFixed(2)
        const draftOrder = await createOrder({lineItems: state.line_items, discountRule: state.discount_data, orderFreightShipping: orderFreightShipping, orderFedexShipping: orderFedexShipping})
        // Make cart empty
        commit('SET_CART', [])
        return draftOrder.data.draft_order.invoice_url
      } catch (err) {
        console.log(err)
      }
    },

    async createQuoteWithCart ({ commit, state, getters }, contactData) {
      try {
        const newQuote = await createQuoteWithCart({ lines: state.line_items, contactDetail: contactData })
        return newQuote.data
      } catch (error) {
        console.log('error generated when creating new quote')
        return false
      }
    },
    
  },
  mutations: {
    SET_CART: (state, data) => {
			state.line_items = data
    },
    SET_DISCOUNT: (state, data) => {
      state.discount_data = data
    },
    SET_SHIPPING_LIST: (state, data) => {
      state.fedex_shipping_list = data
    },
    SET_FREIGHT_SHIPPING: (state, id) => {
      state.freight_shipping = id
    },
    SET_FREIGHT_OPTION_LIST: (state, data) => {
      state.freight_option_list = data
    },
    SET_FEDEX_SHIPPING: (state, id) => {
      state.fedex_shipping = id
    }
  },
  getters: {
    line_length (state) {
      return state.line_items.length
    },
    get_line_items (state) {
      return state.line_items
    },
    get_freight_options (state) {
      return state.freight_option_list
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
        totalPrice += lineItem.calculated_price * (100 - getDiscountByQuantity(lineItem.shipping_summary, lineItem.quantity)) / 100
      })
      return totalPrice
    },
    get_ship_period: (state) => (lineItem) => {
      return getShippingPeriod(lineItem.shipping_summary, lineItem.quantity)
    },
    freight_exist (state) {
      let isFreightExist = false
      const { line_items } = state
      line_items.map(lineItem => {
        if(lineItem.is_freight) {
          isFreightExist = true
        }
        lineItem.custom_options.map(co => {
          if (co.freight) {
            isFreightExist = true
          }
        })
      })
      return isFreightExist
    },
    fedex_exist (state) {
      let numberOfFreight = 0
      const { line_items } = state
      line_items.map(lineItem => {
        let isFreight = false
        lineItem.custom_options.map(co => {
          if (co.freight) {
            isFreight = true
          }
        })
        if (isFreight || lineItem.is_freight) {
          numberOfFreight++
        }
      })

      return numberOfFreight < line_items.length
    },
    get_freight_shipping_price (state) {
      var price = getFreightShippingPrice(state.freight_option_list, state.freight_shipping)
      return {id: state.freight_shipping, shipping_price: price}
    },
    get_fedex_shipping_price (state) {
      var price = getFedexShippingPrice(state.fedex_shipping_list, state.fedex_shipping)
      return {id: state.fedex_shipping, shipping_price: price}
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
    get_shipping_list (state) {
      return state.fedex_shipping_list
    },
    get_total (state) {
      var totalPrice = 0
      var discountAmount = 0
      var freight_shipping_price = getFreightShippingPrice(state.freight_option_list, state.freight_shipping)
      var fedex_shipping_price = getFedexShippingPrice(state.fedex_shipping_list, state.fedex_shipping)
      // console.log('fedex shipping price in calculating total: ', fedex_shipping_price)
      var validPeriod = checkDiscountPeriodValidation(state.discount_data.startsAt, state.discount_data.endsAt)
      state.line_items.map(lineItem => {
        totalPrice += lineItem.calculated_price * (100 - getDiscountByQuantity(lineItem.shipping_summary, lineItem.quantity)) / 100
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
      return totalPrice + discountAmount + freight_shipping_price + fedex_shipping_price
    },

  }
}

export default cart
