

export async function mockUpload(file: File) {
  return {
    url: URL.createObjectURL(file),
  }
}

export async function mockUploadFail() {
  throw new Error('Fail to upload')
}