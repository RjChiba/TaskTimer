'use client';
import React from 'react';
import Image from "next/image";
import Timer from "src/app/components/Timer";
import Controller from "src/app/components/Controller";

export default function Home() {
  const [timeNow, setTimeNow] = React.useState(new Date().toLocaleTimeString());
  const [record, setRecord] = React.useState([]);
  const [controllers, setControllers] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleRecord = (newRecord) => {
    setRecord([...record, newRecord]);
  }

  // save record to localStorage
  const saveRecord = () => {
    localStorage.setItem("record", JSON.stringify(record));
    localStorage.setItem("controllers", JSON.stringify(controllers));
  }

  // load record from localStorage
  const loadRecord = () => {
    const localRecord = localStorage.getItem("record");
    if (localRecord) {
      setRecord(JSON.parse(localRecord));
    }
    const localControllers = localStorage.getItem("controllers");
    if (localControllers) {
      setControllers(JSON.parse(localControllers));
    }
  }

  const clearRecord = () => {
    localStorage.removeItem("record");
    localStorage.removeItem("controllers");
    setRecord([]);
    setControllers([]);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <Timer/>
        <Controller 
          timeDate={timeNow} 
          controllers={controllers}
          setControllers={setControllers}
          record={record} 
          setRecord={handleRecord}/>
        <div className="flex flex-row gap-2 items-center justify-center">
          <button onClick={saveRecord}>Store Record</button>
          <button onClick={loadRecord}>Restore Record</button>
          <button onClick={clearRecord}>Clear Record</button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://rjchiba.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to the creater's website
        </a>
      </footer>
    </div>
  );
}
