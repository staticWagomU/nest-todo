import { describe, expect, it } from 'vitest';
import { extractDateFromUuidv7 } from './uuid.utils';
import { uuidv7 } from 'uuidv7';

describe('UUID Utils', () => {
  it('should extract date from UUIDv7', () => {
    const beforeTime = Date.now();
    const uuid = uuidv7();
    const afterTime = Date.now();

    const extractedDate = extractDateFromUuidv7(uuid);

    expect(extractedDate).toBeInstanceOf(Date);
    expect(extractedDate.getTime()).toBeGreaterThanOrEqual(beforeTime);
    expect(extractedDate.getTime()).toBeLessThanOrEqual(afterTime);
  });

  it('should extract correct timestamp from known UUIDv7', () => {
    // 既知のタイムスタンプを持つUUIDv7をテスト
    // タイムスタンプ: 0x0190123dc9c0 = 1719216243000 (2024-06-24T07:44:03.000Z)
    const knownUuid = '0190123d-c9c0-7000-8000-000000000000';
    const expectedTimestamp = 0x0190123dc9c0;

    const extractedDate = extractDateFromUuidv7(knownUuid);

    expect(extractedDate.getTime()).toBe(expectedTimestamp);
  });

  it('should handle UUIDs with different formats', () => {
    // ハイフンありのUUID
    const uuidWithHyphens = '0190123d-c9c0-7000-8000-000000000000';
    // ハイフンなしのUUID (32桁の16進数文字列)
    const uuidWithoutHyphens = '0190123dc9c070008000000000000000';

    const dateWithHyphens = extractDateFromUuidv7(uuidWithHyphens);
    const dateWithoutHyphens = extractDateFromUuidv7(uuidWithoutHyphens);

    expect(dateWithHyphens.getTime()).toBe(dateWithoutHyphens.getTime());
  });

  it('should extract timestamp from first 48 bits only', () => {
    // 最初の48ビット（12文字）のみを使用することを確認
    const uuid1 = '0190123d-c9c0-7000-8000-000000000000';
    const uuid2 = '0190123d-c9c0-7fff-ffff-ffffffffffff';

    const date1 = extractDateFromUuidv7(uuid1);
    const date2 = extractDateFromUuidv7(uuid2);

    // 最初の48ビットが同じなので、同じ日時が抽出される
    expect(date1.getTime()).toBe(date2.getTime());
  });
});
