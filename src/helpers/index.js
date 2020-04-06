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
			return parseFloat(fedexShippingList.ground)
		case 'twoday':
			return parseFloat(fedexShippingList.twoday)
		case 'threeday':
			return parseFloat(fedexShippingList.threeday)
		case 'nextday':
			return parseFloat(fedexShippingList.nextday)
		default:
			return 0
	}
}

export function getDiscountByQuantity(summary, quantity) {
	let discountPercent = 0
	let shipDuration = ''
	let shipPeriodFrom = 0
	let shipPeriodTo = 0

	const summaryLines = summary.split('\n')
	summaryLines.forEach(summaryLine => {
		let shippingLineItems = summaryLine.split(',')
		const shippingQtyItems = shippingLineItems[0].split(' ')
		const shippingQty = shippingQtyItems[1].split('-')
		const qtyFrom = parseInt(shippingQty[0])
		const qtyTo = parseInt(shippingQty[1])
		if (quantity >= qtyFrom && quantity <= qtyTo) {
			discountPercent = parseInt(shippingLineItems[1].replace('%', ''))
			shipDuration = shippingLineItems[2]
			let shipPeriod = shippingLineItems[2].split('-')
			shipPeriodFrom = parseInt(shipPeriod[0].replace('Usually Ships in ', ''))
			shipPeriodTo = parseInt(shipPeriod[1])
		}
		
	})
	return discountPercent
}

export function getShippingPeriod(summary, quantity) {
	let shipDuration = ''
	let shipPeriodFrom = 0
	let shipPeriodTo = 0

	const monthList = [
		'January', 'February', 'March', 'April',
		'May', 'June', 'July', 'August',
		'September', 'October', 'November', 'December'
	]

	const summaryLines = summary.split('\n')
	summaryLines.forEach(summaryLine => {
		let shippingLineItems = summaryLine.split(',')
		const shippingQtyItems = shippingLineItems[0].split(' ')
		const shippingQty = shippingQtyItems[1].split('-')
		const qtyFrom = parseInt(shippingQty[0])
		const qtyTo = parseInt(shippingQty[1])
		if (quantity >= qtyFrom && quantity <= qtyTo) {
			shipDuration = shippingLineItems[2]
			let shipPeriod = shippingLineItems[2].split('-')
			shipPeriodFrom = parseInt(shipPeriod[0].replace('Usually Ships in ', ''))
			shipPeriodTo = parseInt(shipPeriod[1])
		}
		
	})

	shipPeriodFrom = shipDuration.includes('Weeks') ? shipPeriodFrom * 7 : shipPeriodFrom
	shipPeriodTo = shipDuration.includes('Weeks') ? shipPeriodTo * 7 : shipPeriodTo

	const currentDate = new Date()
	let estimateDate = new Date(currentDate.getTime() + 86400000 * shipPeriodFrom)
	const leadTimeFrom = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()
	estimateDate = new Date(currentDate.getTime() + 86400000 * (shipPeriodFrom + 7))
	const estimateFrom = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()
	estimateDate = new Date(currentDate.getTime() + 86400000 * shipPeriodTo)
	const leadTimeTo = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()
	estimateDate = new Date(currentDate.getTime() + 86400000 * (shipPeriodTo + 7))
	const estimateTo = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()

	return {
		shipDuration: shipDuration,
		leadTimeFrom: leadTimeFrom,
		leadTimeTo: leadTimeTo,
		estimateFrom: estimateFrom,
		estimateTo: estimateTo,
		shipPeriodFrom: shipPeriodFrom,
		shipPeriodTo: shipPeriodTo,
	}
}