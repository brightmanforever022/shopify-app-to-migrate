import request from '@/utils/request'

export function initializeWishlist () {
  localStorage.removeItem('wish_items')
}

export function getWishlist () {
	var currentWishItems
	if (localStorage.getItem('wish_items') === 'undefined' || localStorage.getItem('wish_items') == null) {
		currentWishItems = {wish_items: []}
	} else {
		currentWishItems = JSON.parse(localStorage.getItem('wish_items'))
	}

	return currentWishItems.wish_items
}

export function addWishlist (data) {
	var wishItem = data
	var currentWishItems
	if (localStorage.getItem('wish_items') === 'undefined' || localStorage.getItem('wish_items') == null) {
		currentWishItems = {wish_items: [wishItem]}
		localStorage.setItem('wish_items', JSON.stringify(currentWishItems))
	} else {
		currentWishItems = JSON.parse(localStorage.getItem('wish_items'))
		currentWishItems.wish_items.push(wishItem)
		localStorage.setItem('wish_items', JSON.stringify(currentWishItems))
	}

	return currentWishItems.wish_items
}

export function removeWishlist (id) {
	var currentWishItems = JSON.parse(localStorage.getItem('wish_items'))
	var removedWishItems = []
	if (currentWishItems.wish_items.length > 1) {
		removedWishItems = []
		currentWishItems.wish_items.map(wish_item => {
			if (wish_item.wishId != id) {
				removedWishItems.push(wish_item)
			}
		})
	}
	localStorage.setItem('wish_items', JSON.stringify({wish_items: removedWishItems}))
	return removedWishItems
}


