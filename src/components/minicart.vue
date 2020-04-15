<template>
  <div class="display_cart-overlay">
    <div class="cart-header">
      <a @click.prevent="continue_shopping" class="continue-shopping"><span>&lt;</span>Continue Shopping</a>
      <h2>Your Cart</h2>
      <a @click.prevent="continue_shopping" class="close-cart">
        <icon-close/>
      </a>
    </div>
    <div class="display_cart-wrapper">
      <div class="checkout-buttons">
        <div class="checkout-button">
          <button @click.prevent="createOrder" :disabled="checkoutLoading || !shippingDetailShow"><icon-lock/>SECURE CHECKOUT</button>
          <p v-if="!shippingDetailShow">Please Choose a shipping selection below</p>
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
                  <span>Item ID # {{ line_item.sku }}</span>
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
      <div class="show-shipping-options">
        <h2>Shipping Options</h2>
        <p>
          <IconFlagCanada />
          <!-- <span>
            Shipping to Canada? <a @click.prevent="showQuoteExplain">?</a>
            <div class="explain-quote-block" v-show="explainQuoteFlag">
              <div class="explain-block-header">
                <a @click.prevent="hideQuoteExplain"><icon-close/></a>
              </div>
              Click to Request a Quote
            </div>
          </span> -->
          <span>
            Shipping to Canada?<br />
            <a @click.prevent="showRequestQuote">Request Quote</a>
          </span>
        </p>
        <div class="zip-code-form">
          <label for="zip_code">ZIP Code</label>
          <input type="text" id="zip_code" v-model="zipCode" v-on:keyup="showShippingOptions" placeholder="12345">
          <button @click.prevent="fetchShipping">SHOW SHIPPING OPTIONS</button>
        </div>
        <loading
          :active.sync="shippingLoading"
          :is-full-page="false"
        />
      </div>
      <div class="shipping-details" v-show="shippingDetailShow">
        <div class="fedex-shipping" v-if="fedex_exist">
          <h4>FedEx/UPS Shipping Options</h4>
          <div class="fedex-shipping-header">
            <span>Service</span>
            <span>Cost</span>
            <span>Lead Time to Ship</span>
          </div>
          <div class="fedex-shipping-body">
            <ul>
              <li @click.prevent="fedexShipping('ground')" id="fedex-shipping-option-ground" class="active">
                <span>Ground</span>
                <span>{{ groundMoney }}</span>
                <!-- <span>Get it by October 26</span> -->
                <span>{{ shipPeriod.duration }}</span>
              </li>
              <li @click.prevent="fedexShipping('threeday')" id="fedex-shipping-option-threeday">
                <span>3 day select</span>
                <span>{{fedex_shipping_list.threeday | money}}</span>
                <span>{{ shipPeriod.duration }}</span>
              </li>
              <li @click.prevent="fedexShipping('twoday')" id="fedex-shipping-option-twoday">
                <span>2nd day air</span>
                <span>{{fedex_shipping_list.twoday | money}}</span>
                <span>{{ shipPeriod.duration }}</span>
              </li>
              <li @click.prevent="fedexShipping('nextday')" id="fedex-shipping-option-nextday">
                <span>Next day air</span>
                <span>{{fedex_shipping_list.nextday | money}}</span>
                <span>{{ shipPeriod.duration }}</span>
              </li>
            </ul>
          </div>
          <div class="fedex-shipping-date">
            <span>Lead time to ship</span>: {{ shipPeriod.leadFrom }} - {{ shipPeriod.leadTo }}<br /><br />
            <span>Delivery estimate</span>: {{ shipPeriod.deliveryFrom }} - {{ shipPeriod.deliveryTo }}
          </div>
          <div class="need-quote">
            <h4>Need a Quote?</h4>
            <p>
              When requesting an estimate, we review all aspects of the order including product, size and weight, quantity, boxing, shipping method and any special request or custom option to provide you the best possible quote.
            </p>
            <h6><a @click.prevent="showRequestQuote"><icon-quote />&nbsp;Request a Quote</a></h6>
          </div>
        </div>
        <div v-if="freight_exist" class="freight-shipping-options">
          <h4>Freight Shipping Options</h4>
          <div class="freight-shipping-header">
            <span>Service</span>
            <span>Cost</span>
          </div>
          <div class="freight-shipping-body">
            <ul>
              <li
                v-for="(freightItem, key) in freight_option_list"
                :key="`freightoption-${key}`"
                :value="freightItem.id"
                :id="`freight-shipping-option-${freightItem.id}`"
                @click.prevent="freightShipping(freightItem.id)"
              >
                <span>{{ freightItem.label }}</span>
                <span>${{ freightItem.price.toFixed(2) }}</span>
                <icon-question-circle v-tooltip.bottom-left="freightItem.description" :class="freight-option-circle" />
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
                <li v-if="isPromoCode">
                  <span class="summary-title">Discount:</span>
                  <span class="summary-price">{{discount_total | money}}</span>
                </li>
                <li v-if="fedex_exist">
                  <span class="summary-title">UPS / Fedex (Ground) Shipping:</span>
                  <span class="summary-price">{{fedex_shipping.shipping_price | money}}</span>
                </li>
                <li v-if="freight_exist">
                  <span class="summary-title">{{freightShippingList[freight_shipping.id - 1]}}:</span>
                  <span class="summary-price">{{freight_shipping.shipping_price | money}}</span>
                </li>
                <!-- <li>
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
                </li> -->
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
              <p v-if="!shippingDetailShow">Please Choose a shipping selection below</p>
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
  </div>
</template>
<script>
import Vue from 'vue'
import { VTooltip } from 'v-tooltip'
import MinicartFormSelection from '@/components/minicart-form-selection'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import Loading from 'vue-loading-overlay'
import priceMixin from '@/mixins/price'
import CartInputQuantity from '@/components/cart-quantity'
import IconQuote from '@/components/icons/icon-quote'
import IconHeart from '@/components/icons/icon-heart'
import IconHeartFill from '@/components/icons/icon-heart-fill'
import IconVisa from '@/components/icons/icon-visa'
import IconMaster from '@/components/icons/icon-master'
import IconAmerica from '@/components/icons/icon-america'
import IconDiscover from '@/components/icons/icon-discover'
import IconPaypal from '@/components/icons/icon-paypal'
import IconLock from '@/components/icons/icon-lock'
import IconFlagCanada from '@/components/icons/icon-flag-canada'
import IconClose from '@/components/icons/icon-close'
import IconQuestionCircle from '@/components/icons/icon-question-circle'

export default {
  name: 'Minicart',
  components: {
    MinicartFormSelection,
    CartInputQuantity,
    IconQuote,
    IconHeart,
    IconHeartFill,
    IconVisa,
    IconMaster,
    IconAmerica,
    IconDiscover,
    IconPaypal,
    IconLock,
    IconFlagCanada,
    IconClose,
    IconQuestionCircle,
    Loading,
  },
  props: {
    continue_shopping: {
      type: Function
    }
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      line_items: 'cart/get_line_items',
      wish_id_list: 'wishlist/get_wish_id_list',
      sub_total: 'cart/get_sub_total',
      cal_total: 'cart/get_total',
      discount_total: 'cart/get_discount',
      freight_option_list: 'cart/get_freight_options',
      freight_shipping: 'cart/get_freight_shipping_price',
      fedex_shipping: 'cart/get_fedex_shipping_price',
      fedex_shipping_list: 'cart/get_shipping_list',
      freight_exist: 'cart/freight_exist',
      fedex_exist: 'cart/fedex_exist',
      ship_period: 'cart/get_ship_period',
    }),
    shipPeriod () {
      let shipPeriodFrom = 0
      let shipPeriodTo = 0
      let shipDuration = ''
      let leadTimeFrom = ''
      let leadTimeTo = ''
      let estimateFrom = ''
      let estimateTo = ''


      this.line_items.map(lit => {
        const shipPeriod = this.ship_period(lit)
        if (shipPeriod.shipPeriodFrom > shipPeriodFrom) {
          shipPeriodFrom = shipPeriod.shipPeriodFrom
          shipPeriodTo = shipPeriod.shipPeriodTo
          shipDuration = shipPeriod.shipDuration
          leadTimeFrom = shipPeriod.leadTimeFrom
          leadTimeTo = shipPeriod.leadTimeTo
          estimateFrom = shipPeriod.estimateFrom
          estimateTo = shipPeriod.estimateTo
        }
      })

      return {
        duration: shipDuration,
        leadFrom: leadTimeFrom,
        leadTo: leadTimeTo,
        deliveryFrom: estimateFrom,
        deliveryTo: estimateTo,
      }
    },
    groundMoney () {
      return (this.fedex_shipping_list.ground > 0 ? '$' + this.fedex_shipping_list.ground : 'Free Ground')
    }
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

    Vue.use(VTooltip)
    Vue.directive('tooltip', VTooltip)
  },
  data() {
    return {
      isPromoCode: false,
      promoCode: '',
      zipCode: '',
      explainFlag: false,
      explainQuoteFlag: false,
      shippingLoading: false,
      discountLoading: false,
      checkoutLoading: false,
      blockZipcodeList: [
        [601, 988],
        [20001, 20599],
        [56901, 56999],
        [96701, 96898],
        [99501, 99950]
      ],
      shippingDetailShow: false,
      freightShippingList: [
        'Commercial Basic Free Freight Delivery (Standard Dock to Dock Service)',
        'Commercial Lift-Gate Freight Delivery (Commercial Lift-Gate Service)',
        'Commercial Special Freight Delivery (Commercial Lift-Gate & Inside Service)',
        'Commercial Freight Delivery (Inside Service to Exact Location)',
        'RESIDENTIAL Freight Delivery (Residential Lift-Gate & Call Ahead Service)',
        'RESIDENTIAL Special Freight Delivery (Residential Lift-Gate & Inside Service 2/Call Ahead)'
      ]
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

    showQuoteExplain () {
      this.explainQuoteFlag = true
    },
    hideQuoteExplain () {
      this.explainQuoteFlag = false
    },
    showExplain () {
      this.explainFlag = true
    },
    hideExplain () {
      this.explainFlag = false
    },
    showRequestQuote () {
      console.log('request quote will come soon')
      alert('request quote will come soon')
    },
    hideRequestQuote () {
      console.log('request quote has been hidden')
    },
    showShippingOptions (e) {
      if (e.key == "Enter") {
        this.fetchShipping()
      }
    },
    async fetchShipping () {
      let zipcodeRegex = /^\d{5}$/
      let zipCodeNumber = parseInt(this.zipCode)
      let zipValid = true
      if(zipcodeRegex.test(this.zipCode)) { // check if this zipcode is based on US
        // check if this zipcode is in supported confidential zipcode list
        this.blockZipcodeList.map(zipRow => {
          if (zipCodeNumber >= zipRow[0] && zipCodeNumber <= zipRow[1]) {
            zipValid = false
          }
        })

        if (zipValid) {
          // get details of shipping options
          try {
            this.shippingLoading = true
            await this.$store.dispatch('cart/fetchShippingList', this.zipCode)
            this.shippingLoading = false
            this.shippingDetailShow = true
          } catch (error) {
            console.log(error)
          }
        } else {
          alert('Please try to request a quote. Stanard shipping does not support this zipcode.')
          return false
        }
      } else {
        alert('Sorry, we support only US area.')
        return false
      }
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
    fedexShipping (fedexType) {
      this.$store.dispatch('cart/setFedexShipping', fedexType)
      $('.fedex-shipping-body li').removeClass('active')
      $('#fedex-shipping-option-'+fedexType).addClass('active')
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
        free_ground: data.free_ground,
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