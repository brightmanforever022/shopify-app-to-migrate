export function checkDiscountPeriodValidation(startsAt, endsAt) {
	var currentDate = new Date().getTime()
	var discountStartsAt = new Date(startsAt).getTime()
	if (endsAt) {
		var discountEndsAt = new Date(endsAt).getTime()
	}
	return (currentDate >= discountStartsAt) && (endsAt ? (currentDate <= discountEndsAt) : true)
}

export function getFreightShippingPrice(id) {
	var shippingPrice = 0
	if (id == 1) {
		shippingPrice = 0
	} else if (id == 2) {
		shippingPrice = 125
	} else if (id == 3) {
		shippingPrice = 300
	} else if (id == 4) {
		shippingPrice = 450
	} else if (id == 5) {
		shippingPrice = 130
	} else if (id == 6) {
		shippingPrice = 325
	}
	return shippingPrice
}

export function getFedexShippingPrice(fedexShippingList, fedexType) {
	switch(fedexType) {
		case 'ground':
			return fedexShippingList.ground.total_net_charge ? parseFloat(fedexShippingList.ground.total_net_charge) : 0
		case 'twoday':
			return fedexShippingList.twoday.total_net_charge ? parseFloat(fedexShippingList.twoday.total_net_charge) : 0
		case 'threeday':
			return fedexShippingList.threeday.total_net_charge ? parseFloat(fedexShippingList.threeday.total_net_charge) : 0
		case 'nextday':
			return fedexShippingList.nextday.total_net_charge ? parseFloat(fedexShippingList.nextday.total_net_charge) : 0
		default:
			return 0
	}
}