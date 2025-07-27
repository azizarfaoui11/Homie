import React, { useState } from "react";
import { api } from "../services/api";

const VideoUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const video = await api.uploadVideo(formData);
      console.log("Vidéo envoyée :", video);
    } catch (err) {
      console.error("Erreur upload :", err);
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input type="text" placeholder="Titre" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleUpload}>Uploader</button>
    </div>
  );
};

export default VideoUploader;
