/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import CustomButton from "./CustomButton";

const ImageEditor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<any>({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(1);
  const [flipY, setFlipY] = useState(1);
  const [editedImages, setEditedImages] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty("--columns", `${Math.max(1, Math.floor(window.innerWidth / 200))}`);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setCroppedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = () => setRotation((prev) => (prev + 90) % 360);
  const flipHorizontal = () => setFlipX((prev) => -prev);
  const flipVertical = () => setFlipY((prev) => -prev);
  const replaceImage = () => setImage(null);

  const cropImage = () => {
    if (!imgRef.current || !completedCrop || !canvasRef.current) return;
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const { x, y, width, height } = completedCrop;
  
    canvas.width = Math.ceil(width * scaleX);
    canvas.height = Math.ceil(height * scaleY);
  
    ctx.drawImage(
      image,
      x * scaleX,
      y * scaleY,
      width * scaleX,
      height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  
    const croppedImage = canvas.toDataURL();
    setCroppedImage(croppedImage);
    setImage(croppedImage);
  };
  

  const handleDone = () => {
    if (croppedImage) {
      setEditedImages([...editedImages, croppedImage]);
      setImage(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <aside className="w-80 bg-gray-800 shadow-lg p-6 flex flex-col items-center rounded-lg m-4">
        <h2 className="text-2xl font-bold mb-4 text-teal-400">Image Editor</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4 bg-gray-700 p-2 rounded-lg w-full" />
        {image && (
          <>
            <div className="relative overflow-hidden border border-gray-600 p-2 w-full rounded-lg">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Uploaded"
                  className="max-w-full rounded-lg"
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipX}) scaleY(${flipY})`,
                  }}
                />
              </ReactCrop>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex flex-col gap-3 mt-4 w-full">
            <CustomButton onClick={rotateImage} color="bg-teal-500 hover:bg-teal-600 active:bg-teal-700">Rotate</CustomButton>
            <CustomButton onClick={flipHorizontal} color="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700">Flip X</CustomButton>
            <CustomButton onClick={flipVertical} color="bg-purple-500 hover:bg-purple-600 active:bg-purple-700">Flip Y</CustomButton>
            <CustomButton onClick={cropImage} color="bg-green-500 hover:bg-green-600 active:bg-green-700">Crop</CustomButton>
            <CustomButton onClick={replaceImage} color="bg-red-500 hover:bg-red-600 active:bg-red-700">Replace</CustomButton>
            <CustomButton onClick={handleDone} color="bg-blue-500 hover:bg-blue-600 active:bg-blue-700">Done</CustomButton>
            </div>
          </>
        )}
      </aside>
      <main className="flex-1 p-6">
        {editedImages.length === 0 && <p className="text-gray-400 text-lg">Upload an image to start editing</p>}
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))` }}>
          {editedImages.map((img, index) => (
            <img key={index} src={img} alt={`Edited ${index}`} className="w-full h-auto rounded-lg shadow-lg border border-gray-600" />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ImageEditor;
