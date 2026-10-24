import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { AdminWorkspace } from "./useAdminWorkspace";

export function PhotoManager({ workspace: w }: { workspace: AdminWorkspace }) {
  const { fileInputRef } = w;
  const [dragging, setDragging] = useState(false);
  const images = w.productForm.imageUrls;
  const disabled = w.isLoading || w.isUploading || !w.dataReady;
  function move(index: number, target: number) {
    const next = [...images];
    const [photo] = next.splice(index, 1);
    next.splice(target, 0, photo);
    w.updateProductForm({ imageUrls: next });
  }
  return (
    <section className="editor-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">02 / Show its character</p>
          <h2>Photographs</h2>
        </div>
        <span className="text-sm">{images.length} / 20</span>
      </div>
      <p className="field-help">
        The first photo is your cover. Add different angles and close-ups of any
        details or wear.
      </p>
      <label
        className={`photo-dropzone ${dragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) void w.handleUpload(Array.from(e.dataTransfer.files));
        }}
      >
        <ImagePlus size={30} />
        <strong>
          {w.isUploading ? w.uploadProgress : "Choose photos or drop them here"}
        </strong>
        <span>JPEG, PNG, WebP, AVIF or GIF · Up to 20 photos</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          disabled={disabled}
          className="sr-only"
          onChange={(e) => w.handleUpload(e.target.files)}
        />
      </label>
      <p className="field-help">
        Large phone photos are resized for you. Export HEIC photos as JPEG
        first. Up to 20 MB per original; GIFs up to 4 MB.
      </p>
      <div role="status" className="sr-only">
        {w.uploadProgress}
      </div>
      <div className="photo-manager-grid">
        {images.map((url, index) => (
          <div key={`${url}-${index}`} className="photo-tile">
            <div className="photo-tile-image">
              <Image
                src={url}
                alt={`Product photo ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 180px, 40vw"
                className="object-contain"
              />
              <span className="photo-index">
                {index === 0
                  ? "Cover photo"
                  : String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="photo-tools">
              <button
                type="button"
                className="icon-button"
                disabled={disabled || index === 0}
                onClick={() => move(index, index - 1)}
                aria-label={`Move photo ${index + 1} earlier`}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                className="icon-button"
                disabled={disabled || index === images.length - 1}
                onClick={() => move(index, index + 1)}
                aria-label={`Move photo ${index + 1} later`}
              >
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="icon-button"
                disabled={disabled}
                onClick={() =>
                  w.updateProductForm({
                    imageUrls: images.filter((_, i) => i !== index),
                  })
                }
                aria-label={`Remove photo ${index + 1}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
            {index > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                disabled={disabled}
                onClick={() => move(index, 0)}
              >
                <Star size={13} /> Make cover
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
