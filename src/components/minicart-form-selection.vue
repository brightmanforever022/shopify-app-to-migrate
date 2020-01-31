<template>
  <div class="form__selections-view">
    <h4>Your selections</h4>
    <ul>
      <!-- <li>Number of doors: {{options.quantity}}</li>
      <li v-for="(opt, index) in options.original"
        :key="index"
      >
        {{opt.name}}: {{opt.value}}
      </li> -->
      <li
        v-for="(option, index) in options.custom"
        :key="index"
      >{{option.group}}: {{option.label}}</li>
      <li>Shipping method: Free fround freight</li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MinicartFormSelection',
  props: {
    line_id: {
      type: String,
      default: () => null,
    }
  },
  computed: {
    ...mapGetters({
      get_options: 'cart/get_options_by_id'
		}),
		options (id) {
			return this.get_options(this.line_id)
		}
  },  
}
</script>