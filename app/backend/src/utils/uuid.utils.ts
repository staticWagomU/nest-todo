/**
 * UUIDv7から作成日時を抽出する
 * @param uuid UUIDv7文字列
 * @returns 作成日時のDateオブジェクト
 */
export function extractDateFromUuidv7(uuid: string): Date {
  // UUIDv7の最初の48ビット（12文字）がUnixタイムスタンプ（ミリ秒）
  const timestampHex = uuid.replace(/-/g, '').substring(0, 12);
  const timestamp = Number.parseInt(timestampHex, 16);
  return new Date(timestamp);
}
