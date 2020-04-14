import request from '@/utils/request'

export function initializeCart () {
  localStorage.removeItem('line_items')
}

export function getCart () {
	var currentLineItems
	if (localStorage.getItem('line_items') === 'undefined' || localStorage.getItem('line_items') == null) {
		currentLineItems = {line_items: []}
	} else {
		currentLineItems = JSON.parse(localStorage.getItem('line_items'))
	}

	return currentLineItems.line_items
}

export function plusNCartItem (id, quantity) {
	var currentLineItems = JSON.parse(localStorage.getItem('line_items'))
	var plusedLineItems = currentLineItems.line_items.map(line_item => {
		if (line_item.lineId == id) {
			var tempLineItem = line_item
			tempLineItem.quantity += quantity
			tempLineItem.calculated_price = tempLineItem.calculated_item_price * tempLineItem.quantity
			return tempLineItem
		} else {
			return line_item
		}
	})
	localStorage.setItem('line_items', JSON.stringify({line_items: plusedLineItems}))
	return plusedLineItems
}

export function addCart (data) {
	var lineItem = data
	var currentLineItems
	if (localStorage.getItem('line_items') === 'undefined' || localStorage.getItem('line_items') == null) {
		currentLineItems = {line_items: [lineItem]}
		localStorage.setItem('line_items', JSON.stringify(currentLineItems))
	} else {
		currentLineItems = JSON.parse(localStorage.getItem('line_items'))

		currentLineItems.line_items.push(lineItem)
		localStorage.setItem('line_items', JSON.stringify(currentLineItems))
	}

	return currentLineItems.line_items
}

export function removeCart (id) {
	var currentLineItems = JSON.parse(localStorage.getItem('line_items'))
	var removedLineItems = []
	if (currentLineItems.line_items.length > 1) {
		removedLineItems = []
		currentLineItems.line_items.map(line_item => {
			if (line_item.lineId != id) {
				removedLineItems.push(line_item)
			}
		})
	}
	localStorage.setItem('line_items', JSON.stringify({line_items: removedLineItems}))
	return removedLineItems
}

export function plusCartItem (id) {
	var currentLineItems = JSON.parse(localStorage.getItem('line_items'))
	var plusedLineItems = currentLineItems.line_items.map(line_item => {
		if (line_item.lineId == id) {
			var tempLineItem = line_item
			tempLineItem.quantity ++
			tempLineItem.calculated_price = tempLineItem.calculated_item_price * tempLineItem.quantity
			return tempLineItem
		} else {
			return line_item
		}
	})
	localStorage.setItem('line_items', JSON.stringify({line_items: plusedLineItems}))
	return plusedLineItems
}

export function minusCartItem (id) {
	var currentLineItems = JSON.parse(localStorage.getItem('line_items'))
	var minusedLineItems = currentLineItems.line_items.map(line_item => {
		if (line_item.lineId == id && line_item.quantity > 1) {
			var tempLineItem = line_item
			tempLineItem.quantity --
			tempLineItem.calculated_price = tempLineItem.calculated_item_price * tempLineItem.quantity
			return tempLineItem
		} else {
			return line_item
		}
	})
	localStorage.setItem('line_items', JSON.stringify({line_items: minusedLineItems}))
	return minusedLineItems
}

export function getFedexList (data) {
  return request({
    url: `carts/fedex/options/list`,
    method: 'post',
    data: data
  })
}

export function getFreightOptions () {
  return request({
    url: `/carts/freightoptions`,
    method: 'post'
  })
}