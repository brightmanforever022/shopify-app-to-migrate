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
              <input type="text" id="contact_name" v-model="contactName" placeholder="Type name">
              <span :class="['quote-form-errors', validateElement('contact_name')]">This field is invalid</span>
            </div>

            <div class="form__row">
              <label for="company">Company (optional)</label>
              <input type="text" id="company" v-model="contactCompany" placeholder="Type company (optional)">
            </div>
            <div class="form__row">
              <label for="contact_email">Email Address *</label>
              <input type="text" id="contact_email" v-model="contactEmail" placeholder="Type your email address">
              <span :class="['quote-form-errors', validateElement('contact_email')]">This field is invalid</span>
            </div>
            <div class="form__row">
              <label for="contact_phone">Phone Number (optional)</label>
              <input type="text" id="contact_phone" v-model="contactPhone" placeholder="(555) 555-555 (optional)">
            </div>
          </div>

          <h4 class="quote-form-title">Ship To Address</h4>
          <div class="quote-form-card">
            <div class="form__row__full">
              <label for="address1">Address Line 1 *</label>
              <input type="text" id="address1" v-model="address1" placeholder="Type address">
              <span :class="['quote-form-errors', validateElement('address1')]">This field is invalid</span>
            </div>
            <div class="form__row__full">
              <label for="address2">Address Line 2 (optional)</label>
              <input type="text" id="address2" v-model="address2" placeholder="Optional (Apt., Suite, Bldg, PO Box)">
            </div>
            <div class="form__row">
              <label for="town_city">Town/City *</label>
              <input type="text" id="town_city" v-model="townCity" placeholder="Type town/city">
              <span :class="['quote-form-errors', validateElement('town_city')]">This field is invalid</span>
            </div>
            <div class="form__row">
              <label for="country">Country *</label>
              <select v-model="contactCountry" id="country">
                <option value='US' :selected="contactCountry=='US'">United States</option>
                <option value='CA' :selected="contactCountry=='CA'">Canada</option>
                <option
                    v-for="(country, key) in this.countryList"
                    :key="`country-${key}`"
                    :value="country.countryId"
                    :selected="country.countryId==contactCountry"
                  >
                    {{ country.countryName }}
                  </option>
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
              <span :class="['quote-form-errors', validateElement('postal_code')]">This field is invalid</span>
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
                <icon-question-circle v-tooltip.bottom-left="`Indicate the shipping method you would like us to quote. If you are unsure, please choose the standard shipping service.`" />
              </div>
              <select v-model="shippingMethod" id="shipping-method" class="flex__row__full">
                <option
                  v-for="(shipItem, key) in shippingMethodList"
                  :key="`shipmethod-${key}`"
                  :value="shipItem.shipId"
                  :selected="shipItem.shipId==shippingMethod"
                >
                  {{shipItem.shipName}}
                </option>
              </select>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="is-lift-gate" v-model="isLiftGate">
                <label for="is-lift-gate">
                  For any Quote that requires Freight Truck Delivery, is a Lift-Gate required?
                </label>
                <icon-question-circle v-tooltip.bottom-left="`A lift-gate lowers deliveries from the truck to the ground. A lift-gate is required for commercial locations that DO NOT have a raised loading dock or forklift and ALL residential locations.`" />
              </div>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="is-freight" v-model="isFreight">
                <label for="is-freight">
                  <span>Is Freight, Inside Delivery Required</span>
                </label>
                <icon-question-circle v-tooltip.bottom-left="`Inside Delivery is an optional service where the freight driver brings the shipment to just inside the nearest entrance or doorway with no stairs.`" />
              </div>
            </div>
          </div>

          <h4 class="quote-form-title">Billing Details (Optional But Recommended)</h4>
          <div class="quote-form-card">
            <div class="form__row__full">
              <div class="flex__row__full">
                <input type="checkbox" id="same-shipping-address" v-model="isSameAddress" @change="sameWithShipping($event)" />
                <label for="same-shipping-address">
                  Same as Shipping Address
                </label>
              </div>
            </div>
            <template v-if="!isSameAddress">
              <div class="form__row">
                <label for="billing-address1">Address Line 1</label>
                <input type="text" id="billing-address1" v-model="billingAddress1" placeholder="Type address">
              </div>
              <div class="form__row">
                <label for="billing-address2">Address Line 2 (optional)</label>
                <input type="text" id="billing-address2" v-model="billingAddress2" placeholder="Apt., Suite, Bldg, PO Box(optional)">
              </div>
              <div class="form__row">
                <label for="billing-town_city">Town/City</label>
                <input type="text" id="billing-town_city" v-model="billingTownCity" placeholder="Type town/city">
              </div>
              <div class="form__row">
                <label for="billing-country">Country</label>
                <select v-model="billingCountry" id="billing-country">
                  <option value='US' :selected="billingCountry=='US'">United States</option>
                  <option value='CA' :selected="billingCountry=='CA'">Canada</option>
                  <option
                    v-for="(country, key) in this.countryList"
                    :key="`country-${key}`"
                    :value="country.countryId"
                    :selected="country.countryId==billingCountry"
                  >
                    {{ country.countryName }}
                  </option>
                </select>
              </div>
              <div class="form__row">
                <label for="billing-state">State/Region</label>
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
                      {{ item.provinceName }}
                    </option>
                  </fragment>
                </select>
              </div>
              <div class="form__row">
                <label for="billing-postal_code">Postal Code</label>
                <input type="text" id="billing-postal_code" v-model="billingPostalCode" placeholder="Type postal code">
              </div>
            </template>
          </div>

          <h4 class="quote-form-title">Quote Details</h4>
          <div class="quote-form-card">

            <div class="form__row__full item-detail">
              Item
              <p class="item-id">{{ productSKU }}</p>
            </div>
            <div class="form__row__full">
              <label for="quote-quantity">Quantity *</label>
              <input type="text" id="quote-quantity" v-model="quantity" placeholder="Can be entered as a number or range">
              <span :class="['quote-form-errors', validateElement('quote-quantity')]">This field is invalid</span>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <label for="quote-else-know">Anything Else You'd Like us to Know?</label>
                <icon-question-circle v-tooltip.bottom-left="`Please indicate any product details, customizations, due date, or special requests.`" />
              </div>
              <textarea id="quote-else-know" v-model="quoteElseKnow"></textarea>
            </div>
            <div class="form__row__full">
              <div class="flex__row__full">
                <label for="quote-upload">Do you have anything you would like to upload?</label>
                <icon-question-circle v-tooltip.bottom-left="`Please upload any specifications, drawings or documents that may assist us in providing you a quote.`" />
              </div>
              <a @click.prevent="$refs.file.click()" class="upload-link">choose file</a>
              <input type="file" ref="file" id="quote-upload" v-on:change="handleFileUpload()" name="uploadFile" />
            </div>
          </div>

          <loading
            :active.sync="quoteRequestLoading"
            :is-full-page="false"
          />

          <notifications group="request-quote" position="top center" />

          <button @click.prevent="submitQuoteRequest">{{btnText}}</button>
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
  import Vue from 'vue'
  import { VTooltip } from 'v-tooltip'
  import { mapGetters } from 'vuex'
  import $ from 'jquery'
  import Loading from 'vue-loading-overlay'
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
      IconQuestionCircle,
      Loading,
    },
    computed: {
      ...mapGetters({
        productData: 'product/get',
        variant: 'product/variant'
      }),
      quantity: {
        get() {
          const { quantity } = this.$store.state.order;
          return quantity
        },
        set(value) {
          const quoteQuantity = parseInt(value)
          if (quoteQuantity > 0) {
            this.$store.dispatch('order/setQuantity', quoteQuantity)
          }
        }
      },
      productSKU() {
        return this.variant.sku
      },
      shippingMethodList () {
        return this.productData.tags.includes('is-freight') ? [
          {
            shipId: 'basic',
            shipName: 'Commercial Basic Free Freight Delivery (Standard Dock to Dock Service)'
          },
          {
            shipId: 'lift-gate',
            shipName: 'Commercial Lift-Gate Freight Delivery (Commercial Lift-Gate Service)'
          },
          {
            shipId: 'special',
            shipName: 'Commercial Special Freight Delivery (Commercial Lift-Gate & Inside Service)'
          },
          {
            shipId: 'exact-location',
            shipName: 'Commercial Freight Delivery (Inside Service to Exact Location)'
          },
          {
            shipId: 'residential-freight',
            shipName: 'RESIDENTIAL Freight Delivery (Residential Lift-Gate & Call Ahead Service)'
          },
          {
            shipId: 'residential-special',
            shipName: 'RESIDENTIAL Special Freight Delivery (Residential Lift-Gate & Inside Service 2/Call Ahead)'
          }
        ] : [
          {
            shipId: 'ground',
            shipName: 'Ground'
          },
          {
            shipId: 'three_day',
            shipName: '3 Day'
          },
          {
            shipId: 'two_day',
            shipName: '2 Day'
          },
          {
            shipId: 'next_day',
            shipName: 'Next Day'
          }
        ]
      },
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
        shippingMethod: 'ground',
        isLiftGate: false,
        isFreight: false,
        isSameAddress: false,
        billingAddress1: '',
        billingAddress2: '',
        billingTownCity: '',
        billingCountry: 'US',
        billingState: 'AL',
        billingPostalCode: '',
        quoteQuantity: 1,
        quoteElseKnow: '',
        file: '',
        btnText: 'SUBMIT QUOTE REQUEST',
        quoteRequestLoading: false,
      }
    },

    created () {
      Vue.use(VTooltip)
      Vue.directive('tooltip', VTooltip)
    },

    methods: {
      sameWithShipping (e) {
        if (this.isSameAddress) {
          this.billingAddress1 =  this.address1
          this.billingAddress2 = this.address2
          this.billingTownCity = this.townCity
          this.billingCountry = this.contactCountry
          this.billingState = this.contactState
          this.billingPostalCode = this.postalCode
        }
      },
      handleFileUpload () {
        const fileData = this.$refs.file.files[0]
        if (fileData.size > 1024 * 1024 * 2) {
          alert('Sorry, the file size is larger than 2 MB. Please retry with smaller file.')
        } else {
          console.log('file data: ', fileData)
          this.file = this.$refs.file.files[0]
        }
      },
      async submitFile () {
        let formData = new FormData()
        formData.append('quote_file', this.file)
        const uploaded = await this.$store.dispatch('product/uploadFile', formData)
        return uploaded
      },
      liveChat() {
        console.log('clicked live chat')
      },
      phoneSupport () {
        window.location = 'tel:1800-289-1539'
      },
      emailUs () {
        window.location = 'mailto:info@displays4sale.com'
      },
      async submitQuoteRequest () {
        this.sameWithShipping()
        const validateResult = await this.validateForm()
        if (validateResult) {
          // /*
          this.quoteRequestLoading = true
          let uploadedFile = null
          if (this.file.size) {
            uploadedFile = await this.submitFile()
          }
          const createdQuote = await this.$store.dispatch('order/createQuote', {
            contactName: this.contactName,
            contactCompany: this.contactCompany,
            contactEmail: this.contactEmail,
            contactPhone: this.contactPhone,
            address1: this.address1,
            address2: this.address2,
            townCity: this.townCity,
            contactCountry: this.contactCountry,
            contactState: this.contactState,
            postalCode: this.postalCode,
            isOutUS: this.isOutUS,
            outAddress: this.outAddress,
            isResidential: this.isResidential,
            shippingMethod: this.shippingMethod,
            isLiftGate: this.isLiftGate,
            isFreight: this.isFreight,
            billingAddress1: this.billingAddress1,
            billingAddress2: this.billingAddress2,
            billingTownCity: this.billingTownCity,
            billingCountry: this.billingCountry,
            billingState: this.billingState,
            billingPostalCode: this.billingPostalCode,
            quoteQuantity: this.quantity,
            quoteElseKnow: this.quoteElseKnow,
            originalPrice: this.original_price,
            metaShipping: this.productData.metafield,
            uploadedFile: uploadedFile
          })
          this.btnText = "YOU SUBMITTED QUOTE REQUEST"
          this.quoteRequestLoading = false
          this.$notify({
            group: 'request-quote',
            title: 'Request Quote',
            text: 'You submitted a quote successfully!'
          });
          setTimeout(this.closeQuote, 2000)

          // */
        } else {
          alert('please fill the form with correct data')
          return false
        }

      },
      validateElement (elementName) {
        return this.checkElement(elementName, 0) ? 'quote-valid' : 'quote-unvalid'
      },
      checkElement (el, checkLevel) {
        let regex = ''
        switch(el) {
          case 'contact_name':
            regex = /^[a-zA-Z ]{2,30}$/
            if (checkLevel == 0) {
              return (this.contactName == '') ? true : (regex.test(this.contactName) ? true : false)
            } else {
              return regex.test(this.contactName) ? true : false
            }
            break
          case 'contact_email':
            regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            if (checkLevel == 0) {
              return (this.contactEmail == '') ? true : (regex.test(this.contactEmail) ? true : false)
            } else {
              return regex.test(this.contactEmail) ? true : false
            }
            break
          case 'address1':
            regex = /([^\s])/
            if (checkLevel == 0) {
              return (this.address1 == '') ? true : (regex.test(this.address1) ? true : false)
            } else {
              return regex.test(this.address1) ? true : false
            }
            break
          case 'town_city':
            regex = /([^\s])/
            if (checkLevel == 0) {
              return (this.townCity == '') ? true : (regex.test(this.townCity) ? true : false)
            } else {
              return regex.test(this.townCity) ? true : false
            }
            break
          case 'postal_code':
            regex = /([^\s])/
            if (checkLevel == 0) {
              return (this.postalCode == '') ? true : (regex.test(this.postalCode) ? true : false)
            } else {
              return regex.test(this.postalCode) ? true : false
            }
            break
          case 'quote-quantity':
            regex = /^\d*$/
            if (checkLevel == 0) {
              return (this.quantity == 0) ? true : (regex.test(this.quantity) ? true : false)
            } else {
              return regex.test(this.quantity) ? true : false
            }
            break
        }
      },
      async validateForm () {
        const elementList = [
          'contact_name',
          'contact_email',
          'address1',
          'town_city',
          'postal_code',
          'quote-quantity'
        ]
        let validateResult = true
        elementList.map(el => {
          if (!this.checkElement(el, 1)) {
            validateResult = false
          }
        })
        return validateResult
      }      
    }

  }
</script>