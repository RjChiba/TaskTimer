'use client';

import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faFloppyDisk, faBoxArchive, faXmark } from '@fortawesome/free-solid-svg-icons'
import RandStr from 'src/app/utils/RandStr';
import PlayerPause from 'src/app/atom/Icons/PlayerPause';
import PlayerPlay from 'src/app/atom/Icons/PlayerPlay';

function ControllerItem({
  controller,
  timeDelta,
  isProcessing,
  onStart,
  onStop,
  onUpdateName,
  onRemove
}) {
  const [isPopup, setIsPopup] = React.useState(false);
  const [itemName, setItemName] = React.useState(controller.name);

  const currentTimeString = new Date(controller.time + timeDelta).toISOString().substr(11, 8);

  return (
    <>
      {/* Controller Display */}
      <div className={isProcessing ? 'controller-running' : 'controller-primary'}>
        <div className="max-w-[25rem] flex flex-row gap-1">
          <button onClick={() => setIsPopup(true)}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <h2 className="max-w-[10rem] text-left">{itemName}</h2>
          <p className="max-w-[10rem] text-center">{currentTimeString}</p>
        </div>
        <div className="flex flex-row gap-2 justify-center items-center">
          {!isProcessing && (
            <button onClick={onStart}>
              <PlayerPlay />
            </button>
          )}
          {isProcessing && (
            <button onClick={onStop}>
              <PlayerPause />
            </button>
          )}
        </div>
      </div>

      {/* Popup Window */}
      {isPopup && (
        <div className="z-10 absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="w-[calc(100%-2rem)] md:w-[50%] p-8 bg-white rounded-lg flex flex-col gap-4 md:flex-row justify-between">
            <div className="flex flex-row gap-2">
              <label htmlFor={`name-${controller.id}`}>Title</label>
              <input
                id={`name-${controller.id}`}
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2 justify-center items-center">
              <button title="save changes" onClick={() => { onUpdateName(itemName); setIsPopup(false); }}>
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
              <button title="remove" onClick={() => { onRemove(); setIsPopup(false); }}>
                <FontAwesomeIcon icon={faBoxArchive} />
              </button>
              <button title="cancel" onClick={() => setIsPopup(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Controller({ timeDate, controllers, setControllers, record, handleRecord }) {
  const [processingId, setProcessingId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [totalTime, setTotalTime] = React.useState(0);

  const addController = () => {
    setControllers([...controllers, { id: RandStr(12), name: `Item_${controllers.length}`, time: 0 }]);
  };

  const updateController = (id, updates) => {
    setControllers(controllers.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeController = (id) => {
    setControllers(controllers.filter((c) => c.id !== id));
  };

  const startProcessing = (id) => {
    const currentTime = timeDate.valueOf();
    const lastRecord = record[record.length - 1];
    const processStart = lastRecord ? lastRecord.time : 0;

    if (processingId) {
      updateController(processingId, { time: controllers.find((c) => c.id === processingId).time + (currentTime - processStart) });
    }

    setProcessingId(id);
    setStartTime(currentTime);
    handleRecord({ id, type: 'start', time: currentTime });
  };

  const stopProcessing = (id) => {
    const currentTime = timeDate.valueOf();
    const lastRecord = record[record.length - 1];
    const processStart = lastRecord ? lastRecord.time : 0;

    updateController(id, { time: controllers.find((c) => c.id === id).time + (currentTime - processStart) });
    setProcessingId(null);
    handleRecord({ type: 'stop', time: currentTime });
  };

  React.useEffect(() => {
    setTotalTime(controllers.reduce((sum, c) => sum + c.time, 0));
  }, [controllers]);

  const spentTime = processingId ? totalTime + (timeDate.valueOf() - startTime) : totalTime;

	return (
		<div className="xl:w-[50%] w-full">
			<div className="w-full">
				<h1 className="text-center text-2xl">
					Total Spent Time: {new Date(spentTime).toISOString().substr(11, 8)}
				</h1>
			</div>
			<div className="w-full">
				<button 
					className="rounded"
					onClick={addController}
				>
					&#43;
				</button>
			</div>
			<div className="w-full">
				{controllers.map((controller) => (
		          <ControllerItem
		            key={controller.id}
		            controller={controller}
		            timeDelta={processingId === controller.id ? timeDate.valueOf() - startTime : 0}
		            isProcessing={processingId === controller.id}
		            onStart={() => startProcessing(controller.id)}
		            onStop={() => stopProcessing(controller.id)}
		            onUpdateName={(name) => updateController(controller.id, { name })}
		            onRemove={() => removeController(controller.id)}
		          />
		        ))}
			</div>
		</div>
	);
}