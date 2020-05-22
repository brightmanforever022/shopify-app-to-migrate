<template>
  <table class="option-select-table" @click.prevent="test">
    <thead>
      <tr>
        <th>Item ID</th>
        <th>Description</th>
        <th>Vendor</th>
        <th>Unit Price</th>
        <th>Shipping Weight</th>
        <th>Shipping Dimensions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(opn, index) in options" :key="index">
        <td>{{productItemId(itemId)}}</td>
        <td>{{optionLabel(opn)}}</td>
        <td><span v-if="opn.vendor_sku != ''">{{opn.vendor_sku}}<br/></span>Postal Code: {{opn.postal_code}}</td>
        <td>{{optionPrice(opn.price)}}</td>
        <td>{{optionWeight(opn.weight)}}</td>
        <td>{{optionDimension(opn)}}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormSelectionTable',
  computed: {
    ...mapGetters({
      options: 'order/custom_options',
    }),
    
  },
  props: {
    itemId: {
      type: String
    },
    // openQuote: {
    //   type: Function
    // },
  },
  methods: {
    test() {
      console.log('options: ', this.options);
    },
    productItemId() {
      return this.itemId
    },
    optionLabel(item) {
      if (item.price > 0) {
        if (item.price_type) {
          return item.label + '(' + item.price + '% Upcharge)'
        } else {
          return item.label + '(+ $' + item.price.toFixed(2) + ')'
        }
      } else {
        return item.label
      }
    },
    optionPrice(price) {
      if(price > 0) {
        return '$' + price.toFixed(2)
      } else {
        return 'N/A'
      }
    },
    optionWeight(weight) {
      if(weight > 0) {
        return parseInt(weight) + ' LBS'
      } else {
        return 'N/A'
      }
    },
    optionDimension(item) {
      if (item.width > 0) {
        return item.width + '" x ' + item.length + '" x ' + item.girth + '"'
      } else {
        return 'N/A'
      }
    }
  },
}
</script>