<template>
  <fragment>
    <div
      class="quote__app-overlay"
      :class="{'visibled': isQuoteModal}"
    >
      <div class="quote-body">
        <h3 class="quote-body-title">Request a Quote</h3>
        <p class="quote-body-description">
          Please fill out this form and one of our customer service team members will get back to you promptly. Most quotes will be provided within 1 business day.
        </p>
        <div class="quote-form">
          <h4 class="quote-form-title">Your Info</h4>
          <div class="quote-form-card">
            <div class="form__row">
              <label for="contact_name">Contact Name *</label>
              <input type="text" id="contact_name" v-model="contactName" placeholder="Type 2222 name">
            </div>

            <div class="form__row">
              <label for="contact_name">Company (optional)</label>
              <input type="text" id="company" v-model="contactCompany" placeholder="Type company (optional)">
            </div>
            <div class="form__row">
              <label for="contact_name">Email Address *</label>
              <input type="text" id="contact_email" v-model="contactEmail" placeholder="Type your email address">
            </div>
            <div class="form__row">
              <label for="contact_name">Phone Number (optional)</label>
              <input type="text" id="contact_phone" v-model="contactPhone" placeholder="(555) 555-555 (optional)">
            </div>
          </div>

          <h4 class="quote-form-title">Ship To Address</h4>
          <div class="quote-form-card">
            <div class="form__row__full">
              <label for="address1">Address Line 1 *</label>
              <input type="text" id="address1" v-model="address1" placeholder="Type address">
            </div>
            <div class="form__row__full">
              <label for="address2">Address Line 2 (optional)</label>
              <input type="text" id="address2" v-model="address2" placeholder="Optional (Apt., Suite, Bldg, PO Box)">
            </div>
            <div class="form__row">
              <label for="town_city">Town/City *</label>
              <input type="text" id="town_city" v-model="townCity" placeholder="Type town/city">
            </div>
            <div class="form__row">
              <label for="country">Country *</label>
              <select v-model="contactCountry" @change.prevent="changeContactStates" id="country">
                <option value='US' :selected="contactCountry=='US'">United States</option>
                <option value='CA' :selected="contactCountry=='CA'">Canada</option>                
              </select>
            </div>
            <div class="form__row">
              <label for="state_region">State/Region *</label>
              <select v-model="contactState" id="state_region">
                <fragment v-if="contactCountry=='US'">
                  <option
                    v-for="(item, key) in this.stateList"
                    :key="`state-${key}`"
                    :value="item.stateCode"
                    :selected="item.stateCode==contactState"
                  >
                    {{item.state}}
                  </option>
                </fragment>
                <fragment v-if="contactCountry=='CA'">
                  <option
                    v-for="(item, key) in this.provinceList"
                    :key="`province-${key}`"
                    :value="item.provinceId"
                    :selected="item.provinceId==contactState"
                  >
                    {{item.provinceName}}
                  </option>
                </fragment>
              </select>
            </div>
            <div class="form__row">
              <label for="postal_code">Postal Code *</label>
              <input type="text" id="postal_code" v-model="postalCode" placeholder="Type postal code">
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="shipping-out-us" v-model="isOutUS">
                <label for="shipping-out-us">
                  Shipping to Outside the US?
                </label>
              </div>
              <textarea v-model="outAddress" placeholder="Please type full address here"></textarea>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="is-residential" v-model="isResidential">
                <label for="is-residential">
                  This is a Residential Address
                </label>
              </div>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <label for="shipping-method">Preferred Shipping Method </label>
                <icon-question-circle />
              </div>
              <select v-model="shippingMethod" id="shipping-method" class="flex__row__full">
                <option value=''>Select your preferred shipping method</option>
              </select>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="is-lift-gate" v-model="isLiftGate">
                <label for="is-lift-gate">
                  For any Quote that requires Freight Truck Delivery, is a Lift-Gate required?
                </label>
                <icon-question-circle />
              </div>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="is-freight" v-model="isFreight">
                <label for="is-freight">
                  <span>Is Freight, Inside Delivery Required</span>
                </label>
                <icon-question-circle />
              </div>
            </div>
          </div>

          <h4 class="quote-form-title">Billing Details (Optional But Recommended)</h4>
          <div class="quote-form-card">
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="same-shipping-address" v-model="isSameAddress">
                <label for="same-shipping-address">
                  Same as Shipping Address
                </label>
              </div>
            </div>
            <div class="form__row">
              <label for="billing-address1">Address Line 1 *</label>
              <input type="text" id="billing-address1" v-model="billingAddress1" placeholder="Type address">
            </div>
            <div class="form__row">
              <label for="billing-address2">Address Line 2 (optional)</label>
              <input type="text" id="billing-address2" v-model="billingAddress2" placeholder="Apt., Suite, Bldg, PO Box(optional)">
            </div>
            <div class="form__row">
              <label for="billing-town_city">Town/City *</label>
              <input type="text" id="billing-town_city" v-model="billingTownCity" placeholder="Type town/city">
            </div>
            <div class="form__row">
              <label for="billing-country">Country *</label>
              <select v-model="billingCountry" @change.prevent="changeBillingStates" id="billing-country">
                <option value='US' :selected="billingCountry=='US'">United States</option>
                <option value='CA' :selected="billingCountry=='CA'">Canada</option>
              </select>
            </div>
            <div class="form__row">
              <label for="billing-state">State/Region *</label>
              <select v-model="billingState" id="billing-state">
                <fragment v-if="billingCountry=='US'">
                  <option
                    v-for="(item, key) in this.stateList"
                    :key="`state-${key}`"
                    :value="item.stateCode"
                    :selected="item.stateCode==billingState"
                  >
                    {{item.state}}
                  </option>
                </fragment>
                <fragment v-if="billingCountry=='CA'">
                  <option
                    v-for="(item, key) in this.provinceList"
                    :key="`province-${key}`"
                    :value="item.provinceId"
                    :selected="item.provinceId==billingState"
                  >
                    {{item.provinceName}}
                  </option>
                </fragment>
              </select>
            </div>
            <div class="form__row">
              <label for="billing-postal_code">Postal Code *</label>
              <input type="text" id="billing-postal_code" v-model="billingPostalCode" placeholder="Type postal code">
            </div>
          </div>

          <h4 class="quote-form-title">Quote Details</h4>
          <div class="quote-form-card">

            <div class="form__row__full item-detail">
              Item
              <p class="item-id">{{ productSKU }}</p>
            </div>
            <div class="form__row__full">
              <label for="quote-quantity">Quantity *</label>
              <input type="text" id="quote-quantity" v-model="quoteQuantity" placeholder="Can be entered as a number or range">
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <label for="quote-else-know">Anything Else You'd Like us to Know?</label>
                <icon-question-circle />
              </div>
              <textarea id="quote-else-know" v-model="quoteElseKnow"></textarea>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <label for="quote-upload">Do you have anything you would like to upload?</label>
                <icon-question-circle />
              </div>
              <a @click.prevent="$refs.file.click()" class="upload-link">choose file</a>
              <input type="file" ref="file" id="quote-upload" v-on:change="handleFileUpload()" name="uploadFile" />
            </div>
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
                <span class="link-title">Live Chat</span>
              </a>
            </li>
            <li>
              <a @click.prevent="phoneSupport">
                <span><icon-phone-support /> </span>
                <span class="link-title">Phone Support<p>800-289-1539</p></span>
              </a>
            </li>
            <li>
              <a @click.prevent="emailUs">
                <span><icon-email-us /> </span>
                <span class="link-title">Email us<p>info@displays4sale.com</p></span>
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
  import IconQuestionCircle from '@/components/icons/icon-question-circle'
  import priceMixin from '@/mixins/price'
  import constantMixin from '@/mixins/constants'
  import QuoteItemDetail from '@/components/quote-item-detail'
  import '@/styles/style.scss'

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
    mixins: [ priceMixin, constantMixin ],
    components: {
      IconEmailUs,
      IconLiveChat,
      IconPhoneSupport,
      QuoteItemDetail,
      IconQuestionCircle
    },
    computed: {
      ...mapGetters({
        variant: 'product/variant'
      }),
      productSKU() {
        return this.variant.sku
      }
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
        contactCountry: 'US',
        contactState: 'AL',
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
        billingCountry: 'US',
        billingState: 'AL',
        billingPostalCode: '',
        quoteQuantity: 0,
        quoteElseKnow: '',
        file: ''
      }
    },

    created () {
      // console.log('sku: ', this.stateList)
    },

    methods: {
      changeContactStates (evt) {
        console.log('contact country: ', evt.target.value)
      },
      changeBillingStates (evt) {
        console.log('billing country: ', evt.target.value)
      },
      handleFileUpload () {
        console.log('you uploaded a file')
        this.file = this.$refs.file.files[0]
        console.log('file: ', this.file)
      },
      liveChat() {
        console.log('clicked live chat')
      },
      phoneSupport () {
        console.log('clicked phone support')
        window.location = 'tel:1800-289-1539'
      },
      emailUs () {
        console.log('clicked email us')
        window.location = 'mailto:info@displays4sale.com'
      },
      async submitQuoteRequest () {
        console.log('contact name: ', this.contactName)
        console.log('submitted quote request')
        await this.$store.dispatch('cart/createQuote')
      }
    }

  }
</script>