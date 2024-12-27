'use client';

import React from 'react';
// import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFloppyDisk, faBoxArchive, faXmark } from '@fortawesome/free-solid-svg-icons'
import RandStr from 'src/app/utils/RandStr';

function ControllerItem({controller, timeDelta, isProcessing, startProcessing, stopProcessing, updateItemName, removeController}) {

	const [isPopup, setIsPopup] = React.useState(false);
	const [itemName, setName] = React.useState(controller.name);

	const openPopup = () => {
		setIsPopup(true);
	}

	const closePopup = () => {
		setIsPopup(false);
	}

	const handleSave = () => {
		updateItemName(itemName);
		closePopup();
	}

	const handleInputChange = (e) => {
		setName(e.target.value);
	}

	const handleRemove = () => {
		removeController();
		closePopup();
	}

	const currentTimeString = new Date(controller.time + timeDelta).toISOString().substr(11, 8);

	return (
		<>
			{/* controller */}
			<div className="z-0 flex flex-row gap-2 justify-between my-2 px-4 py-2 border rounded">
				<div className="max-w-[25rem] flex flex-row gap-1">
					<button onClick={openPopup}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
					<h2 className="max-w-[10rem] text-left">{itemName}</h2>
					<p className="max-w-[10rem] text-center">{currentTimeString}</p>
				</div>
				<div className="flex flex-row gap-2 justify-center items-center">
					<button onClick={startProcessing} disabled={isProcessing ? true : false}>Start</button>
					<button disabled={isProcessing ? false : true} onClick={stopProcessing}>Stop</button>
				</div>
			</div>

			{/* popup window */}
			<div className={isPopup ? "z-10" : "z-10 hidden"}>
				<div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
					<div className="w-[calc(100%-2rem)] md:w-[50%] p-8 bg-white rounded-lg flex flex-col gap-4 md:flex-row justify-between">
						<div className="flex flex-row gap-2">
							<label htmlFor="name">Title</label>
							<input
								id="name"
								type="text"
								value={itemName} // Bind to state
								onChange={handleInputChange} // Update state on change
							/>
						</div>
						<div className="flex flex-row gap-2 justify-center items-center">
							<button title="save changes" onClick={handleSave}>
								<FontAwesomeIcon icon={faFloppyDisk} />
							</button>
							<button title="remove" onClick={handleRemove}>
								<FontAwesomeIcon icon={faBoxArchive} />
							</button>
							<button title="cancell" onClick={closePopup}>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}


export default function Controller({timeDate, controllers, setControllers, record, setRecord}) {

	const [processingId, setProcessingId] = React.useState(null);
	const [startTime, setStartTime] = React.useState(null);

	const addController = () => {
		setControllers([...controllers, {id: RandStr(12), name: `Item_${controllers.length}`, time: 0}]);
	}

	const updateItemName = (id, name) => {
		setControllers(controllers.map((controller) => {
			if (controller.id === id) {
				controller.name = name;
			}
			return controller;
		}));
	}

	const removeController = (id) => {
		setControllers(controllers.filter((controller) => controller.id !== id));
	}

	const startProcessing = (id) => {
		const currentTime = parseInt(timeDate.valueOf());
		setStartTime(currentTime);

		// get current processing id and start time
		const currentProcessingId = processingId;
		const lastRecord = record[record.length - 1];
		const processStart = lastRecord ? lastRecord.time : 0;

		// override processing id and add record
		setProcessingId(id);
		setRecord({"id": id, "type": "start", "time": currentTime});

		// update controller
		if(currentProcessingId) {
			updateProcessingTime(currentProcessingId, currentTime - processStart);
		}
	}

	const stopProcessing = (id) => {
		const currentTime = parseInt(timeDate.valueOf());

		const lastRecord = record[record.length - 1];
		const processStart = lastRecord ? lastRecord.time : 0;

		// change processing id
		setProcessingId(null);

		// update record
		setRecord({"type": "stop", "time": currentTime});
		updateProcessingTime(id, currentTime - processStart);
	}

	const updateProcessingTime = (id, timeDelta) => {
		setControllers(controllers.map((controller) => {
			if (controller.id === id) {
				controller.time += timeDelta;
			}
			return controller;
		}));
	}

	return (
		<div className="xl:w-[50%] w-full">
			<div className="w-full">
				<button onClick={addController}>&#43;</button>
			</div>
			<div className="w-full">
				{controllers.map((controller) => {
					let isProcessing = (controller.id === processingId);

					return <ControllerItem 
						key={controller.id} 
						controller={controller}
						timeDelta={isProcessing ? timeDate.valueOf() - startTime : 0}
						isProcessing={isProcessing}
						startProcessing={() => startProcessing(controller.id)}
						stopProcessing={() => stopProcessing(controller.id)}
						updateItemName={(name) => updateItemName(controller.id, name)}
						removeController={() => removeController(controller.id)} />
				})}
			</div>
		</div>
	);
}