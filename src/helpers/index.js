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