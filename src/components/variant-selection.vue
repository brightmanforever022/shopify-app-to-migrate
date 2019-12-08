<template>
  <fragment>
    <div
      v-for="(option, index) in options"
      :key="index"
      class="form__row selector-wrapper js product-form__item"
    >
      <label class="form__label" :for="`variant-option-selector-${index}`">
        {{option.name}}
      </label>
      <div class="select">
        <select
          :name="option.name"
          :class="`variant-option-selector variant-option-selector-${index} product-form__input`"
          :id="`variant-option-selector-${index}`"
          :data-index="`${index}`"
          @change="selectVariant"
        >
          <option v-for="(value, key) in option.values" :key="key">
            {{value}}
          </option>
        </select>
      </div>
    </div>
  </fragment>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VariantSelection',
  computed: {
    ...mapGetters({
      options: 'product/options',
      variant: 'product/variant'
    })
  },
  created () {
  },
  methods: {
    selectVariant (evt) {
      let option = {
        value: evt.target.value,
        name: evt.target.name
      }
      this.$store.dispatch('product/setVariant', option)
        .then(() => {
          this.$store.dispatch('order/setVariant', this.variant)
          this.$store.dispatch('order/initCustomization')
        })
    }
  }
}
</script>