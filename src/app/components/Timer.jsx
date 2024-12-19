'use client';
import React from 'react';

export default function Timer() {

	const [timeNow, setTimeNow] = React.useState(null);
	const [timeZone, setTimeZone] = React.useState(null)

	React.useEffect(() => {
		const interval = setInterval(() => {
			const date = new Date();
			setTimeNow(date.toLocaleTimeString());
			setTimeZone(`GMT${date.toTimeString().split("GMT")[1]}`)
		}, 300);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="w-full flex flex-col gap-2 justify-center items-center">
			<h1 className="text-xl">{timeZone}</h1>
			<h1 className="text-3xl">{timeNow}</h1>
		</div>
	);
}