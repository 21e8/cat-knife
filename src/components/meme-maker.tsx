"use client";
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const MemeMaker: React.FC = () => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        const activeObject = canvasRef.current?.getActiveObject(); 
        if (activeObject) {
          canvasRef.current?.remove(activeObject);
        }
      }
    });
  }, []);

  useEffect(() => {
    canvasRef.current = new fabric.Canvas("meme-canvas", {
      width: 600,
      height: 600,
      backgroundColor: "#fff",
    });

    return () => {
      canvasRef.current?.dispose();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        fabric.Image.fromURL(data, (img) => {
          img.set({
            left: canvasRef.current!.width! / 2,
            top: canvasRef.current!.height! / 2,
            originX: "center",
            originY: "center",
          });
          canvasRef.current?.add(img);
          canvasRef.current?.bringToFront(img);
        });
      };
      reader.readAsDataURL(e.target.files[0]);
      // @ts-ignore
      e.target.value = null;
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.toDataURL({ format: "jpeg" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "meme.jpg";
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input type="file" onChange={handleFileChange} />
      <div className="mt-4">
        <canvas id="meme-canvas" />
      </div>
      <button
        onClick={handleDownload}
        className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
      >
        Download Meme
      </button>
    </div>
  );
};

export default MemeMaker;
