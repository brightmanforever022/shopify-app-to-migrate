<template>
  <fragment>
    <div class="product__form--instock">
      <div class="stock__shipping-delivery">
        <div>
          <h3>{{stock}}</h3>
          <p>
            Order today and receive it by {{computedDate}}. <icon-question-circle  v-tooltip.bottom-left="`The delivery date range shown is based on ground shipping for the quantity selected. For additional information, review the Shipping tab below.`" />
          </p>
        </div>
        <icon-flag-usa v-if="madeInUsa" />
      </div>
    </div>
    <div class="product__form-container">
      <div class="product__form-container--header">
        <div class="product__form--price">
          From
          <span class="price">{{estimatedPrice | money}}</span>
        </div>
      </div>

      <div class="form__body">
        <input-quantity :inSelect="0"></input-quantity>
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
      class="overlay__bg quote-request"
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
import Vue from 'vue'
import { VTooltip } from 'v-tooltip'
import InputQuantity from '@/components/quantity'
import FormDescription from '@/components/form-description'
import FormSelection from '@/components/form-selection'
import FormActions from '@/components/form-actions'
import RequestQuote from '@/components/request-quote'
import IconFlagUsa from '@/components/icons/icon-flag-usa'
import IconQuestionCircle from '@/components/icons/icon-question-circle'
import { mapGetters } from 'vuex'
import $ from 'jquery'
import priceMixin from '@/mixins/price'
import { getShippingPeriod, getAfterNDays, getDiscountByQuantity } from '@/helpers'

export default {
  name: 'Customize',
  components: {
    InputQuantity,
    FormDescription,
    FormSelection,
    FormActions,
    RequestQuote,
    IconFlagUsa,
    IconQuestionCircle,
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
      const shipDays = getShippingPeriod(this.product.metafield.value, this.quantity)
      return shipDays.shipPeriodFrom <= 3 ? 'In stock' : 'Built to Order'
    },
    madeInUsa () {
      return this.product.tags.includes('made-in-usa')
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

      const shipDays = getShippingPeriod(this.product.metafield.value, this.quantity)
      const currentDate = new Date()
      const estimateDateFrom = getAfterNDays(shipDays.shipPeriodFrom + 1)
      const estimateDateTo = getAfterNDays(shipDays.shipPeriodTo + 5)
      return monthList[estimateDateFrom.getMonth()] + ' ' + estimateDateFrom.getDate() +
              ' - ' + (estimateDateFrom.getMonth() != estimateDateTo.getMonth() ? monthList[estimateDateTo.getMonth()] + ' ' : '') +
              estimateDateTo.getDate()
    },
    estimatedPrice() {
      return (100 - getDiscountByQuantity(this.product.metafield.value, this.quantity)) * this.calculated_item_price / 100 * this.quantity
    }
  },
  data () {
    return {
      isQuoteModal: false,
    }
  },
  created () {
    // console.log('quote modal open? ', this.isQuoteModal)
    Vue.use(VTooltip)
    Vue.directive('tooltip', VTooltip)
  },

  methods: {
    openQuoteModal () {
      $('#shopify-section-header .header').css('z-index', '-1')
      $('.product__details').css('z-index', -1)
      $('.wrapper').css({'position': 'fixed', 'width': '100%'});
      this.isQuoteModal = true
    },
    closeQuoteModal () {
      $('#shopify-section-header .header').css('z-index', '101')
      $('.product__details').css('z-index', 'initial')
      $('.wrapper').css({'position': 'inherit', 'width': 'inherit'});
      this.isQuoteModal = false
    }
  },
}
</script>