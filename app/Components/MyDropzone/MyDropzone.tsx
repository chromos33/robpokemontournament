'use client';
import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image';
import {resizeImage, blobToBase64} from '../../functions';
export function MyDropzone(props:{onUpload:any;previewImage:any}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [tmpImage,setTmpImage] = useState<any>(null);
  const onDrop = useCallback((acceptedFiles:any) => {
    acceptedFiles.forEach((file:any) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
            const blob = reader.result;
            resizeImage({maxSize:500,file:file},canvas.current).then((resizedBlob) => {
              blobToBase64(resizedBlob).then((base64) => {
                setTmpImage(base64);
              });
              let castblob = resizedBlob as Blob;
              let resizedFile = new File([castblob], file.name, {type: file.type})
              
              let tmp = {
                name: file.name,
                type: file.type,
                size: file.size,
                blob: resizedBlob,
                file: resizedFile
            };
            props.onUpload(tmp);
            });
        }
        reader.readAsDataURL(file)
    });

    // Do something with the files
  }, [])
  useEffect(() => {
    setTmpImage(props.previewImage);
  },[props.previewImage])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className='dropzone mb-3' {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      }
      {
        tmpImage && <Image src={tmpImage} alt="Pokemon Image" width={200} height={200} />
      }
      <canvas id="canvas" ref={canvas} style={{display:"none"}}></canvas>
    </div>
  )
}