<template>
  <fragment>
    <div
      class="product__section-overlay"
      :class="{'visibled': isQuoteModal}"
    >
      <h3>this is request quote app</h3>
    </div>
  </fragment>
</template>

<script>
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
  }
</script>