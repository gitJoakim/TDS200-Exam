export const dateFormatter = () => {
	const date = new Date();
	const formattedDate = date.toLocaleDateString("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const [day, month, year] = formattedDate.split(" ");
	return `${month} ${day}, ${year}`;
};
