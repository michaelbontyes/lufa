(function () {
	function lufa_filter() {
		let maxScrollInterval = 200;
		let scrollDelay = 100;
		let stopRequested = false;
		let foundDiscounts = 0;

		let overlay = $(`
		<div id="lufa-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center;">
			<img src="//raw.githubusercontent.com/michaelbontyes/lufa/main/loader.gif" alt="Loading" style="width: 200px; height: 200px;">
			<div style="color: white; font-size: 24px; margin: 20px;"><span id="discount-count"></span><span class="animated-ellipsis"></span></div>
			<button id="stop-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Stop</button>
		</div>
		`);
		$('body').append(overlay);

		$('#stop-button').click(function () {
			stopRequested = true;
			$('#lufa-overlay').remove();
		});

		$('<style>')
			.prop('type', 'text/css')
			.html(`
				@keyframes blink {
					0%, 100% { opacity: 0; }
					50% { opacity: 1; }
				}
				.animated-ellipsis::after {
					content: '...';
					animation: blink 1s infinite;
				}
			`)
			.appendTo('head');

		function scrollStep() {
			if (stopRequested) return;

			let scrollTop = $(window).scrollTop();
			let scrollHeight = $(document).height();
			let newScrollTop = scrollTop + maxScrollInterval;

			$(window).scrollTop(newScrollTop);
			filterProductsWithoutDiscount();

			if (
				scrollTop < scrollHeight - $(window).height() &&
				newScrollTop < scrollHeight
			) {
				setTimeout(scrollStep, scrollDelay);
			} else {
				console.log('Scroll complete.');
				$('#lufa-overlay').remove();
			}
		}

function filterProductsWithoutDiscount() {
	const uniqueSaleProducts = new Set();

	$('.single-product-wrapper, .products-wrapper-generated').each(function () {
		const $product = $(this);
		const pid = $product.find('.single-product').data('pid');

		const hasSale = $product.find('.order-price.fr.sale').length > 0;

		if (!hasSale) {
			// Hide the product if it doesn't have a sale
			$product.hide();
		} else {
			// Show the product if it has a sale and ensure we count unique items
			$product.show();
			if (pid) {
				uniqueSaleProducts.add(pid);
			}
		}
	});

	const count = uniqueSaleProducts.size;
	$('#discount-count').text(count + ' aubaines trouvées');
	$('.header-aubaines').text('Aubaines (' + count + ')');
}

		scrollStep();
	}

	// Inject the "Aubaines" nav button
	let navList = document.querySelector('.v2-header-menu .v2-header-wrapper ul');
	if (navList) {
		let newListItem = document.createElement('li');
		let newDiv = document.createElement('div');
		newDiv.style.display = 'inline-block';
		newDiv.style.position = 'relative';

		let newButton = document.createElement('a');
		newButton.href = 'javascript:void(0);';
		newButton.className = 'v2-button-green button-small header-aubaines';
		newButton.style.backgroundColor = 'red';
		newButton.style.color = 'white';
		newButton.style.fontWeight = 'bold';
		newButton.textContent = 'Aubaines';
		newButton.onclick = lufa_filter;

		newDiv.appendChild(newButton);
		newListItem.appendChild(newDiv);
		navList.appendChild(newListItem); // Append to the end of the <ul>

		console.log('"Aubaines" button injected.');
	} else {
		console.error('Nav list not found.');
	}
})();
