"""
File storage abstraction.

Dev:  saves files to ./uploads/<sub_dir>/<filename> and returns a local URL.
Prod: set STORAGE_BACKEND=s3 and configure AWS_* env vars; uses boto3.

The caller only calls save_upload() and gets back a public URL string.
"""
import os
import uuid
import shutil
from pathlib import Path
from typing import Optional

STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads"))
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")

# S3 config (only used when STORAGE_BACKEND=s3)
AWS_BUCKET = os.getenv("AWS_S3_BUCKET", "")
AWS_REGION = os.getenv("AWS_REGION", "ap-south-1")


def save_upload(file_bytes: bytes, original_filename: str, sub_dir: str = "general") -> str:
    """
    Persist file_bytes and return a publicly accessible URL.

    sub_dir examples: "documents", "vehicle_photos", "delivery_proofs"
    """
    ext = Path(original_filename).suffix.lower() or ".jpg"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    if STORAGE_BACKEND == "s3":
        return _save_to_s3(file_bytes, unique_name, sub_dir)
    return _save_local(file_bytes, unique_name, sub_dir)


def _save_local(file_bytes: bytes, filename: str, sub_dir: str) -> str:
    dest_dir = UPLOAD_DIR / sub_dir
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / filename
    dest.write_bytes(file_bytes)
    return f"{BASE_URL}/uploads/{sub_dir}/{filename}"


def _save_to_s3(file_bytes: bytes, filename: str, sub_dir: str) -> str:
    try:
        import boto3
        s3 = boto3.client("s3", region_name=AWS_REGION)
        key = f"{sub_dir}/{filename}"
        s3.put_object(Bucket=AWS_BUCKET, Key=key, Body=file_bytes, ACL="public-read")
        return f"https://{AWS_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{key}"
    except Exception as exc:
        raise RuntimeError(f"S3 upload failed: {exc}") from exc
