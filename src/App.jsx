import { useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import * as tf from '@tensorflow/tfjs'
import * as cocoModel from '@tensorflow-models/coco-ssd'

function App() {
  const [model, setModel] = useState()
  const [objectName, setObjectName] = useState("")
  const [objectScore, setObjectScore] = useState("")
  const [isPredicting, setIsPredicting] = useState(false)

  async function loadModel(){
    try {
      const dataset = await cocoModel.load()
      setModel(dataset)
      console.log('dataset ready...');
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel()
    })
  }, [])

  useEffect(() => {
    // Fungsi untuk memulai prediksi
    const startPredicting = async () => {
      setIsPredicting(true)
      while (isPredicting) {
        await predict()
        await new Promise(resolve => setTimeout(resolve, 1000)) // Tunggu 1 detik sebelum prediksi berikutnya
      }
      setIsPredicting(false)
    }

    if (isPredicting) {
      startPredicting()
    }
  }, [isPredicting])

  async function predict(){
    const detection = await model.detect(document.getElementById("videoSourced"))
    if(detection.length > 0){
      const result = detection[0] // Ambil hasil deteksi pertama saja
      setObjectScore(result.score)
      setObjectName(result.class)
    } else {
      setObjectScore("No Data Set Object")
      setObjectName("No Data Set Object")
    }
  }

  const videoOptions = {
    width : 720,
    height : 480,
    facingMode: "environment"
  }

  const handleScanNowClick = () => {
    setIsPredicting(true) // Mulai prediksi saat tombol "SCAN SEKARANG" diklik
  }

  return (
    <div className="h-screen w-screen m-0 p-0 bg-slate-600 justify-center item-center flex max-h-screen">
      <div className='m-[30px] item-center'>
        <h1 className='text-center text-[2rem] text-white'>WEB CAM</h1>
        
        <h3 className='text-white text-center mt-5'>Name Object : {objectName}</h3>
        <h3 className='text-white mb-5 text-center'>Score Perediction : {objectScore}</h3>
        <Webcam
          id='videoSourced'
          audio={false}
          videoConstraints={videoOptions}
        />
        <button onClick={handleScanNowClick} className="bg-[#255BFE] m-[10px] p-[10px] rounded text-white hover:bg-[#251BFE]">SCAN OBJECT</button>
      </div>
    </div>
  )
}

export default App
