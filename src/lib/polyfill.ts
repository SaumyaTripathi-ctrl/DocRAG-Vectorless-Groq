// Pure JS polyfills for browser canvas APIs used by pdfjs-dist
// Executed at the very beginning of retrieval to avoid Node.js / Vercel Serverless environment crashes

if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrix {
    a: number; b: number; c: number; d: number; e: number; f: number;
    constructor(init?: number[] | DOMMatrix | string) {
      if (Array.isArray(init)) {
        this.a = init[0] ?? 1;
        this.b = init[1] ?? 0;
        this.c = init[2] ?? 0;
        this.d = init[3] ?? 1;
        this.e = init[4] ?? 0;
        this.f = init[5] ?? 0;
      } else if (init && typeof init === 'object') {
        this.a = (init as any).a ?? 1;
        this.b = (init as any).b ?? 0;
        this.c = (init as any).c ?? 0;
        this.d = (init as any).d ?? 1;
        this.e = (init as any).e ?? 0;
        this.f = (init as any).f ?? 0;
      } else {
        this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      }
    }
    translate(tx: number, ty: number = 0): DOMMatrix {
      return new DOMMatrix([
        this.a,
        this.b,
        this.c,
        this.d,
        this.a * tx + this.c * ty + this.e,
        this.b * tx + this.d * ty + this.f
      ]);
    }
    scale(sx: number, sy: number = sx): DOMMatrix {
      return new DOMMatrix([
        this.a * sx,
        this.b * sx,
        this.c * sy,
        this.d * sy,
        this.e,
        this.f
      ]);
    }
    multiplySelf(other: DOMMatrix): DOMMatrix {
      const a = this.a * other.a + this.c * other.b;
      const b = this.b * other.a + this.d * other.b;
      const c = this.a * other.c + this.c * other.d;
      const d = this.b * other.c + this.d * other.d;
      const e = this.a * other.e + this.c * other.f + this.e;
      const f = this.b * other.e + this.d * other.f + this.f;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    preMultiplySelf(other: DOMMatrix): DOMMatrix {
      const a = other.a * this.a + other.c * this.b;
      const b = other.b * this.a + other.d * this.b;
      const c = other.a * this.c + other.c * this.d;
      const d = other.b * this.c + other.d * this.d;
      const e = other.a * this.e + other.c * this.f + other.e;
      const f = other.b * this.e + other.d * this.f + other.f;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
    invertSelf(): DOMMatrix {
      const det = this.a * this.d - this.b * this.c;
      if (det === 0) return this;
      const a = this.d / det;
      const b = -this.b / det;
      const c = -this.c / det;
      const d = this.a / det;
      const e = (this.c * this.f - this.d * this.e) / det;
      const f = (this.b * this.e - this.a * this.f) / det;
      this.a = a; this.b = b; this.c = c; this.d = d; this.e = e; this.f = f;
      return this;
    }
  }
  (globalThis as any).DOMMatrix = DOMMatrix;
}

if (typeof globalThis.ImageData === 'undefined') {
  class ImageData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
    }
  }
  (globalThis as any).ImageData = ImageData;
}

if (typeof globalThis.Path2D === 'undefined') {
  class Path2D {
    addPath() {}
    closePath() {}
    moveTo() {}
    lineTo() {}
    bezierCurveTo() {}
    quadraticCurveTo() {}
    arc() {}
    arcTo() {}
    ellipse() {}
    rect() {}
  }
  (globalThis as any).Path2D = Path2D;
}
