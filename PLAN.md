# Frontend Migration Plan: GCS Signed URLs

Scope: Update Angular frontend to use backend only for generating signed URLs; upload files directly to GCS. Keep image listing using signed read URLs.

## Milestones
- [ ] M1: Wire up API contracts in FileUploadService (signed URL generation + direct PUT to GCS)
- [ ] M2: Update single-file upload component (file-upload.component) to new 2-step flow
- [ ] M3: Update multi-file upload path in picture-gallery to new 2-step flow
- [ ] M4: Ensure listing uses signed URLs with current filters (no code change if already string[])
- [ ] M5: Add robust error handling (backend and GCS errors, URL expiration messaging)
- [x] M1: Wire up API contracts in FileUploadService (signed URL generation + direct PUT to GCS)
- [x] M2: Update single-file upload component (file-upload.component) to new 2-step flow
- [x] M3: Update multi-file upload path in picture-gallery to new 2-step flow

- [ ] M6: Add data-testid attributes for testability on all key UI elements
- [ ] M7: Manual verification and polish

## API Contracts (as provided)
Base: {API_BASE_URL}/upload
- POST /upload/generate-upload-url
- POST /upload/generate-multi-upload-urls
- GET  /upload/list-images?eventName={event}&user={user}

## Detailed Tasks

### T1: Service updates (src/app/services/file-upload/file-upload.service.ts)
- [ ] Replace multipart endpoints with:
  - [ ] uploadFile(file, event):
    1) POST to generate-upload-url with { fileName, contentType, event }
    2) PUT file binary directly to GCS via signedUrl with Content-Type header
    3) Return UploadResult { fileName, blobPath, success, error? }
  - [ ] uploadMultipleFiles(files, event):
    1) POST to generate-multi-upload-urls with files[] metadata
    2) PUT each file to respective signedUrl in parallel
    3) Return UploadResult[]
  - [ ] Keep listImages() as is; it now returns signed URLs
- [ ] Strong typing for SignedUrlResponse, MultiUploadUrlResponse, UploadResult, ListImagesResponse
- [ ] Catch and surface GCS errors (403/400/401) and backend errors

### T2: Single-file upload component (src/app/file-upload/...)
- [ ] Switch to new service.uploadFile() return type
- [ ] Adjust progress UI (no granular progress via fetch; show staged progress 0→50→100)
- [ ] Better messages on success/failure, reset input after success
- [ ] Add data-testid attributes to input, submit button, progress, and status message

### T3: Picture gallery multi-upload (src/app/picture-gallery/...)
- [ ] Replace HttpEventType logic with uploadMultipleFiles() returning UploadResult[]
- [ ] Show spinner/progress while uploading; summarize successes/failures
- [ ] Refresh list on success, keep errors visible on partial failures
- [ ] Keep listImages usage unchanged (signed read URLs)
- [ ] Add data-testid attributes for upload trigger, file input, progress, and error list

### T4: Auth and environment
- [ ] Reuse existing Http interceptor to attach Bearer token
- [ ] Respect environment.apiBaseUrl (no hardcoded URLs)

### T5: Testing & Validation
- [ ] Manual: Single file upload happy path
- [ ] Manual: Multi-file upload with mixed types/images/videos
- [ ] Manual: List signed image URLs display and playback/preview
- [ ] Manual: Error scenarios (simulate expired/invalid signed URL by waiting or tampering header)
- [ ] Confirm CORS works with signed URLs

## Rollback Plan
- Keep original methods commented in Git history; if needed, we can re-enable multipart code quickly.

## Notes
- No change to routing or auth required
- Signed upload URLs expire in ~15 minutes; read URLs expire in ~1 hour
- Progress events via fetch are not granular; staged progress will be used
