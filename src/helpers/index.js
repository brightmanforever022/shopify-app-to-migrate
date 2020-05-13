const monthList = [
	'January', 'February', 'March', 'April',
	'May', 'June', 'July', 'August',
	'September', 'October', 'November', 'December'
]
export function checkDiscountPeriodValidation(startsAt, endsAt) {
	var currentDate = new Date().getTime()
	var discountStartsAt = new Date(startsAt).getTime()
	if (endsAt) {
		var discountEndsAt = new Date(endsAt).getTime()
	}
	return (currentDate >= discountStartsAt) && (endsAt ? (currentDate <= discountEndsAt) : true)
}

export function getFreightShippingPrice(optionList, id) {
	var shippingPrice = 0
	optionList.map(ol => {
		if (ol.id == id) {
			shippingPrice = ol.price
		}
	})
	
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

	const summaryLines = summary.split('<newline>')
	summaryLines.forEach(summaryLine => {
		let shippingLineItems = summaryLine.split(',')
		const shippingQtyItems = shippingLineItems[0].split(' ')
		const shippingQty = shippingQtyItems[1].split('-')
		const qtyFrom = parseInt(shippingQty[0])
		const qtyTo = parseInt(shippingQty[1])
		if (quantity >= qtyFrom && quantity <= qtyTo) {
			discountPercent = parseInt(shippingLineItems[1].replace('%', ''))
		}
		
	})
	return discountPercent
}

export function getShippingPeriod(summary, quantity, fedex_type = 'ground') {
	let shipDuration = ''
	let shipPeriodFrom = 0
	let shipPeriodTo = 0
	let fedexPeriod = 5

	const summaryLines = summary.split('<newline>')
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
			shipPeriodTo = shipPeriod[1] ? parseInt(shipPeriod[1]) : shipPeriodFrom
		}		
	})

	shipPeriodFrom = shipDuration.includes('Weeks') ? shipPeriodFrom * 5 : shipPeriodFrom
	shipPeriodTo = shipDuration.includes('Weeks') ? shipPeriodTo * 5 : shipPeriodTo

	let estimateDate = getAfterNDays(shipPeriodFrom)
	const leadTimeFrom = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()
	estimateDate = getAfterNDays(shipPeriodFrom + 1)
	const estimateFrom = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()
	estimateDate = getAfterNDays(shipPeriodTo)
	const leadTimeTo = monthList[estimateDate.getMonth()] + ' ' + estimateDate.getDate() + ', ' + estimateDate.getFullYear()

	switch(fedex_type) {
		case 'twoday':
			fedexPeriod = 2;
			break;
		case 'threeday':
			fedexPeriod = 3;
			break;
		case 'nextday':
			fedexPeriod = 1;
			break;
		default:
			fedexPeriod = 5
	}
	estimateDate = getAfterNDays(shipPeriodTo + fedexPeriod)
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

export function getAfterNDays(days) {
	var businessDays = days, counter = 1; // set to 1 to count from next business day
	var tmpDate
	while( businessDays>0 ) {
		tmpDate = new Date();
		var startDate = new Date();
		tmpDate.setDate( startDate .getDate() + counter++ );
		switch( tmpDate.getDay() ) {
			case 0: case 6: break;// sunday & saturday
			default:
				businessDays--;
		}
	}
	return tmpDate
}

export function compareOptions (option1, option2) {
	let firstOptionIdList = option1.map(op1 => parseInt(op1.id))
	firstOptionIdList.sort(function(a, b){ return a-b })
	let secondOptionIdList = option2.map(op2 => parseInt(op2.id))
	secondOptionIdList.sort(function(a, b){ return a-b })

	return (JSON.stringify(firstOptionIdList) == JSON.stringify(secondOptionIdList))
}