import { useEffect, useState, useRef } from 'react'
import Head from 'next/head';
import { Configuration, OpenAIApi } from "openai";
import { saveAs } from "file-saver";


// git rm --cached .next/ -r


export default function Home() {
  const API_KEY = process.env.NEXT_PUBLIC_OPEN_API_KEY;
  const [transparentActive, setTransparentActive] = useState(false);
  const [whiteActive, setWhiteActive] = useState(false);
  const [greyActive, setGreyActive] = useState(false);
  const [blackActive, setBlackActive] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [showSpinner, setShowSpinner] = useState(false)
  const [inputErrorMessage, setInputErrorMessage] = useState(false);
  const [backgroundErrorMessage, setBackgroundErrorMessage] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [outputResults, setOutputResults] = useState(false);
  const [downloadAsset, setDownloadAsset] = useState(null);

  const imageContainerRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const generateIconRef = useRef(null);

  const url = "https://api.openai.com/v1/images/generations";
  const text = inputValue;
  const imageContainer = imageContainerRef.current;
  
  useEffect(() => {
    console.log("API_KEY", API_KEY)
  }, []);
  

  const handleRadioSelect = (e:any) => {
    if (e.target.checked) {
      if (e.target.value === 'transparent') {
        setTransparentActive(true);
        setWhiteActive(false);
        setGreyActive(false);
        setBlackActive(false);
        setBackgroundColor('border-dashed border-2 border-gray-500');
      } else if (e.target.value === 'white') {
        setTransparentActive(false);
        setWhiteActive(true);
        setGreyActive(false);
        setBlackActive(false);
        setBackgroundColor('border-white border-2 bg-white');
      } else if (e.target.value === 'grey') {
        setTransparentActive(false);
        setWhiteActive(false);
        setGreyActive(true);
        setBlackActive(false);
        setBackgroundColor('border-gray-200 border-2 bg-gray-200');
      } else if (e.target.value === 'black') {
        setTransparentActive(false);
        setWhiteActive(false);
        setGreyActive(false);
        setBlackActive(true);
        setBackgroundColor('border-black  border-2 bg-black');
      }
    }
  }

  async function handleGenerateIcon(e:any){
    e.preventDefault();
    console.log('image container', imageContainer)

    if (inputValue === '' 
      || blackActive === false
      && transparentActive === false
      && greyActive === false
      && whiteActive === false) {
      setInputErrorMessage(true)
      setOutputResults(false)
      return;
    } else {
      setShowSpinner(true);
      const data = {
        prompt: 'I want an icon of a ' + text,
        n: 1,
        size: "256x256",
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('data', data);
          const arraySize = data.data.length;
          for (let i = 0; i < arraySize; i++) {
            setImgSrc(data.data[i].url)
          }
          setShowSpinner(false);
          setOutputResults(true);
          setInputErrorMessage(false);
          setBackgroundErrorMessage(false)
        });
    }

    console.log(inputValue)
  }

  const handleDownload = () => {
    console.log('download')
  }

  return (
    <>
      <Head>
        <title>OpenAI Icon Generator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <form action="/send-data-here" method="post" className="flex flex-col items-center">
          <div className="container flex justify-center items-center">
            <span className="text-5xl">Welcome to</span>
            <span className="ml-3 text-5xl">AIcon</span>
          </div>
          <div className="container flex justify-center items-center mt-6">
            <span className="text-2xl">
              Create your very own custom AI generated icons
            </span>
          </div>

          <div className="container flex justify-center items-center mt-6">
            <span className="text-3xl mr-4">I would like an icon of a </span>
            <input 
            className="text-2xl"
            type="text" 
            id="prompt" 
            placeholder="smiley face" 
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            />
          </div>

           <div className="container flex justify-center items-center mt-6">
            <span className="text-2xl">Select background color: </span>

            <div className="grid grid-col-4 grid-flow-col gap-4 ml-6">
              <div className='flex flex-col items-center'>
                <label htmlFor="transparent" className={`flex w-16 h-16 rounded-lg border-dashed border-2 border-gray-500 cursor-pointer ${transparentActive ? "active" : ""}`} onClick={handleRadioSelect}>
                  <input className="hidden pointer" type="radio" id="transparent" name="transparent" value="transparent" />
                </label>
                 Transparent
              </div>

              <div className='flex flex-col items-center'>
                <label htmlFor="white" className={`flex w-16 h-16 border rounded-lg cursor-pointer ${whiteActive ? "active" : ""}`} onClick={handleRadioSelect}>
                  <input className="hidden pointer" type="radio" id="white" name="white" value="white" />
                </label>
                 White
              </div>

              <div className='flex flex-col items-center'>
                <label htmlFor="grey" className={`flex w-16 h-16 border rounded-lg bg-gray-200 cursor-pointer ${greyActive ? "active" : ""}`} onClick={handleRadioSelect}>
                  <input className="hidden pointer" type="radio" id="grey" name="grey" value="grey" />
                </label>
                 Grey
              </div>

              <div className='flex flex-col items-center'>
                <label htmlFor="black" className={`flex w-16 h-16 border rounded-lg bg-black cursor-pointer ${blackActive ? "active" : ""}`} onClick={handleRadioSelect}>
                  <input className="hidden pointer" type="radio" id="black" name="black" value="black" />
                </label>
                 Black
              </div>

             
            </div>
          </div>
          <button 
          className='mt-12 rounded-lg bg-blue-500 text-white p-4 h-auto' 
          type="submit" 
          onClick={handleGenerateIcon}
          ref={generateIconRef}
          >
            Generate
          </button>

          {inputErrorMessage && 
            <div className="text-red-500 mt-6">Please enter some text</div>
          }

          {backgroundErrorMessage && 
            <div className="text-red-500 mt-6">Please select a background color</div>
          }

          {showSpinner && 
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
          }

          {outputResults && 
            <>
              <div className={`mt-12 results-container container rounded-lg flex justify-center items-center w-16 h-16 ${backgroundColor}`}>
                <div ref={imageContainer} className="fill-current w-10/12">
                  <img src={imgSrc} alt="icon" />
                </div>
              </div>
              <button 
              className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" 
              onClick={handleDownload}
              >
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                <span>Download</span>
              </button>
            </>
          }
        </form>
      </main>
    </>
  )
}
