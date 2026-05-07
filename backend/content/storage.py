from __future__ import annotations

from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

from .image_optimization import OptimizeOptions, optimize_image_bytes, should_optimize


class OptimizingMediaStorage(FileSystemStorage):
    """
    File storage that resizes/compresses images before saving to MEDIA_ROOT.
    Applies to any upload that goes through Django storage (admin, API, CKEditor).
    """

    def _save(self, name, content):
        try:
            # Read into memory; typical uploads are images and not huge after optimization.
            raw = content.read()
            optimized, _fmt = optimize_image_bytes(
                filename=name,
                data=raw,
                options=OptimizeOptions(),
            )
            if should_optimize(original_size=len(raw), optimized_size=len(optimized)):
                content = ContentFile(optimized)
        except Exception:
            # If anything goes wrong, fall back to original upload.
            try:
                content.seek(0)
            except Exception:
                pass
        return super()._save(name, content)

