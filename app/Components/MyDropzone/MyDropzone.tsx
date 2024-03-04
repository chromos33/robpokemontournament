'use client';
import React, {useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import Image from 'next/image';

export function MyDropzone(props:{onUpload:any;previewImage:any}) {
    const [tmpImage,setTmpImage] = useState<any>(null);
  const onDrop = useCallback((acceptedFiles:any) => {
    acceptedFiles.forEach((file:any) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
            const blob = reader.result;
            setTmpImage(blob);
            let tmp = {
                name: file.name,
                type: file.type,
                size: file.size,
                blob: blob,
                file: file
            };
            props.onUpload(tmp);
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
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
      {
        tmpImage && <Image src={tmpImage} alt="Pokemon Image" width={200} height={200} />
      }

    </div>
  )
}