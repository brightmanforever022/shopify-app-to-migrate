import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      variant: 'product/variant',
      quantity: 'order/quantity',
      options: 'order/custom_options',
      variant_id: 'order/variant_id',
      template: 'template/get_template',
    }),
    original_price () {
      const firstGroupLabel = this.template.groups[0].label
      const optionOfFirstGroup = this.options.find(op => op.group == firstGroupLabel)
      return optionOfFirstGroup ? optionOfFirstGroup.price : 0
    },
    calculated_item_price () {
      let add_on_prices = this.options.length > 0 ? this.options.map(opt => opt.price ? (opt.price_type ? Number(this.variant.price) * opt.price / 100 : opt.price) : 0).reduce((prev, next) => prev + next) : 0
      return Number(this.original_price) + add_on_prices
    },
    calculated_price () {
      return (this.calculated_item_price * this.quantity)
    },
    fully_customized () {
      // return this.options.length === this.template(this.variant_id).groups.length
      return this.options.length === this.template.groups.length
    },
    customizable () {
      return this.template.groups.length > 0
    }
  }
}