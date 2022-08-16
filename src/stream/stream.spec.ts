import { describe, expect, test } from "vitest";
import { ArrayStream } from "./array";
import { ClockStream } from "./clock";

describe('stream', () => {
  test('map', () => {
    const stream = new ArrayStream<number>([1, 2, 3]);
    let target: number[] = [];
    stream.map(item => item * 2).forEach(item => target.push(item));
    expect(target).to.deep.eq([2, 4, 6]);
  });

  test('flatMap', () => {
    const stream = new ArrayStream<number[]>([[1, 2, 3], [4, 5, 6]]);
    let target: number[] = [];
    stream.flatMap(item => item).forEach(item => target.push(item))
    expect(target).to.deep.eq([1, 2, 3, 4, 5, 6]);
  })

  test('collect', async () => {
    const cs = new ClockStream(100);
    const res = await cs.collect(10);
    expect(res.length).to.eq(10);
  });

  test('collect timeout', async () => {
    await expect(async () => {
      const cs = new ClockStream(100);
      await cs.collect(100, 10);
    }).rejects
  })
});