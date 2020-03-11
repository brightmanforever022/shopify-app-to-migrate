<template>
  <fragment>
    <div
      class="product__section-overlay"
      :class="{'visibled': isQuoteModal}"
    >
      <div class="quote-body">
        <h3>Request a Quote</h3>
        <p>
          Please fill out this form and one of our customer service team members will get back to you promptly. Most quotes will be provided within 1 business day.
        </p>
        <div class="quote-form">
          <div class="quote-form-card">
            <h4 class="quote-form-title">Your Info</h4>
            <label for="contact_name">Contact Name *</label>
            <input type="text" id="contact_name" v-model="contactName" placeholder="Type 2222 name">

            <label for="contact_name">Company (optional)</label>
            <input type="text" id="company" v-model="contactCompany" placeholder="Type company (optional)">
            <label for="contact_name">Email Address *</label>
            <input type="text" id="contact_email" v-model="contactEmail" placeholder="Type your email address">
            <label for="contact_name">Phone Number (optional)</label>
            <input type="text" id="contact_phone" v-model="contactPhone" placeholder="(555) 555-555 (optional)">
          </div>

          <div class="quote-form-card">
            <h4 class="quote-form-title">Ship To Address</h4>
            <label for="address1">Address Line 1 *</label>
            <input type="text" id="address1" v-model="address1" placeholder="Type address">
            <label for="address2">Address Line 2 (optional)</label>
            <input type="text" id="address2" v-model="address2" placeholder="Optional (Apt., Suite, Bldg, PO Box)">
            <label for="town_city">Town/City *</label>
            <input type="text" id="town_city" v-model="townCity" placeholder="Type town/city">
            <label for="country">Country *</label>
            <select v-model="contactCountry" id="country">
              <option value=''>Select country</option>
            </select>

            <label for="postal_code">Postal Code *</label>
            <input type="text" id="postal_code" v-model="postalCode" placeholder="Type postal code">

            <label for="shipping-out-us">Shipping to Outside the US?</label>
            <input type="checkbox" id="shipping-out-us" v-model="isOutUS">
            <textarea v-model="outAddress" placeholder="Please type full address here"></textarea>

            <label for="is-residential">This is a Residential Address</label>
            <input type="checkbox" id="is-residential" v-model="isResidential">

            <label for="shipping-method">Preferred Shipping Method</label>
            <select v-model="shippingMethod" id="shipping-method">
              <option value=''>Select your preferred shipping method</option>
            </select>

            <label for="is-lift-gate">For any Quote that requires Freight Truck Delivery, is a Lift-Gate required?</label>
            <input type="checkbox" id="is-lift-gate" v-model="isLiftGate">

            <label for="is-freight">Is Freight, Inside Delivery Required</label>
            <input type="checkbox" id="is-freight" v-model="isFreight">
          </div>

          <div class="quote-form-card">
            <h4 class="quote-form-title">Billing Details (Optional But Recommended)</h4>
            <label for="same-shipping-address">Same as Shipping Address</label>
            <input type="checkbox" id="same-shipping-address" v-model="isSameAddress">

            <label for="billing-address1">Address Line 1 *</label>
            <input type="text" id="billing-address1" v-model="billingAddress1" placeholder="Type address">
            <label for="billing-address2">Address Line 2 (optional)</label>
            <input type="text" id="billing-address2" v-model="billingAddress2" placeholder="Apt., Suite, Bldg, PO Box(optional)">
            <label for="billing-town_city">Town/City *</label>
            <input type="text" id="billing-town_city" v-model="billingTownCity" placeholder="Type town/city">
            <label for="billing-country">Country *</label>
            <select v-model="billingCountry" id="billing-country">
              <option value=''>Select country</option>
            </select>

            <label for="billing-postal_code">Postal Code *</label>
            <input type="text" id="billing-postal_code" v-model="billingPostalCode" placeholder="Type postal code">
          </div>

          <div class="quote-form-card">
            <h4 class="quote-form-title">Quote Details</h4>

            Item<span class="item-id">SCBBR</span>

            <label for="quote-quantity">Quantity *</label>
            <input type="text" id="quote-quantity" v-model="quoteQuantity" placeholder="Can be entered as a number or range">

            <label for="quote-else-know">Anything Else You'd Like us to Know?</label>
            <textarea id="quote-else-know" v-model="quoteElseKnow"></textarea>

            <label for="quote-upload">Do you have anything you would like to upload?</label>
            <input type="file" id="quote-upload">
          </div>

          <button @click.prevent="submitQuoteRequest">SUBMIT QUOTE REQUEST</button>
        </div>
      </div>

      <div class="quote-sidebar">
        <div class="quote-sidebar-links">
          <ul>
            <li>
              <a @click.prevent="liveChat">
                <span><icon-live-chat /> </span>
                <span>Live Chat</span>
              </a>
            </li>
            <li>
              <a @click.prevent="phoneSupport">
                <span><icon-phone-support /> </span>
                <span>Phone Support <br>800-289-1539</span>
              </a>
            </li>
            <li>
              <a @click.prevent="emailUs">
                <span><icon-email-us /> </span>
                <span>Email us<br>info@displays4sale.com</span>
              </a>
            </li>
          </ul>
        </div>

        <div class="quote-sidebar-app">
          <quote-item-detail></quote-item-detail>
        </div>
      </div>

    </div>
  </fragment>
</template>

<script>
  import { mapGetters } from 'vuex'
  import $ from 'jquery'
  import IconEmailUs from '@/components/icons/icon-email-us'
  import IconLiveChat from '@/components/icons/icon-live-chat'
  import IconPhoneSupport from '@/components/icons/icon-phone-support'
  import priceMixin from '@/mixins/price'
  import QuoteItemDetail from '@/components/quote-item-detail'

  export default {
    name: 'RequestQuote',
    props: {
      closeQuote: {
        type: Function
      },
      isQuoteModal: {
        type: Boolean
      }
    },
    mixins: [ priceMixin ],
    components: {
      IconEmailUs,
      IconLiveChat,
      IconPhoneSupport,
      QuoteItemDetail
    },

    data () {
      return {
        contactName: '',
        contactCompany: '',
        contactEmail: '',
        contactPhone: '',
        address1: '',
        address2: '',
        townCity: '',
        contactCountry: '',
        postalCode: '',
        isOutUS: false,
        outAddress: '',
        isResidential: false,
        shippingMethod: '',
        isLiftGate: false,
        isFreight: false,
        isSameAddress: false,
        billingAddress1: '',
        billingAddress2: '',
        billingTownCity: '',
        billingCountry: '',
        billingPostalCode: '',
        quoteQuantity: 0,
        quoteElseKnow: '',

      }
    },

    created () {
      console.log('created')
    },

    methods: {
      liveChat() {
        console.log('clicked live chat')
      },
      phoneSupport () {
        console.log('clicked phone support')
      },
      emailUs () {
        console.log('clicked email us')
      },
      submitQuoteRequest () {
        console.log('contact name: ', this.contactName)
        console.log('submitted quote request')
      }
    }

  }
</script>

<style scoped lang="scss">
  .quote-body {
    color: red;

    h3 {
      color: green;
    }
  }

</style>