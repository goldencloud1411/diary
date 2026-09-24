import { Directory, File, Paths } from 'expo-file-system';

export async function persistCover(sourceUri, extension = '.jpg') {
  if (!sourceUri) return null;
  const covers = new Directory(Paths.document, 'haru-covers');
  covers.create({ idempotent: true, intermediates: true });
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  const destination = new File(covers, `cover-${Date.now()}${ext}`);
  const source = new File(sourceUri);
  await source.copy(destination, { overwrite: true });
  return destination.uri;
}
