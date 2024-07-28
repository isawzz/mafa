const axios = require('axios');

async function getQuotes(pageTitle) {
	const URL = "https://en.wikiquote.org/w/api.php";
	const PARAMS = {
		action: "parse",
		format: "json",
		page: pageTitle,
		prop: "text",
		section: 1 // Usually, the quotes are in the first section after the intro
	};

	try {
		const response = await axios.get(URL, { params: PARAMS });
		const html = response.data.parse.text["*"];

		// Extract quotes from the HTML (simple regex approach)
		const quotes = [];
		const quoteRegex = /<li>(.*?)<\/li>/g;
		let match;
		while ((match = quoteRegex.exec(html)) !== null && quotes.length < 5) {
			quotes.push(match[1].replace(/<.*?>/g, "")); // Remove HTML tags
		}

		return quotes;
	} catch (error) {
		console.error('Error fetching quotes:', error);
		return null;
	}
}

async function fetchAndPrintQuotes() {
	const pageTitle = "Ludwig van Beethoven";
	const quotes = await getQuotes(pageTitle);

	if (quotes) {
		quotes.forEach((quote, index) => {
			console.log(`Quote ${index + 1}: ${quote}`);
		});
	}
}

fetchAndPrintQuotes().catch(console.error);
