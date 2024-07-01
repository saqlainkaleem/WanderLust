(() => {
	"use strict";

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.from(forms).forEach((form) => {
		form.addEventListener(
			"submit",
			(event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				}

				form.classList.add("was-validated");
			},
			false
		);
	});
})();

// Example JavaScript to control loader visibility
document.addEventListener("DOMContentLoaded", function () {
	// Simulate async operation (e.g., API request)
	setTimeout(function () {
		// When content is loaded or operation complete, hide loader
		document.getElementById("loader").style.display = "none";
		document.getElementById("content").style.display = "block"; // Show main content
	}, 500); // Simulated 1 second delay
});
