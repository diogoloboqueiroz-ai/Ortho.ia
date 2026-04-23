"use client";

/**
 * ORTHO.AI — ImageUploader
 * Componente de upload de imagens médicas para o Ortho Console
 * Converte para base64 e envia junto com a mensagem ao OrthoBrain Engine™
 */

import { useState, useRef, useCallback } from "react";
import type { ImageInput } from "@/lib/ortho-brain";

type Props = {
  onImagesReady: (images: ImageInput[]) => void;
  onClear: () => void;
  maxImages?: number;
};

type PreviewImage = ImageInput & {
  id: string;
  fileName: string;
  sizeKB: number;
  previewUrl: string;
};

export function ImageUploader({ onImagesReady, onClear, maxImages = 4 }: Props) {
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = ["image/jpeg", "image/png", "image/webp"] as const;
  const MAX_SIZE_MB = 10;

  function getModalityLabel(fileName: string): string {
    const f = fileName.toLowerCase();
    if (f.includes("rx") || f.includes("xray") || f.includes("raio"))  return "RX";
    if (f.includes("rm") || f.includes("mri") || f.includes("reson"))  return "RM";
    if (f.includes("tc") || f.includes("ct") || f.includes("tomo"))    return "TC";
    if (f.includes("us") || f.includes("eco") || f.includes("ultra"))  return "US";
    return "IMG";
  }

  const processFile = useCallback(
    async (file: File): Promise<PreviewImage | null> => {
      if (!ACCEPTED.includes(file.type as any)) {
        alert(`Formato não suportado: ${file.name}. Use JPG, PNG ou WebP.`);
        return null;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Imagem muito grande: ${file.name}. Máximo ${MAX_SIZE_MB}MB.`);
        return null;
      }

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          // Remover prefixo data:image/...;base64,
          const base64Data = dataUrl.split(",")[1];
          const previewUrl = dataUrl;

          resolve({
            id:          crypto.randomUUID(),
            fileName:    file.name,
            sizeKB:      Math.round(file.size / 1024),
            mimeType:    file.type as ImageInput["mimeType"],
            base64Data,
            previewUrl,
            description: getModalityLabel(file.name),
          });
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - previews.length;
      const toProcess = fileArray.slice(0, remaining);

      const results = await Promise.all(toProcess.map(processFile));
      const valid = results.filter(Boolean) as PreviewImage[];

      if (valid.length === 0) return;

      const updated = [...previews, ...valid];
      setPreviews(updated);
      onImagesReady(updated.map(({ id, fileName, sizeKB, previewUrl, ...img }) => img));
    },
    [previews, maxImages, processFile, onImagesReady]
  );

  function removeImage(id: string) {
    const updated = previews.filter((p) => p.id !== id);
    setPreviews(updated);
    if (updated.length === 0) {
      onClear();
    } else {
      onImagesReady(updated.map(({ id, fileName, sizeKB, previewUrl, ...img }) => img));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  if (previews.length === 0) {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `1.5px dashed ${dragging ? "#C9A84C" : "#D6D1C8"}`,
          borderRadius: 10,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          background: dragging ? "rgba(201,168,76,0.04)" : "transparent",
          transition: "all 0.15s",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 20 }}>🩻</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1F2A" }}>
            Adicionar imagem médica
          </div>
          <div style={{ fontSize: 11, color: "#5A6B78" }}>
            RX · RM · TC · US — JPG/PNG/WebP até 10MB
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {previews.map((p) => (
          <div
            key={p.id}
            style={{
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: 8,
              overflow: "hidden",
              border: "1.5px solid #C9A84C",
              flexShrink: 0,
            }}
          >
            {/* Preview */}
            <img
              src={p.previewUrl}
              alt={p.fileName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Overlay label */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "rgba(11,31,42,0.75)", padding: "2px 4px",
              fontSize: 9, fontFamily: "monospace", color: "#C9A84C",
              textAlign: "center", letterSpacing: "0.08em",
            }}>
              {p.description}
            </div>
            {/* Remove */}
            <button
              onClick={() => removeImage(p.id)}
              style={{
                position: "absolute", top: 2, right: 2,
                width: 16, height: 16, borderRadius: "50%",
                background: "rgba(11,31,42,0.8)", border: "none",
                color: "white", fontSize: 10, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>
        ))}

        {/* Adicionar mais */}
        {previews.length < maxImages && (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              width: 72, height: 72, borderRadius: 8,
              border: "1.5px dashed #D6D1C8",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 20, color: "#5A6B78",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
            onMouseOut={(e)  => (e.currentTarget.style.borderColor = "#D6D1C8")}
          >
            +
          </div>
        )}
      </div>

      <div style={{ fontSize: 10, color: "#8A9BA8", marginTop: 4, fontFamily: "monospace" }}>
        {previews.length}/{maxImages} imagem(ns) · OrthoBrain Vision via Gemini
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
    </div>
  );
}
