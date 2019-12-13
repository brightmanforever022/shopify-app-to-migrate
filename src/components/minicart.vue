<template>
  <div class="display_cart-overlay">
    <div class="cart-header">
      <a @click.prevent="continue_shopping"><span>&lt;</span>Continue Shopping</a>
      <h2>Your Cart</h2>
      <span @click.prevent="close">
        <img src="//cdn.shopify.com/s/files/1/0036/4393/2761/t/11/assets/cart-close-button_18x.png?32245" alt="close button" />
      </span>
    </div>
    <div class="display_cart-wrapper">
      <div class="checkout-buttons">
        <div class="checkout-button">
          <button @click.prevent="createOrder" :disabled="checkoutLoading"><icon-lock/>SECURE CHECKOUT</button>
          <p>Please Choose a shipping selection below</p>
        </div>
        <div class="card-list">
          <a href=""><icon-visa/></a>
          <a href=""><icon-master/></a>
          <a href=""><icon-america/></a>
          <a href=""><icon-discover/></a>
          <a href=""><icon-paypal/></a>
        </div>
      </div>
      <div class="cart-line-wrapper">
        <div class="cart-line-header">
          <div class="header-qty">Items/Qty</div>
          <div class="header-price">Item Price</div>
          <div class="header-total">Total</div>
        </div>
        <div class="cart-line-list">
          <div class="cart-line" v-for="line_item in line_items" :key="line_item.lineId">
            <div class="img-wrapper">
              <img :src="line_item.product_img_url" alt="variant image">
            </div>
            <div class="cart-line-detail">
              <div class="main-detail">
                <div class="detail-qty">
                  <a :href="line_item.product_url" :target="_blank">{{line_item.product_title}}</a>
                  <span>Item ID # SCBBR</span>
                  <cart-input-quantity :quantity="line_item.quantity" :line_id="line_item.lineId"></cart-input-quantity>
                </div>
                <div class="detail-price">
                  {{line_item.calculated_item_price | money}}
                </div>
                <div class="detail-total">
                  {{line_item.calculated_price | money}}
                </div>
              </div>
              <div class="selections">
                <minicart-form-selection :line_id="line_item.lineId"></minicart-form-selection>
              </div>
              <div class="buttons">
                <button @click.prevent="removeLineFromCart(line_item.lineId)">REMOVE FROM CART</button>
                <button v-if="checkExistWishlist(line_item.lineId)" class="add-wishlist active" @click.prevent="removeWishlist(line_item.lineId)"><icon-heart-fill/> REMOVE FROM WISH LIST</button>
                <button v-else class="add-wishlist" @click.prevent="addWishlist(line_item)"><icon-heart/> ADD TO WISH LIST</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="show-shipping-options">
        <h2>Shipping Options</h2>
        <p>
          <span>Shipping to Canada?</span>
          <img src="//cdn.shopify.com/s/files/1/0036/4393/2761/t/11/assets/flag-canada_92x34.png?32199" alt="canada-flag">
        </p>
        <label for="zipcode" class="form__label">ZIP Code</label>
        <input type="text" class="zipcode" id="zipcode" />
        <button>SHOW SHIPPING OPTIONS</button>
      </div> -->
      <div class="freight-shipping-options">
        <h4>Freight Shipping Options</h4>
        <div class="freight-shipping-header">
          <span>Service</span>
          <span>Cost</span>
        </div>
        <div class="freight-shipping-body">
          <ul>
            <li @click.prevent="freightShipping(1)" id="freight-shipping-option-1" class="active">
              <span>Commercial Basic Free Freight Delivery (Standard Dock to Dock Service)</span>
              <span>$0.00</span>
            </li>
            <li @click.prevent="freightShipping(2)" id="freight-shipping-option-2">
              <span>Commercial Lift-Gate Freight Delivery (Commercial Lift-Gate Service)</span>
              <span>$125.00</span>
            </li>
            <li @click.prevent="freightShipping(3)" id="freight-shipping-option-3">
              <span>Commercial Special Freight Delivery (Commercial Lift-Gate & Inside Service)</span>
              <span>$300.00</span>
            </li>
            <li @click.prevent="freightShipping(4)" id="freight-shipping-option-4">
              <span>Commercial Freight Delivery (Inside Service to Exact Location)</span>
              <span>$450.00</span>
            </li>
            <li @click.prevent="freightShipping(5)" id="freight-shipping-option-5">
              <span>RESIDENTIAL Freight Delivery (Residential Lift-Gate & Call Ahead Service)</span>
              <span>$130.00</span>
            </li>
            <li @click.prevent="freightShipping(6)" id="freight-shipping-option-6">
              <span>RESIDENTIAL Special Freight Delivery (Residential Lift-Gate & Inside Service 2/Call Ahead)</span>
              <span>$325.00</span>
            </li>
          </ul>
          <p>* Delivery Estimate refers to the Shipping Time or transit time of your order once the items have been shipped. The delivery estimates above refer to standard ground delivery.</p>
          <p>Depending on actual ship date, the shipping service selected, and the shipping location, your order may arrive sooner than the scheduled ship date.</p>
          <p>** All shipping services offered above are NOT VALID outside the contiguous United States. Please contact us if your shipping location is outside the contiguous United States for a quote.</p>
          <p><span>Business days:</span> Monday - Friday (excluding major holidays)</p>
          <a>READ MORE ABOUT SHIPPING</a>
        </div>
      </div>
      <loading
        :active.sync="checkoutLoading"
        :is-full-page="false"
      />
      <div class="order-summary">
        <div class="promo-code">
          <div class="promo-code-check">
            <input type="checkbox" name="isPromoCode" id="isPromoCode" @click.prevent="togglePromo">
            <label for="isPromoCode">Promo Code</label>
          </div>
          <div class="promo-code-form" v-show="isPromoCode">
            <label for="promo_code">Enter A Promo Code</label>
            <input type="text" id="promo_code" v-model="promoCode" placeholder="29470604">
            <button @click.prevent="calculateByDiscount">APPLY TO ORDER</button>
          </div>
          <loading
            :active.sync="discountLoading"
            :is-full-page="false"
          />
        </div>
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="order-details">
            <ul>
              <li>
                <span class="summary-title">Product Subtotal:</span>
                <span class="summary-price">{{sub_total | money}}</span>
              </li>
              <li>
                <span class="summary-title">Discount:</span>
                <span class="summary-price">{{discount_total | money}}</span>
              </li>
              <li>
                <span class="summary-title">Optional Commercial Lift-Gate Service:</span>
                <span class="summary-price">{{freight_shipping.shipping_price | money}}</span>
              </li>
              <li>
                <span class="summary-title">
                  Sales Tax (8.625%): <a @click.prevent="showExplain">?</a>
                  <div class="explain-block" v-show="explainFlag">
                    <div class="explain-block-header">
                      <a @click.prevent="hideExplain"><icon-close/></a>
                    </div>
                    Tax Exempt? Once your order is placed, please send us your Resale or Tax Exempt Certificate, and we will refund the Tax collected.
                  </div>
                </span>
                <span class="summary-price">{{sub_total*0.08625 | money}}</span>
              </li>
            </ul>
          </div>
          <div class="order-total">
            <span class="total-title">Order Total:</span>
            <span class="total-price">{{cal_total | money}}</span>
          </div>
        </div>
        <div class="checkout-buttons">
          <div class="checkout-button">
            <button @click.prevent="createOrder" :disabled="checkoutLoading"><icon-lock/>SECURE CHECKOUT</button>
            <p>Please Choose a shipping selection below</p>
          </div>
          <div class="card-list">
            <a href=""><icon-visa/></a>
            <a href=""><icon-master/></a>
            <a href=""><icon-america/></a>
            <a href=""><icon-discover/></a>
            <a href=""><icon-paypal/></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MinicartFormSelection from '@/components/minicart-form-selection'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import Loading from 'vue-loading-overlay'
import priceMixin from '@/mixins/price'
import CartInputQuantity from '@/components/cart-quantity'
import IconHeart from '@/components/icons/icon-heart'
import IconHeartFill from '@/components/icons/icon-heart-fill'
import IconVisa from '@/components/icons/icon-visa'
import IconMaster from '@/components/icons/icon-master'
import IconAmerica from '@/components/icons/icon-america'
import IconDiscover from '@/components/icons/icon-discover'
import IconPaypal from '@/components/icons/icon-paypal'
import IconLock from '@/components/icons/icon-lock'
import IconFlag from '@/components/icons/icon-flag'
import IconClose from '@/components/icons/icon-close'

export default {
  name: 'Minicart',
  components: {
    MinicartFormSelection,
    CartInputQuantity,
    IconHeart,
    IconHeartFill,
    IconVisa,
    IconMaster,
    IconAmerica,
    IconDiscover,
    IconPaypal,
    IconLock,
    IconFlag,
    IconClose,
    Loading,
  },
  props: {
    close: {
      type: Function
    },
    continue_shopping: {
      type: Function
    }
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      variant: 'product/variant',
      line_items: 'cart/get_line_items',
      wish_id_list: 'wishlist/get_wish_id_list',
      sub_total: 'cart/get_sub_total',
      cal_total: 'cart/get_total',
      discount_total: 'cart/get_discount',
      freight_shipping: 'cart/get_freight_shipping_price',
    }),
    
    // stock () {
    //   return this.variant.inventoryQuantity > 0 ? 'In stock' : 'Out of stock'
    // }
  },
  created () {
    this.$store.dispatch('cart/get')
      .then(res => {
        console.log('initialized cart state with localstorage data', res);
      })
    this.$store.dispatch('wishlist/get')
      .then(res => {
        console.log('initialized wishlist state with localstorage data', res);
      })
  },
  data() {
    return {
      isPromoCode: false,
      promoCode: '',
      explainFlag: false,
      discountLoading: false,
      checkoutLoading: false,
    }
  },
  methods: {
    removeLineFromCart (line_id) {
      this.$store.dispatch('cart/removeCart', line_id)
        .then(res => {
          console.log('removed line successfully.')
        }).catch(err => {
          console.log(err)
        })
    },
    togglePromo () {
      this.isPromoCode = !this.isPromoCode
      if (this.isPromoCode) {
        $('.promo-code-check label').addClass('checked')
      } else {
        $('.promo-code-check label').removeClass('checked')
      }
    },
    showExplain () {
      this.explainFlag = true
    },
    hideExplain () {
      this.explainFlag = false
    },
    async calculateByDiscount () {
      try {
        if (this.isPromoCode) {
          this.discountLoading = true
          await this.$store.dispatch('cart/getDiscountAmount', this.promoCode)
          this.discountLoading = false
        } else {
          return false
        }
      } catch (error) {
        console.log(error)
      }
    },
    freightShipping (shippingId) {
      this.$store.dispatch('cart/setFreightShipping', shippingId)
      $('.freight-shipping-body li').removeClass('active')
      $('#freight-shipping-option-'+shippingId).addClass('active')
    },
    async createOrder () {
      this.checkoutLoading = true
      try {
        const checkoutUrl = await this.$store.dispatch('cart/createDraftOrder')
        this.checkoutLoading = false
        window.location.href = checkoutUrl
      } catch (error) {
        console.log(error)
        return false
      }
    },
    checkExistWishlist(id) {
      return this.wish_id_list.includes(id)
    },
    async addWishlist (data) {
      let wishItem = {
        product_title: data.product_title,
        product_url: data.product_url,
        product_img_url: data.product_img_url,
        product_id: data.product_id,
        collections: data.collections,
        variant_id: data.variant_id,
        selected_options: data.selected_options,
        custom_options: data.custom_options,
        calculated_item_price: data.calculated_item_price,
        wishId: data.lineId
      }
      try {
        const res = await this.$store.dispatch('wishlist/addLineWish', wishItem)
      } catch (err) {
        console.log(err)
        alert('Sorry, adding this selection into wishlist is failed!')
      }
    },
    removeWishlist (id) {
      this.$store.dispatch('wishlist/removeWish', id)
    }
  }
}

</script>