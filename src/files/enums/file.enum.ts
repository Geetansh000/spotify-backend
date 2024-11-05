export enum FILE_STATUS {
  DELETED = 'DELETED',
  ACTIVE = 'ACTIVE',
  DUPLICATE = 'DUPLICATE',
  REJECTED = 'REJECTED',
  UPDATED = 'UPDATED',
}
export enum FileType {
  JPEG = 'JPEG',
  JPG = 'JPG',
  PNG = 'PNG',
  MP3 = 'MP3',
  MP4 = 'MP4',
}
export const FileMimeType = {
  [FileType.JPG]: 'image/jpg',
  [FileType.JPEG]: 'image/jpeg',
  [FileType.PNG]: 'image/png',
};

export enum ContentType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}
