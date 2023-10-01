export function getTimeFromNow(timestampAsSec: number) {
	// Create Date objects for the two dates
	const past = timestampAsSec * 1000;
	const now = Date.now();

	// Calculate the time difference in milliseconds
	var timeDiff = Math.abs(now - past);

	// Convert the time difference to days
	const mins = Math.floor(timeDiff / (1000 * 60));

	if (mins === 0) {
		return 'now';
	} else if (mins < 60) {
		return `${mins} mins ago`;
	} else {
		return `${Math.round(mins / 60)} hours ago`;
	}
}
