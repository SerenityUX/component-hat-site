import Head from "next/head";
import { Inter } from "next/font/google";
import React, { useState, useRef, useEffect } from 'react';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import CanvasDraw from "react-canvas-draw";


const inter = Inter({ subsets: ["latin"] });

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'public', 'components.yml');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = yaml.parse(fileContents);

  return {
    props: {
      components: data,
    },
  };
}

export default function Home({ components }) {
  const canvasRef = useRef(null);

  const [hatIdea, setHatIdea] = useState("");

  const [completeIdea, setCompleteIdea] = useState(false);


  const [firstRoll, setFirstRoll] = useState(null);
  const [secondRoll, setSecondRoll] = useState(null);
  const [thirdRoll, setThirdRoll] = useState(null);

  useEffect(() => {
    console.log(components);
  }, [components]);

  const handleRoll = (type, setRoll) => {
    const audio = new Audio('/item-sound.mp3');
    console.log(audio)
    audio.play();


    const filteredComponents = components.filter(component => component.type === type);
    let count = 0;
    const maxCount = 25; // Adjust the number of shuffles before stopping

  // Preload the sound for smoother playback


    const intervalId = setInterval(() => {
      if (count < maxCount) {
        const tempIndex = Math.floor(Math.random() * filteredComponents.length);
        setRoll(tempIndex + 1); // Update state with a temporary random index
        count++;
      } else {
        clearInterval(intervalId); // Stop shuffling
        const finalIndex = Math.floor(Math.random() * filteredComponents.length);
        setRoll(finalIndex + 1); // Settle on the final random index
      }
    }, 150); // 0.5 seconds interval
  };

  return (
    <>
      <Head>
        <title>Components In A Hat</title>
        <meta name="description" content="Get your components out of a hat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <p>Components In A Hat</p>
          
          <p>Input: <button onClick={() => handleRoll('input', setFirstRoll)}>{firstRoll == null ? ("Roll") : (firstRoll)}</button></p>
          {firstRoll && (
            <a target="_blank" href={components.filter(component => component.type === "input")[firstRoll - 1]?.help_page}>
            <div style={{padding: 8, border: "1px solid #000", width: 128}}>
              <img style={{width: 128}} src={components.filter(component => component.type === "input")[firstRoll - 1]?.image_url}/>
              <p><b>{components.filter(component => component.type === "input")[firstRoll - 1]?.name}</b></p>
              <p>{components.filter(component => component.type === "input")[firstRoll - 1]?.flavor}</p>
            </div>
            </a>
          )}
          
          <p>Output:<button onClick={() => handleRoll('output', setSecondRoll)}>{secondRoll == null ? ("Roll") : (secondRoll)}</button></p>
          {secondRoll && (
            <a target="_blank" href={components.filter(component => component.type === "output")[secondRoll - 1]?.help_page}>
            <div style={{padding: 8, border: "1px solid #000", width: 128}}>
              <img style={{width: 128}} src={components.filter(component => component.type === "output")[secondRoll - 1]?.image_url}/>
              <p><b>{components.filter(component => component.type === "output")[secondRoll - 1]?.name}</b></p>
              <p>{components.filter(component => component.type === "output")[secondRoll - 1]?.flavor}</p>
            </div>
            </a>
          )}
          
          <p>Power: <button onClick={() => handleRoll('power', setThirdRoll)}>{thirdRoll == null ? ("Roll") : (thirdRoll)}</button></p>
          {thirdRoll && (
            <a target="_blank" href={components.filter(component => component.type === "power")[thirdRoll - 1]?.help_page}>
            <div style={{padding: 8, border: "1px solid #000", width: 128}}>
              <img style={{width: 128}} src={components.filter(component => component.type === "power")[thirdRoll - 1]?.image_url}/>
              <p><b>{components.filter(component => component.type === "power")[thirdRoll - 1]?.name}</b></p>
              <p>{components.filter(component => component.type === "power")[thirdRoll - 1]?.flavor}</p>
            </div>
            </a>
          )}
        </div>
        {firstRoll != null && secondRoll != null && thirdRoll != null && (
        <div>
        <p>What are you going to make with a <b>{components.filter(component => component.type === "input")[firstRoll - 1]?.name}</b>, a <b>{components.filter(component => component.type === "output")[secondRoll - 1]?.name}</b>, and a{' '}<b>{components.filter(component => component.type === "power")[thirdRoll - 1]?.name}</b></p>
        <textarea/>
        <br/><button onClick={() => setCompleteIdea(true)}>Complete Idea</button>
        </div>)}
          {completeIdea && <div>
          <p>Draw art for your PCB.</p>
          <p><i>Here's an example: </i></p>
          <img style={{width: 96}} src="https://cloud-h6y736d7c-hack-club-bot.vercel.app/0drawing__3_.png"/>
        <div style={{ marginTop: "20px" }}>
  <CanvasDraw ref={canvasRef} brushColor="black" brushRadius={5} lazyRadius={0} canvasWidth={400} canvasHeight={400} />
  <button onClick={() => {
  // Get the drawing canvas
  const canvas = canvasRef.current.canvasContainer.children[1];
  // Create an image URL from the canvas
  const imageURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

  // Create a link and set the URL as the href
  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'drawing.png'; // Set the filename for the download

  // Trigger the download
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
}}>Download Drawing</button>

<p>After the drawing, boom you're ready! Pop open Easy-EDA and add in your components.</p>
</div></div>
}
      </main>
    </>
  );
}
