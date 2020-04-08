<template>
  <fragment>
    <div class="product__form--instock" title="The delivery date range shown is based on ground shipping for the quantity selected. For additional information, review the Shipping tab below.">
      <div class="stock__shipping-delivery">
        <h3>{{stock}}</h3>
        <!-- <p>Order in the next <span>{{computedTime}}</span> and receive it by {{computedDate}}.</p> -->
        <p>Order today and receive it by {{computedDate}}.</p>
      </div>
    </div>
    <div class="product__form-container">
      <div class="product__form-container--header">
        <div class="product__form--price">
          From
          <span class="price">{{calculated_price | money}}</span>
        </div>
      </div>

      <div class="form__body">
        <input-quantity></input-quantity>
        <form-description></form-description>
        <form-selection
          v-if="customizable && fully_customized"
        ></form-selection>
        <form-actions
          :openDisplayCart="openDisplayCart"
          :openQuote="openQuoteModal"
        >
        </form-actions>
      </div>
    </div>
    <div
      class="overlay__bg"
      :key="quote-request"
      :class="{'visibled': isQuoteModal}"
      @click.prevent="closeQuoteModal"
    ></div>
    <request-quote
      v-if="isQuoteModal"
      :isQuoteModal="isQuoteModal"
      :closeQuote="closeQuoteModal"
    >
    </request-quote>
  </fragment>
</template>
<script>
import InputQuantity from '@/components/quantity'
import FormDescription from '@/components/form-description'
import FormSelection from '@/components/form-selection'
import FormActions from '@/components/form-actions'
import RequestQuote from '@/components/request-quote'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import priceMixin from '@/mixins/price'

export default {
  name: 'Customize',
  components: {
    InputQuantity,
    FormDescription,
    FormSelection,
    FormActions,
    RequestQuote
  },
  props: {
    openDisplayCart: {
      type: Function
    }
  },
  mixins: [ priceMixin ],
  computed: {
    ...mapGetters({
      product: 'product/get',
      variant: 'product/variant',
      quantity: 'order/quantity'
    }),
    stock () {
      return this.variant.inventoryQuantity > 0 ? 'In stock' : 'Out of stock'
    },
    computedTime () {
      const currentDate = new Date()
      const currentHour = currentDate.getHours()
      const currentMinute = currentDate.getMinutes()
      let timeString = currentMinute > 0 ? (23 - currentHour) + ' hours ' : (24 - currentHour) + ' hours'
      timeString += currentMinute > 0 ? (60 - currentMinute) + ' minutes' : ''
      return timeString
    },
    computedDate () {
      const monthList = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ]

      const discountRuleLines = this.product.metafield.value.split('\n')
      let discountRuleList = []
      discountRuleLines.forEach(ruleLine => {
        let shippingLineItems = ruleLine.split(',')
        const shippingQtyItems = shippingLineItems[0].split(' ')
        const shippingQty = shippingQtyItems[1].split('-')
        const qtyFrom = parseInt(shippingQty[0])
        const qtyTo = parseInt(shippingQty[1])
        let shipPeriod = parseInt(shippingLineItems[2].replace(" Usually Ships in ", "").split('-'))
        const shipDays = shippingLineItems[2].includes('Weeks') ? shipPeriod * 7 : shipPeriod
        
        discountRuleList.push({
          qtyFrom: qtyFrom,
          qtyTo: qtyTo,
          shipPeriod: shipDays
        })
      });
      console.log('ship rule list: ', discountRuleList)
      let shipPeriod = 0
      discountRuleList.forEach(dr => {
        if (this.quantity >= dr.qtyFrom && this.quantity <= dr.qtyTo) {
          shipPeriod = dr.shipPeriod
        }
      })
      const currentDate = new Date()
      const estimateDate = new Date(currentDate.getTime() + 86400000 * shipPeriod)
      return monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate()
    }
  },
  data () {
    return {
      isQuoteModal: false,
    }
  },
  created () {
    // console.log('quote modal open? ', this.isQuoteModal)
  },

  methods: {
    openQuoteModal () {
      /*if (this.customizable && this.fully_customized) {
        $('#shopify-section-header .header').css('z-index', '-1')
        $('.product__details').css('z-index', -1)
        this.isQuoteModal = true
      } else {
        alert('Please make product selections before requesting a quote.')
      }*/
      $('#shopify-section-header .header').css('z-index', '-1')
      $('.product__details').css('z-index', -1)
      this.isQuoteModal = true
    },
    closeQuoteModal () {
      $('#shopify-section-header .header').css('z-index', '101')
      $('.product__details').css('z-index', 'initial')
      this.isQuoteModal = false
    }
  },
}
</script>