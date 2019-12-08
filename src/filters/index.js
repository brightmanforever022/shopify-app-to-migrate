import Vue from 'vue'

Vue.filter('money', function (value, prefix = '$') {
  if (value) {
    try {
      if (value >= 0)
        return prefix + parseFloat(value).toFixed(2)
      else
        return '-' + prefix + Math.abs(parseFloat(value).toFixed(2))
    } catch (e) {
      console.error('[filter#money] Error:', e)
    }
  } else {
    return prefix + '0'
  }
})