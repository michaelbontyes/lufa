function lufa_filter() {
	let maxScrollInterval = 200; // Maximum amount to scroll on each step
	let scrollDelay = 100; // Delay in milliseconds between each scroll
	let stopRequested = false;
	let foundDiscounts = 0; // Initialize the count of found discounts

	function firstItem() {
		// Get the first <li> item of the navigation bar with class name "user-sidebar"
		var firstLiItem = document.querySelector('.user-sidebar li:first-child');

		// Get the link (<a> tag) inside the first <li> item
		var link = firstLiItem.querySelector('a');
		console.log(link);
		// Click the link
		link.click();
	}

	firstItem();

	// Create and show the overlay with the loading GIF, text, and stop button
	let overlay = $(`
    <div id="lufa-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <img src="//raw.githubusercontent.com/michaelbontyes/lufa/main/loader.gif" alt="Loading" style="width: 200px; height: 200px;">
        <div style="color: white; font-size: 24px; margin: 20px;"><span id="discount-count"></span><span class="animated-ellipsis"></span></div>
        <button id="stop-button" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Stop</button>
    </div>
    `);
	$('body').append(overlay);

	// Add click event listener to the stop button
	$('#stop-button').click(function () {
		stopRequested = true;
		$('#lufa-overlay').remove();
	});

	// Add CSS animation for the animated ellipsis
	$('<style>')
		.prop('type', 'text/css')
		.html(
			`
            @keyframes blink {
                0%, 100% { opacity: 0; }
                50% { opacity: 1; }
            }
            .animated-ellipsis::after {
                content: '...';
                animation: blink 1s infinite;
            }
        `
		)
		.appendTo('head');

	function scrollStep() {
		if (stopRequested) return;

		let scrollTop = $(window).scrollTop();
		let scrollHeight = $(document).height();
		let newScrollTop = scrollTop + maxScrollInterval;

		$(window).scrollTop(newScrollTop);

		// Filter products without discount at each scroll step
		filterProductsWithoutDiscount();

		if (
			scrollTop < scrollHeight - $(window).height() &&
			newScrollTop < scrollHeight
		) {
			setTimeout(scrollStep, scrollDelay);
		} else {
			console.log('Reached the bottom or no more content to load.');
			// Remove the overlay once filtering is complete
			$('#lufa-overlay').remove();
			firstItem();
		}
	}

	function filterProductsWithoutDiscount() {
		$('.single-product-wrapper, .products-wrapper-generated')
			.filter(function () {
				return $(this).find('.discount-tag').length === 0;
			})
			.remove();

		// Update the count of found discounts
		foundDiscounts = $('.discount-tag').length;
		$('#discount-count').text(foundDiscounts + ' aubaines trouvées');

		// Update the "Aubaines" button text with the count
		$('.header-aubaines').text('Aubaines (' + foundDiscounts + ')');
	}

	scrollStep();
}

window.onload = function () {
	console.log(
		'Page is fully loaded. Adding "Aubaines" button to navigation...'
	);

	// Find the navigation list
	var navList = document.querySelector('.v2-header-menu .v2-header-wrapper ul');

	if (navList) {
		// Create the new list item
		var newListItem = document.createElement('li');

		// Create the div container for the button
		var newDiv = document.createElement('div');
		newDiv.style.display = 'inline-block';
		newDiv.style.position = 'relative';

		// Create the button
		var newButton = document.createElement('a');
		newButton.href = 'javascript:void(0);'; // Prevent default link behavior
		newButton.className = 'v2-button-green button-small header-aubaines';
		newButton.id = 'header-one-time-basket';
		newButton.style.backgroundColor = 'red'; // Set the background color to red
		newButton.innerText = 'Aubaines';
		newButton.onclick = function () {
			lufa_filter();
		};

		// Append the button to the div container
		newDiv.appendChild(newButton);

		// Append the div container to the list item
		newListItem.appendChild(newDiv);

		// Insert the new list item before the last list item in the navigation
		navList.insertBefore(newListItem, navList.lastChild);

		console.log(
			'"Aubaines" button added to navigation. Click to run lufa_filter().'
		);
	} else {
		console.error(
			'Navigation list not found. Unable to add "Aubaines" button.'
		);
	}
};
