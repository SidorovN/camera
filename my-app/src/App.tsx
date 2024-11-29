import React, { useRef, useState } from 'react';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 }, // Запрос HD-разрешения
          height: { ideal: 1080 },
          facingMode: 'environment', // Использование задней камеры
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        // Настраиваем размеры canvas
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        // Рисуем изображение с камеры на canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Сохраняем изображение в формате JPEG с максимальным качеством
        const imageData = canvas.toDataURL('image/jpeg', 1.0);
        setCapturedImage(imageData);

        // Останавливаем камеру
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  return (
      <div>
        {!isCameraActive && !capturedImage && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <button
                  onClick={openCamera}
                  style={{
                    padding: '10px 20px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                  }}
              >
                Открыть камеру
              </button>
            </div>
        )}

        <div
            style={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              display: isCameraActive ? 'block' : 'none',
            }}
        >
          {/* Видео с камеры */}
          <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
          ></video>

          {/* Маска поверх видео */}
          <div
              style={{
                position: 'absolute',
                top: '25%',
                left: '25%',
                width: '50%',
                height: '50%',
                border: '4px solid rgba(255, 0, 0, 0.8)', // Красная рамка
                borderRadius: '15px',
                pointerEvents: 'none', // Маска не блокирует взаимодействие
              }}
          ></div>

          {/* Кнопка для снимка */}
          <button
              onClick={takePhoto}
              style={{
                position: 'absolute',
                bottom: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '10px 20px',
                fontSize: '18px',
                cursor: 'pointer',
                background: '#FF5722',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
              }}
          >
            Снять
          </button>
        </div>

        {capturedImage && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <h1>Снимок</h1>
              <img
                  src={capturedImage}
                  alt="Снимок"
                  style={{ width: '100%', maxWidth: '500px', borderRadius: '10px' }}
              />
              <button
                  onClick={() => setCapturedImage(null)}
                  style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    background: '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                  }}
              >
                Сделать ещё
              </button>
            </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>
  );
};

export default App;