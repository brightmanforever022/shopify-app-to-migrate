<template>
  <fragment>
    <div
      class="overlay__bg"
      :key="variant-selection"
      :class="{'visibled': is_opened}"
      @click.prevent="closeSelection"
    ></div>
    <div
      class="product__section-overlay"
      :class="{'visibled': is_opened}"
    >
      <a
        class="close-selections"
        @click.prevent="closeSelection"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16L9.41333 14.5867L3.82667 9L16 9L16 7L3.82667 7L9.41333 1.41333L8 -6.99382e-07L6.99382e-07 8L8 16Z" />
        </svg>
        Back to product details
      </a>
      <h1>Make Your Selections</h1>
      <div class="form-body">
        <div class="loading-spin">
          <loading
            :active.sync="loading"
            :is-full-page="false"
          />
        </div>
        <input-quantity></input-quantity>
        <!-- <variant-selection></variant-selection> -->
        <div
          v-for="(group, index) in template.groups"
          :key="index"
          class="form__row selector-wrapper js product-form__item"
        >
          <label class="form__label" :for="`group-option-selector-${index}`">
            {{group.label}}
          </label>
          <div v-if="activeOptions(group.dattributes).length>1" class="select">
            <select
              :name="group.label"
              :class="`group-option-selector group-option-selector-${index} product-form__input`"
              :id="`group-option-selector-${index}`"
              :data-group="`${group.id}`"
              @change="setAddOn"
              :placeholder="`Select ${group.label}`"
            >
              <option :selected="!customized(group.label)" :key=0 :value="noselected"></option>
              <option
                v-for="(item, key) in activeOptions(group.dattributes)"
                :key="key"
                :value="item.id"
              >
                {{item.label}}
              </option>
            </select>
          </div>
          <div v-if="activeOptions(group.dattributes).length<2" class="select">
            <select
              :name="group.label"
              :class="`group-option-selector group-option-selector-${index} product-form__input`"
              :id="`group-option-selector-${index}`"
              :data-group="`${group.id}`"
              @change="setAddOn"
              :placeholder="`Select ${group.label}`"
            >
              <option
                v-for="(item, key) in activeOptions(group.dattributes)"
                :key="key"
                :value="item.id"
                :selected="true"
              >
                {{item.label}}
              </option>
            </select>
          </div>
          <div
            class="form__errors"
            v-if="!customized(group.label)"
          >
            This option requires changes. Click to review.
          </div>
        </div>
      </div>
      <div class="form__actions">
        <a class="save_to_wishlist"
          @click.prevent="addToWhishlist"
        >
          <icon-heart/>
          Save to Wish List
        </a>
        <div class="form__actions-right">
          <div class="total__cost">
            <div class="total__cost-prifix">Total Cost</div>
            <div class="total__cost-price">{{calculated_price | money}}</div>
          </div>
          <button
            class="btn form__btn btn--green"
            :disabled="!fully_customized"
            @click.prevent="saveSelection"
          >
            <span>Save Selections</span>
          </button>
        </div>
      </div>
    </div>

    <div
      class="overlay__bg"
      :class="{'visibled': addtocart_confirm_opened}"
      :key="addtocart-confirm"
      @click.prevent="closeConfirm"
    ></div>
    <div
      class="added_confirm-overlay"
      v-show="addtocart_confirm_opened"
    >
      <div class="addedCart">
        <div class="added_img">
          <img :src="productData.images.edges[0].node.originalSrc" />
        </div>
        <div class="added_product_info">
          <p>Item ID # SCBBR</p>
          <a :href="productData.onlineStoreUrl" :target="_blank">{{productData.title}}</a>
          <span>Added to Cart</span>
        </div>
      </div>
      <div class="confirm-buttons">
        <div>
          <a class="btn form__btn btn--block" @click.prevent="continueShopping">continue shopping</a>
        </div>
        <div>
          <a class="btn form__btn btn--block" @click.prevent="viewDisplayCart">view cart</a>
        </div>
      </div>
      <div class="related-products">
        <h2>Customer Who Shopped For Enclosed Indoor Bulletin Boards Multipl... Also Purchased Items Below</h2>
        <div class="product-list">
          <div class="product">
            <img :src="productData.images.edges[0].node.originalSrc" />
            <a :href="productData.onlineStoreUrl">product1</a>
            <span>Item ID #TTR607</span>
            <p>From product price</p>
          </div>
          <div class="product">
            <img :src="productData.images.edges[0].node.originalSrc" />
            <a :href="productData.onlineStoreUrl">product1</a>
            <span>Item ID #TTR607</span>
            <p>From product price</p>
          </div>
          <div class="product">
            <img :src="productData.images.edges[0].node.originalSrc" />
            <a :href="productData.onlineStoreUrl">product1</a>
            <span>Item ID #TTR607</span>
            <p>From product price</p>
          </div>
        </div>
      </div>
    </div>
    <div class="form__actions">
      <a
        class="btn form__btn btn--block"
        @click.prevent="openSelection"
      >
        <span v-if="fully_customized && customizable">Edit selections</span>
        <span v-else>Make selections</span>
      </a>
      <button class="btn form__btn btn--block add-to-cart"
        :class="{'inactive': !fully_customized && customizable}"
        :disabled="!fully_customized && customizable"
        @click.prevent="addToCart"
       >
        <span>Add to cart</span>
        <span v-if="!fully_customzed && customizable">(Make Selections first)</span>
      </button>
    </div>

  </fragment>
</template>
<script>
import { mapGetters } from 'vuex'
import $ from 'jquery'
import Loading from 'vue-loading-overlay'
import priceMixin from '@/mixins/price'
import InputQuantity from '@/components/quantity'
// import VariantSelection from '@/components/variant-selection'
import IconHeart from '@/components/icons/icon-heart'
import Minicart from '@/components/minicart'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'FormActions',
  computed: {
    ...mapGetters({
      variant_id: 'order/variant_id',
      variant: 'product/variant',
      template: 'template/get_template',
      group: 'template/group_by_id',
      exceptGroupList: 'template/group_label_list',
      productData: 'product/get',
      custom_options: 'order/custom_options',
      except_list: 'order/except_list',
    })
  },
  props: {
    openDisplayCart: {
      type: Function
    }
  },
  mixins: [ priceMixin ],
  components: {
    InputQuantity,
    // VariantSelection,
    IconHeart,
    Loading,
    Minicart
  },
  data () {
    return {
      noselected: 'noselected',
      loading: false,
      is_opened: false,
      addtocart_confirm_opened: false
    }
  },
  created () {
    this.checkGroupAttributes()
  },
  methods: {
    openSelection () {
      this.is_opened = true
      $('.product__details').css('z-index', -1)
      $('#shopify-section-header .header').css('z-index', '-1')
    },
    closeSelection () {
      this.is_opened = false
      $('.product__details').css('z-index', 'initial')
      $('#shopify-section-header .header').css('z-index', '101')
    },
    openConfirm () {
      this.addtocart_confirm_opened = true
      $('.product__details').css('z-index', -1)
      $('#shopify-section-header .header').css('z-index', '-1')
    },
    closeConfirm () {
      this.addtocart_confirm_opened = false
      $('.product__details').css('z-index', 'initial')
      $('#shopify-section-header .header').css('z-index', '101')
    },
    continueShopping () {
      this.closeConfirm()
      // this.openSelection()
    },
    viewDisplayCart () {
      this.closeConfirm()
      this.openDisplayCart()
    },
    isActiveOption (item) {
      if (!this.except_list.includes(item.id)) {
        return 'disabled'
      }
    },
    activeOptions (options) {
      return options.filter(op => !this.except_list.includes(op.id))
    },
    checkGroupAttributes () {
      this.template.groups.map(gr => {
        const activeAttributes = this.activeOptions(gr.dattributes)
        if (activeAttributes.length == 1) {
          this.setAutoOneAddon(gr, activeAttributes[0])
        }
      })
    },
    async setAutoOneAddon (group, item) {
      if (item) {
        item['group'] = group.label
  
        // get excepts for selected item
        const drellation = group.drellations.find(dr => dr.dattribute_id == item.id)
        const newExcepts = drellation.excepts == '' ? [] : drellation.excepts.split(',').map(ex => {
          return {
            groupId: drellation.group_id,
            groupLabel: group.label,
            exceptId: parseInt(ex)
          }
        })
        try {
          await this.$store.dispatch('order/upsert_customization', item)
          await this.$store.dispatch('order/setExcepts',
           {
              groupId: drellation.group_id,
              groupLabelList: this.exceptGroupList(drellation.excepts),
              exceptData: newExcepts
            }
          )
          // this.checkGroupAttributes()
        } catch (error) {
          console.log('Error in upsert customization: ', error)
        }
      }
    },
    async setAddOn (evt) {
      let group_id = evt.target.dataset.group
      let item_id = evt.target.value
      let group = this.group(evt.target.dataset.group)
      let item = group.dattributes.find(i => i.id === +item_id)
      if (item) {
        item['group'] = group.label
  
        // get excepts for selected item
        const drellation = group.drellations.find(dr => dr.dattribute_id == item.id)
        const newExcepts = drellation.excepts == '' ? [] : drellation.excepts.split(',').map(ex => {
          return {
            groupId: drellation.group_id,
            groupLabel: group.label,
            exceptId: parseInt(ex)
          }
        })
        try {
          const customOptions = await this.$store.dispatch('order/upsert_customization', item)
          await this.$store.dispatch('order/setExcepts',
           {
              groupId: drellation.group_id,
              groupLabelList: this.exceptGroupList(drellation.excepts),
              exceptData: newExcepts
            }
          )
          this.checkGroupAttributes()
        } catch (error) {
          console.log('Error in upsert customization: ', error)
        }
      }
    },
    saveSelection () {
      this.is_opened = false
      $('.product__details').css('z-index', 'initial')
      $('#shopify-section-header .header').css('z-index', '101')
    },
    customized (group_label) {
      return this.custom_options.map(opt => opt.group).includes(group_label)
    },
    async addToCart () {
      if (!this.fully_customized && this.customizable) {
        return false
      }
      let cartItem = {
        product_title: this.productData.title,
        product_url: this.productData.onlineStoreUrl,
        product_img_url: this.productData.images.edges[0].node.originalSrc,
        product_id: this.productData.id.split('/').slice(-1).pop(),
        collections: this.productData.collections.edges.map(collectionItem => {
          return collectionItem.node.id.split('/').slice(-1).pop()
        }),
        variant_id: this.variant_id,
        selected_options: this.variant.selectedOptions,
        custom_options: this.custom_options,
        quantity: this.quantity,
        original_price: this.original_price,
        calculated_item_price: this.calculated_item_price,
        calculated_price: this.calculated_price,
        free_ground: this.productData.tags.includes('free-ground') ? true : false,
        wishlisted: false,
      }
      
      try {
        const res = await this.$store.dispatch('cart/addCart', cartItem)
        this.openConfirm()
      } catch (error) {
        console.log(error)
      }
    },
    async addToWhishlist () {
      if (!this.fully_customized && this.customizable) {
        alert('Please select options firstly!')
        return false
      }
      this.loading = true
      let wishItem = {
        product_title: this.productData.title,
        product_url: this.productData.onlineStoreUrl,
        product_img_url: this.productData.images.edges[0].node.originalSrc,
        product_id: this.productData.id.split('/').slice(-1).pop(),
        collections: this.productData.collections.edges.map(collectionItem => {
          return collectionItem.node.id.split('/').slice(-1).pop()
        }),
        variant_id: this.variant_id,
        selected_options: this.variant.selectedOptions,
        custom_options: this.custom_options,
        calculated_item_price: this.calculated_item_price,
        free_ground: this.productData.tags.includes('free-ground') ? true : false,
      }
      try {
        const res = await this.$store.dispatch('wishlist/addWish', wishItem)
        setTimeout(() => {
          this.loading = false
          console.log('add wishlist response: ', res)
        }, 800)
      } catch (err) {
        this.loading = false
        console.log(err)
        alert('Sorry, adding this selection into wishlist is failed!')
      }
    },
  }
}

</script>
