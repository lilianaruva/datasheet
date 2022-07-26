import React, { useMemo } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone({ onDrop, accept, open }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({
    accept,
    onDrop,
  });

  const baseStyle = {
    textAlign: "center",
    padding: "20px",
    width: "100%",
    margin: "auto",
  };

  const focusedStyle = {
    backgroundColor: "rgba(240, 242, 245, 0.3)",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? focusedStyle : {}),
    }),
    [isDragActive]
  );

  return (
    <div>
      <div {...getRootProps({ style })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">Release to drop the files here</p>
          ) : (
            <p className="dropzone-content">
              Drag’ n’ drop some files here, or click to select files
            </p>
          )}
          <button type="button" onClick={open} className="buttonCustom">
            Click to select files
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dropzone;
