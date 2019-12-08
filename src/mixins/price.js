import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      variant: 'product/variant',
      quantity: 'order/quantity',
      options: 'order/custom_options',
      variant_id: 'order/variant_id',
      template: 'template/template_by_variant',
    }),
    calculated_item_price () {
      let add_on_prices = this.options.length > 0 ? this.options.map(opt => opt.price).reduce((prev, next) => prev + next) : 0
      return Number(this.variant.price) + add_on_prices
    },
    calculated_price () {
      let add_on_prices = this.options.length > 0 ? this.options.map(opt => opt.price).reduce((prev, next) => prev + next) : 0
      return (Number(this.variant.price) + add_on_prices) * this.quantity
    },
    fully_customized () {
      return this.options.length === this.template(this.variant_id).groups.length
    },
    customizable () {
      return this.template(this.variant_id).groups.length > 0
    }
  }
}