<template>
  <div class="quote__selection-view">
    <label class="form__label" :for="`group-option-selector`">
      {{firstGroup.label}}
    </label>
    <div class="select">
      <select
        :class="`group-option-selector product-form__input`"
        :id="`group-option-selector`"
        @change="setAddOn"
        :placeholder="`Select ${firstGroup.label}`"
      >
        <option :selected="!customized(firstGroup.label)" :key=0 :value="noselected"></option>
        <option
          v-for="(item, key) in firstGroup.dattributes"
          :key="key"
          :value="item.id"
          :selected="selectedAttribute(item.id)"
        >
          {{item.label}}
        </option>
      </select>
    </div>
    <ul>
      <li
        v-for="(option, index) in optionsExceptFirst"
        :key="index"
      >{{option.group}}: {{option.label}}</li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'QuoteSelection',
  computed: {
    ...mapGetters({
      options: 'order/custom_options',
      template: 'template/get_template',
      exceptGroupList: 'template/group_label_list',
    }),
    firstOption () {
      return this.options.find(op => op.group == this.firstGroup.label)
    },
    firstGroup () {
      return this.template.groups[0]
    },
    optionsExceptFirst () {
      return this.options.filter(op => op.group != this.firstGroup.label)
    }
  },
  methods: {
    async setAddOn (evt) {
      let group_id = this.firstGroup.id
      let item_id = evt.target.value
      let group = this.firstGroup
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
        } catch (error) {
          console.log('Error in upsert customization: ', error)
        }
      }
    },
    customized (group_label) {
      return this.options.map(opt => opt.group).includes(group_label)
    },
    selectedAttribute (attributeId) {
      return (this.firstOption.id == attributeId)
    }
  }
}
</script>