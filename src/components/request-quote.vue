<template>
  <fragment>
    <div
      class="product__section-overlay"
      :class="{'visibled': isQuoteModal}"
    >
      <div class="quote-body">
        <h3>Request a Quote</h3>
        <p>
          Please fill out this form and one of our customer service team members will get back to you promptly. Most quotes will be provided within 1 business day.
        </p>
        <div class="quote-form">
          <div class="quote-form-card">
            <h4 class="quote-form-title">Your Info</h4>
            <label for="contact_name">Contact Name *</label>
            <input type="text" id="contact_name" v-model="contactName" placeholder="Type 2222 name">

            <label for="contact_name">Company (optional)</label>
            <input type="text" id="company" v-model="company" placeholder="Type company (optional)">
            <label for="contact_name">Email Address *</label>
            <input type="text" id="contact_email" v-model="contactEmail" placeholder="Type your email address">
            <label for="contact_name">Phone Number (optional)</label>
            <input type="text" id="contact_phone" v-model="contactPhone" placeholder="(555) 555-555 (optional)">
          </div>
        </div>

      </div>
      <div class="quote-sidebar"></div>
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