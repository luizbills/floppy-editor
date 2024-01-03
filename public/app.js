(() => {
  var j = class n {
      lineAt(e) {
        if (e < 0 || e > this.length)
          throw new RangeError(
            `Invalid position ${e} in document of length ${this.length}`
          );
        return this.lineInner(e, !1, 1, 0);
      }
      line(e) {
        if (e < 1 || e > this.lines)
          throw new RangeError(
            `Invalid line number ${e} in ${this.lines}-line document`
          );
        return this.lineInner(e, !0, 1, 0);
      }
      replace(e, t, i) {
        [e, t] = Kt(this, e, t);
        let s = [];
        return (
          this.decompose(0, e, s, 2),
          i.length && i.decompose(0, i.length, s, 3),
          this.decompose(t, this.length, s, 1),
          Gt.from(s, this.length - (t - e) + i.length)
        );
      }
      append(e) {
        return this.replace(this.length, this.length, e);
      }
      slice(e, t = this.length) {
        [e, t] = Kt(this, e, t);
        let i = [];
        return this.decompose(e, t, i, 0), Gt.from(i, t - e);
      }
      eq(e) {
        if (e == this) return !0;
        if (e.length != this.length || e.lines != this.lines) return !1;
        let t = this.scanIdentical(e, 1),
          i = this.length - this.scanIdentical(e, -1),
          s = new Rt(this),
          r = new Rt(e);
        for (let o = t, l = t; ; ) {
          if (
            (s.next(o),
            r.next(o),
            (o = 0),
            s.lineBreak != r.lineBreak ||
              s.done != r.done ||
              s.value != r.value)
          )
            return !1;
          if (((l += s.value.length), s.done || l >= i)) return !0;
        }
      }
      iter(e = 1) {
        return new Rt(this, e);
      }
      iterRange(e, t = this.length) {
        return new kn(this, e, t);
      }
      iterLines(e, t) {
        let i;
        if (e == null) i = this.iter();
        else {
          t == null && (t = this.lines + 1);
          let s = this.line(e).from;
          i = this.iterRange(
            s,
            Math.max(
              s,
              t == this.lines + 1
                ? this.length
                : t <= 1
                ? 0
                : this.line(t - 1).to
            )
          );
        }
        return new Qn(i);
      }
      toString() {
        return this.sliceString(0);
      }
      toJSON() {
        let e = [];
        return this.flatten(e), e;
      }
      constructor() {}
      static of(e) {
        if (e.length == 0)
          throw new RangeError("A document must have at least one line");
        return e.length == 1 && !e[0]
          ? n.empty
          : e.length <= 32
          ? new Pe(e)
          : Gt.from(Pe.split(e, []));
      }
    },
    Pe = class n extends j {
      constructor(e, t = xd(e)) {
        super(), (this.text = e), (this.length = t);
      }
      get lines() {
        return this.text.length;
      }
      get children() {
        return null;
      }
      lineInner(e, t, i, s) {
        for (let r = 0; ; r++) {
          let o = this.text[r],
            l = s + o.length;
          if ((t ? i : l) >= e) return new cr(s, l, i, o);
          (s = l + 1), i++;
        }
      }
      decompose(e, t, i, s) {
        let r =
          e <= 0 && t >= this.length
            ? this
            : new n(
                la(this.text, e, t),
                Math.min(t, this.length) - Math.max(0, e)
              );
        if (s & 1) {
          let o = i.pop(),
            l = xn(r.text, o.text.slice(), 0, r.length);
          if (l.length <= 32) i.push(new n(l, o.length + r.length));
          else {
            let a = l.length >> 1;
            i.push(new n(l.slice(0, a)), new n(l.slice(a)));
          }
        } else i.push(r);
      }
      replace(e, t, i) {
        if (!(i instanceof n)) return super.replace(e, t, i);
        [e, t] = Kt(this, e, t);
        let s = xn(this.text, xn(i.text, la(this.text, 0, e)), t),
          r = this.length + i.length - (t - e);
        return s.length <= 32 ? new n(s, r) : Gt.from(n.split(s, []), r);
      }
      sliceString(
        e,
        t = this.length,
        i = `
`
      ) {
        [e, t] = Kt(this, e, t);
        let s = "";
        for (let r = 0, o = 0; r <= t && o < this.text.length; o++) {
          let l = this.text[o],
            a = r + l.length;
          r > e && o && (s += i),
            e < a && t > r && (s += l.slice(Math.max(0, e - r), t - r)),
            (r = a + 1);
        }
        return s;
      }
      flatten(e) {
        for (let t of this.text) e.push(t);
      }
      scanIdentical() {
        return 0;
      }
      static split(e, t) {
        let i = [],
          s = -1;
        for (let r of e)
          i.push(r),
            (s += r.length + 1),
            i.length == 32 && (t.push(new n(i, s)), (i = []), (s = -1));
        return s > -1 && t.push(new n(i, s)), t;
      }
    },
    Gt = class n extends j {
      constructor(e, t) {
        super(), (this.children = e), (this.length = t), (this.lines = 0);
        for (let i of e) this.lines += i.lines;
      }
      lineInner(e, t, i, s) {
        for (let r = 0; ; r++) {
          let o = this.children[r],
            l = s + o.length,
            a = i + o.lines - 1;
          if ((t ? a : l) >= e) return o.lineInner(e, t, i, s);
          (s = l + 1), (i = a + 1);
        }
      }
      decompose(e, t, i, s) {
        for (let r = 0, o = 0; o <= t && r < this.children.length; r++) {
          let l = this.children[r],
            a = o + l.length;
          if (e <= a && t >= o) {
            let h = s & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
            o >= e && a <= t && !h
              ? i.push(l)
              : l.decompose(e - o, t - o, i, h);
          }
          o = a + 1;
        }
      }
      replace(e, t, i) {
        if ((([e, t] = Kt(this, e, t)), i.lines < this.lines))
          for (let s = 0, r = 0; s < this.children.length; s++) {
            let o = this.children[s],
              l = r + o.length;
            if (e >= r && t <= l) {
              let a = o.replace(e - r, t - r, i),
                h = this.lines - o.lines + a.lines;
              if (a.lines < h >> 4 && a.lines > h >> 6) {
                let c = this.children.slice();
                return (c[s] = a), new n(c, this.length - (t - e) + i.length);
              }
              return super.replace(r, l, a);
            }
            r = l + 1;
          }
        return super.replace(e, t, i);
      }
      sliceString(
        e,
        t = this.length,
        i = `
`
      ) {
        [e, t] = Kt(this, e, t);
        let s = "";
        for (let r = 0, o = 0; r < this.children.length && o <= t; r++) {
          let l = this.children[r],
            a = o + l.length;
          o > e && r && (s += i),
            e < a && t > o && (s += l.sliceString(e - o, t - o, i)),
            (o = a + 1);
        }
        return s;
      }
      flatten(e) {
        for (let t of this.children) t.flatten(e);
      }
      scanIdentical(e, t) {
        if (!(e instanceof n)) return 0;
        let i = 0,
          [s, r, o, l] =
            t > 0
              ? [0, 0, this.children.length, e.children.length]
              : [this.children.length - 1, e.children.length - 1, -1, -1];
        for (; ; s += t, r += t) {
          if (s == o || r == l) return i;
          let a = this.children[s],
            h = e.children[r];
          if (a != h) return i + a.scanIdentical(h, t);
          i += a.length + 1;
        }
      }
      static from(e, t = e.reduce((i, s) => i + s.length + 1, -1)) {
        let i = 0;
        for (let d of e) i += d.lines;
        if (i < 32) {
          let d = [];
          for (let p of e) p.flatten(d);
          return new Pe(d, t);
        }
        let s = Math.max(32, i >> 5),
          r = s << 1,
          o = s >> 1,
          l = [],
          a = 0,
          h = -1,
          c = [];
        function f(d) {
          let p;
          if (d.lines > r && d instanceof n) for (let g of d.children) f(g);
          else
            d.lines > o && (a > o || !a)
              ? (u(), l.push(d))
              : d instanceof Pe &&
                a &&
                (p = c[c.length - 1]) instanceof Pe &&
                d.lines + p.lines <= 32
              ? ((a += d.lines),
                (h += d.length + 1),
                (c[c.length - 1] = new Pe(
                  p.text.concat(d.text),
                  p.length + 1 + d.length
                )))
              : (a + d.lines > s && u(),
                (a += d.lines),
                (h += d.length + 1),
                c.push(d));
        }
        function u() {
          a != 0 &&
            (l.push(c.length == 1 ? c[0] : n.from(c, h)),
            (h = -1),
            (a = c.length = 0));
        }
        for (let d of e) f(d);
        return u(), l.length == 1 ? l[0] : new n(l, t);
      }
    };
  j.empty = new Pe([""], 0);
  function xd(n) {
    let e = -1;
    for (let t of n) e += t.length + 1;
    return e;
  }
  function xn(n, e, t = 0, i = 1e9) {
    for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
      let l = n[r],
        a = s + l.length;
      a >= t &&
        (a > i && (l = l.slice(0, i - s)),
        s < t && (l = l.slice(t - s)),
        o ? ((e[e.length - 1] += l), (o = !1)) : e.push(l)),
        (s = a + 1);
    }
    return e;
  }
  function la(n, e, t) {
    return xn(n, [""], e, t);
  }
  var Rt = class {
      constructor(e, t = 1) {
        (this.dir = t),
          (this.done = !1),
          (this.lineBreak = !1),
          (this.value = ""),
          (this.nodes = [e]),
          (this.offsets = [
            t > 0
              ? 1
              : (e instanceof Pe ? e.text.length : e.children.length) << 1,
          ]);
      }
      nextInner(e, t) {
        for (this.done = this.lineBreak = !1; ; ) {
          let i = this.nodes.length - 1,
            s = this.nodes[i],
            r = this.offsets[i],
            o = r >> 1,
            l = s instanceof Pe ? s.text.length : s.children.length;
          if (o == (t > 0 ? l : 0)) {
            if (i == 0) return (this.done = !0), (this.value = ""), this;
            t > 0 && this.offsets[i - 1]++,
              this.nodes.pop(),
              this.offsets.pop();
          } else if ((r & 1) == (t > 0 ? 0 : 1)) {
            if (((this.offsets[i] += t), e == 0))
              return (
                (this.lineBreak = !0),
                (this.value = `
`),
                this
              );
            e--;
          } else if (s instanceof Pe) {
            let a = s.text[o + (t < 0 ? -1 : 0)];
            if (((this.offsets[i] += t), a.length > Math.max(0, e)))
              return (
                (this.value =
                  e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e)),
                this
              );
            e -= a.length;
          } else {
            let a = s.children[o + (t < 0 ? -1 : 0)];
            e > a.length
              ? ((e -= a.length), (this.offsets[i] += t))
              : (t < 0 && this.offsets[i]--,
                this.nodes.push(a),
                this.offsets.push(
                  t > 0
                    ? 1
                    : (a instanceof Pe ? a.text.length : a.children.length) << 1
                ));
          }
        }
      }
      next(e = 0) {
        return (
          e < 0 && (this.nextInner(-e, -this.dir), (e = this.value.length)),
          this.nextInner(e, this.dir)
        );
      }
    },
    kn = class {
      constructor(e, t, i) {
        (this.value = ""),
          (this.done = !1),
          (this.cursor = new Rt(e, t > i ? -1 : 1)),
          (this.pos = t > i ? e.length : 0),
          (this.from = Math.min(t, i)),
          (this.to = Math.max(t, i));
      }
      nextInner(e, t) {
        if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
          return (this.value = ""), (this.done = !0), this;
        e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
        let i = t < 0 ? this.pos - this.from : this.to - this.pos;
        e > i && (e = i), (i -= e);
        let { value: s } = this.cursor.next(e);
        return (
          (this.pos += (s.length + e) * t),
          (this.value =
            s.length <= i ? s : t < 0 ? s.slice(s.length - i) : s.slice(0, i)),
          (this.done = !this.value),
          this
        );
      }
      next(e = 0) {
        return (
          e < 0
            ? (e = Math.max(e, this.from - this.pos))
            : e > 0 && (e = Math.min(e, this.to - this.pos)),
          this.nextInner(e, this.cursor.dir)
        );
      }
      get lineBreak() {
        return this.cursor.lineBreak && this.value != "";
      }
    },
    Qn = class {
      constructor(e) {
        (this.inner = e),
          (this.afterBreak = !0),
          (this.value = ""),
          (this.done = !1);
      }
      next(e = 0) {
        let { done: t, lineBreak: i, value: s } = this.inner.next(e);
        return (
          t && this.afterBreak
            ? ((this.value = ""), (this.afterBreak = !1))
            : t
            ? ((this.done = !0), (this.value = ""))
            : i
            ? this.afterBreak
              ? (this.value = "")
              : ((this.afterBreak = !0), this.next())
            : ((this.value = s), (this.afterBreak = !1)),
          this
        );
      }
      get lineBreak() {
        return !1;
      }
    };
  typeof Symbol < "u" &&
    ((j.prototype[Symbol.iterator] = function () {
      return this.iter();
    }),
    (Rt.prototype[Symbol.iterator] =
      kn.prototype[Symbol.iterator] =
      Qn.prototype[Symbol.iterator] =
        function () {
          return this;
        }));
  var cr = class {
    constructor(e, t, i, s) {
      (this.from = e), (this.to = t), (this.number = i), (this.text = s);
    }
    get length() {
      return this.to - this.from;
    }
  };
  function Kt(n, e, t) {
    return (
      (e = Math.max(0, Math.min(n.length, e))),
      [e, Math.max(e, Math.min(n.length, t))]
    );
  }
  var Ut =
    "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o"
      .split(",")
      .map((n) => (n ? parseInt(n, 36) : 1));
  for (let n = 1; n < Ut.length; n++) Ut[n] += Ut[n - 1];
  function kd(n) {
    for (let e = 1; e < Ut.length; e += 2) if (Ut[e] > n) return Ut[e - 1] <= n;
    return !1;
  }
  function aa(n) {
    return n >= 127462 && n <= 127487;
  }
  var ha = 8205;
  function se(n, e, t = !0, i = !0) {
    return (t ? Oa : Qd)(n, e, i);
  }
  function Oa(n, e, t) {
    if (e == n.length) return e;
    e && ma(n.charCodeAt(e)) && ga(n.charCodeAt(e - 1)) && e--;
    let i = ne(n, e);
    for (e += Oe(i); e < n.length; ) {
      let s = ne(n, e);
      if (i == ha || s == ha || (t && kd(s))) (e += Oe(s)), (i = s);
      else if (aa(s)) {
        let r = 0,
          o = e - 2;
        for (; o >= 0 && aa(ne(n, o)); ) r++, (o -= 2);
        if (r % 2 == 0) break;
        e += 2;
      } else break;
    }
    return e;
  }
  function Qd(n, e, t) {
    for (; e > 0; ) {
      let i = Oa(n, e - 2, t);
      if (i < e) return i;
      e--;
    }
    return 0;
  }
  function ma(n) {
    return n >= 56320 && n < 57344;
  }
  function ga(n) {
    return n >= 55296 && n < 56320;
  }
  function ne(n, e) {
    let t = n.charCodeAt(e);
    if (!ga(t) || e + 1 == n.length) return t;
    let i = n.charCodeAt(e + 1);
    return ma(i) ? ((t - 55296) << 10) + (i - 56320) + 65536 : t;
  }
  function Pi(n) {
    return n <= 65535
      ? String.fromCharCode(n)
      : ((n -= 65536),
        String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
  }
  function Oe(n) {
    return n < 65536 ? 1 : 2;
  }
  var fr = /\r\n?|\n/,
    le = (function (n) {
      return (
        (n[(n.Simple = 0)] = "Simple"),
        (n[(n.TrackDel = 1)] = "TrackDel"),
        (n[(n.TrackBefore = 2)] = "TrackBefore"),
        (n[(n.TrackAfter = 3)] = "TrackAfter"),
        n
      );
    })(le || (le = {})),
    ot = class n {
      constructor(e) {
        this.sections = e;
      }
      get length() {
        let e = 0;
        for (let t = 0; t < this.sections.length; t += 2) e += this.sections[t];
        return e;
      }
      get newLength() {
        let e = 0;
        for (let t = 0; t < this.sections.length; t += 2) {
          let i = this.sections[t + 1];
          e += i < 0 ? this.sections[t] : i;
        }
        return e;
      }
      get empty() {
        return (
          this.sections.length == 0 ||
          (this.sections.length == 2 && this.sections[1] < 0)
        );
      }
      iterGaps(e) {
        for (let t = 0, i = 0, s = 0; t < this.sections.length; ) {
          let r = this.sections[t++],
            o = this.sections[t++];
          o < 0 ? (e(i, s, r), (s += r)) : (s += o), (i += r);
        }
      }
      iterChangedRanges(e, t = !1) {
        ur(this, e, t);
      }
      get invertedDesc() {
        let e = [];
        for (let t = 0; t < this.sections.length; ) {
          let i = this.sections[t++],
            s = this.sections[t++];
          s < 0 ? e.push(i, s) : e.push(s, i);
        }
        return new n(e);
      }
      composeDesc(e) {
        return this.empty ? e : e.empty ? this : ya(this, e);
      }
      mapDesc(e, t = !1) {
        return e.empty ? this : dr(this, e, t);
      }
      mapPos(e, t = -1, i = le.Simple) {
        let s = 0,
          r = 0;
        for (let o = 0; o < this.sections.length; ) {
          let l = this.sections[o++],
            a = this.sections[o++],
            h = s + l;
          if (a < 0) {
            if (h > e) return r + (e - s);
            r += l;
          } else {
            if (
              i != le.Simple &&
              h >= e &&
              ((i == le.TrackDel && s < e && h > e) ||
                (i == le.TrackBefore && s < e) ||
                (i == le.TrackAfter && h > e))
            )
              return null;
            if (h > e || (h == e && t < 0 && !l))
              return e == s || t < 0 ? r : r + a;
            r += a;
          }
          s = h;
        }
        if (e > s)
          throw new RangeError(
            `Position ${e} is out of range for changeset of length ${s}`
          );
        return r;
      }
      touchesRange(e, t = e) {
        for (let i = 0, s = 0; i < this.sections.length && s <= t; ) {
          let r = this.sections[i++],
            o = this.sections[i++],
            l = s + r;
          if (o >= 0 && s <= t && l >= e) return s < e && l > t ? "cover" : !0;
          s = l;
        }
        return !1;
      }
      toString() {
        let e = "";
        for (let t = 0; t < this.sections.length; ) {
          let i = this.sections[t++],
            s = this.sections[t++];
          e += (e ? " " : "") + i + (s >= 0 ? ":" + s : "");
        }
        return e;
      }
      toJSON() {
        return this.sections;
      }
      static fromJSON(e) {
        if (
          !Array.isArray(e) ||
          e.length % 2 ||
          e.some((t) => typeof t != "number")
        )
          throw new RangeError("Invalid JSON representation of ChangeDesc");
        return new n(e);
      }
      static create(e) {
        return new n(e);
      }
    },
    me = class n extends ot {
      constructor(e, t) {
        super(e), (this.inserted = t);
      }
      apply(e) {
        if (this.length != e.length)
          throw new RangeError(
            "Applying change set to a document with the wrong length"
          );
        return (
          ur(this, (t, i, s, r, o) => (e = e.replace(s, s + (i - t), o)), !1), e
        );
      }
      mapDesc(e, t = !1) {
        return dr(this, e, t, !0);
      }
      invert(e) {
        let t = this.sections.slice(),
          i = [];
        for (let s = 0, r = 0; s < t.length; s += 2) {
          let o = t[s],
            l = t[s + 1];
          if (l >= 0) {
            (t[s] = l), (t[s + 1] = o);
            let a = s >> 1;
            for (; i.length < a; ) i.push(j.empty);
            i.push(o ? e.slice(r, r + o) : j.empty);
          }
          r += o;
        }
        return new n(t, i);
      }
      compose(e) {
        return this.empty ? e : e.empty ? this : ya(this, e, !0);
      }
      map(e, t = !1) {
        return e.empty ? this : dr(this, e, t, !0);
      }
      iterChanges(e, t = !1) {
        ur(this, e, t);
      }
      get desc() {
        return ot.create(this.sections);
      }
      filter(e) {
        let t = [],
          i = [],
          s = [],
          r = new Yt(this);
        e: for (let o = 0, l = 0; ; ) {
          let a = o == e.length ? 1e9 : e[o++];
          for (; l < a || (l == a && r.len == 0); ) {
            if (r.done) break e;
            let c = Math.min(r.len, a - l);
            ce(s, c, -1);
            let f = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
            ce(t, c, f), f > 0 && dt(i, t, r.text), r.forward(c), (l += c);
          }
          let h = e[o++];
          for (; l < h; ) {
            if (r.done) break e;
            let c = Math.min(r.len, h - l);
            ce(t, c, -1),
              ce(s, c, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0),
              r.forward(c),
              (l += c);
          }
        }
        return { changes: new n(t, i), filtered: ot.create(s) };
      }
      toJSON() {
        let e = [];
        for (let t = 0; t < this.sections.length; t += 2) {
          let i = this.sections[t],
            s = this.sections[t + 1];
          s < 0
            ? e.push(i)
            : s == 0
            ? e.push([i])
            : e.push([i].concat(this.inserted[t >> 1].toJSON()));
        }
        return e;
      }
      static of(e, t, i) {
        let s = [],
          r = [],
          o = 0,
          l = null;
        function a(c = !1) {
          if (!c && !s.length) return;
          o < t && ce(s, t - o, -1);
          let f = new n(s, r);
          (l = l ? l.compose(f.map(l)) : f), (s = []), (r = []), (o = 0);
        }
        function h(c) {
          if (Array.isArray(c)) for (let f of c) h(f);
          else if (c instanceof n) {
            if (c.length != t)
              throw new RangeError(
                `Mismatched change set length (got ${c.length}, expected ${t})`
              );
            a(), (l = l ? l.compose(c.map(l)) : c);
          } else {
            let { from: f, to: u = f, insert: d } = c;
            if (f > u || f < 0 || u > t)
              throw new RangeError(
                `Invalid change range ${f} to ${u} (in doc of length ${t})`
              );
            let p = d
                ? typeof d == "string"
                  ? j.of(d.split(i || fr))
                  : d
                : j.empty,
              g = p.length;
            if (f == u && g == 0) return;
            f < o && a(),
              f > o && ce(s, f - o, -1),
              ce(s, u - f, g),
              dt(r, s, p),
              (o = u);
          }
        }
        return h(e), a(!l), l;
      }
      static empty(e) {
        return new n(e ? [e, -1] : [], []);
      }
      static fromJSON(e) {
        if (!Array.isArray(e))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        let t = [],
          i = [];
        for (let s = 0; s < e.length; s++) {
          let r = e[s];
          if (typeof r == "number") t.push(r, -1);
          else {
            if (
              !Array.isArray(r) ||
              typeof r[0] != "number" ||
              r.some((o, l) => l && typeof o != "string")
            )
              throw new RangeError("Invalid JSON representation of ChangeSet");
            if (r.length == 1) t.push(r[0], 0);
            else {
              for (; i.length < s; ) i.push(j.empty);
              (i[s] = j.of(r.slice(1))), t.push(r[0], i[s].length);
            }
          }
        }
        return new n(t, i);
      }
      static createSet(e, t) {
        return new n(e, t);
      }
    };
  function ce(n, e, t, i = !1) {
    if (e == 0 && t <= 0) return;
    let s = n.length - 2;
    s >= 0 && t <= 0 && t == n[s + 1]
      ? (n[s] += e)
      : e == 0 && n[s] == 0
      ? (n[s + 1] += t)
      : i
      ? ((n[s] += e), (n[s + 1] += t))
      : n.push(e, t);
  }
  function dt(n, e, t) {
    if (t.length == 0) return;
    let i = (e.length - 2) >> 1;
    if (i < n.length) n[n.length - 1] = n[n.length - 1].append(t);
    else {
      for (; n.length < i; ) n.push(j.empty);
      n.push(t);
    }
  }
  function ur(n, e, t) {
    let i = n.inserted;
    for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
      let l = n.sections[o++],
        a = n.sections[o++];
      if (a < 0) (s += l), (r += l);
      else {
        let h = s,
          c = r,
          f = j.empty;
        for (
          ;
          (h += l),
            (c += a),
            a && i && (f = f.append(i[(o - 2) >> 1])),
            !(t || o == n.sections.length || n.sections[o + 1] < 0);

        )
          (l = n.sections[o++]), (a = n.sections[o++]);
        e(s, h, r, c, f), (s = h), (r = c);
      }
    }
  }
  function dr(n, e, t, i = !1) {
    let s = [],
      r = i ? [] : null,
      o = new Yt(n),
      l = new Yt(e);
    for (let a = -1; ; )
      if (o.ins == -1 && l.ins == -1) {
        let h = Math.min(o.len, l.len);
        ce(s, h, -1), o.forward(h), l.forward(h);
      } else if (
        l.ins >= 0 &&
        (o.ins < 0 ||
          a == o.i ||
          (o.off == 0 && (l.len < o.len || (l.len == o.len && !t))))
      ) {
        let h = l.len;
        for (ce(s, l.ins, -1); h; ) {
          let c = Math.min(o.len, h);
          o.ins >= 0 &&
            a < o.i &&
            o.len <= c &&
            (ce(s, 0, o.ins), r && dt(r, s, o.text), (a = o.i)),
            o.forward(c),
            (h -= c);
        }
        l.next();
      } else if (o.ins >= 0) {
        let h = 0,
          c = o.len;
        for (; c; )
          if (l.ins == -1) {
            let f = Math.min(c, l.len);
            (h += f), (c -= f), l.forward(f);
          } else if (l.ins == 0 && l.len < c) (c -= l.len), l.next();
          else break;
        ce(s, h, a < o.i ? o.ins : 0),
          r && a < o.i && dt(r, s, o.text),
          (a = o.i),
          o.forward(o.len - c);
      } else {
        if (o.done && l.done) return r ? me.createSet(s, r) : ot.create(s);
        throw new Error("Mismatched change set lengths");
      }
  }
  function ya(n, e, t = !1) {
    let i = [],
      s = t ? [] : null,
      r = new Yt(n),
      o = new Yt(e);
    for (let l = !1; ; ) {
      if (r.done && o.done) return s ? me.createSet(i, s) : ot.create(i);
      if (r.ins == 0) ce(i, r.len, 0, l), r.next();
      else if (o.len == 0 && !o.done)
        ce(i, 0, o.ins, l), s && dt(s, i, o.text), o.next();
      else {
        if (r.done || o.done) throw new Error("Mismatched change set lengths");
        {
          let a = Math.min(r.len2, o.len),
            h = i.length;
          if (r.ins == -1) {
            let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
            ce(i, a, c, l), s && c && dt(s, i, o.text);
          } else
            o.ins == -1
              ? (ce(i, r.off ? 0 : r.len, a, l), s && dt(s, i, r.textBit(a)))
              : (ce(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l),
                s && !o.off && dt(s, i, o.text));
          (l = (r.ins > a || (o.ins >= 0 && o.len > a)) && (l || i.length > h)),
            r.forward2(a),
            o.forward(a);
        }
      }
    }
  }
  var Yt = class {
      constructor(e) {
        (this.set = e), (this.i = 0), this.next();
      }
      next() {
        let { sections: e } = this.set;
        this.i < e.length
          ? ((this.len = e[this.i++]), (this.ins = e[this.i++]))
          : ((this.len = 0), (this.ins = -2)),
          (this.off = 0);
      }
      get done() {
        return this.ins == -2;
      }
      get len2() {
        return this.ins < 0 ? this.len : this.ins;
      }
      get text() {
        let { inserted: e } = this.set,
          t = (this.i - 2) >> 1;
        return t >= e.length ? j.empty : e[t];
      }
      textBit(e) {
        let { inserted: t } = this.set,
          i = (this.i - 2) >> 1;
        return i >= t.length && !e
          ? j.empty
          : t[i].slice(this.off, e == null ? void 0 : this.off + e);
      }
      forward(e) {
        e == this.len ? this.next() : ((this.len -= e), (this.off += e));
      }
      forward2(e) {
        this.ins == -1
          ? this.forward(e)
          : e == this.ins
          ? this.next()
          : ((this.ins -= e), (this.off += e));
      }
    },
    zt = class n {
      constructor(e, t, i) {
        (this.from = e), (this.to = t), (this.flags = i);
      }
      get anchor() {
        return this.flags & 32 ? this.to : this.from;
      }
      get head() {
        return this.flags & 32 ? this.from : this.to;
      }
      get empty() {
        return this.from == this.to;
      }
      get assoc() {
        return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
      }
      get bidiLevel() {
        let e = this.flags & 7;
        return e == 7 ? null : e;
      }
      get goalColumn() {
        let e = this.flags >> 6;
        return e == 16777215 ? void 0 : e;
      }
      map(e, t = -1) {
        let i, s;
        return (
          this.empty
            ? (i = s = e.mapPos(this.from, t))
            : ((i = e.mapPos(this.from, 1)), (s = e.mapPos(this.to, -1))),
          i == this.from && s == this.to ? this : new n(i, s, this.flags)
        );
      }
      extend(e, t = e) {
        if (e <= this.anchor && t >= this.anchor) return w.range(e, t);
        let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
        return w.range(this.anchor, i);
      }
      eq(e) {
        return this.anchor == e.anchor && this.head == e.head;
      }
      toJSON() {
        return { anchor: this.anchor, head: this.head };
      }
      static fromJSON(e) {
        if (!e || typeof e.anchor != "number" || typeof e.head != "number")
          throw new RangeError(
            "Invalid JSON representation for SelectionRange"
          );
        return w.range(e.anchor, e.head);
      }
      static create(e, t, i) {
        return new n(e, t, i);
      }
    },
    w = class n {
      constructor(e, t) {
        (this.ranges = e), (this.mainIndex = t);
      }
      map(e, t = -1) {
        return e.empty
          ? this
          : n.create(
              this.ranges.map((i) => i.map(e, t)),
              this.mainIndex
            );
      }
      eq(e) {
        if (
          this.ranges.length != e.ranges.length ||
          this.mainIndex != e.mainIndex
        )
          return !1;
        for (let t = 0; t < this.ranges.length; t++)
          if (!this.ranges[t].eq(e.ranges[t])) return !1;
        return !0;
      }
      get main() {
        return this.ranges[this.mainIndex];
      }
      asSingle() {
        return this.ranges.length == 1 ? this : new n([this.main], 0);
      }
      addRange(e, t = !0) {
        return n.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
      }
      replaceRange(e, t = this.mainIndex) {
        let i = this.ranges.slice();
        return (i[t] = e), n.create(i, this.mainIndex);
      }
      toJSON() {
        return {
          ranges: this.ranges.map((e) => e.toJSON()),
          main: this.mainIndex,
        };
      }
      static fromJSON(e) {
        if (
          !e ||
          !Array.isArray(e.ranges) ||
          typeof e.main != "number" ||
          e.main >= e.ranges.length
        )
          throw new RangeError(
            "Invalid JSON representation for EditorSelection"
          );
        return new n(
          e.ranges.map((t) => zt.fromJSON(t)),
          e.main
        );
      }
      static single(e, t = e) {
        return new n([n.range(e, t)], 0);
      }
      static create(e, t = 0) {
        if (e.length == 0)
          throw new RangeError("A selection needs at least one range");
        for (let i = 0, s = 0; s < e.length; s++) {
          let r = e[s];
          if (r.empty ? r.from <= i : r.from < i)
            return n.normalized(e.slice(), t);
          i = r.to;
        }
        return new n(e, t);
      }
      static cursor(e, t = 0, i, s) {
        return zt.create(
          e,
          e,
          (t == 0 ? 0 : t < 0 ? 8 : 16) |
            (i == null ? 7 : Math.min(6, i)) |
            ((s ?? 16777215) << 6)
        );
      }
      static range(e, t, i, s) {
        let r = ((i ?? 16777215) << 6) | (s == null ? 7 : Math.min(6, s));
        return t < e
          ? zt.create(t, e, 48 | r)
          : zt.create(e, t, (t > e ? 8 : 0) | r);
      }
      static normalized(e, t = 0) {
        let i = e[t];
        e.sort((s, r) => s.from - r.from), (t = e.indexOf(i));
        for (let s = 1; s < e.length; s++) {
          let r = e[s],
            o = e[s - 1];
          if (r.empty ? r.from <= o.to : r.from < o.to) {
            let l = o.from,
              a = Math.max(r.to, o.to);
            s <= t && t--,
              e.splice(
                --s,
                2,
                r.anchor > r.head ? n.range(a, l) : n.range(l, a)
              );
          }
        }
        return new n(e, t);
      }
    };
  function ba(n, e) {
    for (let t of n.ranges)
      if (t.to > e)
        throw new RangeError("Selection points outside of document");
  }
  var kr = 0,
    T = class n {
      constructor(e, t, i, s, r) {
        (this.combine = e),
          (this.compareInput = t),
          (this.compare = i),
          (this.isStatic = s),
          (this.id = kr++),
          (this.default = e([])),
          (this.extensions = typeof r == "function" ? r(this) : r);
      }
      get reader() {
        return this;
      }
      static define(e = {}) {
        return new n(
          e.combine || ((t) => t),
          e.compareInput || ((t, i) => t === i),
          e.compare || (e.combine ? (t, i) => t === i : Qr),
          !!e.static,
          e.enables
        );
      }
      of(e) {
        return new Ft([], this, 0, e);
      }
      compute(e, t) {
        if (this.isStatic) throw new Error("Can't compute a static facet");
        return new Ft(e, this, 1, t);
      }
      computeN(e, t) {
        if (this.isStatic) throw new Error("Can't compute a static facet");
        return new Ft(e, this, 2, t);
      }
      from(e, t) {
        return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
      }
    };
  function Qr(n, e) {
    return n == e || (n.length == e.length && n.every((t, i) => t === e[i]));
  }
  var Ft = class {
    constructor(e, t, i, s) {
      (this.dependencies = e),
        (this.facet = t),
        (this.type = i),
        (this.value = s),
        (this.id = kr++);
    }
    dynamicSlot(e) {
      var t;
      let i = this.value,
        s = this.facet.compareInput,
        r = this.id,
        o = e[r] >> 1,
        l = this.type == 2,
        a = !1,
        h = !1,
        c = [];
      for (let f of this.dependencies)
        f == "doc"
          ? (a = !0)
          : f == "selection"
          ? (h = !0)
          : ((t = e[f.id]) !== null && t !== void 0 ? t : 1) & 1 ||
            c.push(e[f.id]);
      return {
        create(f) {
          return (f.values[o] = i(f)), 1;
        },
        update(f, u) {
          if (
            (a && u.docChanged) ||
            (h && (u.docChanged || u.selection)) ||
            pr(f, c)
          ) {
            let d = i(f);
            if (l ? !ca(d, f.values[o], s) : !s(d, f.values[o]))
              return (f.values[o] = d), 1;
          }
          return 0;
        },
        reconfigure: (f, u) => {
          let d,
            p = u.config.address[r];
          if (p != null) {
            let g = Zn(u, p);
            if (
              this.dependencies.every((m) =>
                m instanceof T
                  ? u.facet(m) === f.facet(m)
                  : m instanceof F
                  ? u.field(m, !1) == f.field(m, !1)
                  : !0
              ) ||
              (l ? ca((d = i(f)), g, s) : s((d = i(f)), g))
            )
              return (f.values[o] = g), 0;
          } else d = i(f);
          return (f.values[o] = d), 1;
        },
      };
    }
  };
  function ca(n, e, t) {
    if (n.length != e.length) return !1;
    for (let i = 0; i < n.length; i++) if (!t(n[i], e[i])) return !1;
    return !0;
  }
  function pr(n, e) {
    let t = !1;
    for (let i of e) xi(n, i) & 1 && (t = !0);
    return t;
  }
  function vd(n, e, t) {
    let i = t.map((a) => n[a.id]),
      s = t.map((a) => a.type),
      r = i.filter((a) => !(a & 1)),
      o = n[e.id] >> 1;
    function l(a) {
      let h = [];
      for (let c = 0; c < i.length; c++) {
        let f = Zn(a, i[c]);
        if (s[c] == 2) for (let u of f) h.push(u);
        else h.push(f);
      }
      return e.combine(h);
    }
    return {
      create(a) {
        for (let h of i) xi(a, h);
        return (a.values[o] = l(a)), 1;
      },
      update(a, h) {
        if (!pr(a, r)) return 0;
        let c = l(a);
        return e.compare(c, a.values[o]) ? 0 : ((a.values[o] = c), 1);
      },
      reconfigure(a, h) {
        let c = pr(a, i),
          f = h.config.facets[e.id],
          u = h.facet(e);
        if (f && !c && Qr(t, f)) return (a.values[o] = u), 0;
        let d = l(a);
        return e.compare(d, u)
          ? ((a.values[o] = u), 0)
          : ((a.values[o] = d), 1);
      },
    };
  }
  var fa = T.define({ static: !0 }),
    F = class n {
      constructor(e, t, i, s, r) {
        (this.id = e),
          (this.createF = t),
          (this.updateF = i),
          (this.compareF = s),
          (this.spec = r),
          (this.provides = void 0);
      }
      static define(e) {
        let t = new n(
          kr++,
          e.create,
          e.update,
          e.compare || ((i, s) => i === s),
          e
        );
        return e.provide && (t.provides = e.provide(t)), t;
      }
      create(e) {
        let t = e.facet(fa).find((i) => i.field == this);
        return (t?.create || this.createF)(e);
      }
      slot(e) {
        let t = e[this.id] >> 1;
        return {
          create: (i) => ((i.values[t] = this.create(i)), 1),
          update: (i, s) => {
            let r = i.values[t],
              o = this.updateF(r, s);
            return this.compareF(r, o) ? 0 : ((i.values[t] = o), 1);
          },
          reconfigure: (i, s) =>
            s.config.address[this.id] != null
              ? ((i.values[t] = s.field(this)), 0)
              : ((i.values[t] = this.create(i)), 1),
        };
      }
      init(e) {
        return [this, fa.of({ field: this, create: e })];
      }
      get extension() {
        return this;
      }
    },
    Tt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
  function Si(n) {
    return (e) => new vn(e, n);
  }
  var Le = {
      highest: Si(Tt.highest),
      high: Si(Tt.high),
      default: Si(Tt.default),
      low: Si(Tt.low),
      lowest: Si(Tt.lowest),
    },
    vn = class {
      constructor(e, t) {
        (this.inner = e), (this.prec = t);
      }
    },
    Pn = class n {
      of(e) {
        return new ki(this, e);
      }
      reconfigure(e) {
        return n.reconfigure.of({ compartment: this, extension: e });
      }
      get(e) {
        return e.config.compartments.get(this);
      }
    },
    ki = class {
      constructor(e, t) {
        (this.compartment = e), (this.inner = t);
      }
    },
    $n = class n {
      constructor(e, t, i, s, r, o) {
        for (
          this.base = e,
            this.compartments = t,
            this.dynamicSlots = i,
            this.address = s,
            this.staticValues = r,
            this.facets = o,
            this.statusTemplate = [];
          this.statusTemplate.length < i.length;

        )
          this.statusTemplate.push(0);
      }
      staticFacet(e) {
        let t = this.address[e.id];
        return t == null ? e.default : this.staticValues[t >> 1];
      }
      static resolve(e, t, i) {
        let s = [],
          r = Object.create(null),
          o = new Map();
        for (let u of Pd(e, t, o))
          u instanceof F
            ? s.push(u)
            : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
        let l = Object.create(null),
          a = [],
          h = [];
        for (let u of s) (l[u.id] = h.length << 1), h.push((d) => u.slot(d));
        let c = i?.config.facets;
        for (let u in r) {
          let d = r[u],
            p = d[0].facet,
            g = (c && c[u]) || [];
          if (d.every((m) => m.type == 0))
            if (((l[p.id] = (a.length << 1) | 1), Qr(g, d))) a.push(i.facet(p));
            else {
              let m = p.combine(d.map((b) => b.value));
              a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
            }
          else {
            for (let m of d)
              m.type == 0
                ? ((l[m.id] = (a.length << 1) | 1), a.push(m.value))
                : ((l[m.id] = h.length << 1), h.push((b) => m.dynamicSlot(b)));
            (l[p.id] = h.length << 1), h.push((m) => vd(m, p, d));
          }
        }
        let f = h.map((u) => u(l));
        return new n(e, o, f, l, a, r);
      }
    };
  function Pd(n, e, t) {
    let i = [[], [], [], [], []],
      s = new Map();
    function r(o, l) {
      let a = s.get(o);
      if (a != null) {
        if (a <= l) return;
        let h = i[a].indexOf(o);
        h > -1 && i[a].splice(h, 1), o instanceof ki && t.delete(o.compartment);
      }
      if ((s.set(o, l), Array.isArray(o))) for (let h of o) r(h, l);
      else if (o instanceof ki) {
        if (t.has(o.compartment))
          throw new RangeError("Duplicate use of compartment in extensions");
        let h = e.get(o.compartment) || o.inner;
        t.set(o.compartment, h), r(h, l);
      } else if (o instanceof vn) r(o.inner, o.prec);
      else if (o instanceof F) i[l].push(o), o.provides && r(o.provides, l);
      else if (o instanceof Ft)
        i[l].push(o), o.facet.extensions && r(o.facet.extensions, Tt.default);
      else {
        let h = o.extension;
        if (!h)
          throw new Error(
            `Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`
          );
        r(h, l);
      }
    }
    return r(n, Tt.default), i.reduce((o, l) => o.concat(l));
  }
  function xi(n, e) {
    if (e & 1) return 2;
    let t = e >> 1,
      i = n.status[t];
    if (i == 4)
      throw new Error("Cyclic dependency between fields and/or facets");
    if (i & 2) return i;
    n.status[t] = 4;
    let s = n.computeSlot(n, n.config.dynamicSlots[t]);
    return (n.status[t] = 2 | s);
  }
  function Zn(n, e) {
    return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
  }
  var wa = T.define(),
    Or = T.define({ combine: (n) => n.some((e) => e), static: !0 }),
    Sa = T.define({ combine: (n) => (n.length ? n[0] : void 0), static: !0 }),
    xa = T.define(),
    ka = T.define(),
    Qa = T.define(),
    va = T.define({ combine: (n) => (n.length ? n[0] : !1) }),
    ke = class {
      constructor(e, t) {
        (this.type = e), (this.value = t);
      }
      static define() {
        return new mr();
      }
    },
    mr = class {
      of(e) {
        return new ke(this, e);
      }
    },
    gr = class {
      constructor(e) {
        this.map = e;
      }
      of(e) {
        return new Y(this, e);
      }
    },
    Y = class n {
      constructor(e, t) {
        (this.type = e), (this.value = t);
      }
      map(e) {
        let t = this.type.map(this.value, e);
        return t === void 0
          ? void 0
          : t == this.value
          ? this
          : new n(this.type, t);
      }
      is(e) {
        return this.type == e;
      }
      static define(e = {}) {
        return new gr(e.map || ((t) => t));
      }
      static mapEffects(e, t) {
        if (!e.length) return e;
        let i = [];
        for (let s of e) {
          let r = s.map(t);
          r && i.push(r);
        }
        return i;
      }
    };
  Y.reconfigure = Y.define();
  Y.appendConfig = Y.define();
  var ae = class n {
    constructor(e, t, i, s, r, o) {
      (this.startState = e),
        (this.changes = t),
        (this.selection = i),
        (this.effects = s),
        (this.annotations = r),
        (this.scrollIntoView = o),
        (this._doc = null),
        (this._state = null),
        i && ba(i, t.newLength),
        r.some((l) => l.type == n.time) ||
          (this.annotations = r.concat(n.time.of(Date.now())));
    }
    static create(e, t, i, s, r, o) {
      return new n(e, t, i, s, r, o);
    }
    get newDoc() {
      return this._doc || (this._doc = this.changes.apply(this.startState.doc));
    }
    get newSelection() {
      return this.selection || this.startState.selection.map(this.changes);
    }
    get state() {
      return this._state || this.startState.applyTransaction(this), this._state;
    }
    annotation(e) {
      for (let t of this.annotations) if (t.type == e) return t.value;
    }
    get docChanged() {
      return !this.changes.empty;
    }
    get reconfigured() {
      return this.startState.config != this.state.config;
    }
    isUserEvent(e) {
      let t = this.annotation(n.userEvent);
      return !!(
        t &&
        (t == e ||
          (t.length > e.length &&
            t.slice(0, e.length) == e &&
            t[e.length] == "."))
      );
    }
  };
  ae.time = ke.define();
  ae.userEvent = ke.define();
  ae.addToHistory = ke.define();
  ae.remote = ke.define();
  function $d(n, e) {
    let t = [];
    for (let i = 0, s = 0; ; ) {
      let r, o;
      if (i < n.length && (s == e.length || e[s] >= n[i]))
        (r = n[i++]), (o = n[i++]);
      else if (s < e.length) (r = e[s++]), (o = e[s++]);
      else return t;
      !t.length || t[t.length - 1] < r
        ? t.push(r, o)
        : t[t.length - 1] < o && (t[t.length - 1] = o);
    }
  }
  function Pa(n, e, t) {
    var i;
    let s, r, o;
    return (
      t
        ? ((s = e.changes),
          (r = me.empty(e.changes.length)),
          (o = n.changes.compose(e.changes)))
        : ((s = e.changes.map(n.changes)),
          (r = n.changes.mapDesc(e.changes, !0)),
          (o = n.changes.compose(s))),
      {
        changes: o,
        selection: e.selection
          ? e.selection.map(r)
          : (i = n.selection) === null || i === void 0
          ? void 0
          : i.map(s),
        effects: Y.mapEffects(n.effects, s).concat(Y.mapEffects(e.effects, r)),
        annotations: n.annotations.length
          ? n.annotations.concat(e.annotations)
          : e.annotations,
        scrollIntoView: n.scrollIntoView || e.scrollIntoView,
      }
    );
  }
  function yr(n, e, t) {
    let i = e.selection,
      s = Ht(e.annotations);
    return (
      e.userEvent && (s = s.concat(ae.userEvent.of(e.userEvent))),
      {
        changes:
          e.changes instanceof me
            ? e.changes
            : me.of(e.changes || [], t, n.facet(Sa)),
        selection: i && (i instanceof w ? i : w.single(i.anchor, i.head)),
        effects: Ht(e.effects),
        annotations: s,
        scrollIntoView: !!e.scrollIntoView,
      }
    );
  }
  function $a(n, e, t) {
    let i = yr(n, e.length ? e[0] : {}, n.doc.length);
    e.length && e[0].filter === !1 && (t = !1);
    for (let r = 1; r < e.length; r++) {
      e[r].filter === !1 && (t = !1);
      let o = !!e[r].sequential;
      i = Pa(i, yr(n, e[r], o ? i.changes.newLength : n.doc.length), o);
    }
    let s = ae.create(
      n,
      i.changes,
      i.selection,
      i.effects,
      i.annotations,
      i.scrollIntoView
    );
    return Cd(t ? Zd(s) : s);
  }
  function Zd(n) {
    let e = n.startState,
      t = !0;
    for (let s of e.facet(xa)) {
      let r = s(n);
      if (r === !1) {
        t = !1;
        break;
      }
      Array.isArray(r) && (t = t === !0 ? r : $d(t, r));
    }
    if (t !== !0) {
      let s, r;
      if (t === !1) (r = n.changes.invertedDesc), (s = me.empty(e.doc.length));
      else {
        let o = n.changes.filter(t);
        (s = o.changes), (r = o.filtered.mapDesc(o.changes).invertedDesc);
      }
      n = ae.create(
        e,
        s,
        n.selection && n.selection.map(r),
        Y.mapEffects(n.effects, r),
        n.annotations,
        n.scrollIntoView
      );
    }
    let i = e.facet(ka);
    for (let s = i.length - 1; s >= 0; s--) {
      let r = i[s](n);
      r instanceof ae
        ? (n = r)
        : Array.isArray(r) && r.length == 1 && r[0] instanceof ae
        ? (n = r[0])
        : (n = $a(e, Ht(r), !1));
    }
    return n;
  }
  function Cd(n) {
    let e = n.startState,
      t = e.facet(Qa),
      i = n;
    for (let s = t.length - 1; s >= 0; s--) {
      let r = t[s](n);
      r &&
        Object.keys(r).length &&
        (i = Pa(i, yr(e, r, n.changes.newLength), !0));
    }
    return i == n
      ? n
      : ae.create(
          e,
          n.changes,
          n.selection,
          i.effects,
          i.annotations,
          i.scrollIntoView
        );
  }
  var Td = [];
  function Ht(n) {
    return n == null ? Td : Array.isArray(n) ? n : [n];
  }
  var _ = (function (n) {
      return (
        (n[(n.Word = 0)] = "Word"),
        (n[(n.Space = 1)] = "Space"),
        (n[(n.Other = 2)] = "Other"),
        n
      );
    })(_ || (_ = {})),
    Ad =
      /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/,
    br;
  try {
    br = new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
  } catch {}
  function Rd(n) {
    if (br) return br.test(n);
    for (let e = 0; e < n.length; e++) {
      let t = n[e];
      if (
        /\w/.test(t) ||
        (t > "\x80" && (t.toUpperCase() != t.toLowerCase() || Ad.test(t)))
      )
        return !0;
    }
    return !1;
  }
  function Yd(n) {
    return (e) => {
      if (!/\S/.test(e)) return _.Space;
      if (Rd(e)) return _.Word;
      for (let t = 0; t < n.length; t++)
        if (e.indexOf(n[t]) > -1) return _.Word;
      return _.Other;
    };
  }
  var V = class n {
    constructor(e, t, i, s, r, o) {
      (this.config = e),
        (this.doc = t),
        (this.selection = i),
        (this.values = s),
        (this.status = e.statusTemplate.slice()),
        (this.computeSlot = r),
        o && (o._state = this);
      for (let l = 0; l < this.config.dynamicSlots.length; l++)
        xi(this, l << 1);
      this.computeSlot = null;
    }
    field(e, t = !0) {
      let i = this.config.address[e.id];
      if (i == null) {
        if (t) throw new RangeError("Field is not present in this state");
        return;
      }
      return xi(this, i), Zn(this, i);
    }
    update(...e) {
      return $a(this, e, !0);
    }
    applyTransaction(e) {
      let t = this.config,
        { base: i, compartments: s } = t;
      for (let l of e.effects)
        l.is(Pn.reconfigure)
          ? (t &&
              ((s = new Map()),
              t.compartments.forEach((a, h) => s.set(h, a)),
              (t = null)),
            s.set(l.value.compartment, l.value.extension))
          : l.is(Y.reconfigure)
          ? ((t = null), (i = l.value))
          : l.is(Y.appendConfig) && ((t = null), (i = Ht(i).concat(l.value)));
      let r;
      t
        ? (r = e.startState.values.slice())
        : ((t = $n.resolve(i, s, this)),
          (r = new n(
            t,
            this.doc,
            this.selection,
            t.dynamicSlots.map(() => null),
            (a, h) => h.reconfigure(a, this),
            null
          ).values));
      let o = e.startState.facet(Or)
        ? e.newSelection
        : e.newSelection.asSingle();
      new n(t, e.newDoc, o, r, (l, a) => a.update(l, e), e);
    }
    replaceSelection(e) {
      return (
        typeof e == "string" && (e = this.toText(e)),
        this.changeByRange((t) => ({
          changes: { from: t.from, to: t.to, insert: e },
          range: w.cursor(t.from + e.length),
        }))
      );
    }
    changeByRange(e) {
      let t = this.selection,
        i = e(t.ranges[0]),
        s = this.changes(i.changes),
        r = [i.range],
        o = Ht(i.effects);
      for (let l = 1; l < t.ranges.length; l++) {
        let a = e(t.ranges[l]),
          h = this.changes(a.changes),
          c = h.map(s);
        for (let u = 0; u < l; u++) r[u] = r[u].map(c);
        let f = s.mapDesc(h, !0);
        r.push(a.range.map(f)),
          (s = s.compose(c)),
          (o = Y.mapEffects(o, c).concat(Y.mapEffects(Ht(a.effects), f)));
      }
      return { changes: s, selection: w.create(r, t.mainIndex), effects: o };
    }
    changes(e = []) {
      return e instanceof me
        ? e
        : me.of(e, this.doc.length, this.facet(n.lineSeparator));
    }
    toText(e) {
      return j.of(e.split(this.facet(n.lineSeparator) || fr));
    }
    sliceDoc(e = 0, t = this.doc.length) {
      return this.doc.sliceString(e, t, this.lineBreak);
    }
    facet(e) {
      let t = this.config.address[e.id];
      return t == null ? e.default : (xi(this, t), Zn(this, t));
    }
    toJSON(e) {
      let t = { doc: this.sliceDoc(), selection: this.selection.toJSON() };
      if (e)
        for (let i in e) {
          let s = e[i];
          s instanceof F &&
            this.config.address[s.id] != null &&
            (t[i] = s.spec.toJSON(this.field(e[i]), this));
        }
      return t;
    }
    static fromJSON(e, t = {}, i) {
      if (!e || typeof e.doc != "string")
        throw new RangeError("Invalid JSON representation for EditorState");
      let s = [];
      if (i) {
        for (let r in i)
          if (Object.prototype.hasOwnProperty.call(e, r)) {
            let o = i[r],
              l = e[r];
            s.push(o.init((a) => o.spec.fromJSON(l, a)));
          }
      }
      return n.create({
        doc: e.doc,
        selection: w.fromJSON(e.selection),
        extensions: t.extensions ? s.concat([t.extensions]) : s,
      });
    }
    static create(e = {}) {
      let t = $n.resolve(e.extensions || [], new Map()),
        i =
          e.doc instanceof j
            ? e.doc
            : j.of((e.doc || "").split(t.staticFacet(n.lineSeparator) || fr)),
        s = e.selection
          ? e.selection instanceof w
            ? e.selection
            : w.single(e.selection.anchor, e.selection.head)
          : w.single(0);
      return (
        ba(s, i.length),
        t.staticFacet(Or) || (s = s.asSingle()),
        new n(
          t,
          i,
          s,
          t.dynamicSlots.map(() => null),
          (r, o) => o.create(r),
          null
        )
      );
    }
    get tabSize() {
      return this.facet(n.tabSize);
    }
    get lineBreak() {
      return (
        this.facet(n.lineSeparator) ||
        `
`
      );
    }
    get readOnly() {
      return this.facet(va);
    }
    phrase(e, ...t) {
      for (let i of this.facet(n.phrases))
        if (Object.prototype.hasOwnProperty.call(i, e)) {
          e = i[e];
          break;
        }
      return (
        t.length &&
          (e = e.replace(/\$(\$|\d*)/g, (i, s) => {
            if (s == "$") return "$";
            let r = +(s || 1);
            return !r || r > t.length ? i : t[r - 1];
          })),
        e
      );
    }
    languageDataAt(e, t, i = -1) {
      let s = [];
      for (let r of this.facet(wa))
        for (let o of r(this, t, i))
          Object.prototype.hasOwnProperty.call(o, e) && s.push(o[e]);
      return s;
    }
    charCategorizer(e) {
      return Yd(this.languageDataAt("wordChars", e).join(""));
    }
    wordAt(e) {
      let { text: t, from: i, length: s } = this.doc.lineAt(e),
        r = this.charCategorizer(e),
        o = e - i,
        l = e - i;
      for (; o > 0; ) {
        let a = se(t, o, !1);
        if (r(t.slice(a, o)) != _.Word) break;
        o = a;
      }
      for (; l < s; ) {
        let a = se(t, l);
        if (r(t.slice(l, a)) != _.Word) break;
        l = a;
      }
      return o == l ? null : w.range(o + i, l + i);
    }
  };
  V.allowMultipleSelections = Or;
  V.tabSize = T.define({ combine: (n) => (n.length ? n[0] : 4) });
  V.lineSeparator = Sa;
  V.readOnly = va;
  V.phrases = T.define({
    compare(n, e) {
      let t = Object.keys(n),
        i = Object.keys(e);
      return t.length == i.length && t.every((s) => n[s] == e[s]);
    },
  });
  V.languageData = wa;
  V.changeFilter = xa;
  V.transactionFilter = ka;
  V.transactionExtender = Qa;
  Pn.reconfigure = Y.define();
  function fe(n, e, t = {}) {
    let i = {};
    for (let s of n)
      for (let r of Object.keys(s)) {
        let o = s[r],
          l = i[r];
        if (l === void 0) i[r] = o;
        else if (!(l === o || o === void 0))
          if (Object.hasOwnProperty.call(t, r)) i[r] = t[r](l, o);
          else throw new Error("Config merge conflict for field " + r);
      }
    for (let s in e) i[s] === void 0 && (i[s] = e[s]);
    return i;
  }
  var Ve = class {
    eq(e) {
      return this == e;
    }
    range(e, t = e) {
      return Qi.create(e, t, this);
    }
  };
  Ve.prototype.startSide = Ve.prototype.endSide = 0;
  Ve.prototype.point = !1;
  Ve.prototype.mapMode = le.TrackDel;
  var Qi = class n {
    constructor(e, t, i) {
      (this.from = e), (this.to = t), (this.value = i);
    }
    static create(e, t, i) {
      return new n(e, t, i);
    }
  };
  function wr(n, e) {
    return n.from - e.from || n.value.startSide - e.value.startSide;
  }
  var Sr = class n {
      constructor(e, t, i, s) {
        (this.from = e), (this.to = t), (this.value = i), (this.maxPoint = s);
      }
      get length() {
        return this.to[this.to.length - 1];
      }
      findIndex(e, t, i, s = 0) {
        let r = i ? this.to : this.from;
        for (let o = s, l = r.length; ; ) {
          if (o == l) return o;
          let a = (o + l) >> 1,
            h =
              r[a] - e ||
              (i ? this.value[a].endSide : this.value[a].startSide) - t;
          if (a == o) return h >= 0 ? o : l;
          h >= 0 ? (l = a) : (o = a + 1);
        }
      }
      between(e, t, i, s) {
        for (
          let r = this.findIndex(t, -1e9, !0),
            o = this.findIndex(i, 1e9, !1, r);
          r < o;
          r++
        )
          if (s(this.from[r] + e, this.to[r] + e, this.value[r]) === !1)
            return !1;
      }
      map(e, t) {
        let i = [],
          s = [],
          r = [],
          o = -1,
          l = -1;
        for (let a = 0; a < this.value.length; a++) {
          let h = this.value[a],
            c = this.from[a] + e,
            f = this.to[a] + e,
            u,
            d;
          if (c == f) {
            let p = t.mapPos(c, h.startSide, h.mapMode);
            if (
              p == null ||
              ((u = d = p),
              h.startSide != h.endSide && ((d = t.mapPos(c, h.endSide)), d < u))
            )
              continue;
          } else if (
            ((u = t.mapPos(c, h.startSide)),
            (d = t.mapPos(f, h.endSide)),
            u > d || (u == d && h.startSide > 0 && h.endSide <= 0))
          )
            continue;
          (d - u || h.endSide - h.startSide) < 0 ||
            (o < 0 && (o = u),
            h.point && (l = Math.max(l, d - u)),
            i.push(h),
            s.push(u - o),
            r.push(d - o));
        }
        return { mapped: i.length ? new n(s, r, i, l) : null, pos: o };
      }
    },
    I = class n {
      constructor(e, t, i, s) {
        (this.chunkPos = e),
          (this.chunk = t),
          (this.nextLayer = i),
          (this.maxPoint = s);
      }
      static create(e, t, i, s) {
        return new n(e, t, i, s);
      }
      get length() {
        let e = this.chunk.length - 1;
        return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
      }
      get size() {
        if (this.isEmpty) return 0;
        let e = this.nextLayer.size;
        for (let t of this.chunk) e += t.value.length;
        return e;
      }
      chunkEnd(e) {
        return this.chunkPos[e] + this.chunk[e].length;
      }
      update(e) {
        let {
            add: t = [],
            sort: i = !1,
            filterFrom: s = 0,
            filterTo: r = this.length,
          } = e,
          o = e.filter;
        if (t.length == 0 && !o) return this;
        if ((i && (t = t.slice().sort(wr)), this.isEmpty))
          return t.length ? n.of(t) : this;
        let l = new Cn(this, null, -1).goto(0),
          a = 0,
          h = [],
          c = new Ie();
        for (; l.value || a < t.length; )
          if (
            a < t.length &&
            (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0
          ) {
            let f = t[a++];
            c.addInner(f.from, f.to, f.value) || h.push(f);
          } else
            l.rangeIndex == 1 &&
            l.chunkIndex < this.chunk.length &&
            (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) &&
            (!o ||
              s > this.chunkEnd(l.chunkIndex) ||
              r < this.chunkPos[l.chunkIndex]) &&
            c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex])
              ? l.nextChunk()
              : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) &&
                  (c.addInner(l.from, l.to, l.value) ||
                    h.push(Qi.create(l.from, l.to, l.value))),
                l.next());
        return c.finishInner(
          this.nextLayer.isEmpty && !h.length
            ? n.empty
            : this.nextLayer.update({
                add: h,
                filter: o,
                filterFrom: s,
                filterTo: r,
              })
        );
      }
      map(e) {
        if (e.empty || this.isEmpty) return this;
        let t = [],
          i = [],
          s = -1;
        for (let o = 0; o < this.chunk.length; o++) {
          let l = this.chunkPos[o],
            a = this.chunk[o],
            h = e.touchesRange(l, l + a.length);
          if (h === !1)
            (s = Math.max(s, a.maxPoint)), t.push(a), i.push(e.mapPos(l));
          else if (h === !0) {
            let { mapped: c, pos: f } = a.map(l, e);
            c && ((s = Math.max(s, c.maxPoint)), t.push(c), i.push(f));
          }
        }
        let r = this.nextLayer.map(e);
        return t.length == 0 ? r : new n(i, t, r || n.empty, s);
      }
      between(e, t, i) {
        if (!this.isEmpty) {
          for (let s = 0; s < this.chunk.length; s++) {
            let r = this.chunkPos[s],
              o = this.chunk[s];
            if (
              t >= r &&
              e <= r + o.length &&
              o.between(r, e - r, t - r, i) === !1
            )
              return;
          }
          this.nextLayer.between(e, t, i);
        }
      }
      iter(e = 0) {
        return vi.from([this]).goto(e);
      }
      get isEmpty() {
        return this.nextLayer == this;
      }
      static iter(e, t = 0) {
        return vi.from(e).goto(t);
      }
      static compare(e, t, i, s, r = -1) {
        let o = e.filter(
            (f) => f.maxPoint > 0 || (!f.isEmpty && f.maxPoint >= r)
          ),
          l = t.filter(
            (f) => f.maxPoint > 0 || (!f.isEmpty && f.maxPoint >= r)
          ),
          a = ua(o, l, i),
          h = new At(o, a, r),
          c = new At(l, a, r);
        i.iterGaps((f, u, d) => da(h, f, c, u, d, s)),
          i.empty && i.length == 0 && da(h, 0, c, 0, 0, s);
      }
      static eq(e, t, i = 0, s) {
        s == null && (s = 999999999);
        let r = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0),
          o = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0);
        if (r.length != o.length) return !1;
        if (!r.length) return !0;
        let l = ua(r, o),
          a = new At(r, l, 0).goto(i),
          h = new At(o, l, 0).goto(i);
        for (;;) {
          if (
            a.to != h.to ||
            !xr(a.active, h.active) ||
            (a.point && (!h.point || !a.point.eq(h.point)))
          )
            return !1;
          if (a.to > s) return !0;
          a.next(), h.next();
        }
      }
      static spans(e, t, i, s, r = -1) {
        let o = new At(e, null, r).goto(t),
          l = t,
          a = o.openStart;
        for (;;) {
          let h = Math.min(o.to, i);
          if (o.point) {
            let c = o.activeForPoint(o.to),
              f = o.pointFrom < t ? c.length + 1 : Math.min(c.length, a);
            s.point(l, h, o.point, c, f, o.pointRank),
              (a = Math.min(o.openEnd(h), c.length));
          } else h > l && (s.span(l, h, o.active, a), (a = o.openEnd(h)));
          if (o.to > i) return a + (o.point && o.to > i ? 1 : 0);
          (l = o.to), o.next();
        }
      }
      static of(e, t = !1) {
        let i = new Ie();
        for (let s of e instanceof Qi ? [e] : t ? Wd(e) : e)
          i.add(s.from, s.to, s.value);
        return i.finish();
      }
    };
  I.empty = new I([], [], null, -1);
  function Wd(n) {
    if (n.length > 1)
      for (let e = n[0], t = 1; t < n.length; t++) {
        let i = n[t];
        if (wr(e, i) > 0) return n.slice().sort(wr);
        e = i;
      }
    return n;
  }
  I.empty.nextLayer = I.empty;
  var Ie = class n {
    finishChunk(e) {
      this.chunks.push(new Sr(this.from, this.to, this.value, this.maxPoint)),
        this.chunkPos.push(this.chunkStart),
        (this.chunkStart = -1),
        (this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint)),
        (this.maxPoint = -1),
        e && ((this.from = []), (this.to = []), (this.value = []));
    }
    constructor() {
      (this.chunks = []),
        (this.chunkPos = []),
        (this.chunkStart = -1),
        (this.last = null),
        (this.lastFrom = -1e9),
        (this.lastTo = -1e9),
        (this.from = []),
        (this.to = []),
        (this.value = []),
        (this.maxPoint = -1),
        (this.setMaxPoint = -1),
        (this.nextLayer = null);
    }
    add(e, t, i) {
      this.addInner(e, t, i) ||
        (this.nextLayer || (this.nextLayer = new n())).add(e, t, i);
    }
    addInner(e, t, i) {
      let s = e - this.lastTo || i.startSide - this.last.endSide;
      if (
        s <= 0 &&
        (e - this.lastFrom || i.startSide - this.last.startSide) < 0
      )
        throw new Error(
          "Ranges must be added sorted by `from` position and `startSide`"
        );
      return s < 0
        ? !1
        : (this.from.length == 250 && this.finishChunk(!0),
          this.chunkStart < 0 && (this.chunkStart = e),
          this.from.push(e - this.chunkStart),
          this.to.push(t - this.chunkStart),
          (this.last = i),
          (this.lastFrom = e),
          (this.lastTo = t),
          this.value.push(i),
          i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)),
          !0);
    }
    addChunk(e, t) {
      if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
        return !1;
      this.from.length && this.finishChunk(!0),
        (this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint)),
        this.chunks.push(t),
        this.chunkPos.push(e);
      let i = t.value.length - 1;
      return (
        (this.last = t.value[i]),
        (this.lastFrom = t.from[i] + e),
        (this.lastTo = t.to[i] + e),
        !0
      );
    }
    finish() {
      return this.finishInner(I.empty);
    }
    finishInner(e) {
      if ((this.from.length && this.finishChunk(!1), this.chunks.length == 0))
        return e;
      let t = I.create(
        this.chunkPos,
        this.chunks,
        this.nextLayer ? this.nextLayer.finishInner(e) : e,
        this.setMaxPoint
      );
      return (this.from = null), t;
    }
  };
  function ua(n, e, t) {
    let i = new Map();
    for (let r of n)
      for (let o = 0; o < r.chunk.length; o++)
        r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
    let s = new Set();
    for (let r of e)
      for (let o = 0; o < r.chunk.length; o++) {
        let l = i.get(r.chunk[o]);
        l != null &&
          (t ? t.mapPos(l) : l) == r.chunkPos[o] &&
          !t?.touchesRange(l, l + r.chunk[o].length) &&
          s.add(r.chunk[o]);
      }
    return s;
  }
  var Cn = class {
      constructor(e, t, i, s = 0) {
        (this.layer = e), (this.skip = t), (this.minPoint = i), (this.rank = s);
      }
      get startSide() {
        return this.value ? this.value.startSide : 0;
      }
      get endSide() {
        return this.value ? this.value.endSide : 0;
      }
      goto(e, t = -1e9) {
        return (
          (this.chunkIndex = this.rangeIndex = 0),
          this.gotoInner(e, t, !1),
          this
        );
      }
      gotoInner(e, t, i) {
        for (; this.chunkIndex < this.layer.chunk.length; ) {
          let s = this.layer.chunk[this.chunkIndex];
          if (
            !(
              (this.skip && this.skip.has(s)) ||
              this.layer.chunkEnd(this.chunkIndex) < e ||
              s.maxPoint < this.minPoint
            )
          )
            break;
          this.chunkIndex++, (i = !1);
        }
        if (this.chunkIndex < this.layer.chunk.length) {
          let s = this.layer.chunk[this.chunkIndex].findIndex(
            e - this.layer.chunkPos[this.chunkIndex],
            t,
            !0
          );
          (!i || this.rangeIndex < s) && this.setRangeIndex(s);
        }
        this.next();
      }
      forward(e, t) {
        (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
      }
      next() {
        for (;;)
          if (this.chunkIndex == this.layer.chunk.length) {
            (this.from = this.to = 1e9), (this.value = null);
            break;
          } else {
            let e = this.layer.chunkPos[this.chunkIndex],
              t = this.layer.chunk[this.chunkIndex],
              i = e + t.from[this.rangeIndex];
            if (
              ((this.from = i),
              (this.to = e + t.to[this.rangeIndex]),
              (this.value = t.value[this.rangeIndex]),
              this.setRangeIndex(this.rangeIndex + 1),
              this.minPoint < 0 ||
                (this.value.point && this.to - this.from >= this.minPoint))
            )
              break;
          }
      }
      setRangeIndex(e) {
        if (e == this.layer.chunk[this.chunkIndex].value.length) {
          if ((this.chunkIndex++, this.skip))
            for (
              ;
              this.chunkIndex < this.layer.chunk.length &&
              this.skip.has(this.layer.chunk[this.chunkIndex]);

            )
              this.chunkIndex++;
          this.rangeIndex = 0;
        } else this.rangeIndex = e;
      }
      nextChunk() {
        this.chunkIndex++, (this.rangeIndex = 0), this.next();
      }
      compare(e) {
        return (
          this.from - e.from ||
          this.startSide - e.startSide ||
          this.rank - e.rank ||
          this.to - e.to ||
          this.endSide - e.endSide
        );
      }
    },
    vi = class n {
      constructor(e) {
        this.heap = e;
      }
      static from(e, t = null, i = -1) {
        let s = [];
        for (let r = 0; r < e.length; r++)
          for (let o = e[r]; !o.isEmpty; o = o.nextLayer)
            o.maxPoint >= i && s.push(new Cn(o, t, i, r));
        return s.length == 1 ? s[0] : new n(s);
      }
      get startSide() {
        return this.value ? this.value.startSide : 0;
      }
      goto(e, t = -1e9) {
        for (let i of this.heap) i.goto(e, t);
        for (let i = this.heap.length >> 1; i >= 0; i--) hr(this.heap, i);
        return this.next(), this;
      }
      forward(e, t) {
        for (let i of this.heap) i.forward(e, t);
        for (let i = this.heap.length >> 1; i >= 0; i--) hr(this.heap, i);
        (this.to - e || this.value.endSide - t) < 0 && this.next();
      }
      next() {
        if (this.heap.length == 0)
          (this.from = this.to = 1e9), (this.value = null), (this.rank = -1);
        else {
          let e = this.heap[0];
          (this.from = e.from),
            (this.to = e.to),
            (this.value = e.value),
            (this.rank = e.rank),
            e.value && e.next(),
            hr(this.heap, 0);
        }
      }
    };
  function hr(n, e) {
    for (let t = n[e]; ; ) {
      let i = (e << 1) + 1;
      if (i >= n.length) break;
      let s = n[i];
      if (
        (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && ((s = n[i + 1]), i++),
        t.compare(s) < 0)
      )
        break;
      (n[i] = t), (n[e] = s), (e = i);
    }
  }
  var At = class {
    constructor(e, t, i) {
      (this.minPoint = i),
        (this.active = []),
        (this.activeTo = []),
        (this.activeRank = []),
        (this.minActive = -1),
        (this.point = null),
        (this.pointFrom = 0),
        (this.pointRank = 0),
        (this.to = -1e9),
        (this.endSide = 0),
        (this.openStart = -1),
        (this.cursor = vi.from(e, t, i));
    }
    goto(e, t = -1e9) {
      return (
        this.cursor.goto(e, t),
        (this.active.length =
          this.activeTo.length =
          this.activeRank.length =
            0),
        (this.minActive = -1),
        (this.to = e),
        (this.endSide = t),
        (this.openStart = -1),
        this.next(),
        this
      );
    }
    forward(e, t) {
      for (
        ;
        this.minActive > -1 &&
        (this.activeTo[this.minActive] - e ||
          this.active[this.minActive].endSide - t) < 0;

      )
        this.removeActive(this.minActive);
      this.cursor.forward(e, t);
    }
    removeActive(e) {
      wn(this.active, e),
        wn(this.activeTo, e),
        wn(this.activeRank, e),
        (this.minActive = pa(this.active, this.activeTo));
    }
    addActive(e) {
      let t = 0,
        { value: i, to: s, rank: r } = this.cursor;
      for (; t < this.activeRank.length && this.activeRank[t] <= r; ) t++;
      Sn(this.active, t, i),
        Sn(this.activeTo, t, s),
        Sn(this.activeRank, t, r),
        e && Sn(e, t, this.cursor.from),
        (this.minActive = pa(this.active, this.activeTo));
    }
    next() {
      let e = this.to,
        t = this.point;
      this.point = null;
      let i = this.openStart < 0 ? [] : null;
      for (;;) {
        let s = this.minActive;
        if (
          s > -1 &&
          (this.activeTo[s] - this.cursor.from ||
            this.active[s].endSide - this.cursor.startSide) < 0
        ) {
          if (this.activeTo[s] > e) {
            (this.to = this.activeTo[s]),
              (this.endSide = this.active[s].endSide);
            break;
          }
          this.removeActive(s), i && wn(i, s);
        } else if (this.cursor.value)
          if (this.cursor.from > e) {
            (this.to = this.cursor.from),
              (this.endSide = this.cursor.startSide);
            break;
          } else {
            let r = this.cursor.value;
            if (!r.point) this.addActive(i), this.cursor.next();
            else if (
              t &&
              this.cursor.to == this.to &&
              this.cursor.from < this.cursor.to
            )
              this.cursor.next();
            else {
              (this.point = r),
                (this.pointFrom = this.cursor.from),
                (this.pointRank = this.cursor.rank),
                (this.to = this.cursor.to),
                (this.endSide = r.endSide),
                this.cursor.next(),
                this.forward(this.to, this.endSide);
              break;
            }
          }
        else {
          this.to = this.endSide = 1e9;
          break;
        }
      }
      if (i) {
        this.openStart = 0;
        for (let s = i.length - 1; s >= 0 && i[s] < e; s--) this.openStart++;
      }
    }
    activeForPoint(e) {
      if (!this.active.length) return this.active;
      let t = [];
      for (
        let i = this.active.length - 1;
        i >= 0 && !(this.activeRank[i] < this.pointRank);
        i--
      )
        (this.activeTo[i] > e ||
          (this.activeTo[i] == e &&
            this.active[i].endSide >= this.point.endSide)) &&
          t.push(this.active[i]);
      return t.reverse();
    }
    openEnd(e) {
      let t = 0;
      for (
        let i = this.activeTo.length - 1;
        i >= 0 && this.activeTo[i] > e;
        i--
      )
        t++;
      return t;
    }
  };
  function da(n, e, t, i, s, r) {
    n.goto(e), t.goto(i);
    let o = i + s,
      l = i,
      a = i - e;
    for (;;) {
      let h = n.to + a - t.to || n.endSide - t.endSide,
        c = h < 0 ? n.to + a : t.to,
        f = Math.min(c, o);
      if (
        (n.point || t.point
          ? (n.point &&
              t.point &&
              (n.point == t.point || n.point.eq(t.point)) &&
              xr(n.activeForPoint(n.to), t.activeForPoint(t.to))) ||
            r.comparePoint(l, f, n.point, t.point)
          : f > l &&
            !xr(n.active, t.active) &&
            r.compareRange(l, f, n.active, t.active),
        c > o)
      )
        break;
      (l = c), h <= 0 && n.next(), h >= 0 && t.next();
    }
  }
  function xr(n, e) {
    if (n.length != e.length) return !1;
    for (let t = 0; t < n.length; t++)
      if (n[t] != e[t] && !n[t].eq(e[t])) return !1;
    return !0;
  }
  function wn(n, e) {
    for (let t = e, i = n.length - 1; t < i; t++) n[t] = n[t + 1];
    n.pop();
  }
  function Sn(n, e, t) {
    for (let i = n.length - 1; i >= e; i--) n[i + 1] = n[i];
    n[e] = t;
  }
  function pa(n, e) {
    let t = -1,
      i = 1e9;
    for (let s = 0; s < e.length; s++)
      (e[s] - i || n[s].endSide - n[t].endSide) < 0 && ((t = s), (i = e[s]));
    return t;
  }
  function lt(n, e, t = n.length) {
    let i = 0;
    for (let s = 0; s < t; )
      n.charCodeAt(s) == 9 ? ((i += e - (i % e)), s++) : (i++, (s = se(n, s)));
    return i;
  }
  function Tn(n, e, t, i) {
    for (let s = 0, r = 0; ; ) {
      if (r >= e) return s;
      if (s == n.length) break;
      (r += n.charCodeAt(s) == 9 ? t - (r % t) : 1), (s = se(n, s));
    }
    return i === !0 ? -1 : n.length;
  }
  var vr = "\u037C",
    Za = typeof Symbol > "u" ? "__" + vr : Symbol.for(vr),
    Pr =
      typeof Symbol > "u"
        ? "__styleSet" + Math.floor(Math.random() * 1e8)
        : Symbol("styleSet"),
    Ca =
      typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {},
    Ee = class {
      constructor(e, t) {
        this.rules = [];
        let { finish: i } = t || {};
        function s(o) {
          return /^@/.test(o) ? [o] : o.split(/,\s*/);
        }
        function r(o, l, a, h) {
          let c = [],
            f = /^@(\w+)\b/.exec(o[0]),
            u = f && f[1] == "keyframes";
          if (f && l == null) return a.push(o[0] + ";");
          for (let d in l) {
            let p = l[d];
            if (/&/.test(d))
              r(
                d
                  .split(/,\s*/)
                  .map((g) => o.map((m) => g.replace(/&/, m)))
                  .reduce((g, m) => g.concat(m)),
                p,
                a
              );
            else if (p && typeof p == "object") {
              if (!f)
                throw new RangeError(
                  "The value of a property (" +
                    d +
                    ") should be a primitive value."
                );
              r(s(d), p, c, u);
            } else
              p != null &&
                c.push(
                  d
                    .replace(/_.*/, "")
                    .replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) +
                    ": " +
                    p +
                    ";"
                );
          }
          (c.length || u) &&
            a.push(
              (i && !f && !h ? o.map(i) : o).join(", ") +
                " {" +
                c.join(" ") +
                "}"
            );
        }
        for (let o in e) r(s(o), e[o], this.rules);
      }
      getRules() {
        return this.rules.join(`
`);
      }
      static newName() {
        let e = Ca[Za] || 1;
        return (Ca[Za] = e + 1), vr + e.toString(36);
      }
      static mount(e, t, i) {
        let s = e[Pr],
          r = i && i.nonce;
        s ? r && s.setNonce(r) : (s = new $r(e, r)),
          s.mount(Array.isArray(t) ? t : [t]);
      }
    },
    Ta = new Map(),
    $r = class {
      constructor(e, t) {
        let i = e.ownerDocument || e,
          s = i.defaultView;
        if (!e.head && e.adoptedStyleSheets && s.CSSStyleSheet) {
          let r = Ta.get(i);
          if (r)
            return (
              (e.adoptedStyleSheets = [r.sheet, ...e.adoptedStyleSheets]),
              (e[Pr] = r)
            );
          (this.sheet = new s.CSSStyleSheet()),
            (e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets]),
            Ta.set(i, this);
        } else {
          (this.styleTag = i.createElement("style")),
            t && this.styleTag.setAttribute("nonce", t);
          let r = e.head || e;
          r.insertBefore(this.styleTag, r.firstChild);
        }
        (this.modules = []), (e[Pr] = this);
      }
      mount(e) {
        let t = this.sheet,
          i = 0,
          s = 0;
        for (let r = 0; r < e.length; r++) {
          let o = e[r],
            l = this.modules.indexOf(o);
          if (
            (l < s && l > -1 && (this.modules.splice(l, 1), s--, (l = -1)),
            l == -1)
          ) {
            if ((this.modules.splice(s++, 0, o), t))
              for (let a = 0; a < o.rules.length; a++)
                t.insertRule(o.rules[a], i++);
          } else {
            for (; s < l; ) i += this.modules[s++].rules.length;
            (i += o.rules.length), s++;
          }
        }
        if (!t) {
          let r = "";
          for (let o = 0; o < this.modules.length; o++)
            r +=
              this.modules[o].getRules() +
              `
`;
          this.styleTag.textContent = r;
        }
      }
      setNonce(e) {
        this.styleTag &&
          this.styleTag.getAttribute("nonce") != e &&
          this.styleTag.setAttribute("nonce", e);
      }
    };
  var at = {
      8: "Backspace",
      9: "Tab",
      10: "Enter",
      12: "NumLock",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      44: "PrintScreen",
      45: "Insert",
      46: "Delete",
      59: ";",
      61: "=",
      91: "Meta",
      92: "Meta",
      106: "*",
      107: "+",
      108: ",",
      109: "-",
      110: ".",
      111: "/",
      144: "NumLock",
      145: "ScrollLock",
      160: "Shift",
      161: "Shift",
      162: "Control",
      163: "Control",
      164: "Alt",
      165: "Alt",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'",
    },
    Jt = {
      48: ")",
      49: "!",
      50: "@",
      51: "#",
      52: "$",
      53: "%",
      54: "^",
      55: "&",
      56: "*",
      57: "(",
      59: ":",
      61: "+",
      173: "_",
      186: ":",
      187: "+",
      188: "<",
      189: "_",
      190: ">",
      191: "?",
      192: "~",
      219: "{",
      220: "|",
      221: "}",
      222: '"',
    },
    Xd = typeof navigator < "u" && /Mac/.test(navigator.platform),
    Md =
      typeof navigator < "u" &&
      /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
  for (re = 0; re < 10; re++) at[48 + re] = at[96 + re] = String(re);
  var re;
  for (re = 1; re <= 24; re++) at[re + 111] = "F" + re;
  var re;
  for (re = 65; re <= 90; re++)
    (at[re] = String.fromCharCode(re + 32)), (Jt[re] = String.fromCharCode(re));
  var re;
  for (An in at) Jt.hasOwnProperty(An) || (Jt[An] = at[An]);
  var An;
  function Aa(n) {
    var e =
        (Xd && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey) ||
        (Md && n.shiftKey && n.key && n.key.length == 1) ||
        n.key == "Unidentified",
      t =
        (!e && n.key) ||
        (n.shiftKey ? Jt : at)[n.keyCode] ||
        n.key ||
        "Unidentified";
    return (
      t == "Esc" && (t = "Escape"),
      t == "Del" && (t = "Delete"),
      t == "Left" && (t = "ArrowLeft"),
      t == "Up" && (t = "ArrowUp"),
      t == "Right" && (t = "ArrowRight"),
      t == "Down" && (t = "ArrowDown"),
      t
    );
  }
  function zn(n) {
    let e;
    return (
      n.nodeType == 11 ? (e = n.getSelection ? n : n.ownerDocument) : (e = n),
      e.getSelection()
    );
  }
  function Xr(n, e) {
    return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
  }
  function Ed(n) {
    let e = n.activeElement;
    for (; e && e.shadowRoot; ) e = e.shadowRoot.activeElement;
    return e;
  }
  function Bn(n, e) {
    if (!e.anchorNode) return !1;
    try {
      return Xr(n, e.anchorNode);
    } catch {
      return !1;
    }
  }
  function ji(n) {
    return n.nodeType == 3
      ? Wt(n, 0, n.nodeValue.length).getClientRects()
      : n.nodeType == 1
      ? n.getClientRects()
      : [];
  }
  function Gn(n, e, t, i) {
    return t ? Ra(n, e, t, i, -1) || Ra(n, e, t, i, 1) : !1;
  }
  function qi(n) {
    for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
  }
  function Ra(n, e, t, i, s) {
    for (;;) {
      if (n == t && e == i) return !0;
      if (e == (s < 0 ? 0 : ht(n))) {
        if (n.nodeName == "DIV") return !1;
        let r = n.parentNode;
        if (!r || r.nodeType != 1) return !1;
        (e = qi(n) + (s < 0 ? 0 : 1)), (n = r);
      } else if (n.nodeType == 1) {
        if (
          ((n = n.childNodes[e + (s < 0 ? -1 : 0)]),
          n.nodeType == 1 && n.contentEditable == "false")
        )
          return !1;
        e = s < 0 ? ht(n) : 0;
      } else return !1;
    }
  }
  function ht(n) {
    return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
  }
  function ko(n, e) {
    let t = e ? n.left : n.right;
    return { left: t, right: t, top: n.top, bottom: n.bottom };
  }
  function Dd(n) {
    return { left: 0, right: n.innerWidth, top: 0, bottom: n.innerHeight };
  }
  function yh(n, e) {
    let t = e.width / n.offsetWidth,
      i = e.height / n.offsetHeight;
    return (
      ((t > 0.995 && t < 1.005) ||
        !isFinite(t) ||
        Math.abs(e.width - n.offsetWidth) < 1) &&
        (t = 1),
      ((i > 0.995 && i < 1.005) ||
        !isFinite(i) ||
        Math.abs(e.height - n.offsetHeight) < 1) &&
        (i = 1),
      { scaleX: t, scaleY: i }
    );
  }
  function jd(n, e, t, i, s, r, o, l) {
    let a = n.ownerDocument,
      h = a.defaultView || window;
    for (let c = n, f = !1; c && !f; )
      if (c.nodeType == 1) {
        let u,
          d = c == a.body,
          p = 1,
          g = 1;
        if (d) u = Dd(h);
        else {
          if (
            (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0),
            c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth)
          ) {
            c = c.assignedSlot || c.parentNode;
            continue;
          }
          let k = c.getBoundingClientRect();
          ({ scaleX: p, scaleY: g } = yh(c, k)),
            (u = {
              left: k.left,
              right: k.left + c.clientWidth * p,
              top: k.top,
              bottom: k.top + c.clientHeight * g,
            });
        }
        let m = 0,
          b = 0;
        if (s == "nearest")
          e.top < u.top
            ? ((b = -(u.top - e.top + o)),
              t > 0 &&
                e.bottom > u.bottom + b &&
                (b = e.bottom - u.bottom + b + o))
            : e.bottom > u.bottom &&
              ((b = e.bottom - u.bottom + o),
              t < 0 && e.top - b < u.top && (b = -(u.top + b - e.top + o)));
        else {
          let k = e.bottom - e.top,
            $ = u.bottom - u.top;
          b =
            (s == "center" && k <= $
              ? e.top + k / 2 - $ / 2
              : s == "start" || (s == "center" && t < 0)
              ? e.top - o
              : e.bottom - $ + o) - u.top;
        }
        if (
          (i == "nearest"
            ? e.left < u.left
              ? ((m = -(u.left - e.left + r)),
                t > 0 &&
                  e.right > u.right + m &&
                  (m = e.right - u.right + m + r))
              : e.right > u.right &&
                ((m = e.right - u.right + r),
                t < 0 &&
                  e.left < u.left + m &&
                  (m = -(u.left + m - e.left + r)))
            : (m =
                (i == "center"
                  ? e.left + (e.right - e.left) / 2 - (u.right - u.left) / 2
                  : (i == "start") == l
                  ? e.left - r
                  : e.right - (u.right - u.left) + r) - u.left),
          m || b)
        )
          if (d) h.scrollBy(m, b);
          else {
            let k = 0,
              $ = 0;
            if (b) {
              let P = c.scrollTop;
              (c.scrollTop += b / g), ($ = (c.scrollTop - P) * g);
            }
            if (m) {
              let P = c.scrollLeft;
              (c.scrollLeft += m / p), (k = (c.scrollLeft - P) * p);
            }
            (e = {
              left: e.left - k,
              top: e.top - $,
              right: e.right - k,
              bottom: e.bottom - $,
            }),
              k && Math.abs(k - m) < 1 && (i = "nearest"),
              $ && Math.abs($ - b) < 1 && (s = "nearest");
          }
        if (d) break;
        c = c.assignedSlot || c.parentNode;
      } else if (c.nodeType == 11) c = c.host;
      else break;
  }
  function qd(n) {
    let e = n.ownerDocument;
    for (let t = n.parentNode; t && t != e.body; )
      if (t.nodeType == 1) {
        if (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth)
          return t;
        t = t.assignedSlot || t.parentNode;
      } else if (t.nodeType == 11) t = t.host;
      else break;
    return null;
  }
  var Mr = class {
      constructor() {
        (this.anchorNode = null),
          (this.anchorOffset = 0),
          (this.focusNode = null),
          (this.focusOffset = 0);
      }
      eq(e) {
        return (
          this.anchorNode == e.anchorNode &&
          this.anchorOffset == e.anchorOffset &&
          this.focusNode == e.focusNode &&
          this.focusOffset == e.focusOffset
        );
      }
      setRange(e) {
        let { anchorNode: t, focusNode: i } = e;
        this.set(
          t,
          Math.min(e.anchorOffset, t ? ht(t) : 0),
          i,
          Math.min(e.focusOffset, i ? ht(i) : 0)
        );
      }
      set(e, t, i, s) {
        (this.anchorNode = e),
          (this.anchorOffset = t),
          (this.focusNode = i),
          (this.focusOffset = s);
      }
    },
    ei = null;
  function bh(n) {
    if (n.setActive) return n.setActive();
    if (ei) return n.focus(ei);
    let e = [];
    for (
      let t = n;
      t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument);
      t = t.parentNode
    );
    if (
      (n.focus(
        ei == null
          ? {
              get preventScroll() {
                return (ei = { preventScroll: !0 }), !0;
              },
            }
          : void 0
      ),
      !ei)
    ) {
      ei = !1;
      for (let t = 0; t < e.length; ) {
        let i = e[t++],
          s = e[t++],
          r = e[t++];
        i.scrollTop != s && (i.scrollTop = s),
          i.scrollLeft != r && (i.scrollLeft = r);
      }
    }
  }
  var Ya;
  function Wt(n, e, t = e) {
    let i = Ya || (Ya = document.createRange());
    return i.setEnd(n, t), i.setStart(n, e), i;
  }
  function si(n, e, t) {
    let i = { key: e, code: e, keyCode: t, which: t, cancelable: !0 },
      s = new KeyboardEvent("keydown", i);
    (s.synthetic = !0), n.dispatchEvent(s);
    let r = new KeyboardEvent("keyup", i);
    return (
      (r.synthetic = !0),
      n.dispatchEvent(r),
      s.defaultPrevented || r.defaultPrevented
    );
  }
  function Bd(n) {
    for (; n; ) {
      if (n && (n.nodeType == 9 || (n.nodeType == 11 && n.host))) return n;
      n = n.assignedSlot || n.parentNode;
    }
    return null;
  }
  function wh(n) {
    for (; n.attributes.length; ) n.removeAttributeNode(n.attributes[0]);
  }
  function Vd(n, e) {
    let t = e.focusNode,
      i = e.focusOffset;
    if (!t || e.anchorNode != t || e.anchorOffset != i) return !1;
    for (i = Math.min(i, ht(t)); ; )
      if (i) {
        if (t.nodeType != 1) return !1;
        let s = t.childNodes[i - 1];
        s.contentEditable == "false" ? i-- : ((t = s), (i = ht(t)));
      } else {
        if (t == n) return !0;
        (i = qi(t)), (t = t.parentNode);
      }
  }
  function Sh(n) {
    return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
  }
  var ge = class n {
      constructor(e, t, i = !0) {
        (this.node = e), (this.offset = t), (this.precise = i);
      }
      static before(e, t) {
        return new n(e.parentNode, qi(e), t);
      }
      static after(e, t) {
        return new n(e.parentNode, qi(e) + 1, t);
      }
    },
    Qo = [],
    H = class n {
      constructor() {
        (this.parent = null), (this.dom = null), (this.flags = 2);
      }
      get overrideDOMText() {
        return null;
      }
      get posAtStart() {
        return this.parent ? this.parent.posBefore(this) : 0;
      }
      get posAtEnd() {
        return this.posAtStart + this.length;
      }
      posBefore(e) {
        let t = this.posAtStart;
        for (let i of this.children) {
          if (i == e) return t;
          t += i.length + i.breakAfter;
        }
        throw new RangeError("Invalid child in posBefore");
      }
      posAfter(e) {
        return this.posBefore(e) + e.length;
      }
      sync(e, t) {
        if (this.flags & 2) {
          let i = this.dom,
            s = null,
            r;
          for (let o of this.children) {
            if (o.flags & 7) {
              if (!o.dom && (r = s ? s.nextSibling : i.firstChild)) {
                let l = n.get(r);
                (!l || (!l.parent && l.canReuseDOM(o))) && o.reuseDOM(r);
              }
              o.sync(e, t), (o.flags &= -8);
            }
            if (
              ((r = s ? s.nextSibling : i.firstChild),
              t && !t.written && t.node == i && r != o.dom && (t.written = !0),
              o.dom.parentNode == i)
            )
              for (; r && r != o.dom; ) r = Wa(r);
            else i.insertBefore(o.dom, r);
            s = o.dom;
          }
          for (
            r = s ? s.nextSibling : i.firstChild,
              r && t && t.node == i && (t.written = !0);
            r;

          )
            r = Wa(r);
        } else if (this.flags & 1)
          for (let i of this.children)
            i.flags & 7 && (i.sync(e, t), (i.flags &= -8));
      }
      reuseDOM(e) {}
      localPosFromDOM(e, t) {
        let i;
        if (e == this.dom) i = this.dom.childNodes[t];
        else {
          let s = ht(e) == 0 ? 0 : t == 0 ? -1 : 1;
          for (;;) {
            let r = e.parentNode;
            if (r == this.dom) break;
            s == 0 &&
              r.firstChild != r.lastChild &&
              (e == r.firstChild ? (s = -1) : (s = 1)),
              (e = r);
          }
          s < 0 ? (i = e) : (i = e.nextSibling);
        }
        if (i == this.dom.firstChild) return 0;
        for (; i && !n.get(i); ) i = i.nextSibling;
        if (!i) return this.length;
        for (let s = 0, r = 0; ; s++) {
          let o = this.children[s];
          if (o.dom == i) return r;
          r += o.length + o.breakAfter;
        }
      }
      domBoundsAround(e, t, i = 0) {
        let s = -1,
          r = -1,
          o = -1,
          l = -1;
        for (let a = 0, h = i, c = i; a < this.children.length; a++) {
          let f = this.children[a],
            u = h + f.length;
          if (h < e && u > t) return f.domBoundsAround(e, t, h);
          if (
            (u >= e && s == -1 && ((s = a), (r = h)),
            h > t && f.dom.parentNode == this.dom)
          ) {
            (o = a), (l = c);
            break;
          }
          (c = u), (h = u + f.breakAfter);
        }
        return {
          from: r,
          to: l < 0 ? i + this.length : l,
          startDOM:
            (s ? this.children[s - 1].dom.nextSibling : null) ||
            this.dom.firstChild,
          endDOM:
            o < this.children.length && o >= 0 ? this.children[o].dom : null,
        };
      }
      markDirty(e = !1) {
        (this.flags |= 2), this.markParentsDirty(e);
      }
      markParentsDirty(e) {
        for (let t = this.parent; t; t = t.parent) {
          if ((e && (t.flags |= 2), t.flags & 1)) return;
          (t.flags |= 1), (e = !1);
        }
      }
      setParent(e) {
        this.parent != e &&
          ((this.parent = e), this.flags & 7 && this.markParentsDirty(!0));
      }
      setDOM(e) {
        this.dom != e &&
          (this.dom && (this.dom.cmView = null),
          (this.dom = e),
          (e.cmView = this));
      }
      get rootView() {
        for (let e = this; ; ) {
          let t = e.parent;
          if (!t) return e;
          e = t;
        }
      }
      replaceChildren(e, t, i = Qo) {
        this.markDirty();
        for (let s = e; s < t; s++) {
          let r = this.children[s];
          r.parent == this && i.indexOf(r) < 0 && r.destroy();
        }
        this.children.splice(e, t - e, ...i);
        for (let s = 0; s < i.length; s++) i[s].setParent(this);
      }
      ignoreMutation(e) {
        return !1;
      }
      ignoreEvent(e) {
        return !1;
      }
      childCursor(e = this.length) {
        return new Un(this.children, e, this.children.length);
      }
      childPos(e, t = 1) {
        return this.childCursor().findPos(e, t);
      }
      toString() {
        let e = this.constructor.name.replace("View", "");
        return (
          e +
          (this.children.length
            ? "(" + this.children.join() + ")"
            : this.length
            ? "[" + (e == "Text" ? this.text : this.length) + "]"
            : "") +
          (this.breakAfter ? "#" : "")
        );
      }
      static get(e) {
        return e.cmView;
      }
      get isEditable() {
        return !0;
      }
      get isWidget() {
        return !1;
      }
      get isHidden() {
        return !1;
      }
      merge(e, t, i, s, r, o) {
        return !1;
      }
      become(e) {
        return !1;
      }
      canReuseDOM(e) {
        return (
          e.constructor == this.constructor && !((this.flags | e.flags) & 8)
        );
      }
      getSide() {
        return 0;
      }
      destroy() {
        for (let e of this.children) e.parent == this && e.destroy();
        this.parent = null;
      }
    };
  H.prototype.breakAfter = 0;
  function Wa(n) {
    let e = n.nextSibling;
    return n.parentNode.removeChild(n), e;
  }
  var Un = class {
    constructor(e, t, i) {
      (this.children = e), (this.pos = t), (this.i = i), (this.off = 0);
    }
    findPos(e, t = 1) {
      for (;;) {
        if (
          e > this.pos ||
          (e == this.pos &&
            (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        )
          return (this.off = e - this.pos), this;
        let i = this.children[--this.i];
        this.pos -= i.length + i.breakAfter;
      }
    }
  };
  function xh(n, e, t, i, s, r, o, l, a) {
    let { children: h } = n,
      c = h.length ? h[e] : null,
      f = r.length ? r[r.length - 1] : null,
      u = f ? f.breakAfter : o;
    if (
      !(
        e == i &&
        c &&
        !o &&
        !u &&
        r.length < 2 &&
        c.merge(t, s, r.length ? f : null, t == 0, l, a)
      )
    ) {
      if (i < h.length) {
        let d = h[i];
        d && (s < d.length || (d.breakAfter && f?.breakAfter))
          ? (e == i && ((d = d.split(s)), (s = 0)),
            !u && f && d.merge(0, s, f, !0, 0, a)
              ? (r[r.length - 1] = d)
              : ((s || (d.children.length && !d.children[0].length)) &&
                  d.merge(0, s, null, !1, 0, a),
                r.push(d)))
          : d?.breakAfter && (f ? (f.breakAfter = 1) : (o = 1)),
          i++;
      }
      for (
        c &&
        ((c.breakAfter = o),
        t > 0 &&
          (!o && r.length && c.merge(t, c.length, r[0], !1, l, 0)
            ? (c.breakAfter = r.shift().breakAfter)
            : (t < c.length ||
                (c.children.length &&
                  c.children[c.children.length - 1].length == 0)) &&
              c.merge(t, c.length, null, !1, l, 0),
          e++));
        e < i && r.length;

      )
        if (h[i - 1].become(r[r.length - 1]))
          i--, r.pop(), (a = r.length ? 0 : l);
        else if (h[e].become(r[0])) e++, r.shift(), (l = r.length ? 0 : a);
        else break;
      !r.length &&
        e &&
        i < h.length &&
        !h[e - 1].breakAfter &&
        h[i].merge(0, 0, h[e - 1], !1, l, a) &&
        e--,
        (e < i || r.length) && n.replaceChildren(e, i, r);
    }
  }
  function kh(n, e, t, i, s, r) {
    let o = n.childCursor(),
      { i: l, off: a } = o.findPos(t, 1),
      { i: h, off: c } = o.findPos(e, -1),
      f = e - t;
    for (let u of i) f += u.length;
    (n.length += f), xh(n, h, c, l, a, i, 0, s, r);
  }
  var $e =
      typeof navigator < "u"
        ? navigator
        : { userAgent: "", vendor: "", platform: "" },
    Er = typeof document < "u" ? document : { documentElement: { style: {} } },
    Dr = /Edge\/(\d+)/.exec($e.userAgent),
    Qh = /MSIE \d/.test($e.userAgent),
    jr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec($e.userAgent),
    hs = !!(Qh || jr || Dr),
    Xa = !hs && /gecko\/(\d+)/i.test($e.userAgent),
    Zr = !hs && /Chrome\/(\d+)/.exec($e.userAgent),
    Ma = "webkitFontSmoothing" in Er.documentElement.style,
    vh = !hs && /Apple Computer/.test($e.vendor),
    Ea = vh && (/Mobile\/\w+/.test($e.userAgent) || $e.maxTouchPoints > 2),
    A = {
      mac: Ea || /Mac/.test($e.platform),
      windows: /Win/.test($e.platform),
      linux: /Linux|X11/.test($e.platform),
      ie: hs,
      ie_version: Qh ? Er.documentMode || 6 : jr ? +jr[1] : Dr ? +Dr[1] : 0,
      gecko: Xa,
      gecko_version: Xa
        ? +(/Firefox\/(\d+)/.exec($e.userAgent) || [0, 0])[1]
        : 0,
      chrome: !!Zr,
      chrome_version: Zr ? +Zr[1] : 0,
      ios: Ea,
      android: /Android\b/.test($e.userAgent),
      webkit: Ma,
      safari: vh,
      webkit_version: Ma
        ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1]
        : 0,
      tabSize:
        Er.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size",
    },
    Id = 256,
    mt = class n extends H {
      constructor(e) {
        super(), (this.text = e);
      }
      get length() {
        return this.text.length;
      }
      createDOM(e) {
        this.setDOM(e || document.createTextNode(this.text));
      }
      sync(e, t) {
        this.dom || this.createDOM(),
          this.dom.nodeValue != this.text &&
            (t && t.node == this.dom && (t.written = !0),
            (this.dom.nodeValue = this.text));
      }
      reuseDOM(e) {
        e.nodeType == 3 && this.createDOM(e);
      }
      merge(e, t, i) {
        return this.flags & 8 ||
          (i &&
            (!(i instanceof n) ||
              this.length - (t - e) + i.length > Id ||
              i.flags & 8))
          ? !1
          : ((this.text =
              this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t)),
            this.markDirty(),
            !0);
      }
      split(e) {
        let t = new n(this.text.slice(e));
        return (
          (this.text = this.text.slice(0, e)),
          this.markDirty(),
          (t.flags |= this.flags & 8),
          t
        );
      }
      localPosFromDOM(e, t) {
        return e == this.dom ? t : t ? this.text.length : 0;
      }
      domAtPos(e) {
        return new ge(this.dom, e);
      }
      domBoundsAround(e, t, i) {
        return {
          from: i,
          to: i + this.length,
          startDOM: this.dom,
          endDOM: this.dom.nextSibling,
        };
      }
      coordsAt(e, t) {
        return Ld(this.dom, e, t);
      }
    },
    gt = class n extends H {
      constructor(e, t = [], i = 0) {
        super(), (this.mark = e), (this.children = t), (this.length = i);
        for (let s of t) s.setParent(this);
      }
      setAttrs(e) {
        if (
          (wh(e),
          this.mark.class && (e.className = this.mark.class),
          this.mark.attrs)
        )
          for (let t in this.mark.attrs) e.setAttribute(t, this.mark.attrs[t]);
        return e;
      }
      canReuseDOM(e) {
        return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
      }
      reuseDOM(e) {
        e.nodeName == this.mark.tagName.toUpperCase() &&
          (this.setDOM(e), (this.flags |= 6));
      }
      sync(e, t) {
        this.dom
          ? this.flags & 4 && this.setAttrs(this.dom)
          : this.setDOM(
              this.setAttrs(document.createElement(this.mark.tagName))
            ),
          super.sync(e, t);
      }
      merge(e, t, i, s, r, o) {
        return i &&
          (!(i instanceof n && i.mark.eq(this.mark)) ||
            (e && r <= 0) ||
            (t < this.length && o <= 0))
          ? !1
          : (kh(this, e, t, i ? i.children.slice() : [], r - 1, o - 1),
            this.markDirty(),
            !0);
      }
      split(e) {
        let t = [],
          i = 0,
          s = -1,
          r = 0;
        for (let l of this.children) {
          let a = i + l.length;
          a > e && t.push(i < e ? l.split(e - i) : l),
            s < 0 && i >= e && (s = r),
            (i = a),
            r++;
        }
        let o = this.length - e;
        return (
          (this.length = e),
          s > -1 && ((this.children.length = s), this.markDirty()),
          new n(this.mark, t, o)
        );
      }
      domAtPos(e) {
        return Ph(this, e);
      }
      coordsAt(e, t) {
        return Zh(this, e, t);
      }
    };
  function Ld(n, e, t) {
    let i = n.nodeValue.length;
    e > i && (e = i);
    let s = e,
      r = e,
      o = 0;
    (e == 0 && t < 0) || (e == i && t >= 0)
      ? A.chrome || A.gecko || (e ? (s--, (o = 1)) : r < i && (r++, (o = -1)))
      : t < 0
      ? s--
      : r < i && r++;
    let l = Wt(n, s, r).getClientRects();
    if (!l.length) return null;
    let a = l[(o ? o < 0 : t >= 0) ? 0 : l.length - 1];
    return (
      A.safari &&
        !o &&
        a.width == 0 &&
        (a = Array.prototype.find.call(l, (h) => h.width) || a),
      o ? ko(a, o < 0) : a || null
    );
  }
  var Bi = class n extends H {
      static create(e, t, i) {
        return new n(e, t, i);
      }
      constructor(e, t, i) {
        super(),
          (this.widget = e),
          (this.length = t),
          (this.side = i),
          (this.prevWidget = null);
      }
      split(e) {
        let t = n.create(this.widget, this.length - e, this.side);
        return (this.length -= e), t;
      }
      sync(e) {
        (!this.dom || !this.widget.updateDOM(this.dom, e)) &&
          (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
          (this.prevWidget = null),
          this.setDOM(this.widget.toDOM(e)),
          (this.dom.contentEditable = "false"));
      }
      getSide() {
        return this.side;
      }
      merge(e, t, i, s, r, o) {
        return i &&
          (!(i instanceof n) ||
            !this.widget.compare(i.widget) ||
            (e > 0 && r <= 0) ||
            (t < this.length && o <= 0))
          ? !1
          : ((this.length = e + (i ? i.length : 0) + (this.length - t)), !0);
      }
      become(e) {
        return e instanceof n &&
          e.side == this.side &&
          this.widget.constructor == e.widget.constructor
          ? (this.widget.compare(e.widget) || this.markDirty(!0),
            this.dom && !this.prevWidget && (this.prevWidget = this.widget),
            (this.widget = e.widget),
            (this.length = e.length),
            !0)
          : !1;
      }
      ignoreMutation() {
        return !0;
      }
      ignoreEvent(e) {
        return this.widget.ignoreEvent(e);
      }
      get overrideDOMText() {
        if (this.length == 0) return j.empty;
        let e = this;
        for (; e.parent; ) e = e.parent;
        let { view: t } = e,
          i = t && t.state.doc,
          s = this.posAtStart;
        return i ? i.slice(s, s + this.length) : j.empty;
      }
      domAtPos(e) {
        return (this.length ? e == 0 : this.side > 0)
          ? ge.before(this.dom)
          : ge.after(this.dom, e == this.length);
      }
      domBoundsAround() {
        return null;
      }
      coordsAt(e, t) {
        let i = this.widget.coordsAt(this.dom, e, t);
        if (i) return i;
        let s = this.dom.getClientRects(),
          r = null;
        if (!s.length) return null;
        let o = this.side ? this.side < 0 : e > 0;
        for (
          let l = o ? s.length - 1 : 0;
          (r = s[l]), !(e > 0 ? l == 0 : l == s.length - 1 || r.top < r.bottom);
          l += o ? -1 : 1
        );
        return ko(r, !o);
      }
      get isEditable() {
        return !1;
      }
      get isWidget() {
        return !0;
      }
      get isHidden() {
        return this.widget.isHidden;
      }
      destroy() {
        super.destroy(), this.dom && this.widget.destroy(this.dom);
      }
    },
    Vi = class n extends H {
      constructor(e) {
        super(), (this.side = e);
      }
      get length() {
        return 0;
      }
      merge() {
        return !1;
      }
      become(e) {
        return e instanceof n && e.side == this.side;
      }
      split() {
        return new n(this.side);
      }
      sync() {
        if (!this.dom) {
          let e = document.createElement("img");
          (e.className = "cm-widgetBuffer"),
            e.setAttribute("aria-hidden", "true"),
            this.setDOM(e);
        }
      }
      getSide() {
        return this.side;
      }
      domAtPos(e) {
        return this.side > 0 ? ge.before(this.dom) : ge.after(this.dom);
      }
      localPosFromDOM() {
        return 0;
      }
      domBoundsAround() {
        return null;
      }
      coordsAt(e) {
        return this.dom.getBoundingClientRect();
      }
      get overrideDOMText() {
        return j.empty;
      }
      get isHidden() {
        return !0;
      }
    };
  mt.prototype.children = Bi.prototype.children = Vi.prototype.children = Qo;
  function Ph(n, e) {
    let t = n.dom,
      { children: i } = n,
      s = 0;
    for (let r = 0; s < i.length; s++) {
      let o = i[s],
        l = r + o.length;
      if (!(l == r && o.getSide() <= 0)) {
        if (e > r && e < l && o.dom.parentNode == t) return o.domAtPos(e - r);
        if (e <= r) break;
        r = l;
      }
    }
    for (let r = s; r > 0; r--) {
      let o = i[r - 1];
      if (o.dom.parentNode == t) return o.domAtPos(o.length);
    }
    for (let r = s; r < i.length; r++) {
      let o = i[r];
      if (o.dom.parentNode == t) return o.domAtPos(0);
    }
    return new ge(t, 0);
  }
  function $h(n, e, t) {
    let i,
      { children: s } = n;
    t > 0 &&
    e instanceof gt &&
    s.length &&
    (i = s[s.length - 1]) instanceof gt &&
    i.mark.eq(e.mark)
      ? $h(i, e.children[0], t - 1)
      : (s.push(e), e.setParent(n)),
      (n.length += e.length);
  }
  function Zh(n, e, t) {
    let i = null,
      s = -1,
      r = null,
      o = -1;
    function l(h, c) {
      for (let f = 0, u = 0; f < h.children.length && u <= c; f++) {
        let d = h.children[f],
          p = u + d.length;
        p >= c &&
          (d.children.length
            ? l(d, c - u)
            : (!r || (r.isHidden && t > 0)) &&
              (p > c || (u == p && d.getSide() > 0))
            ? ((r = d), (o = c - u))
            : (u < c || (u == p && d.getSide() < 0 && !d.isHidden)) &&
              ((i = d), (s = c - u))),
          (u = p);
      }
    }
    l(n, e);
    let a = (t < 0 ? i : r) || i || r;
    return a ? a.coordsAt(Math.max(0, a == i ? s : o), t) : _d(n);
  }
  function _d(n) {
    let e = n.dom.lastChild;
    if (!e) return n.dom.getBoundingClientRect();
    let t = ji(e);
    return t[t.length - 1] || null;
  }
  function qr(n, e) {
    for (let t in n)
      t == "class" && e.class
        ? (e.class += " " + n.class)
        : t == "style" && e.style
        ? (e.style += ";" + n.style)
        : (e[t] = n[t]);
    return e;
  }
  var Da = Object.create(null);
  function vo(n, e, t) {
    if (n == e) return !0;
    n || (n = Da), e || (e = Da);
    let i = Object.keys(n),
      s = Object.keys(e);
    if (
      i.length - (t && i.indexOf(t) > -1 ? 1 : 0) !=
      s.length - (t && s.indexOf(t) > -1 ? 1 : 0)
    )
      return !1;
    for (let r of i)
      if (r != t && (s.indexOf(r) == -1 || n[r] !== e[r])) return !1;
    return !0;
  }
  function Br(n, e, t) {
    let i = !1;
    if (e)
      for (let s in e)
        (t && s in t) ||
          ((i = !0),
          s == "style" ? (n.style.cssText = "") : n.removeAttribute(s));
    if (t)
      for (let s in t)
        (e && e[s] == t[s]) ||
          ((i = !0),
          s == "style" ? (n.style.cssText = t[s]) : n.setAttribute(s, t[s]));
    return i;
  }
  function Nd(n) {
    let e = Object.create(null);
    for (let t = 0; t < n.attributes.length; t++) {
      let i = n.attributes[t];
      e[i.name] = i.value;
    }
    return e;
  }
  var he = class n extends H {
      constructor() {
        super(...arguments),
          (this.children = []),
          (this.length = 0),
          (this.prevAttrs = void 0),
          (this.attrs = null),
          (this.breakAfter = 0);
      }
      merge(e, t, i, s, r, o) {
        if (i) {
          if (!(i instanceof n)) return !1;
          this.dom || i.transferDOM(this);
        }
        return (
          s && this.setDeco(i ? i.attrs : null),
          kh(this, e, t, i ? i.children.slice() : [], r, o),
          !0
        );
      }
      split(e) {
        let t = new n();
        if (((t.breakAfter = this.breakAfter), this.length == 0)) return t;
        let { i, off: s } = this.childPos(e);
        s &&
          (t.append(this.children[i].split(s), 0),
          this.children[i].merge(s, this.children[i].length, null, !1, 0, 0),
          i++);
        for (let r = i; r < this.children.length; r++)
          t.append(this.children[r], 0);
        for (; i > 0 && this.children[i - 1].length == 0; )
          this.children[--i].destroy();
        return (
          (this.children.length = i), this.markDirty(), (this.length = e), t
        );
      }
      transferDOM(e) {
        this.dom &&
          (this.markDirty(),
          e.setDOM(this.dom),
          (e.prevAttrs =
            this.prevAttrs === void 0 ? this.attrs : this.prevAttrs),
          (this.prevAttrs = void 0),
          (this.dom = null));
      }
      setDeco(e) {
        vo(this.attrs, e) ||
          (this.dom && ((this.prevAttrs = this.attrs), this.markDirty()),
          (this.attrs = e));
      }
      append(e, t) {
        $h(this, e, t);
      }
      addLineDeco(e) {
        let t = e.spec.attributes,
          i = e.spec.class;
        t && (this.attrs = qr(t, this.attrs || {})),
          i && (this.attrs = qr({ class: i }, this.attrs || {}));
      }
      domAtPos(e) {
        return Ph(this, e);
      }
      reuseDOM(e) {
        e.nodeName == "DIV" && (this.setDOM(e), (this.flags |= 6));
      }
      sync(e, t) {
        var i;
        this.dom
          ? this.flags & 4 &&
            (wh(this.dom),
            (this.dom.className = "cm-line"),
            (this.prevAttrs = this.attrs ? null : void 0))
          : (this.setDOM(document.createElement("div")),
            (this.dom.className = "cm-line"),
            (this.prevAttrs = this.attrs ? null : void 0)),
          this.prevAttrs !== void 0 &&
            (Br(this.dom, this.prevAttrs, this.attrs),
            this.dom.classList.add("cm-line"),
            (this.prevAttrs = void 0)),
          super.sync(e, t);
        let s = this.dom.lastChild;
        for (; s && H.get(s) instanceof gt; ) s = s.lastChild;
        if (
          !s ||
          !this.length ||
          (s.nodeName != "BR" &&
            ((i = H.get(s)) === null || i === void 0 ? void 0 : i.isEditable) ==
              !1 &&
            (!A.ios || !this.children.some((r) => r instanceof mt)))
        ) {
          let r = document.createElement("BR");
          (r.cmIgnore = !0), this.dom.appendChild(r);
        }
      }
      measureTextSize() {
        if (this.children.length == 0 || this.length > 20) return null;
        let e = 0,
          t;
        for (let i of this.children) {
          if (!(i instanceof mt) || /[^ -~]/.test(i.text)) return null;
          let s = ji(i.dom);
          if (s.length != 1) return null;
          (e += s[0].width), (t = s[0].height);
        }
        return e
          ? {
              lineHeight: this.dom.getBoundingClientRect().height,
              charWidth: e / this.length,
              textHeight: t,
            }
          : null;
      }
      coordsAt(e, t) {
        let i = Zh(this, e, t);
        if (!this.children.length && i && this.parent) {
          let { heightOracle: s } = this.parent.view.viewState,
            r = i.bottom - i.top;
          if (Math.abs(r - s.lineHeight) < 2 && s.textHeight < r) {
            let o = (r - s.textHeight) / 2;
            return {
              top: i.top + o,
              bottom: i.bottom - o,
              left: i.left,
              right: i.left,
            };
          }
        }
        return i;
      }
      become(e) {
        return !1;
      }
      covers() {
        return !0;
      }
      static find(e, t) {
        for (let i = 0, s = 0; i < e.children.length; i++) {
          let r = e.children[i],
            o = s + r.length;
          if (o >= t) {
            if (r instanceof n) return r;
            if (o > t) break;
          }
          s = o + r.breakAfter;
        }
        return null;
      }
    },
    ri = class n extends H {
      constructor(e, t, i) {
        super(),
          (this.widget = e),
          (this.length = t),
          (this.deco = i),
          (this.breakAfter = 0),
          (this.prevWidget = null);
      }
      merge(e, t, i, s, r, o) {
        return i &&
          (!(i instanceof n) ||
            !this.widget.compare(i.widget) ||
            (e > 0 && r <= 0) ||
            (t < this.length && o <= 0))
          ? !1
          : ((this.length = e + (i ? i.length : 0) + (this.length - t)), !0);
      }
      domAtPos(e) {
        return e == 0
          ? ge.before(this.dom)
          : ge.after(this.dom, e == this.length);
      }
      split(e) {
        let t = this.length - e;
        this.length = e;
        let i = new n(this.widget, t, this.deco);
        return (i.breakAfter = this.breakAfter), i;
      }
      get children() {
        return Qo;
      }
      sync(e) {
        (!this.dom || !this.widget.updateDOM(this.dom, e)) &&
          (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom),
          (this.prevWidget = null),
          this.setDOM(this.widget.toDOM(e)),
          (this.dom.contentEditable = "false"));
      }
      get overrideDOMText() {
        return this.parent
          ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd)
          : j.empty;
      }
      domBoundsAround() {
        return null;
      }
      become(e) {
        return e instanceof n && e.widget.constructor == this.widget.constructor
          ? (e.widget.compare(this.widget) || this.markDirty(!0),
            this.dom && !this.prevWidget && (this.prevWidget = this.widget),
            (this.widget = e.widget),
            (this.length = e.length),
            (this.deco = e.deco),
            (this.breakAfter = e.breakAfter),
            !0)
          : !1;
      }
      ignoreMutation() {
        return !0;
      }
      ignoreEvent(e) {
        return this.widget.ignoreEvent(e);
      }
      get isEditable() {
        return !1;
      }
      get isWidget() {
        return !0;
      }
      coordsAt(e, t) {
        return this.widget.coordsAt(this.dom, e, t);
      }
      destroy() {
        super.destroy(), this.dom && this.widget.destroy(this.dom);
      }
      covers(e) {
        let { startSide: t, endSide: i } = this.deco;
        return t == i ? !1 : e < 0 ? t < 0 : i > 0;
      }
    },
    Qe = class {
      eq(e) {
        return !1;
      }
      updateDOM(e, t) {
        return !1;
      }
      compare(e) {
        return this == e || (this.constructor == e.constructor && this.eq(e));
      }
      get estimatedHeight() {
        return -1;
      }
      get lineBreaks() {
        return 0;
      }
      ignoreEvent(e) {
        return !0;
      }
      coordsAt(e, t, i) {
        return null;
      }
      get isHidden() {
        return !1;
      }
      destroy(e) {}
    },
    ye = (function (n) {
      return (
        (n[(n.Text = 0)] = "Text"),
        (n[(n.WidgetBefore = 1)] = "WidgetBefore"),
        (n[(n.WidgetAfter = 2)] = "WidgetAfter"),
        (n[(n.WidgetRange = 3)] = "WidgetRange"),
        n
      );
    })(ye || (ye = {})),
    R = class extends Ve {
      constructor(e, t, i, s) {
        super(),
          (this.startSide = e),
          (this.endSide = t),
          (this.widget = i),
          (this.spec = s);
      }
      get heightRelevant() {
        return !1;
      }
      static mark(e) {
        return new Ii(e);
      }
      static widget(e) {
        let t = Math.max(-1e4, Math.min(1e4, e.side || 0)),
          i = !!e.block;
        return (
          (t +=
            i && !e.inlineOrder ? (t > 0 ? 3e8 : -4e8) : t > 0 ? 1e8 : -1e8),
          new yt(e, t, t, i, e.widget || null, !1)
        );
      }
      static replace(e) {
        let t = !!e.block,
          i,
          s;
        if (e.isBlockGap) (i = -5e8), (s = 4e8);
        else {
          let { start: r, end: o } = Ch(e, t);
          (i = (r ? (t ? -3e8 : -1) : 5e8) - 1),
            (s = (o ? (t ? 2e8 : 1) : -6e8) + 1);
        }
        return new yt(e, i, s, t, e.widget || null, !0);
      }
      static line(e) {
        return new Li(e);
      }
      static set(e, t = !1) {
        return I.of(e, t);
      }
      hasHeight() {
        return this.widget ? this.widget.estimatedHeight > -1 : !1;
      }
    };
  R.none = I.empty;
  var Ii = class n extends R {
    constructor(e) {
      let { start: t, end: i } = Ch(e);
      super(t ? -1 : 5e8, i ? 1 : -6e8, null, e),
        (this.tagName = e.tagName || "span"),
        (this.class = e.class || ""),
        (this.attrs = e.attributes || null);
    }
    eq(e) {
      var t, i;
      return (
        this == e ||
        (e instanceof n &&
          this.tagName == e.tagName &&
          (this.class ||
            ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) ==
            (e.class ||
              ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) &&
          vo(this.attrs, e.attrs, "class"))
      );
    }
    range(e, t = e) {
      if (e >= t) throw new RangeError("Mark decorations may not be empty");
      return super.range(e, t);
    }
  };
  Ii.prototype.point = !1;
  var Li = class n extends R {
    constructor(e) {
      super(-2e8, -2e8, null, e);
    }
    eq(e) {
      return (
        e instanceof n &&
        this.spec.class == e.spec.class &&
        vo(this.spec.attributes, e.spec.attributes)
      );
    }
    range(e, t = e) {
      if (t != e)
        throw new RangeError("Line decoration ranges must be zero-length");
      return super.range(e, t);
    }
  };
  Li.prototype.mapMode = le.TrackBefore;
  Li.prototype.point = !0;
  var yt = class n extends R {
    constructor(e, t, i, s, r, o) {
      super(t, i, r, e),
        (this.block = s),
        (this.isReplace = o),
        (this.mapMode = s
          ? t <= 0
            ? le.TrackBefore
            : le.TrackAfter
          : le.TrackDel);
    }
    get type() {
      return this.startSide != this.endSide
        ? ye.WidgetRange
        : this.startSide <= 0
        ? ye.WidgetBefore
        : ye.WidgetAfter;
    }
    get heightRelevant() {
      return (
        this.block ||
        (!!this.widget &&
          (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0))
      );
    }
    eq(e) {
      return (
        e instanceof n &&
        zd(this.widget, e.widget) &&
        this.block == e.block &&
        this.startSide == e.startSide &&
        this.endSide == e.endSide
      );
    }
    range(e, t = e) {
      if (
        this.isReplace &&
        (e > t || (e == t && this.startSide > 0 && this.endSide <= 0))
      )
        throw new RangeError("Invalid range for replacement decoration");
      if (!this.isReplace && t != e)
        throw new RangeError(
          "Widget decorations can only have zero-length ranges"
        );
      return super.range(e, t);
    }
  };
  yt.prototype.point = !0;
  function Ch(n, e = !1) {
    let { inclusiveStart: t, inclusiveEnd: i } = n;
    return (
      t == null && (t = n.inclusive),
      i == null && (i = n.inclusive),
      { start: t ?? e, end: i ?? e }
    );
  }
  function zd(n, e) {
    return n == e || !!(n && e && n.compare(e));
  }
  function Vr(n, e, t, i = 0) {
    let s = t.length - 1;
    s >= 0 && t[s] + i >= n ? (t[s] = Math.max(t[s], e)) : t.push(n, e);
  }
  var Yi = class n {
    constructor(e, t, i, s) {
      (this.doc = e),
        (this.pos = t),
        (this.end = i),
        (this.disallowBlockEffectsFor = s),
        (this.content = []),
        (this.curLine = null),
        (this.breakAtStart = 0),
        (this.pendingBuffer = 0),
        (this.bufferMarks = []),
        (this.atCursorPos = !0),
        (this.openStart = -1),
        (this.openEnd = -1),
        (this.text = ""),
        (this.textOff = 0),
        (this.cursor = e.iter()),
        (this.skip = t);
    }
    posCovered() {
      if (this.content.length == 0)
        return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
      let e = this.content[this.content.length - 1];
      return !(e.breakAfter || (e instanceof ri && e.deco.endSide < 0));
    }
    getLine() {
      return (
        this.curLine ||
          (this.content.push((this.curLine = new he())),
          (this.atCursorPos = !0)),
        this.curLine
      );
    }
    flushBuffer(e = this.bufferMarks) {
      this.pendingBuffer &&
        (this.curLine.append(Rn(new Vi(-1), e), e.length),
        (this.pendingBuffer = 0));
    }
    addBlockWidget(e) {
      this.flushBuffer(), (this.curLine = null), this.content.push(e);
    }
    finish(e) {
      this.pendingBuffer && e <= this.bufferMarks.length
        ? this.flushBuffer()
        : (this.pendingBuffer = 0),
        !this.posCovered() &&
          !(
            e &&
            this.content.length &&
            this.content[this.content.length - 1] instanceof ri
          ) &&
          this.getLine();
    }
    buildText(e, t, i) {
      for (; e > 0; ) {
        if (this.textOff == this.text.length) {
          let { value: r, lineBreak: o, done: l } = this.cursor.next(this.skip);
          if (((this.skip = 0), l))
            throw new Error(
              "Ran out of text content when drawing inline views"
            );
          if (o) {
            this.posCovered() || this.getLine(),
              this.content.length
                ? (this.content[this.content.length - 1].breakAfter = 1)
                : (this.breakAtStart = 1),
              this.flushBuffer(),
              (this.curLine = null),
              (this.atCursorPos = !0),
              e--;
            continue;
          } else (this.text = r), (this.textOff = 0);
        }
        let s = Math.min(this.text.length - this.textOff, e, 512);
        this.flushBuffer(t.slice(t.length - i)),
          this.getLine().append(
            Rn(new mt(this.text.slice(this.textOff, this.textOff + s)), t),
            i
          ),
          (this.atCursorPos = !0),
          (this.textOff += s),
          (e -= s),
          (i = 0);
      }
    }
    span(e, t, i, s) {
      this.buildText(t - e, i, s),
        (this.pos = t),
        this.openStart < 0 && (this.openStart = s);
    }
    point(e, t, i, s, r, o) {
      if (this.disallowBlockEffectsFor[o] && i instanceof yt) {
        if (i.block)
          throw new RangeError(
            "Block decorations may not be specified via plugins"
          );
        if (t > this.doc.lineAt(this.pos).to)
          throw new RangeError(
            "Decorations that replace line breaks may not be specified via plugins"
          );
      }
      let l = t - e;
      if (i instanceof yt)
        if (i.block)
          i.startSide > 0 && !this.posCovered() && this.getLine(),
            this.addBlockWidget(new ri(i.widget || new Fn("div"), l, i));
        else {
          let a = Bi.create(i.widget || new Fn("span"), l, l ? 0 : i.startSide),
            h =
              this.atCursorPos &&
              !a.isEditable &&
              r <= s.length &&
              (e < t || i.startSide > 0),
            c = !a.isEditable && (e < t || r > s.length || i.startSide <= 0),
            f = this.getLine();
          this.pendingBuffer == 2 &&
            !h &&
            !a.isEditable &&
            (this.pendingBuffer = 0),
            this.flushBuffer(s),
            h &&
              (f.append(Rn(new Vi(1), s), r),
              (r = s.length + Math.max(0, r - s.length))),
            f.append(Rn(a, s), r),
            (this.atCursorPos = c),
            (this.pendingBuffer = c ? (e < t || r > s.length ? 1 : 2) : 0),
            this.pendingBuffer && (this.bufferMarks = s.slice());
        }
      else
        this.doc.lineAt(this.pos).from == this.pos &&
          this.getLine().addLineDeco(i);
      l &&
        (this.textOff + l <= this.text.length
          ? (this.textOff += l)
          : ((this.skip += l - (this.text.length - this.textOff)),
            (this.text = ""),
            (this.textOff = 0)),
        (this.pos = t)),
        this.openStart < 0 && (this.openStart = r);
    }
    static build(e, t, i, s, r) {
      let o = new n(e, t, i, r);
      return (
        (o.openEnd = I.spans(s, t, i, o)),
        o.openStart < 0 && (o.openStart = o.openEnd),
        o.finish(o.openEnd),
        o
      );
    }
  };
  function Rn(n, e) {
    for (let t of e) n = new gt(t, [n], n.length);
    return n;
  }
  var Fn = class extends Qe {
      constructor(e) {
        super(), (this.tag = e);
      }
      eq(e) {
        return e.tag == this.tag;
      }
      toDOM() {
        return document.createElement(this.tag);
      }
      updateDOM(e) {
        return e.nodeName.toLowerCase() == this.tag;
      }
      get isHidden() {
        return !0;
      }
    },
    Th = T.define(),
    Ah = T.define(),
    Rh = T.define(),
    Yh = T.define(),
    Ir = T.define(),
    Wh = T.define(),
    Xh = T.define(),
    Mh = T.define({ combine: (n) => n.some((e) => e) }),
    Eh = T.define({ combine: (n) => n.some((e) => e) }),
    Wi = class n {
      constructor(e, t = "nearest", i = "nearest", s = 5, r = 5, o = !1) {
        (this.range = e),
          (this.y = t),
          (this.x = i),
          (this.yMargin = s),
          (this.xMargin = r),
          (this.isSnapshot = o);
      }
      map(e) {
        return e.empty
          ? this
          : new n(
              this.range.map(e),
              this.y,
              this.x,
              this.yMargin,
              this.xMargin,
              this.isSnapshot
            );
      }
      clip(e) {
        return this.range.to <= e.doc.length
          ? this
          : new n(
              w.cursor(e.doc.length),
              this.y,
              this.x,
              this.yMargin,
              this.xMargin,
              this.isSnapshot
            );
      }
    },
    Yn = Y.define({ map: (n, e) => n.map(e) });
  function be(n, e, t) {
    let i = n.facet(Yh);
    i.length
      ? i[0](e)
      : window.onerror
      ? window.onerror(String(e), t, void 0, void 0, e)
      : t
      ? console.error(t + ":", e)
      : console.error(e);
  }
  var cs = T.define({ combine: (n) => (n.length ? n[0] : !0) }),
    Gd = 0,
    Zi = T.define(),
    J = class n {
      constructor(e, t, i, s, r) {
        (this.id = e),
          (this.create = t),
          (this.domEventHandlers = i),
          (this.domEventObservers = s),
          (this.extension = r(this));
      }
      static define(e, t) {
        let {
          eventHandlers: i,
          eventObservers: s,
          provide: r,
          decorations: o,
        } = t || {};
        return new n(Gd++, e, i, s, (l) => {
          let a = [Zi.of(l)];
          return (
            o &&
              a.push(
                _i.of((h) => {
                  let c = h.plugin(l);
                  return c ? o(c) : R.none;
                })
              ),
            r && a.push(r(l)),
            a
          );
        });
      }
      static fromClass(e, t) {
        return n.define((i) => new e(i), t);
      }
    },
    Xi = class {
      constructor(e) {
        (this.spec = e), (this.mustUpdate = null), (this.value = null);
      }
      update(e) {
        if (this.value) {
          if (this.mustUpdate) {
            let t = this.mustUpdate;
            if (((this.mustUpdate = null), this.value.update))
              try {
                this.value.update(t);
              } catch (i) {
                if (
                  (be(t.state, i, "CodeMirror plugin crashed"),
                  this.value.destroy)
                )
                  try {
                    this.value.destroy();
                  } catch {}
                this.deactivate();
              }
          }
        } else if (this.spec)
          try {
            this.value = this.spec.create(e);
          } catch (t) {
            be(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
          }
        return this;
      }
      destroy(e) {
        var t;
        if (!((t = this.value) === null || t === void 0) && t.destroy)
          try {
            this.value.destroy();
          } catch (i) {
            be(e.state, i, "CodeMirror plugin crashed");
          }
      }
      deactivate() {
        this.spec = this.value = null;
      }
    },
    Dh = T.define(),
    Po = T.define(),
    _i = T.define(),
    $o = T.define(),
    jh = T.define();
  function ja(n, e, t) {
    let i = n.state.facet(jh);
    if (!i.length) return i;
    let s = i.map((o) => (o instanceof Function ? o(n) : o)),
      r = [];
    return (
      I.spans(s, e, t, {
        point() {},
        span(o, l, a, h) {
          let c = r;
          for (let f = a.length - 1; f >= 0; f--, h--) {
            let u = a[f].spec.bidiIsolate,
              d;
            if (u != null)
              if (
                h > 0 &&
                c.length &&
                (d = c[c.length - 1]).to == o &&
                d.direction == u
              )
                (d.to = l), (c = d.inner);
              else {
                let p = { from: o, to: l, direction: u, inner: [] };
                c.push(p), (c = p.inner);
              }
          }
        },
      }),
      r
    );
  }
  var qh = T.define();
  function Bh(n) {
    let e = 0,
      t = 0,
      i = 0,
      s = 0;
    for (let r of n.state.facet(qh)) {
      let o = r(n);
      o &&
        (o.left != null && (e = Math.max(e, o.left)),
        o.right != null && (t = Math.max(t, o.right)),
        o.top != null && (i = Math.max(i, o.top)),
        o.bottom != null && (s = Math.max(s, o.bottom)));
    }
    return { left: e, right: t, top: i, bottom: s };
  }
  var Ci = T.define(),
    et = class n {
      constructor(e, t, i, s) {
        (this.fromA = e), (this.toA = t), (this.fromB = i), (this.toB = s);
      }
      join(e) {
        return new n(
          Math.min(this.fromA, e.fromA),
          Math.max(this.toA, e.toA),
          Math.min(this.fromB, e.fromB),
          Math.max(this.toB, e.toB)
        );
      }
      addToSet(e) {
        let t = e.length,
          i = this;
        for (; t > 0; t--) {
          let s = e[t - 1];
          if (!(s.fromA > i.toA)) {
            if (s.toA < i.fromA) break;
            (i = i.join(s)), e.splice(t - 1, 1);
          }
        }
        return e.splice(t, 0, i), e;
      }
      static extendWithRanges(e, t) {
        if (t.length == 0) return e;
        let i = [];
        for (let s = 0, r = 0, o = 0, l = 0; ; s++) {
          let a = s == e.length ? null : e[s],
            h = o - l,
            c = a ? a.fromB : 1e9;
          for (; r < t.length && t[r] < c; ) {
            let f = t[r],
              u = t[r + 1],
              d = Math.max(l, f),
              p = Math.min(c, u);
            if ((d <= p && new n(d + h, p + h, d, p).addToSet(i), u > c)) break;
            r += 2;
          }
          if (!a) return i;
          new n(a.fromA, a.toA, a.fromB, a.toB).addToSet(i),
            (o = a.toA),
            (l = a.toB);
        }
      }
    },
    Hn = class n {
      constructor(e, t, i) {
        (this.view = e),
          (this.state = t),
          (this.transactions = i),
          (this.flags = 0),
          (this.startState = e.state),
          (this.changes = me.empty(this.startState.doc.length));
        for (let r of i) this.changes = this.changes.compose(r.changes);
        let s = [];
        this.changes.iterChangedRanges((r, o, l, a) =>
          s.push(new et(r, o, l, a))
        ),
          (this.changedRanges = s);
      }
      static create(e, t, i) {
        return new n(e, t, i);
      }
      get viewportChanged() {
        return (this.flags & 4) > 0;
      }
      get heightChanged() {
        return (this.flags & 2) > 0;
      }
      get geometryChanged() {
        return this.docChanged || (this.flags & 10) > 0;
      }
      get focusChanged() {
        return (this.flags & 1) > 0;
      }
      get docChanged() {
        return !this.changes.empty;
      }
      get selectionSet() {
        return this.transactions.some((e) => e.selection);
      }
      get empty() {
        return this.flags == 0 && this.transactions.length == 0;
      }
    },
    U = (function (n) {
      return (n[(n.LTR = 0)] = "LTR"), (n[(n.RTL = 1)] = "RTL"), n;
    })(U || (U = {})),
    Ni = U.LTR,
    Vh = U.RTL;
  function Ih(n) {
    let e = [];
    for (let t = 0; t < n.length; t++) e.push(1 << +n[t]);
    return e;
  }
  var Ud = Ih(
      "88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"
    ),
    Fd = Ih(
      "4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"
    ),
    Lr = Object.create(null),
    He = [];
  for (let n of ["()", "[]", "{}"]) {
    let e = n.charCodeAt(0),
      t = n.charCodeAt(1);
    (Lr[e] = t), (Lr[t] = -e);
  }
  function Hd(n) {
    return n <= 247
      ? Ud[n]
      : 1424 <= n && n <= 1524
      ? 2
      : 1536 <= n && n <= 1785
      ? Fd[n - 1536]
      : 1774 <= n && n <= 2220
      ? 4
      : 8192 <= n && n <= 8204
      ? 256
      : 64336 <= n && n <= 65023
      ? 4
      : 1;
  }
  var Kd = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/,
    Je = class {
      get dir() {
        return this.level % 2 ? Vh : Ni;
      }
      constructor(e, t, i) {
        (this.from = e), (this.to = t), (this.level = i);
      }
      side(e, t) {
        return (this.dir == t) == e ? this.to : this.from;
      }
      static find(e, t, i, s) {
        let r = -1;
        for (let o = 0; o < e.length; o++) {
          let l = e[o];
          if (l.from <= t && l.to >= t) {
            if (l.level == i) return o;
            (r < 0 ||
              (s != 0
                ? s < 0
                  ? l.from < t
                  : l.to > t
                : e[r].level > l.level)) &&
              (r = o);
          }
        }
        if (r < 0) throw new RangeError("Index out of range");
        return r;
      }
    };
  function Lh(n, e) {
    if (n.length != e.length) return !1;
    for (let t = 0; t < n.length; t++) {
      let i = n[t],
        s = e[t];
      if (
        i.from != s.from ||
        i.to != s.to ||
        i.direction != s.direction ||
        !Lh(i.inner, s.inner)
      )
        return !1;
    }
    return !0;
  }
  var z = [];
  function Jd(n, e, t, i, s) {
    for (let r = 0; r <= i.length; r++) {
      let o = r ? i[r - 1].to : e,
        l = r < i.length ? i[r].from : t,
        a = r ? 256 : s;
      for (let h = o, c = a, f = a; h < l; h++) {
        let u = Hd(n.charCodeAt(h));
        u == 512 ? (u = c) : u == 8 && f == 4 && (u = 16),
          (z[h] = u == 4 ? 2 : u),
          u & 7 && (f = u),
          (c = u);
      }
      for (let h = o, c = a, f = a; h < l; h++) {
        let u = z[h];
        if (u == 128)
          h < l - 1 && c == z[h + 1] && c & 24 ? (u = z[h] = c) : (z[h] = 256);
        else if (u == 64) {
          let d = h + 1;
          for (; d < l && z[d] == 64; ) d++;
          let p =
            (h && c == 8) || (d < t && z[d] == 8) ? (f == 1 ? 1 : 8) : 256;
          for (let g = h; g < d; g++) z[g] = p;
          h = d - 1;
        } else u == 8 && f == 1 && (z[h] = 1);
        (c = u), u & 7 && (f = u);
      }
    }
  }
  function ep(n, e, t, i, s) {
    let r = s == 1 ? 2 : 1;
    for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
      let h = o ? i[o - 1].to : e,
        c = o < i.length ? i[o].from : t;
      for (let f = h, u, d, p; f < c; f++)
        if ((d = Lr[(u = n.charCodeAt(f))]))
          if (d < 0) {
            for (let g = l - 3; g >= 0; g -= 3)
              if (He[g + 1] == -d) {
                let m = He[g + 2],
                  b = m & 2 ? s : m & 4 ? (m & 1 ? r : s) : 0;
                b && (z[f] = z[He[g]] = b), (l = g);
                break;
              }
          } else {
            if (He.length == 189) break;
            (He[l++] = f), (He[l++] = u), (He[l++] = a);
          }
        else if ((p = z[f]) == 2 || p == 1) {
          let g = p == s;
          a = g ? 0 : 1;
          for (let m = l - 3; m >= 0; m -= 3) {
            let b = He[m + 2];
            if (b & 2) break;
            if (g) He[m + 2] |= 2;
            else {
              if (b & 4) break;
              He[m + 2] |= 4;
            }
          }
        }
    }
  }
  function tp(n, e, t, i) {
    for (let s = 0, r = i; s <= t.length; s++) {
      let o = s ? t[s - 1].to : n,
        l = s < t.length ? t[s].from : e;
      for (let a = o; a < l; ) {
        let h = z[a];
        if (h == 256) {
          let c = a + 1;
          for (;;)
            if (c == l) {
              if (s == t.length) break;
              (c = t[s++].to), (l = s < t.length ? t[s].from : e);
            } else if (z[c] == 256) c++;
            else break;
          let f = r == 1,
            u = (c < e ? z[c] : i) == 1,
            d = f == u ? (f ? 1 : 2) : i;
          for (let p = c, g = s, m = g ? t[g - 1].to : n; p > a; )
            p == m && ((p = t[--g].from), (m = g ? t[g - 1].to : n)),
              (z[--p] = d);
          a = c;
        } else (r = h), a++;
      }
    }
  }
  function _r(n, e, t, i, s, r, o) {
    let l = i % 2 ? 2 : 1;
    if (i % 2 == s % 2)
      for (let a = e, h = 0; a < t; ) {
        let c = !0,
          f = !1;
        if (h == r.length || a < r[h].from) {
          let g = z[a];
          g != l && ((c = !1), (f = g == 16));
        }
        let u = !c && l == 1 ? [] : null,
          d = c ? i : i + 1,
          p = a;
        e: for (;;)
          if (h < r.length && p == r[h].from) {
            if (f) break e;
            let g = r[h];
            if (!c)
              for (let m = g.to, b = h + 1; ; ) {
                if (m == t) break e;
                if (b < r.length && r[b].from == m) m = r[b++].to;
                else {
                  if (z[m] == l) break e;
                  break;
                }
              }
            if ((h++, u)) u.push(g);
            else {
              g.from > a && o.push(new Je(a, g.from, d));
              let m = (g.direction == Ni) != !(d % 2);
              Nr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), (a = g.to);
            }
            p = g.to;
          } else {
            if (p == t || (c ? z[p] != l : z[p] == l)) break;
            p++;
          }
        u ? _r(n, a, p, i + 1, s, u, o) : a < p && o.push(new Je(a, p, d)),
          (a = p);
      }
    else
      for (let a = t, h = r.length; a > e; ) {
        let c = !0,
          f = !1;
        if (!h || a > r[h - 1].to) {
          let g = z[a - 1];
          g != l && ((c = !1), (f = g == 16));
        }
        let u = !c && l == 1 ? [] : null,
          d = c ? i : i + 1,
          p = a;
        e: for (;;)
          if (h && p == r[h - 1].to) {
            if (f) break e;
            let g = r[--h];
            if (!c)
              for (let m = g.from, b = h; ; ) {
                if (m == e) break e;
                if (b && r[b - 1].to == m) m = r[--b].from;
                else {
                  if (z[m - 1] == l) break e;
                  break;
                }
              }
            if (u) u.push(g);
            else {
              g.to < a && o.push(new Je(g.to, a, d));
              let m = (g.direction == Ni) != !(d % 2);
              Nr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), (a = g.from);
            }
            p = g.from;
          } else {
            if (p == e || (c ? z[p - 1] != l : z[p - 1] == l)) break;
            p--;
          }
        u ? _r(n, p, a, i + 1, s, u, o) : p < a && o.push(new Je(p, a, d)),
          (a = p);
      }
  }
  function Nr(n, e, t, i, s, r, o) {
    let l = e % 2 ? 2 : 1;
    Jd(n, s, r, i, l),
      ep(n, s, r, i, l),
      tp(s, r, i, l),
      _r(n, s, r, e, t, i, o);
  }
  function ip(n, e, t) {
    if (!n) return [new Je(0, 0, e == Vh ? 1 : 0)];
    if (e == Ni && !t.length && !Kd.test(n)) return _h(n.length);
    if (t.length) for (; n.length > z.length; ) z[z.length] = 256;
    let i = [],
      s = e == Ni ? 0 : 1;
    return Nr(n, s, s, t, 0, n.length, i), i;
  }
  function _h(n) {
    return [new Je(0, n, 0)];
  }
  var Nh = "";
  function np(n, e, t, i, s) {
    var r;
    let o = i.head - n.from,
      l = -1;
    if (o == 0) {
      if (!s || !n.length) return null;
      e[0].level != t && ((o = e[0].side(!1, t)), (l = 0));
    } else if (o == n.length) {
      if (s) return null;
      let u = e[e.length - 1];
      u.level != t && ((o = u.side(!0, t)), (l = e.length - 1));
    }
    l < 0 &&
      (l = Je.find(
        e,
        o,
        (r = i.bidiLevel) !== null && r !== void 0 ? r : -1,
        i.assoc
      ));
    let a = e[l];
    o == a.side(s, t) && ((a = e[(l += s ? 1 : -1)]), (o = a.side(!s, t)));
    let h = s == (a.dir == t),
      c = se(n.text, o, h);
    if (
      ((Nh = n.text.slice(Math.min(o, c), Math.max(o, c))),
      c > a.from && c < a.to)
    )
      return w.cursor(c + n.from, h ? -1 : 1, a.level);
    let f = l == (s ? e.length - 1 : 0) ? null : e[l + (s ? 1 : -1)];
    return !f && a.level != t
      ? w.cursor(s ? n.to : n.from, s ? -1 : 1, t)
      : f && f.level < a.level
      ? w.cursor(f.side(!s, t) + n.from, s ? 1 : -1, f.level)
      : w.cursor(c + n.from, s ? -1 : 1, a.level);
  }
  var Kn = class extends H {
    get length() {
      return this.view.state.doc.length;
    }
    constructor(e) {
      super(),
        (this.view = e),
        (this.decorations = []),
        (this.dynamicDecorationMap = []),
        (this.domChanged = null),
        (this.hasComposition = null),
        (this.markedForComposition = new Set()),
        (this.minWidth = 0),
        (this.minWidthFrom = 0),
        (this.minWidthTo = 0),
        (this.impreciseAnchor = null),
        (this.impreciseHead = null),
        (this.forceSelection = !1),
        (this.lastUpdate = Date.now()),
        this.setDOM(e.contentDOM),
        (this.children = [new he()]),
        this.children[0].setParent(this),
        this.updateDeco(),
        this.updateInner([new et(0, 0, 0, e.state.doc.length)], 0, null);
    }
    update(e) {
      var t;
      let i = e.changedRanges;
      this.minWidth > 0 &&
        i.length &&
        (i.every(
          ({ fromA: h, toA: c }) => c < this.minWidthFrom || h > this.minWidthTo
        )
          ? ((this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1)),
            (this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)))
          : (this.minWidth = this.minWidthFrom = this.minWidthTo = 0));
      let s = -1;
      this.view.inputState.composing >= 0 &&
        (!((t = this.domChanged) === null || t === void 0) && t.newSel
          ? (s = this.domChanged.newSel.head)
          : !cp(e.changes, this.hasComposition) &&
            !e.selectionSet &&
            (s = e.state.selection.main.head));
      let r = s > -1 ? rp(this.view, e.changes, s) : null;
      if (((this.domChanged = null), this.hasComposition)) {
        this.markedForComposition.clear();
        let { from: h, to: c } = this.hasComposition;
        i = new et(
          h,
          c,
          e.changes.mapPos(h, -1),
          e.changes.mapPos(c, 1)
        ).addToSet(i.slice());
      }
      (this.hasComposition = r
        ? { from: r.range.fromB, to: r.range.toB }
        : null),
        (A.ie || A.chrome) &&
          !r &&
          e &&
          e.state.doc.lines != e.startState.doc.lines &&
          (this.forceSelection = !0);
      let o = this.decorations,
        l = this.updateDeco(),
        a = ap(o, l, e.changes);
      return (
        (i = et.extendWithRanges(i, a)),
        !(this.flags & 7) && i.length == 0
          ? !1
          : (this.updateInner(i, e.startState.doc.length, r),
            e.transactions.length && (this.lastUpdate = Date.now()),
            !0)
      );
    }
    updateInner(e, t, i) {
      (this.view.viewState.mustMeasureContent = !0),
        this.updateChildren(e, t, i);
      let { observer: s } = this.view;
      s.ignore(() => {
        (this.dom.style.height =
          this.view.viewState.contentHeight / this.view.scaleY + "px"),
          (this.dom.style.flexBasis = this.minWidth
            ? this.minWidth + "px"
            : "");
        let o =
          A.chrome || A.ios
            ? { node: s.selectionRange.focusNode, written: !1 }
            : void 0;
        this.sync(this.view, o),
          (this.flags &= -8),
          o &&
            (o.written || s.selectionRange.focusNode != o.node) &&
            (this.forceSelection = !0),
          (this.dom.style.height = "");
      }),
        this.markedForComposition.forEach((o) => (o.flags &= -9));
      let r = [];
      if (
        this.view.viewport.from ||
        this.view.viewport.to < this.view.state.doc.length
      )
        for (let o of this.children)
          o instanceof ri && o.widget instanceof Jn && r.push(o.dom);
      s.updateGaps(r);
    }
    updateChildren(e, t, i) {
      let s = i ? i.range.addToSet(e.slice()) : e,
        r = this.childCursor(t);
      for (let o = s.length - 1; ; o--) {
        let l = o >= 0 ? s[o] : null;
        if (!l) break;
        let { fromA: a, toA: h, fromB: c, toB: f } = l,
          u,
          d,
          p,
          g;
        if (i && i.range.fromB < f && i.range.toB > c) {
          let P = Yi.build(
              this.view.state.doc,
              c,
              i.range.fromB,
              this.decorations,
              this.dynamicDecorationMap
            ),
            S = Yi.build(
              this.view.state.doc,
              i.range.toB,
              f,
              this.decorations,
              this.dynamicDecorationMap
            );
          (d = P.breakAtStart), (p = P.openStart), (g = S.openEnd);
          let C = this.compositionView(i);
          S.breakAtStart
            ? (C.breakAfter = 1)
            : S.content.length &&
              C.merge(C.length, C.length, S.content[0], !1, S.openStart, 0) &&
              ((C.breakAfter = S.content[0].breakAfter), S.content.shift()),
            P.content.length &&
              C.merge(
                0,
                0,
                P.content[P.content.length - 1],
                !0,
                0,
                P.openEnd
              ) &&
              P.content.pop(),
            (u = P.content.concat(C).concat(S.content));
        } else
          ({
            content: u,
            breakAtStart: d,
            openStart: p,
            openEnd: g,
          } = Yi.build(
            this.view.state.doc,
            c,
            f,
            this.decorations,
            this.dynamicDecorationMap
          ));
        let { i: m, off: b } = r.findPos(h, 1),
          { i: k, off: $ } = r.findPos(a, -1);
        xh(this, k, $, m, b, u, d, p, g);
      }
      i && this.fixCompositionDOM(i);
    }
    compositionView(e) {
      let t = new mt(e.text.nodeValue);
      t.flags |= 8;
      for (let { deco: s } of e.marks) t = new gt(s, [t], t.length);
      let i = new he();
      return i.append(t, 0), i;
    }
    fixCompositionDOM(e) {
      let t = (r, o) => {
          (o.flags |= 8 | (o.children.some((a) => a.flags & 7) ? 1 : 0)),
            this.markedForComposition.add(o);
          let l = H.get(r);
          l && l != o && (l.dom = null), o.setDOM(r);
        },
        i = this.childPos(e.range.fromB, 1),
        s = this.children[i.i];
      t(e.line, s);
      for (let r = e.marks.length - 1; r >= -1; r--)
        (i = s.childPos(i.off, 1)),
          (s = s.children[i.i]),
          t(r >= 0 ? e.marks[r].node : e.text, s);
    }
    updateSelection(e = !1, t = !1) {
      (e || !this.view.observer.selectionRange.focusNode) &&
        this.view.observer.readSelectionRange();
      let i = this.view.root.activeElement,
        s = i == this.dom,
        r =
          !s &&
          Bn(this.dom, this.view.observer.selectionRange) &&
          !(i && this.dom.contains(i));
      if (!(s || t || r)) return;
      let o = this.forceSelection;
      this.forceSelection = !1;
      let l = this.view.state.selection.main,
        a = this.moveToLine(this.domAtPos(l.anchor)),
        h = l.empty ? a : this.moveToLine(this.domAtPos(l.head));
      if (A.gecko && l.empty && !this.hasComposition && sp(a)) {
        let f = document.createTextNode("");
        this.view.observer.ignore(() =>
          a.node.insertBefore(f, a.node.childNodes[a.offset] || null)
        ),
          (a = h = new ge(f, 0)),
          (o = !0);
      }
      let c = this.view.observer.selectionRange;
      (o ||
        !c.focusNode ||
        !Gn(a.node, a.offset, c.anchorNode, c.anchorOffset) ||
        !Gn(h.node, h.offset, c.focusNode, c.focusOffset)) &&
        (this.view.observer.ignore(() => {
          A.android &&
            A.chrome &&
            this.dom.contains(c.focusNode) &&
            hp(c.focusNode, this.dom) &&
            (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
          let f = zn(this.view.root);
          if (f)
            if (l.empty) {
              if (A.gecko) {
                let u = op(a.node, a.offset);
                if (u && u != 3) {
                  let d = Gh(a.node, a.offset, u == 1 ? 1 : -1);
                  d && (a = new ge(d.node, d.offset));
                }
              }
              f.collapse(a.node, a.offset),
                l.bidiLevel != null &&
                  f.caretBidiLevel !== void 0 &&
                  (f.caretBidiLevel = l.bidiLevel);
            } else if (f.extend) {
              f.collapse(a.node, a.offset);
              try {
                f.extend(h.node, h.offset);
              } catch {}
            } else {
              let u = document.createRange();
              l.anchor > l.head && ([a, h] = [h, a]),
                u.setEnd(h.node, h.offset),
                u.setStart(a.node, a.offset),
                f.removeAllRanges(),
                f.addRange(u);
            }
          r &&
            this.view.root.activeElement == this.dom &&
            (this.dom.blur(), i && i.focus());
        }),
        this.view.observer.setSelectionRange(a, h)),
        (this.impreciseAnchor = a.precise
          ? null
          : new ge(c.anchorNode, c.anchorOffset)),
        (this.impreciseHead = h.precise
          ? null
          : new ge(c.focusNode, c.focusOffset));
    }
    enforceCursorAssoc() {
      if (this.hasComposition) return;
      let { view: e } = this,
        t = e.state.selection.main,
        i = zn(e.root),
        { anchorNode: s, anchorOffset: r } = e.observer.selectionRange;
      if (!i || !t.empty || !t.assoc || !i.modify) return;
      let o = he.find(this, t.head);
      if (!o) return;
      let l = o.posAtStart;
      if (t.head == l || t.head == l + o.length) return;
      let a = this.coordsAt(t.head, -1),
        h = this.coordsAt(t.head, 1);
      if (!a || !h || a.bottom > h.top) return;
      let c = this.domAtPos(t.head + t.assoc);
      i.collapse(c.node, c.offset),
        i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"),
        e.observer.readSelectionRange();
      let f = e.observer.selectionRange;
      e.docView.posFromDOM(f.anchorNode, f.anchorOffset) != t.from &&
        i.collapse(s, r);
    }
    moveToLine(e) {
      let t = this.dom,
        i;
      if (e.node != t) return e;
      for (let s = e.offset; !i && s < t.childNodes.length; s++) {
        let r = H.get(t.childNodes[s]);
        r instanceof he && (i = r.domAtPos(0));
      }
      for (let s = e.offset - 1; !i && s >= 0; s--) {
        let r = H.get(t.childNodes[s]);
        r instanceof he && (i = r.domAtPos(r.length));
      }
      return i ? new ge(i.node, i.offset, !0) : e;
    }
    nearest(e) {
      for (let t = e; t; ) {
        let i = H.get(t);
        if (i && i.rootView == this) return i;
        t = t.parentNode;
      }
      return null;
    }
    posFromDOM(e, t) {
      let i = this.nearest(e);
      if (!i)
        throw new RangeError(
          "Trying to find position for a DOM position outside of the document"
        );
      return i.localPosFromDOM(e, t) + i.posAtStart;
    }
    domAtPos(e) {
      let { i: t, off: i } = this.childCursor().findPos(e, -1);
      for (; t < this.children.length - 1; ) {
        let s = this.children[t];
        if (i < s.length || s instanceof he) break;
        t++, (i = 0);
      }
      return this.children[t].domAtPos(i);
    }
    coordsAt(e, t) {
      let i = null,
        s = 0;
      for (let r = this.length, o = this.children.length - 1; o >= 0; o--) {
        let l = this.children[o],
          a = r - l.breakAfter,
          h = a - l.length;
        if (a < e) break;
        h <= e &&
          (h < e || l.covers(-1)) &&
          (a > e || l.covers(1)) &&
          (!i || (l instanceof he && !(i instanceof he && t >= 0))) &&
          ((i = l), (s = h)),
          (r = h);
      }
      return i ? i.coordsAt(e - s, t) : null;
    }
    coordsForChar(e) {
      let { i: t, off: i } = this.childPos(e, 1),
        s = this.children[t];
      if (!(s instanceof he)) return null;
      for (; s.children.length; ) {
        let { i: l, off: a } = s.childPos(i, 1);
        for (; ; l++) {
          if (l == s.children.length) return null;
          if ((s = s.children[l]).length) break;
        }
        i = a;
      }
      if (!(s instanceof mt)) return null;
      let r = se(s.text, i);
      if (r == i) return null;
      let o = Wt(s.dom, i, r).getClientRects();
      for (let l = 0; l < o.length; l++) {
        let a = o[l];
        if (l == o.length - 1 || (a.top < a.bottom && a.left < a.right))
          return a;
      }
      return null;
    }
    measureVisibleLineHeights(e) {
      let t = [],
        { from: i, to: s } = e,
        r = this.view.contentDOM.clientWidth,
        o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1,
        l = -1,
        a = this.view.textDirection == U.LTR;
      for (let h = 0, c = 0; c < this.children.length; c++) {
        let f = this.children[c],
          u = h + f.length;
        if (u > s) break;
        if (h >= i) {
          let d = f.dom.getBoundingClientRect();
          if ((t.push(d.height), o)) {
            let p = f.dom.lastChild,
              g = p ? ji(p) : [];
            if (g.length) {
              let m = g[g.length - 1],
                b = a ? m.right - d.left : d.right - m.left;
              b > l &&
                ((l = b),
                (this.minWidth = r),
                (this.minWidthFrom = h),
                (this.minWidthTo = u));
            }
          }
        }
        h = u + f.breakAfter;
      }
      return t;
    }
    textDirectionAt(e) {
      let { i: t } = this.childPos(e, 1);
      return getComputedStyle(this.children[t].dom).direction == "rtl"
        ? U.RTL
        : U.LTR;
    }
    measureTextSize() {
      for (let r of this.children)
        if (r instanceof he) {
          let o = r.measureTextSize();
          if (o) return o;
        }
      let e = document.createElement("div"),
        t,
        i,
        s;
      return (
        (e.className = "cm-line"),
        (e.style.width = "99999px"),
        (e.style.position = "absolute"),
        (e.textContent = "abc def ghi jkl mno pqr stu"),
        this.view.observer.ignore(() => {
          this.dom.appendChild(e);
          let r = ji(e.firstChild)[0];
          (t = e.getBoundingClientRect().height),
            (i = r ? r.width / 27 : 7),
            (s = r ? r.height : t),
            e.remove();
        }),
        { lineHeight: t, charWidth: i, textHeight: s }
      );
    }
    childCursor(e = this.length) {
      let t = this.children.length;
      return t && (e -= this.children[--t].length), new Un(this.children, e, t);
    }
    computeBlockGapDeco() {
      let e = [],
        t = this.view.viewState;
      for (let i = 0, s = 0; ; s++) {
        let r = s == t.viewports.length ? null : t.viewports[s],
          o = r ? r.from - 1 : this.length;
        if (o > i) {
          let l =
            (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
          e.push(
            R.replace({
              widget: new Jn(l),
              block: !0,
              inclusive: !0,
              isBlockGap: !0,
            }).range(i, o)
          );
        }
        if (!r) break;
        i = r.to + 1;
      }
      return R.set(e);
    }
    updateDeco() {
      let e = this.view.state
        .facet(_i)
        .map((t, i) =>
          (this.dynamicDecorationMap[i] = typeof t == "function")
            ? t(this.view)
            : t
        );
      for (let t = e.length; t < e.length + 3; t++)
        this.dynamicDecorationMap[t] = !1;
      return (this.decorations = [
        ...e,
        this.computeBlockGapDeco(),
        this.view.viewState.lineGapDeco,
      ]);
    }
    scrollIntoView(e) {
      if (e.isSnapshot) {
        let h = this.view.viewState.lineBlockAt(e.range.head);
        (this.view.scrollDOM.scrollTop = h.top - e.yMargin),
          (this.view.scrollDOM.scrollLeft = e.xMargin);
        return;
      }
      let { range: t } = e,
        i = this.coordsAt(
          t.head,
          t.empty ? t.assoc : t.head > t.anchor ? -1 : 1
        ),
        s;
      if (!i) return;
      !t.empty &&
        (s = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) &&
        (i = {
          left: Math.min(i.left, s.left),
          top: Math.min(i.top, s.top),
          right: Math.max(i.right, s.right),
          bottom: Math.max(i.bottom, s.bottom),
        });
      let r = Bh(this.view),
        o = {
          left: i.left - r.left,
          top: i.top - r.top,
          right: i.right + r.right,
          bottom: i.bottom + r.bottom,
        },
        { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
      jd(
        this.view.scrollDOM,
        o,
        t.head < t.anchor ? -1 : 1,
        e.x,
        e.y,
        Math.max(Math.min(e.xMargin, l), -l),
        Math.max(Math.min(e.yMargin, a), -a),
        this.view.textDirection == U.LTR
      );
    }
  };
  function sp(n) {
    return (
      n.node.nodeType == 1 &&
      n.node.firstChild &&
      (n.offset == 0 ||
        n.node.childNodes[n.offset - 1].contentEditable == "false") &&
      (n.offset == n.node.childNodes.length ||
        n.node.childNodes[n.offset].contentEditable == "false")
    );
  }
  var Jn = class extends Qe {
    constructor(e) {
      super(), (this.height = e);
    }
    toDOM() {
      let e = document.createElement("div");
      return this.updateDOM(e), e;
    }
    eq(e) {
      return e.height == this.height;
    }
    updateDOM(e) {
      return (e.style.height = this.height + "px"), !0;
    }
    get estimatedHeight() {
      return this.height;
    }
  };
  function zh(n, e) {
    let t = n.observer.selectionRange,
      i = t.focusNode && Gh(t.focusNode, t.focusOffset, 0);
    if (!i) return null;
    let s = e - i.offset;
    return { from: s, to: s + i.node.nodeValue.length, node: i.node };
  }
  function rp(n, e, t) {
    let i = zh(n, t);
    if (!i) return null;
    let { node: s, from: r, to: o } = i,
      l = s.nodeValue;
    if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
      return null;
    let a = e.invertedDesc,
      h = new et(a.mapPos(r), a.mapPos(o), r, o),
      c = [];
    for (let f = s.parentNode; ; f = f.parentNode) {
      let u = H.get(f);
      if (u instanceof gt) c.push({ node: f, deco: u.mark });
      else {
        if (
          u instanceof he ||
          (f.nodeName == "DIV" && f.parentNode == n.contentDOM)
        )
          return { range: h, text: s, marks: c, line: f };
        if (f != n.contentDOM)
          c.push({
            node: f,
            deco: new Ii({
              inclusive: !0,
              attributes: Nd(f),
              tagName: f.tagName.toLowerCase(),
            }),
          });
        else return null;
      }
    }
  }
  function Gh(n, e, t) {
    if (t <= 0)
      for (let i = n, s = e; ; ) {
        if (i.nodeType == 3) return { node: i, offset: s };
        if (i.nodeType == 1 && s > 0) (i = i.childNodes[s - 1]), (s = ht(i));
        else break;
      }
    if (t >= 0)
      for (let i = n, s = e; ; ) {
        if (i.nodeType == 3) return { node: i, offset: s };
        if (i.nodeType == 1 && s < i.childNodes.length && t >= 0)
          (i = i.childNodes[s]), (s = 0);
        else break;
      }
    return null;
  }
  function op(n, e) {
    return n.nodeType != 1
      ? 0
      : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) |
          (e < n.childNodes.length && n.childNodes[e].contentEditable == "false"
            ? 2
            : 0);
  }
  var lp = class {
    constructor() {
      this.changes = [];
    }
    compareRange(e, t) {
      Vr(e, t, this.changes);
    }
    comparePoint(e, t) {
      Vr(e, t, this.changes);
    }
  };
  function ap(n, e, t) {
    let i = new lp();
    return I.compare(n, e, t, i), i.changes;
  }
  function hp(n, e) {
    for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
      if (t.nodeType == 1 && t.contentEditable == "false") return !0;
    return !1;
  }
  function cp(n, e) {
    let t = !1;
    return (
      e &&
        n.iterChangedRanges((i, s) => {
          i < e.to && s > e.from && (t = !0);
        }),
      t
    );
  }
  function fp(n, e, t = 1) {
    let i = n.charCategorizer(e),
      s = n.doc.lineAt(e),
      r = e - s.from;
    if (s.length == 0) return w.cursor(e);
    r == 0 ? (t = 1) : r == s.length && (t = -1);
    let o = r,
      l = r;
    t < 0 ? (o = se(s.text, r, !1)) : (l = se(s.text, r));
    let a = i(s.text.slice(o, l));
    for (; o > 0; ) {
      let h = se(s.text, o, !1);
      if (i(s.text.slice(h, o)) != a) break;
      o = h;
    }
    for (; l < s.length; ) {
      let h = se(s.text, l);
      if (i(s.text.slice(l, h)) != a) break;
      l = h;
    }
    return w.range(o + s.from, l + s.from);
  }
  function up(n, e) {
    return e.left > n ? e.left - n : Math.max(0, n - e.right);
  }
  function dp(n, e) {
    return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
  }
  function Cr(n, e) {
    return n.top < e.bottom - 1 && n.bottom > e.top + 1;
  }
  function qa(n, e) {
    return e < n.top
      ? { top: e, left: n.left, right: n.right, bottom: n.bottom }
      : n;
  }
  function Ba(n, e) {
    return e > n.bottom
      ? { top: n.top, left: n.left, right: n.right, bottom: e }
      : n;
  }
  function zr(n, e, t) {
    let i,
      s,
      r,
      o,
      l = !1,
      a,
      h,
      c,
      f;
    for (let p = n.firstChild; p; p = p.nextSibling) {
      let g = ji(p);
      for (let m = 0; m < g.length; m++) {
        let b = g[m];
        s && Cr(s, b) && (b = qa(Ba(b, s.bottom), s.top));
        let k = up(e, b),
          $ = dp(t, b);
        if (k == 0 && $ == 0)
          return p.nodeType == 3 ? Va(p, e, t) : zr(p, e, t);
        if (!i || o > $ || (o == $ && r > k)) {
          (i = p), (s = b), (r = k), (o = $);
          let P = $ ? (t < b.top ? -1 : 1) : k ? (e < b.left ? -1 : 1) : 0;
          l = !P || (P > 0 ? m < g.length - 1 : m > 0);
        }
        k == 0
          ? t > b.bottom && (!c || c.bottom < b.bottom)
            ? ((a = p), (c = b))
            : t < b.top && (!f || f.top > b.top) && ((h = p), (f = b))
          : c && Cr(c, b)
          ? (c = Ba(c, b.bottom))
          : f && Cr(f, b) && (f = qa(f, b.top));
      }
    }
    if (
      (c && c.bottom >= t
        ? ((i = a), (s = c))
        : f && f.top <= t && ((i = h), (s = f)),
      !i)
    )
      return { node: n, offset: 0 };
    let u = Math.max(s.left, Math.min(s.right, e));
    if (i.nodeType == 3) return Va(i, u, t);
    if (l && i.contentEditable != "false") return zr(i, u, t);
    let d =
      Array.prototype.indexOf.call(n.childNodes, i) +
      (e >= (s.left + s.right) / 2 ? 1 : 0);
    return { node: n, offset: d };
  }
  function Va(n, e, t) {
    let i = n.nodeValue.length,
      s = -1,
      r = 1e9,
      o = 0;
    for (let l = 0; l < i; l++) {
      let a = Wt(n, l, l + 1).getClientRects();
      for (let h = 0; h < a.length; h++) {
        let c = a[h];
        if (c.top == c.bottom) continue;
        o || (o = e - c.left);
        let f = (c.top > t ? c.top - t : t - c.bottom) - 1;
        if (c.left - 1 <= e && c.right + 1 >= e && f < r) {
          let u = e >= (c.left + c.right) / 2,
            d = u;
          if (
            ((A.chrome || A.gecko) &&
              Wt(n, l).getBoundingClientRect().left == c.right &&
              (d = !u),
            f <= 0)
          )
            return { node: n, offset: l + (d ? 1 : 0) };
          (s = l + (d ? 1 : 0)), (r = f);
        }
      }
    }
    return { node: n, offset: s > -1 ? s : o > 0 ? n.nodeValue.length : 0 };
  }
  function Uh(n, e, t, i = -1) {
    var s, r;
    let o = n.contentDOM.getBoundingClientRect(),
      l = o.top + n.viewState.paddingTop,
      a,
      { docHeight: h } = n.viewState,
      { x: c, y: f } = e,
      u = f - l;
    if (u < 0) return 0;
    if (u > h) return n.state.doc.length;
    for (
      let P = n.viewState.heightOracle.textHeight / 2, S = !1;
      (a = n.elementAtHeight(u)), a.type != ye.Text;

    )
      for (; (u = i > 0 ? a.bottom + P : a.top - P), !(u >= 0 && u <= h); ) {
        if (S) return t ? null : 0;
        (S = !0), (i = -i);
      }
    f = l + u;
    let d = a.from;
    if (d < n.viewport.from)
      return n.viewport.from == 0 ? 0 : t ? null : Ia(n, o, a, c, f);
    if (d > n.viewport.to)
      return n.viewport.to == n.state.doc.length
        ? n.state.doc.length
        : t
        ? null
        : Ia(n, o, a, c, f);
    let p = n.dom.ownerDocument,
      g = n.root.elementFromPoint ? n.root : p,
      m = g.elementFromPoint(c, f);
    m && !n.contentDOM.contains(m) && (m = null),
      m ||
        ((c = Math.max(o.left + 1, Math.min(o.right - 1, c))),
        (m = g.elementFromPoint(c, f)),
        m && !n.contentDOM.contains(m) && (m = null));
    let b,
      k = -1;
    if (
      m &&
      ((s = n.docView.nearest(m)) === null || s === void 0
        ? void 0
        : s.isEditable) != !1
    ) {
      if (p.caretPositionFromPoint) {
        let P = p.caretPositionFromPoint(c, f);
        P && ({ offsetNode: b, offset: k } = P);
      } else if (p.caretRangeFromPoint) {
        let P = p.caretRangeFromPoint(c, f);
        P &&
          (({ startContainer: b, startOffset: k } = P),
          (!n.contentDOM.contains(b) ||
            (A.safari && pp(b, k, c)) ||
            (A.chrome && Op(b, k, c))) &&
            (b = void 0));
      }
    }
    if (!b || !n.docView.dom.contains(b)) {
      let P = he.find(n.docView, d);
      if (!P) return u > a.top + a.height / 2 ? a.to : a.from;
      ({ node: b, offset: k } = zr(P.dom, c, f));
    }
    let $ = n.docView.nearest(b);
    if (!$) return null;
    if (
      $.isWidget &&
      ((r = $.dom) === null || r === void 0 ? void 0 : r.nodeType) == 1
    ) {
      let P = $.dom.getBoundingClientRect();
      return e.y < P.top || (e.y <= P.bottom && e.x <= (P.left + P.right) / 2)
        ? $.posAtStart
        : $.posAtEnd;
    } else return $.localPosFromDOM(b, k) + $.posAtStart;
  }
  function Ia(n, e, t, i, s) {
    let r = Math.round((i - e.left) * n.defaultCharacterWidth);
    if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
      let l = n.viewState.heightOracle.textHeight,
        a = Math.floor((s - t.top - (n.defaultLineHeight - l) * 0.5) / l);
      r += a * n.viewState.heightOracle.lineLength;
    }
    let o = n.state.sliceDoc(t.from, t.to);
    return t.from + Tn(o, r, n.state.tabSize);
  }
  function pp(n, e, t) {
    let i;
    if (n.nodeType != 3 || e != (i = n.nodeValue.length)) return !1;
    for (let s = n.nextSibling; s; s = s.nextSibling)
      if (s.nodeType != 1 || s.nodeName != "BR") return !1;
    return Wt(n, i - 1, i).getBoundingClientRect().left > t;
  }
  function Op(n, e, t) {
    if (e != 0) return !1;
    for (let s = n; ; ) {
      let r = s.parentNode;
      if (!r || r.nodeType != 1 || r.firstChild != s) return !1;
      if (r.classList.contains("cm-line")) break;
      s = r;
    }
    let i =
      n.nodeType == 1
        ? n.getBoundingClientRect()
        : Wt(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
    return t - i.left > 5;
  }
  function Gr(n, e) {
    let t = n.lineBlockAt(e);
    if (Array.isArray(t.type)) {
      for (let i of t.type)
        if (i.to > e || (i.to == e && (i.to == t.to || i.type == ye.Text)))
          return i;
    }
    return t;
  }
  function mp(n, e, t, i) {
    let s = Gr(n, e.head),
      r =
        !i || s.type != ye.Text || !(n.lineWrapping || s.widgetLineBreaks)
          ? null
          : n.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head);
    if (r) {
      let o = n.dom.getBoundingClientRect(),
        l = n.textDirectionAt(s.from),
        a = n.posAtCoords({
          x: t == (l == U.LTR) ? o.right - 1 : o.left + 1,
          y: (r.top + r.bottom) / 2,
        });
      if (a != null) return w.cursor(a, t ? -1 : 1);
    }
    return w.cursor(t ? s.to : s.from, t ? -1 : 1);
  }
  function La(n, e, t, i) {
    let s = n.state.doc.lineAt(e.head),
      r = n.bidiSpans(s),
      o = n.textDirectionAt(s.from);
    for (let l = e, a = null; ; ) {
      let h = np(s, r, o, l, t),
        c = Nh;
      if (!h) {
        if (s.number == (t ? n.state.doc.lines : 1)) return l;
        (c = `
`),
          (s = n.state.doc.line(s.number + (t ? 1 : -1))),
          (r = n.bidiSpans(s)),
          (h = w.cursor(t ? s.from : s.to));
      }
      if (a) {
        if (!a(c)) return l;
      } else {
        if (!i) return h;
        a = i(c);
      }
      l = h;
    }
  }
  function gp(n, e, t) {
    let i = n.state.charCategorizer(e),
      s = i(t);
    return (r) => {
      let o = i(r);
      return s == _.Space && (s = o), s == o;
    };
  }
  function yp(n, e, t, i) {
    let s = e.head,
      r = t ? 1 : -1;
    if (s == (t ? n.state.doc.length : 0)) return w.cursor(s, e.assoc);
    let o = e.goalColumn,
      l,
      a = n.contentDOM.getBoundingClientRect(),
      h = n.coordsAtPos(s, e.assoc || -1),
      c = n.documentTop;
    if (h) o == null && (o = h.left - a.left), (l = r < 0 ? h.top : h.bottom);
    else {
      let d = n.viewState.lineBlockAt(s);
      o == null &&
        (o = Math.min(
          a.right - a.left,
          n.defaultCharacterWidth * (s - d.from)
        )),
        (l = (r < 0 ? d.top : d.bottom) + c);
    }
    let f = a.left + o,
      u = i ?? n.viewState.heightOracle.textHeight >> 1;
    for (let d = 0; ; d += 10) {
      let p = l + (u + d) * r,
        g = Uh(n, { x: f, y: p }, !1, r);
      if (p < a.top || p > a.bottom || (r < 0 ? g < s : g > s)) {
        let m = n.docView.coordsForChar(g),
          b = !m || p < m.top ? -1 : 1;
        return w.cursor(g, b, void 0, o);
      }
    }
  }
  function Vn(n, e, t) {
    for (;;) {
      let i = 0;
      for (let s of n)
        s.between(e - 1, e + 1, (r, o, l) => {
          if (e > r && e < o) {
            let a = i || t || (e - r < o - e ? -1 : 1);
            (e = a < 0 ? r : o), (i = a);
          }
        });
      if (!i) return e;
    }
  }
  function Tr(n, e, t) {
    let i = Vn(
      n.state.facet($o).map((s) => s(n)),
      t.from,
      e.head > t.from ? -1 : 1
    );
    return i == t.from ? t : w.cursor(i, i < t.from ? 1 : -1);
  }
  var Ur = class {
    setSelectionOrigin(e) {
      (this.lastSelectionOrigin = e), (this.lastSelectionTime = Date.now());
    }
    constructor(e) {
      (this.view = e),
        (this.lastKeyCode = 0),
        (this.lastKeyTime = 0),
        (this.lastTouchTime = 0),
        (this.lastFocusTime = 0),
        (this.lastScrollTop = 0),
        (this.lastScrollLeft = 0),
        (this.pendingIOSKey = void 0),
        (this.lastSelectionOrigin = null),
        (this.lastSelectionTime = 0),
        (this.lastEscPress = 0),
        (this.lastContextMenu = 0),
        (this.scrollHandlers = []),
        (this.handlers = Object.create(null)),
        (this.composing = -1),
        (this.compositionFirstChange = null),
        (this.compositionEndedAt = 0),
        (this.compositionPendingKey = !1),
        (this.compositionPendingChange = !1),
        (this.mouseSelection = null),
        (this.draggedContent = null),
        (this.handleEvent = this.handleEvent.bind(this)),
        (this.notifiedFocused = e.hasFocus),
        A.safari && e.contentDOM.addEventListener("input", () => null),
        A.gecko && Yp(e.contentDOM.ownerDocument);
    }
    handleEvent(e) {
      !vp(this.view, e) ||
        this.ignoreDuringComposition(e) ||
        (e.type == "keydown" && this.keydown(e)) ||
        this.runHandlers(e.type, e);
    }
    runHandlers(e, t) {
      let i = this.handlers[e];
      if (i) {
        for (let s of i.observers) s(this.view, t);
        for (let s of i.handlers) {
          if (t.defaultPrevented) break;
          if (s(this.view, t)) {
            t.preventDefault();
            break;
          }
        }
      }
    }
    ensureHandlers(e) {
      let t = bp(e),
        i = this.handlers,
        s = this.view.contentDOM;
      for (let r in t)
        if (r != "scroll") {
          let o = !t[r].handlers.length,
            l = i[r];
          l &&
            o != !l.handlers.length &&
            (s.removeEventListener(r, this.handleEvent), (l = null)),
            l || s.addEventListener(r, this.handleEvent, { passive: o });
        }
      for (let r in i)
        r != "scroll" && !t[r] && s.removeEventListener(r, this.handleEvent);
      this.handlers = t;
    }
    keydown(e) {
      if (
        ((this.lastKeyCode = e.keyCode),
        (this.lastKeyTime = Date.now()),
        e.keyCode == 9 && Date.now() < this.lastEscPress + 2e3)
      )
        return !0;
      if (
        (e.keyCode != 27 &&
          Hh.indexOf(e.keyCode) < 0 &&
          (this.view.inputState.lastEscPress = 0),
        A.android &&
          A.chrome &&
          !e.synthetic &&
          (e.keyCode == 13 || e.keyCode == 8))
      )
        return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
      let t;
      return A.ios &&
        !e.synthetic &&
        !e.altKey &&
        !e.metaKey &&
        (((t = Fh.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey) ||
          (wp.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey))
        ? ((this.pendingIOSKey = t || e),
          setTimeout(() => this.flushIOSKey(), 250),
          !0)
        : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
    }
    flushIOSKey() {
      let e = this.pendingIOSKey;
      return e
        ? ((this.pendingIOSKey = void 0),
          si(this.view.contentDOM, e.key, e.keyCode))
        : !1;
    }
    ignoreDuringComposition(e) {
      return /^key/.test(e.type)
        ? this.composing > 0
          ? !0
          : A.safari &&
            !A.ios &&
            this.compositionPendingKey &&
            Date.now() - this.compositionEndedAt < 100
          ? ((this.compositionPendingKey = !1), !0)
          : !1
        : !1;
    }
    startMouseSelection(e) {
      this.mouseSelection && this.mouseSelection.destroy(),
        (this.mouseSelection = e);
    }
    update(e) {
      this.mouseSelection && this.mouseSelection.update(e),
        this.draggedContent &&
          e.docChanged &&
          (this.draggedContent = this.draggedContent.map(e.changes)),
        e.transactions.length &&
          (this.lastKeyCode = this.lastSelectionTime = 0);
    }
    destroy() {
      this.mouseSelection && this.mouseSelection.destroy();
    }
  };
  function _a(n, e) {
    return (t, i) => {
      try {
        return e.call(n, i, t);
      } catch (s) {
        be(t.state, s);
      }
    };
  }
  function bp(n) {
    let e = Object.create(null);
    function t(i) {
      return e[i] || (e[i] = { observers: [], handlers: [] });
    }
    for (let i of n) {
      let s = i.spec;
      if (s && s.domEventHandlers)
        for (let r in s.domEventHandlers) {
          let o = s.domEventHandlers[r];
          o && t(r).handlers.push(_a(i.value, o));
        }
      if (s && s.domEventObservers)
        for (let r in s.domEventObservers) {
          let o = s.domEventObservers[r];
          o && t(r).observers.push(_a(i.value, o));
        }
    }
    for (let i in _e) t(i).handlers.push(_e[i]);
    for (let i in Ne) t(i).observers.push(Ne[i]);
    return e;
  }
  var Fh = [
      { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
      { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
      { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
      { key: "Delete", keyCode: 46, inputType: "deleteContentForward" },
    ],
    wp = "dthko",
    Hh = [16, 17, 18, 20, 91, 92, 224, 225],
    Wn = 6;
  function Xn(n) {
    return Math.max(0, n) * 0.7 + 8;
  }
  function Sp(n, e) {
    return Math.max(
      Math.abs(n.clientX - e.clientX),
      Math.abs(n.clientY - e.clientY)
    );
  }
  var Fr = class {
    constructor(e, t, i, s) {
      (this.view = e),
        (this.startEvent = t),
        (this.style = i),
        (this.mustSelect = s),
        (this.scrollSpeed = { x: 0, y: 0 }),
        (this.scrolling = -1),
        (this.lastEvent = t),
        (this.scrollParent = qd(e.contentDOM)),
        (this.atoms = e.state.facet($o).map((o) => o(e)));
      let r = e.contentDOM.ownerDocument;
      r.addEventListener("mousemove", (this.move = this.move.bind(this))),
        r.addEventListener("mouseup", (this.up = this.up.bind(this))),
        (this.extend = t.shiftKey),
        (this.multiple = e.state.facet(V.allowMultipleSelections) && xp(e, t)),
        (this.dragging = Qp(e, t) && tc(t) == 1 ? null : !1);
    }
    start(e) {
      this.dragging === !1 && this.select(e);
    }
    move(e) {
      var t;
      if (e.buttons == 0) return this.destroy();
      if (
        this.dragging ||
        (this.dragging == null && Sp(this.startEvent, e) < 10)
      )
        return;
      this.select((this.lastEvent = e));
      let i = 0,
        s = 0,
        r = ((t = this.scrollParent) === null || t === void 0
          ? void 0
          : t.getBoundingClientRect()) || {
          left: 0,
          top: 0,
          right: this.view.win.innerWidth,
          bottom: this.view.win.innerHeight,
        },
        o = Bh(this.view);
      e.clientX - o.left <= r.left + Wn
        ? (i = -Xn(r.left - e.clientX))
        : e.clientX + o.right >= r.right - Wn && (i = Xn(e.clientX - r.right)),
        e.clientY - o.top <= r.top + Wn
          ? (s = -Xn(r.top - e.clientY))
          : e.clientY + o.bottom >= r.bottom - Wn &&
            (s = Xn(e.clientY - r.bottom)),
        this.setScrollSpeed(i, s);
    }
    up(e) {
      this.dragging == null && this.select(this.lastEvent),
        this.dragging || e.preventDefault(),
        this.destroy();
    }
    destroy() {
      this.setScrollSpeed(0, 0);
      let e = this.view.contentDOM.ownerDocument;
      e.removeEventListener("mousemove", this.move),
        e.removeEventListener("mouseup", this.up),
        (this.view.inputState.mouseSelection =
          this.view.inputState.draggedContent =
            null);
    }
    setScrollSpeed(e, t) {
      (this.scrollSpeed = { x: e, y: t }),
        e || t
          ? this.scrolling < 0 &&
            (this.scrolling = setInterval(() => this.scroll(), 50))
          : this.scrolling > -1 &&
            (clearInterval(this.scrolling), (this.scrolling = -1));
    }
    scroll() {
      this.scrollParent
        ? ((this.scrollParent.scrollLeft += this.scrollSpeed.x),
          (this.scrollParent.scrollTop += this.scrollSpeed.y))
        : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y),
        this.dragging === !1 && this.select(this.lastEvent);
    }
    skipAtoms(e) {
      let t = null;
      for (let i = 0; i < e.ranges.length; i++) {
        let s = e.ranges[i],
          r = null;
        if (s.empty) {
          let o = Vn(this.atoms, s.from, 0);
          o != s.from && (r = w.cursor(o, -1));
        } else {
          let o = Vn(this.atoms, s.from, -1),
            l = Vn(this.atoms, s.to, 1);
          (o != s.from || l != s.to) &&
            (r = w.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
        }
        r && (t || (t = e.ranges.slice()), (t[i] = r));
      }
      return t ? w.create(t, e.mainIndex) : e;
    }
    select(e) {
      let { view: t } = this,
        i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
      (this.mustSelect ||
        !i.eq(t.state.selection) ||
        (i.main.assoc != t.state.selection.main.assoc &&
          this.dragging === !1)) &&
        this.view.dispatch({ selection: i, userEvent: "select.pointer" }),
        (this.mustSelect = !1);
    }
    update(e) {
      this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
    }
  };
  function xp(n, e) {
    let t = n.state.facet(Th);
    return t.length ? t[0](e) : A.mac ? e.metaKey : e.ctrlKey;
  }
  function kp(n, e) {
    let t = n.state.facet(Ah);
    return t.length ? t[0](e) : A.mac ? !e.altKey : !e.ctrlKey;
  }
  function Qp(n, e) {
    let { main: t } = n.state.selection;
    if (t.empty) return !1;
    let i = zn(n.root);
    if (!i || i.rangeCount == 0) return !0;
    let s = i.getRangeAt(0).getClientRects();
    for (let r = 0; r < s.length; r++) {
      let o = s[r];
      if (
        o.left <= e.clientX &&
        o.right >= e.clientX &&
        o.top <= e.clientY &&
        o.bottom >= e.clientY
      )
        return !0;
    }
    return !1;
  }
  function vp(n, e) {
    if (!e.bubbles) return !0;
    if (e.defaultPrevented) return !1;
    for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
      if (!t || t.nodeType == 11 || ((i = H.get(t)) && i.ignoreEvent(e)))
        return !1;
    return !0;
  }
  var _e = Object.create(null),
    Ne = Object.create(null),
    Kh = (A.ie && A.ie_version < 15) || (A.ios && A.webkit_version < 604);
  function Pp(n) {
    let e = n.dom.parentNode;
    if (!e) return;
    let t = e.appendChild(document.createElement("textarea"));
    (t.style.cssText = "position: fixed; left: -10000px; top: 10px"),
      t.focus(),
      setTimeout(() => {
        n.focus(), t.remove(), Jh(n, t.value);
      }, 50);
  }
  function Jh(n, e) {
    let { state: t } = n,
      i,
      s = 1,
      r = t.toText(e),
      o = r.lines == t.selection.ranges.length;
    if (
      Hr != null &&
      t.selection.ranges.every((a) => a.empty) &&
      Hr == r.toString()
    ) {
      let a = -1;
      i = t.changeByRange((h) => {
        let c = t.doc.lineAt(h.from);
        if (c.from == a) return { range: h };
        a = c.from;
        let f = t.toText((o ? r.line(s++).text : e) + t.lineBreak);
        return {
          changes: { from: c.from, insert: f },
          range: w.cursor(h.from + f.length),
        };
      });
    } else
      o
        ? (i = t.changeByRange((a) => {
            let h = r.line(s++);
            return {
              changes: { from: a.from, to: a.to, insert: h.text },
              range: w.cursor(a.from + h.length),
            };
          }))
        : (i = t.replaceSelection(r));
    n.dispatch(i, { userEvent: "input.paste", scrollIntoView: !0 });
  }
  Ne.scroll = (n) => {
    (n.inputState.lastScrollTop = n.scrollDOM.scrollTop),
      (n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft);
  };
  _e.keydown = (n, e) => (
    n.inputState.setSelectionOrigin("select"),
    e.keyCode == 27 && (n.inputState.lastEscPress = Date.now()),
    !1
  );
  Ne.touchstart = (n, e) => {
    (n.inputState.lastTouchTime = Date.now()),
      n.inputState.setSelectionOrigin("select.pointer");
  };
  Ne.touchmove = (n) => {
    n.inputState.setSelectionOrigin("select.pointer");
  };
  _e.mousedown = (n, e) => {
    if ((n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3))
      return !1;
    let t = null;
    for (let i of n.state.facet(Rh)) if (((t = i(n, e)), t)) break;
    if ((!t && e.button == 0 && (t = Cp(n, e)), t)) {
      let i = !n.hasFocus;
      n.inputState.startMouseSelection(new Fr(n, e, t, i)),
        i && n.observer.ignore(() => bh(n.contentDOM));
      let s = n.inputState.mouseSelection;
      if (s) return s.start(e), s.dragging === !1;
    }
    return !1;
  };
  function Na(n, e, t, i) {
    if (i == 1) return w.cursor(e, t);
    if (i == 2) return fp(n.state, e, t);
    {
      let s = he.find(n.docView, e),
        r = n.state.doc.lineAt(s ? s.posAtEnd : e),
        o = s ? s.posAtStart : r.from,
        l = s ? s.posAtEnd : r.to;
      return l < n.state.doc.length && l == r.to && l++, w.range(o, l);
    }
  }
  var ec = (n, e) => n >= e.top && n <= e.bottom,
    za = (n, e, t) => ec(e, t) && n >= t.left && n <= t.right;
  function $p(n, e, t, i) {
    let s = he.find(n.docView, e);
    if (!s) return 1;
    let r = e - s.posAtStart;
    if (r == 0) return 1;
    if (r == s.length) return -1;
    let o = s.coordsAt(r, -1);
    if (o && za(t, i, o)) return -1;
    let l = s.coordsAt(r, 1);
    return l && za(t, i, l) ? 1 : o && ec(i, o) ? -1 : 1;
  }
  function Ga(n, e) {
    let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
    return { pos: t, bias: $p(n, t, e.clientX, e.clientY) };
  }
  var Zp = A.ie && A.ie_version <= 11,
    Ua = null,
    Fa = 0,
    Ha = 0;
  function tc(n) {
    if (!Zp) return n.detail;
    let e = Ua,
      t = Ha;
    return (
      (Ua = n),
      (Ha = Date.now()),
      (Fa =
        !e ||
        (t > Date.now() - 400 &&
          Math.abs(e.clientX - n.clientX) < 2 &&
          Math.abs(e.clientY - n.clientY) < 2)
          ? (Fa + 1) % 3
          : 1)
    );
  }
  function Cp(n, e) {
    let t = Ga(n, e),
      i = tc(e),
      s = n.state.selection;
    return {
      update(r) {
        r.docChanged &&
          ((t.pos = r.changes.mapPos(t.pos)), (s = s.map(r.changes)));
      },
      get(r, o, l) {
        let a = Ga(n, r),
          h,
          c = Na(n, a.pos, a.bias, i);
        if (t.pos != a.pos && !o) {
          let f = Na(n, t.pos, t.bias, i),
            u = Math.min(f.from, c.from),
            d = Math.max(f.to, c.to);
          c = u < c.from ? w.range(u, d) : w.range(d, u);
        }
        return o
          ? s.replaceRange(s.main.extend(c.from, c.to))
          : l && i == 1 && s.ranges.length > 1 && (h = Tp(s, a.pos))
          ? h
          : l
          ? s.addRange(c)
          : w.create([c]);
      },
    };
  }
  function Tp(n, e) {
    for (let t = 0; t < n.ranges.length; t++) {
      let { from: i, to: s } = n.ranges[t];
      if (i <= e && s >= e)
        return w.create(
          n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)),
          n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0)
        );
    }
    return null;
  }
  _e.dragstart = (n, e) => {
    let {
      selection: { main: t },
    } = n.state;
    if (e.target.draggable) {
      let s = n.docView.nearest(e.target);
      if (s && s.isWidget) {
        let r = s.posAtStart,
          o = r + s.length;
        (r >= t.to || o <= t.from) && (t = w.range(r, o));
      }
    }
    let { inputState: i } = n;
    return (
      i.mouseSelection && (i.mouseSelection.dragging = !0),
      (i.draggedContent = t),
      e.dataTransfer &&
        (e.dataTransfer.setData("Text", n.state.sliceDoc(t.from, t.to)),
        (e.dataTransfer.effectAllowed = "copyMove")),
      !1
    );
  };
  _e.dragend = (n) => ((n.inputState.draggedContent = null), !1);
  function Ka(n, e, t, i) {
    if (!t) return;
    let s = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1),
      { draggedContent: r } = n.inputState,
      o = i && r && kp(n, e) ? { from: r.from, to: r.to } : null,
      l = { from: s, insert: t },
      a = n.state.changes(o ? [o, l] : l);
    n.focus(),
      n.dispatch({
        changes: a,
        selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
        userEvent: o ? "move.drop" : "input.drop",
      }),
      (n.inputState.draggedContent = null);
  }
  _e.drop = (n, e) => {
    if (!e.dataTransfer) return !1;
    if (n.state.readOnly) return !0;
    let t = e.dataTransfer.files;
    if (t && t.length) {
      let i = Array(t.length),
        s = 0,
        r = () => {
          ++s == t.length &&
            Ka(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
        };
      for (let o = 0; o < t.length; o++) {
        let l = new FileReader();
        (l.onerror = r),
          (l.onload = () => {
            /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
          }),
          l.readAsText(t[o]);
      }
      return !0;
    } else {
      let i = e.dataTransfer.getData("Text");
      if (i) return Ka(n, e, i, !0), !0;
    }
    return !1;
  };
  _e.paste = (n, e) => {
    if (n.state.readOnly) return !0;
    n.observer.flush();
    let t = Kh ? null : e.clipboardData;
    return t
      ? (Jh(n, t.getData("text/plain") || t.getData("text/uri-text")), !0)
      : (Pp(n), !1);
  };
  function Ap(n, e) {
    let t = n.dom.parentNode;
    if (!t) return;
    let i = t.appendChild(document.createElement("textarea"));
    (i.style.cssText = "position: fixed; left: -10000px; top: 10px"),
      (i.value = e),
      i.focus(),
      (i.selectionEnd = e.length),
      (i.selectionStart = 0),
      setTimeout(() => {
        i.remove(), n.focus();
      }, 50);
  }
  function Rp(n) {
    let e = [],
      t = [],
      i = !1;
    for (let s of n.selection.ranges)
      s.empty || (e.push(n.sliceDoc(s.from, s.to)), t.push(s));
    if (!e.length) {
      let s = -1;
      for (let { from: r } of n.selection.ranges) {
        let o = n.doc.lineAt(r);
        o.number > s &&
          (e.push(o.text),
          t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })),
          (s = o.number);
      }
      i = !0;
    }
    return { text: e.join(n.lineBreak), ranges: t, linewise: i };
  }
  var Hr = null;
  _e.copy = _e.cut = (n, e) => {
    let { text: t, ranges: i, linewise: s } = Rp(n.state);
    if (!t && !s) return !1;
    (Hr = s ? t : null),
      e.type == "cut" &&
        !n.state.readOnly &&
        n.dispatch({ changes: i, scrollIntoView: !0, userEvent: "delete.cut" });
    let r = Kh ? null : e.clipboardData;
    return r ? (r.clearData(), r.setData("text/plain", t), !0) : (Ap(n, t), !1);
  };
  var ic = ke.define();
  function nc(n, e) {
    let t = [];
    for (let i of n.facet(Xh)) {
      let s = i(n, e);
      s && t.push(s);
    }
    return t ? n.update({ effects: t, annotations: ic.of(!0) }) : null;
  }
  function sc(n) {
    setTimeout(() => {
      let e = n.hasFocus;
      if (e != n.inputState.notifiedFocused) {
        let t = nc(n.state, e);
        t ? n.dispatch(t) : n.update([]);
      }
    }, 10);
  }
  Ne.focus = (n) => {
    (n.inputState.lastFocusTime = Date.now()),
      !n.scrollDOM.scrollTop &&
        (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) &&
        ((n.scrollDOM.scrollTop = n.inputState.lastScrollTop),
        (n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft)),
      sc(n);
  };
  Ne.blur = (n) => {
    n.observer.clearSelectionRange(), sc(n);
  };
  Ne.compositionstart = Ne.compositionupdate = (n) => {
    n.inputState.compositionFirstChange == null &&
      (n.inputState.compositionFirstChange = !0),
      n.inputState.composing < 0 && (n.inputState.composing = 0);
  };
  Ne.compositionend = (n) => {
    (n.inputState.composing = -1),
      (n.inputState.compositionEndedAt = Date.now()),
      (n.inputState.compositionPendingKey = !0),
      (n.inputState.compositionPendingChange =
        n.observer.pendingRecords().length > 0),
      (n.inputState.compositionFirstChange = null),
      A.chrome && A.android
        ? n.observer.flushSoon()
        : n.inputState.compositionPendingChange
        ? Promise.resolve().then(() => n.observer.flush())
        : setTimeout(() => {
            n.inputState.composing < 0 &&
              n.docView.hasComposition &&
              n.update([]);
          }, 50);
  };
  Ne.contextmenu = (n) => {
    n.inputState.lastContextMenu = Date.now();
  };
  _e.beforeinput = (n, e) => {
    var t;
    let i;
    if (
      A.chrome &&
      A.android &&
      (i = Fh.find((s) => s.inputType == e.inputType)) &&
      (n.observer.delayAndroidKey(i.key, i.keyCode),
      i.key == "Backspace" || i.key == "Delete")
    ) {
      let s =
        ((t = window.visualViewport) === null || t === void 0
          ? void 0
          : t.height) || 0;
      setTimeout(() => {
        var r;
        (((r = window.visualViewport) === null || r === void 0
          ? void 0
          : r.height) || 0) >
          s + 10 &&
          n.hasFocus &&
          (n.contentDOM.blur(), n.focus());
      }, 100);
    }
    return !1;
  };
  var Ja = new Set();
  function Yp(n) {
    Ja.has(n) ||
      (Ja.add(n),
      n.addEventListener("copy", () => {}),
      n.addEventListener("cut", () => {}));
  }
  var eh = ["pre-wrap", "normal", "pre-line", "break-spaces"],
    Kr = class {
      constructor(e) {
        (this.lineWrapping = e),
          (this.doc = j.empty),
          (this.heightSamples = {}),
          (this.lineHeight = 14),
          (this.charWidth = 7),
          (this.textHeight = 14),
          (this.lineLength = 30),
          (this.heightChanged = !1);
      }
      heightForGap(e, t) {
        let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
        return (
          this.lineWrapping &&
            (i += Math.max(
              0,
              Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength)
            )),
          this.lineHeight * i
        );
      }
      heightForLine(e) {
        return this.lineWrapping
          ? (1 +
              Math.max(
                0,
                Math.ceil((e - this.lineLength) / (this.lineLength - 5))
              )) *
              this.lineHeight
          : this.lineHeight;
      }
      setDoc(e) {
        return (this.doc = e), this;
      }
      mustRefreshForWrapping(e) {
        return eh.indexOf(e) > -1 != this.lineWrapping;
      }
      mustRefreshForHeights(e) {
        let t = !1;
        for (let i = 0; i < e.length; i++) {
          let s = e[i];
          s < 0
            ? i++
            : this.heightSamples[Math.floor(s * 10)] ||
              ((t = !0), (this.heightSamples[Math.floor(s * 10)] = !0));
        }
        return t;
      }
      refresh(e, t, i, s, r, o) {
        let l = eh.indexOf(e) > -1,
          a =
            Math.round(t) != Math.round(this.lineHeight) ||
            this.lineWrapping != l;
        if (
          ((this.lineWrapping = l),
          (this.lineHeight = t),
          (this.charWidth = i),
          (this.textHeight = s),
          (this.lineLength = r),
          a)
        ) {
          this.heightSamples = {};
          for (let h = 0; h < o.length; h++) {
            let c = o[h];
            c < 0 ? h++ : (this.heightSamples[Math.floor(c * 10)] = !0);
          }
        }
        return a;
      }
    },
    Jr = class {
      constructor(e, t) {
        (this.from = e), (this.heights = t), (this.index = 0);
      }
      get more() {
        return this.index < this.heights.length;
      }
    },
    Ke = class n {
      constructor(e, t, i, s, r) {
        (this.from = e),
          (this.length = t),
          (this.top = i),
          (this.height = s),
          (this._content = r);
      }
      get type() {
        return typeof this._content == "number"
          ? ye.Text
          : Array.isArray(this._content)
          ? this._content
          : this._content.type;
      }
      get to() {
        return this.from + this.length;
      }
      get bottom() {
        return this.top + this.height;
      }
      get widget() {
        return this._content instanceof yt ? this._content.widget : null;
      }
      get widgetLineBreaks() {
        return typeof this._content == "number" ? this._content : 0;
      }
      join(e) {
        let t = (Array.isArray(this._content) ? this._content : [this]).concat(
          Array.isArray(e._content) ? e._content : [e]
        );
        return new n(
          this.from,
          this.length + e.length,
          this.top,
          this.height + e.height,
          t
        );
      }
    },
    G = (function (n) {
      return (
        (n[(n.ByPos = 0)] = "ByPos"),
        (n[(n.ByHeight = 1)] = "ByHeight"),
        (n[(n.ByPosNoHeight = 2)] = "ByPosNoHeight"),
        n
      );
    })(G || (G = {})),
    In = 0.001,
    Ze = class n {
      constructor(e, t, i = 2) {
        (this.length = e), (this.height = t), (this.flags = i);
      }
      get outdated() {
        return (this.flags & 2) > 0;
      }
      set outdated(e) {
        this.flags = (e ? 2 : 0) | (this.flags & -3);
      }
      setHeight(e, t) {
        this.height != t &&
          (Math.abs(this.height - t) > In && (e.heightChanged = !0),
          (this.height = t));
      }
      replace(e, t, i) {
        return n.of(i);
      }
      decomposeLeft(e, t) {
        t.push(this);
      }
      decomposeRight(e, t) {
        t.push(this);
      }
      applyChanges(e, t, i, s) {
        let r = this,
          o = i.doc;
        for (let l = s.length - 1; l >= 0; l--) {
          let { fromA: a, toA: h, fromB: c, toB: f } = s[l],
            u = r.lineAt(a, G.ByPosNoHeight, i.setDoc(t), 0, 0),
            d = u.to >= h ? u : r.lineAt(h, G.ByPosNoHeight, i, 0, 0);
          for (f += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
            (a = s[l - 1].fromA),
              (c = s[l - 1].fromB),
              l--,
              a < u.from && (u = r.lineAt(a, G.ByPosNoHeight, i, 0, 0));
          (c += u.from - a), (a = u.from);
          let p = to.build(i.setDoc(o), e, c, f);
          r = r.replace(a, h, p);
        }
        return r.updateHeight(i, 0);
      }
      static empty() {
        return new De(0, 0);
      }
      static of(e) {
        if (e.length == 1) return e[0];
        let t = 0,
          i = e.length,
          s = 0,
          r = 0;
        for (;;)
          if (t == i)
            if (s > r * 2) {
              let l = e[t - 1];
              l.break
                ? e.splice(--t, 1, l.left, null, l.right)
                : e.splice(--t, 1, l.left, l.right),
                (i += 1 + l.break),
                (s -= l.size);
            } else if (r > s * 2) {
              let l = e[i];
              l.break
                ? e.splice(i, 1, l.left, null, l.right)
                : e.splice(i, 1, l.left, l.right),
                (i += 2 + l.break),
                (r -= l.size);
            } else break;
          else if (s < r) {
            let l = e[t++];
            l && (s += l.size);
          } else {
            let l = e[--i];
            l && (r += l.size);
          }
        let o = 0;
        return (
          e[t - 1] == null ? ((o = 1), t--) : e[t] == null && ((o = 1), i++),
          new eo(n.of(e.slice(0, t)), o, n.of(e.slice(i)))
        );
      }
    };
  Ze.prototype.size = 1;
  var es = class extends Ze {
      constructor(e, t, i) {
        super(e, t), (this.deco = i);
      }
      blockAt(e, t, i, s) {
        return new Ke(s, this.length, i, this.height, this.deco || 0);
      }
      lineAt(e, t, i, s, r) {
        return this.blockAt(0, i, s, r);
      }
      forEachLine(e, t, i, s, r, o) {
        e <= r + this.length && t >= r && o(this.blockAt(0, i, s, r));
      }
      updateHeight(e, t = 0, i = !1, s) {
        return (
          s && s.from <= t && s.more && this.setHeight(e, s.heights[s.index++]),
          (this.outdated = !1),
          this
        );
      }
      toString() {
        return `block(${this.length})`;
      }
    },
    De = class n extends es {
      constructor(e, t) {
        super(e, t, null),
          (this.collapsed = 0),
          (this.widgetHeight = 0),
          (this.breaks = 0);
      }
      blockAt(e, t, i, s) {
        return new Ke(s, this.length, i, this.height, this.breaks);
      }
      replace(e, t, i) {
        let s = i[0];
        return i.length == 1 &&
          (s instanceof n || (s instanceof Ot && s.flags & 4)) &&
          Math.abs(this.length - s.length) < 10
          ? (s instanceof Ot
              ? (s = new n(s.length, this.height))
              : (s.height = this.height),
            this.outdated || (s.outdated = !1),
            s)
          : Ze.of(i);
      }
      updateHeight(e, t = 0, i = !1, s) {
        return (
          s && s.from <= t && s.more
            ? this.setHeight(e, s.heights[s.index++])
            : (i || this.outdated) &&
              this.setHeight(
                e,
                Math.max(
                  this.widgetHeight,
                  e.heightForLine(this.length - this.collapsed)
                ) +
                  this.breaks * e.lineHeight
              ),
          (this.outdated = !1),
          this
        );
      }
      toString() {
        return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${
          this.widgetHeight ? ":" + this.widgetHeight : ""
        })`;
      }
    },
    Ot = class n extends Ze {
      constructor(e) {
        super(e, 0);
      }
      heightMetrics(e, t) {
        let i = e.doc.lineAt(t).number,
          s = e.doc.lineAt(t + this.length).number,
          r = s - i + 1,
          o,
          l = 0;
        if (e.lineWrapping) {
          let a = Math.min(this.height, e.lineHeight * r);
          (o = a / r),
            this.length > r + 1 &&
              (l = (this.height - a) / (this.length - r - 1));
        } else o = this.height / r;
        return { firstLine: i, lastLine: s, perLine: o, perChar: l };
      }
      blockAt(e, t, i, s) {
        let {
          firstLine: r,
          lastLine: o,
          perLine: l,
          perChar: a,
        } = this.heightMetrics(t, s);
        if (t.lineWrapping) {
          let h =
              s +
              Math.round(
                Math.max(0, Math.min(1, (e - i) / this.height)) * this.length
              ),
            c = t.doc.lineAt(h),
            f = l + c.length * a,
            u = Math.max(i, e - f / 2);
          return new Ke(c.from, c.length, u, f, 0);
        } else {
          let h = Math.max(0, Math.min(o - r, Math.floor((e - i) / l))),
            { from: c, length: f } = t.doc.line(r + h);
          return new Ke(c, f, i + l * h, l, 0);
        }
      }
      lineAt(e, t, i, s, r) {
        if (t == G.ByHeight) return this.blockAt(e, i, s, r);
        if (t == G.ByPosNoHeight) {
          let { from: d, to: p } = i.doc.lineAt(e);
          return new Ke(d, p - d, 0, 0, 0);
        }
        let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r),
          h = i.doc.lineAt(e),
          c = l + h.length * a,
          f = h.number - o,
          u = s + l * f + a * (h.from - r - f);
        return new Ke(
          h.from,
          h.length,
          Math.max(s, Math.min(u, s + this.height - c)),
          c,
          0
        );
      }
      forEachLine(e, t, i, s, r, o) {
        (e = Math.max(e, r)), (t = Math.min(t, r + this.length));
        let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
        for (let c = e, f = s; c <= t; ) {
          let u = i.doc.lineAt(c);
          if (c == e) {
            let p = u.number - l;
            f += a * p + h * (e - r - p);
          }
          let d = a + h * u.length;
          o(new Ke(u.from, u.length, f, d, 0)), (f += d), (c = u.to + 1);
        }
      }
      replace(e, t, i) {
        let s = this.length - t;
        if (s > 0) {
          let r = i[i.length - 1];
          r instanceof n
            ? (i[i.length - 1] = new n(r.length + s))
            : i.push(null, new n(s - 1));
        }
        if (e > 0) {
          let r = i[0];
          r instanceof n
            ? (i[0] = new n(e + r.length))
            : i.unshift(new n(e - 1), null);
        }
        return Ze.of(i);
      }
      decomposeLeft(e, t) {
        t.push(new n(e - 1), null);
      }
      decomposeRight(e, t) {
        t.push(null, new n(this.length - e - 1));
      }
      updateHeight(e, t = 0, i = !1, s) {
        let r = t + this.length;
        if (s && s.from <= t + this.length && s.more) {
          let o = [],
            l = Math.max(t, s.from),
            a = -1;
          for (
            s.from > t && o.push(new n(s.from - t - 1).updateHeight(e, t));
            l <= r && s.more;

          ) {
            let c = e.doc.lineAt(l).length;
            o.length && o.push(null);
            let f = s.heights[s.index++];
            a == -1 ? (a = f) : Math.abs(f - a) >= In && (a = -2);
            let u = new De(c, f);
            (u.outdated = !1), o.push(u), (l += c + 1);
          }
          l <= r && o.push(null, new n(r - l).updateHeight(e, l));
          let h = Ze.of(o);
          return (
            (a < 0 ||
              Math.abs(h.height - this.height) >= In ||
              Math.abs(a - this.heightMetrics(e, t).perLine) >= In) &&
              (e.heightChanged = !0),
            h
          );
        } else
          (i || this.outdated) &&
            (this.setHeight(e, e.heightForGap(t, t + this.length)),
            (this.outdated = !1));
        return this;
      }
      toString() {
        return `gap(${this.length})`;
      }
    },
    eo = class extends Ze {
      constructor(e, t, i) {
        super(
          e.length + t + i.length,
          e.height + i.height,
          t | (e.outdated || i.outdated ? 2 : 0)
        ),
          (this.left = e),
          (this.right = i),
          (this.size = e.size + i.size);
      }
      get break() {
        return this.flags & 1;
      }
      blockAt(e, t, i, s) {
        let r = i + this.left.height;
        return e < r
          ? this.left.blockAt(e, t, i, s)
          : this.right.blockAt(e, t, r, s + this.left.length + this.break);
      }
      lineAt(e, t, i, s, r) {
        let o = s + this.left.height,
          l = r + this.left.length + this.break,
          a = t == G.ByHeight ? e < o : e < l,
          h = a
            ? this.left.lineAt(e, t, i, s, r)
            : this.right.lineAt(e, t, i, o, l);
        if (this.break || (a ? h.to < l : h.from > l)) return h;
        let c = t == G.ByPosNoHeight ? G.ByPosNoHeight : G.ByPos;
        return a
          ? h.join(this.right.lineAt(l, c, i, o, l))
          : this.left.lineAt(l, c, i, s, r).join(h);
      }
      forEachLine(e, t, i, s, r, o) {
        let l = s + this.left.height,
          a = r + this.left.length + this.break;
        if (this.break)
          e < a && this.left.forEachLine(e, t, i, s, r, o),
            t >= a && this.right.forEachLine(e, t, i, l, a, o);
        else {
          let h = this.lineAt(a, G.ByPos, i, s, r);
          e < h.from && this.left.forEachLine(e, h.from - 1, i, s, r, o),
            h.to >= e && h.from <= t && o(h),
            t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
        }
      }
      replace(e, t, i) {
        let s = this.left.length + this.break;
        if (t < s) return this.balanced(this.left.replace(e, t, i), this.right);
        if (e > this.left.length)
          return this.balanced(this.left, this.right.replace(e - s, t - s, i));
        let r = [];
        e > 0 && this.decomposeLeft(e, r);
        let o = r.length;
        for (let l of i) r.push(l);
        if ((e > 0 && th(r, o - 1), t < this.length)) {
          let l = r.length;
          this.decomposeRight(t, r), th(r, l);
        }
        return Ze.of(r);
      }
      decomposeLeft(e, t) {
        let i = this.left.length;
        if (e <= i) return this.left.decomposeLeft(e, t);
        t.push(this.left),
          this.break && (i++, e >= i && t.push(null)),
          e > i && this.right.decomposeLeft(e - i, t);
      }
      decomposeRight(e, t) {
        let i = this.left.length,
          s = i + this.break;
        if (e >= s) return this.right.decomposeRight(e - s, t);
        e < i && this.left.decomposeRight(e, t),
          this.break && e < s && t.push(null),
          t.push(this.right);
      }
      balanced(e, t) {
        return e.size > 2 * t.size || t.size > 2 * e.size
          ? Ze.of(this.break ? [e, null, t] : [e, t])
          : ((this.left = e),
            (this.right = t),
            (this.height = e.height + t.height),
            (this.outdated = e.outdated || t.outdated),
            (this.size = e.size + t.size),
            (this.length = e.length + this.break + t.length),
            this);
      }
      updateHeight(e, t = 0, i = !1, s) {
        let { left: r, right: o } = this,
          l = t + r.length + this.break,
          a = null;
        return (
          s && s.from <= t + r.length && s.more
            ? (a = r = r.updateHeight(e, t, i, s))
            : r.updateHeight(e, t, i),
          s && s.from <= l + o.length && s.more
            ? (a = o = o.updateHeight(e, l, i, s))
            : o.updateHeight(e, l, i),
          a
            ? this.balanced(r, o)
            : ((this.height = this.left.height + this.right.height),
              (this.outdated = !1),
              this)
        );
      }
      toString() {
        return this.left + (this.break ? " " : "-") + this.right;
      }
    };
  function th(n, e) {
    let t, i;
    n[e] == null &&
      (t = n[e - 1]) instanceof Ot &&
      (i = n[e + 1]) instanceof Ot &&
      n.splice(e - 1, 3, new Ot(t.length + 1 + i.length));
  }
  var Wp = 5,
    to = class n {
      constructor(e, t) {
        (this.pos = e),
          (this.oracle = t),
          (this.nodes = []),
          (this.lineStart = -1),
          (this.lineEnd = -1),
          (this.covering = null),
          (this.writtenTo = e);
      }
      get isCovered() {
        return (
          this.covering && this.nodes[this.nodes.length - 1] == this.covering
        );
      }
      span(e, t) {
        if (this.lineStart > -1) {
          let i = Math.min(t, this.lineEnd),
            s = this.nodes[this.nodes.length - 1];
          s instanceof De
            ? (s.length += i - this.pos)
            : (i > this.pos || !this.isCovered) &&
              this.nodes.push(new De(i - this.pos, -1)),
            (this.writtenTo = i),
            t > i &&
              (this.nodes.push(null), this.writtenTo++, (this.lineStart = -1));
        }
        this.pos = t;
      }
      point(e, t, i) {
        if (e < t || i.heightRelevant) {
          let s = i.widget ? i.widget.estimatedHeight : 0,
            r = i.widget ? i.widget.lineBreaks : 0;
          s < 0 && (s = this.oracle.lineHeight);
          let o = t - e;
          i.block
            ? this.addBlock(new es(o, s, i))
            : (o || r || s >= Wp) && this.addLineDeco(s, r, o);
        } else t > e && this.span(e, t);
        this.lineEnd > -1 &&
          this.lineEnd < this.pos &&
          (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
      }
      enterLine() {
        if (this.lineStart > -1) return;
        let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
        (this.lineStart = e),
          (this.lineEnd = t),
          this.writtenTo < e &&
            ((this.writtenTo < e - 1 ||
              this.nodes[this.nodes.length - 1] == null) &&
              this.nodes.push(this.blankContent(this.writtenTo, e - 1)),
            this.nodes.push(null)),
          this.pos > e && this.nodes.push(new De(this.pos - e, -1)),
          (this.writtenTo = this.pos);
      }
      blankContent(e, t) {
        let i = new Ot(t - e);
        return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
      }
      ensureLine() {
        this.enterLine();
        let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
        if (e instanceof De) return e;
        let t = new De(0, -1);
        return this.nodes.push(t), t;
      }
      addBlock(e) {
        this.enterLine();
        let t = e.deco;
        t && t.startSide > 0 && !this.isCovered && this.ensureLine(),
          this.nodes.push(e),
          (this.writtenTo = this.pos = this.pos + e.length),
          t && t.endSide > 0 && (this.covering = e);
      }
      addLineDeco(e, t, i) {
        let s = this.ensureLine();
        (s.length += i),
          (s.collapsed += i),
          (s.widgetHeight = Math.max(s.widgetHeight, e)),
          (s.breaks += t),
          (this.writtenTo = this.pos = this.pos + i);
      }
      finish(e) {
        let t =
          this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
        this.lineStart > -1 && !(t instanceof De) && !this.isCovered
          ? this.nodes.push(new De(0, -1))
          : (this.writtenTo < this.pos || t == null) &&
            this.nodes.push(this.blankContent(this.writtenTo, this.pos));
        let i = e;
        for (let s of this.nodes)
          s instanceof De && s.updateHeight(this.oracle, i),
            (i += s ? s.length : 1);
        return this.nodes;
      }
      static build(e, t, i, s) {
        let r = new n(i, e);
        return I.spans(t, i, s, r, 0), r.finish(i);
      }
    };
  function Xp(n, e, t) {
    let i = new io();
    return I.compare(n, e, t, i, 0), i.changes;
  }
  var io = class {
    constructor() {
      this.changes = [];
    }
    compareRange() {}
    comparePoint(e, t, i, s) {
      (e < t || (i && i.heightRelevant) || (s && s.heightRelevant)) &&
        Vr(e, t, this.changes, 5);
    }
  };
  function Mp(n, e) {
    let t = n.getBoundingClientRect(),
      i = n.ownerDocument,
      s = i.defaultView || window,
      r = Math.max(0, t.left),
      o = Math.min(s.innerWidth, t.right),
      l = Math.max(0, t.top),
      a = Math.min(s.innerHeight, t.bottom);
    for (let h = n.parentNode; h && h != i.body; )
      if (h.nodeType == 1) {
        let c = h,
          f = window.getComputedStyle(c);
        if (
          (c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) &&
          f.overflow != "visible"
        ) {
          let u = c.getBoundingClientRect();
          (r = Math.max(r, u.left)),
            (o = Math.min(o, u.right)),
            (l = Math.max(l, u.top)),
            (a = h == n.parentNode ? u.bottom : Math.min(a, u.bottom));
        }
        h =
          f.position == "absolute" || f.position == "fixed"
            ? c.offsetParent
            : c.parentNode;
      } else if (h.nodeType == 11) h = h.host;
      else break;
    return {
      left: r - t.left,
      right: Math.max(r, o) - t.left,
      top: l - (t.top + e),
      bottom: Math.max(l, a) - (t.top + e),
    };
  }
  function Ep(n, e) {
    let t = n.getBoundingClientRect();
    return {
      left: 0,
      right: t.right - t.left,
      top: e,
      bottom: t.bottom - (t.top + e),
    };
  }
  var Mi = class {
      constructor(e, t, i) {
        (this.from = e), (this.to = t), (this.size = i);
      }
      static same(e, t) {
        if (e.length != t.length) return !1;
        for (let i = 0; i < e.length; i++) {
          let s = e[i],
            r = t[i];
          if (s.from != r.from || s.to != r.to || s.size != r.size) return !1;
        }
        return !0;
      }
      draw(e, t) {
        return R.replace({
          widget: new no(this.size * (t ? e.scaleY : e.scaleX), t),
        }).range(this.from, this.to);
      }
    },
    no = class extends Qe {
      constructor(e, t) {
        super(), (this.size = e), (this.vertical = t);
      }
      eq(e) {
        return e.size == this.size && e.vertical == this.vertical;
      }
      toDOM() {
        let e = document.createElement("div");
        return (
          this.vertical
            ? (e.style.height = this.size + "px")
            : ((e.style.width = this.size + "px"),
              (e.style.height = "2px"),
              (e.style.display = "inline-block")),
          e
        );
      }
      get estimatedHeight() {
        return this.vertical ? this.size : -1;
      }
    },
    ts = class {
      constructor(e) {
        (this.state = e),
          (this.pixelViewport = {
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: 0,
          }),
          (this.inView = !0),
          (this.paddingTop = 0),
          (this.paddingBottom = 0),
          (this.contentDOMWidth = 0),
          (this.contentDOMHeight = 0),
          (this.editorHeight = 0),
          (this.editorWidth = 0),
          (this.scrollTop = 0),
          (this.scrolledToBottom = !0),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.scrollAnchorPos = 0),
          (this.scrollAnchorHeight = -1),
          (this.scaler = ih),
          (this.scrollTarget = null),
          (this.printing = !1),
          (this.mustMeasureContent = !0),
          (this.defaultTextDirection = U.LTR),
          (this.visibleRanges = []),
          (this.mustEnforceCursorAssoc = !1);
        let t = e
          .facet(Po)
          .some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
        (this.heightOracle = new Kr(t)),
          (this.stateDeco = e.facet(_i).filter((i) => typeof i != "function")),
          (this.heightMap = Ze.empty().applyChanges(
            this.stateDeco,
            j.empty,
            this.heightOracle.setDoc(e.doc),
            [new et(0, 0, 0, e.doc.length)]
          )),
          (this.viewport = this.getViewport(0, null)),
          this.updateViewportLines(),
          this.updateForViewport(),
          (this.lineGaps = this.ensureLineGaps([])),
          (this.lineGapDeco = R.set(
            this.lineGaps.map((i) => i.draw(this, !1))
          )),
          this.computeVisibleRanges();
      }
      updateForViewport() {
        let e = [this.viewport],
          { main: t } = this.state.selection;
        for (let i = 0; i <= 1; i++) {
          let s = i ? t.head : t.anchor;
          if (!e.some(({ from: r, to: o }) => s >= r && s <= o)) {
            let { from: r, to: o } = this.lineBlockAt(s);
            e.push(new ti(r, o));
          }
        }
        (this.viewports = e.sort((i, s) => i.from - s.from)),
          (this.scaler =
            this.heightMap.height <= 7e6
              ? ih
              : new so(this.heightOracle, this.heightMap, this.viewports));
      }
      updateViewportLines() {
        (this.viewportLines = []),
          this.heightMap.forEachLine(
            this.viewport.from,
            this.viewport.to,
            this.heightOracle.setDoc(this.state.doc),
            0,
            0,
            (e) => {
              this.viewportLines.push(
                this.scaler.scale == 1 ? e : Ti(e, this.scaler)
              );
            }
          );
      }
      update(e, t = null) {
        this.state = e.state;
        let i = this.stateDeco;
        this.stateDeco = this.state
          .facet(_i)
          .filter((c) => typeof c != "function");
        let s = e.changedRanges,
          r = et.extendWithRanges(
            s,
            Xp(
              i,
              this.stateDeco,
              e ? e.changes : me.empty(this.state.doc.length)
            )
          ),
          o = this.heightMap.height,
          l = this.scrolledToBottom
            ? null
            : this.scrollAnchorAt(this.scrollTop);
        (this.heightMap = this.heightMap.applyChanges(
          this.stateDeco,
          e.startState.doc,
          this.heightOracle.setDoc(this.state.doc),
          r
        )),
          this.heightMap.height != o && (e.flags |= 2),
          l
            ? ((this.scrollAnchorPos = e.changes.mapPos(l.from, -1)),
              (this.scrollAnchorHeight = l.top))
            : ((this.scrollAnchorPos = -1),
              (this.scrollAnchorHeight = this.heightMap.height));
        let a = r.length
          ? this.mapViewport(this.viewport, e.changes)
          : this.viewport;
        ((t && (t.range.head < a.from || t.range.head > a.to)) ||
          !this.viewportIsAppropriate(a)) &&
          (a = this.getViewport(0, t));
        let h =
          !e.changes.empty ||
          e.flags & 2 ||
          a.from != this.viewport.from ||
          a.to != this.viewport.to;
        (this.viewport = a),
          this.updateForViewport(),
          h && this.updateViewportLines(),
          (this.lineGaps.length ||
            this.viewport.to - this.viewport.from > 4e3) &&
            this.updateLineGaps(
              this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))
            ),
          (e.flags |= this.computeVisibleRanges()),
          t && (this.scrollTarget = t),
          !this.mustEnforceCursorAssoc &&
            e.selectionSet &&
            e.view.lineWrapping &&
            e.state.selection.main.empty &&
            e.state.selection.main.assoc &&
            !e.state.facet(Eh) &&
            (this.mustEnforceCursorAssoc = !0);
      }
      measure(e) {
        let t = e.contentDOM,
          i = window.getComputedStyle(t),
          s = this.heightOracle,
          r = i.whiteSpace;
        this.defaultTextDirection = i.direction == "rtl" ? U.RTL : U.LTR;
        let o = this.heightOracle.mustRefreshForWrapping(r),
          l = t.getBoundingClientRect(),
          a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
        (this.contentDOMHeight = l.height), (this.mustMeasureContent = !1);
        let h = 0,
          c = 0;
        if (l.width && l.height) {
          let { scaleX: P, scaleY: S } = yh(t, l);
          (this.scaleX != P || this.scaleY != S) &&
            ((this.scaleX = P), (this.scaleY = S), (h |= 8), (o = a = !0));
        }
        let f = (parseInt(i.paddingTop) || 0) * this.scaleY,
          u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
        (this.paddingTop != f || this.paddingBottom != u) &&
          ((this.paddingTop = f), (this.paddingBottom = u), (h |= 10)),
          this.editorWidth != e.scrollDOM.clientWidth &&
            (s.lineWrapping && (a = !0),
            (this.editorWidth = e.scrollDOM.clientWidth),
            (h |= 8));
        let d = e.scrollDOM.scrollTop * this.scaleY;
        this.scrollTop != d &&
          ((this.scrollAnchorHeight = -1), (this.scrollTop = d)),
          (this.scrolledToBottom = Sh(e.scrollDOM));
        let p = (this.printing ? Ep : Mp)(t, this.paddingTop),
          g = p.top - this.pixelViewport.top,
          m = p.bottom - this.pixelViewport.bottom;
        this.pixelViewport = p;
        let b =
          this.pixelViewport.bottom > this.pixelViewport.top &&
          this.pixelViewport.right > this.pixelViewport.left;
        if (
          (b != this.inView && ((this.inView = b), b && (a = !0)),
          !this.inView && !this.scrollTarget)
        )
          return 0;
        let k = l.width;
        if (
          ((this.contentDOMWidth != k ||
            this.editorHeight != e.scrollDOM.clientHeight) &&
            ((this.contentDOMWidth = l.width),
            (this.editorHeight = e.scrollDOM.clientHeight),
            (h |= 8)),
          a)
        ) {
          let P = e.docView.measureVisibleLineHeights(this.viewport);
          if (
            (s.mustRefreshForHeights(P) && (o = !0),
            o ||
              (s.lineWrapping &&
                Math.abs(k - this.contentDOMWidth) > s.charWidth))
          ) {
            let {
              lineHeight: S,
              charWidth: C,
              textHeight: Z,
            } = e.docView.measureTextSize();
            (o = S > 0 && s.refresh(r, S, C, Z, k / C, P)),
              o && ((e.docView.minWidth = 0), (h |= 8));
          }
          g > 0 && m > 0
            ? (c = Math.max(g, m))
            : g < 0 && m < 0 && (c = Math.min(g, m)),
            (s.heightChanged = !1);
          for (let S of this.viewports) {
            let C =
              S.from == this.viewport.from
                ? P
                : e.docView.measureVisibleLineHeights(S);
            this.heightMap = (
              o
                ? Ze.empty().applyChanges(
                    this.stateDeco,
                    j.empty,
                    this.heightOracle,
                    [new et(0, 0, 0, e.state.doc.length)]
                  )
                : this.heightMap
            ).updateHeight(s, 0, o, new Jr(S.from, C));
          }
          s.heightChanged && (h |= 2);
        }
        let $ =
          !this.viewportIsAppropriate(this.viewport, c) ||
          (this.scrollTarget &&
            (this.scrollTarget.range.head < this.viewport.from ||
              this.scrollTarget.range.head > this.viewport.to));
        return (
          $ && (this.viewport = this.getViewport(c, this.scrollTarget)),
          this.updateForViewport(),
          (h & 2 || $) && this.updateViewportLines(),
          (this.lineGaps.length ||
            this.viewport.to - this.viewport.from > 4e3) &&
            this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)),
          (h |= this.computeVisibleRanges()),
          this.mustEnforceCursorAssoc &&
            ((this.mustEnforceCursorAssoc = !1),
            e.docView.enforceCursorAssoc()),
          h
        );
      }
      get visibleTop() {
        return this.scaler.fromDOM(this.pixelViewport.top);
      }
      get visibleBottom() {
        return this.scaler.fromDOM(this.pixelViewport.bottom);
      }
      getViewport(e, t) {
        let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)),
          s = this.heightMap,
          r = this.heightOracle,
          { visibleTop: o, visibleBottom: l } = this,
          a = new ti(
            s.lineAt(o - i * 1e3, G.ByHeight, r, 0, 0).from,
            s.lineAt(l + (1 - i) * 1e3, G.ByHeight, r, 0, 0).to
          );
        if (t) {
          let { head: h } = t.range;
          if (h < a.from || h > a.to) {
            let c = Math.min(
                this.editorHeight,
                this.pixelViewport.bottom - this.pixelViewport.top
              ),
              f = s.lineAt(h, G.ByPos, r, 0, 0),
              u;
            t.y == "center"
              ? (u = (f.top + f.bottom) / 2 - c / 2)
              : t.y == "start" || (t.y == "nearest" && h < a.from)
              ? (u = f.top)
              : (u = f.bottom - c),
              (a = new ti(
                s.lineAt(u - 1e3 / 2, G.ByHeight, r, 0, 0).from,
                s.lineAt(u + c + 1e3 / 2, G.ByHeight, r, 0, 0).to
              ));
          }
        }
        return a;
      }
      mapViewport(e, t) {
        let i = t.mapPos(e.from, -1),
          s = t.mapPos(e.to, 1);
        return new ti(
          this.heightMap.lineAt(i, G.ByPos, this.heightOracle, 0, 0).from,
          this.heightMap.lineAt(s, G.ByPos, this.heightOracle, 0, 0).to
        );
      }
      viewportIsAppropriate({ from: e, to: t }, i = 0) {
        if (!this.inView) return !0;
        let { top: s } = this.heightMap.lineAt(
            e,
            G.ByPos,
            this.heightOracle,
            0,
            0
          ),
          { bottom: r } = this.heightMap.lineAt(
            t,
            G.ByPos,
            this.heightOracle,
            0,
            0
          ),
          { visibleTop: o, visibleBottom: l } = this;
        return (
          (e == 0 || s <= o - Math.max(10, Math.min(-i, 250))) &&
          (t == this.state.doc.length ||
            r >= l + Math.max(10, Math.min(i, 250))) &&
          s > o - 2 * 1e3 &&
          r < l + 2 * 1e3
        );
      }
      mapLineGaps(e, t) {
        if (!e.length || t.empty) return e;
        let i = [];
        for (let s of e)
          t.touchesRange(s.from, s.to) ||
            i.push(new Mi(t.mapPos(s.from), t.mapPos(s.to), s.size));
        return i;
      }
      ensureLineGaps(e, t) {
        let i = this.heightOracle.lineWrapping,
          s = i ? 1e4 : 2e3,
          r = s >> 1,
          o = s << 1;
        if (this.defaultTextDirection != U.LTR && !i) return [];
        let l = [],
          a = (h, c, f, u) => {
            if (c - h < r) return;
            let d = this.state.selection.main,
              p = [d.from];
            d.empty || p.push(d.to);
            for (let m of p)
              if (m > h && m < c) {
                a(h, m - 10, f, u), a(m + 10, c, f, u);
                return;
              }
            let g = jp(
              e,
              (m) =>
                m.from >= f.from &&
                m.to <= f.to &&
                Math.abs(m.from - h) < r &&
                Math.abs(m.to - c) < r &&
                !p.some((b) => m.from < b && m.to > b)
            );
            if (!g) {
              if (
                c < f.to &&
                t &&
                i &&
                t.visibleRanges.some((m) => m.from <= c && m.to >= c)
              ) {
                let m = t.moveToLineBoundary(w.cursor(c), !1, !0).head;
                m > h && (c = m);
              }
              g = new Mi(h, c, this.gapSize(f, h, c, u));
            }
            l.push(g);
          };
        for (let h of this.viewportLines) {
          if (h.length < o) continue;
          let c = Dp(h.from, h.to, this.stateDeco);
          if (c.total < o) continue;
          let f = this.scrollTarget ? this.scrollTarget.range.head : null,
            u,
            d;
          if (i) {
            let p =
                (s / this.heightOracle.lineLength) *
                this.heightOracle.lineHeight,
              g,
              m;
            if (f != null) {
              let b = En(c, f),
                k = ((this.visibleBottom - this.visibleTop) / 2 + p) / h.height;
              (g = b - k), (m = b + k);
            } else
              (g = (this.visibleTop - h.top - p) / h.height),
                (m = (this.visibleBottom - h.top + p) / h.height);
            (u = Mn(c, g)), (d = Mn(c, m));
          } else {
            let p = c.total * this.heightOracle.charWidth,
              g = s * this.heightOracle.charWidth,
              m,
              b;
            if (f != null) {
              let k = En(c, f),
                $ =
                  ((this.pixelViewport.right - this.pixelViewport.left) / 2 +
                    g) /
                  p;
              (m = k - $), (b = k + $);
            } else
              (m = (this.pixelViewport.left - g) / p),
                (b = (this.pixelViewport.right + g) / p);
            (u = Mn(c, m)), (d = Mn(c, b));
          }
          u > h.from && a(h.from, u, h, c), d < h.to && a(d, h.to, h, c);
        }
        return l;
      }
      gapSize(e, t, i, s) {
        let r = En(s, i) - En(s, t);
        return this.heightOracle.lineWrapping
          ? e.height * r
          : s.total * this.heightOracle.charWidth * r;
      }
      updateLineGaps(e) {
        Mi.same(e, this.lineGaps) ||
          ((this.lineGaps = e),
          (this.lineGapDeco = R.set(
            e.map((t) => t.draw(this, this.heightOracle.lineWrapping))
          )));
      }
      computeVisibleRanges() {
        let e = this.stateDeco;
        this.lineGaps.length && (e = e.concat(this.lineGapDeco));
        let t = [];
        I.spans(
          e,
          this.viewport.from,
          this.viewport.to,
          {
            span(s, r) {
              t.push({ from: s, to: r });
            },
            point() {},
          },
          20
        );
        let i =
          t.length != this.visibleRanges.length ||
          this.visibleRanges.some(
            (s, r) => s.from != t[r].from || s.to != t[r].to
          );
        return (this.visibleRanges = t), i ? 4 : 0;
      }
      lineBlockAt(e) {
        return (
          (e >= this.viewport.from &&
            e <= this.viewport.to &&
            this.viewportLines.find((t) => t.from <= e && t.to >= e)) ||
          Ti(
            this.heightMap.lineAt(e, G.ByPos, this.heightOracle, 0, 0),
            this.scaler
          )
        );
      }
      lineBlockAtHeight(e) {
        return Ti(
          this.heightMap.lineAt(
            this.scaler.fromDOM(e),
            G.ByHeight,
            this.heightOracle,
            0,
            0
          ),
          this.scaler
        );
      }
      scrollAnchorAt(e) {
        let t = this.lineBlockAtHeight(e + 8);
        return t.from >= this.viewport.from ||
          this.viewportLines[0].top - e > 200
          ? t
          : this.viewportLines[0];
      }
      elementAtHeight(e) {
        return Ti(
          this.heightMap.blockAt(
            this.scaler.fromDOM(e),
            this.heightOracle,
            0,
            0
          ),
          this.scaler
        );
      }
      get docHeight() {
        return this.scaler.toDOM(this.heightMap.height);
      }
      get contentHeight() {
        return this.docHeight + this.paddingTop + this.paddingBottom;
      }
    },
    ti = class {
      constructor(e, t) {
        (this.from = e), (this.to = t);
      }
    };
  function Dp(n, e, t) {
    let i = [],
      s = n,
      r = 0;
    return (
      I.spans(
        t,
        n,
        e,
        {
          span() {},
          point(o, l) {
            o > s && (i.push({ from: s, to: o }), (r += o - s)), (s = l);
          },
        },
        20
      ),
      s < e && (i.push({ from: s, to: e }), (r += e - s)),
      { total: r, ranges: i }
    );
  }
  function Mn({ total: n, ranges: e }, t) {
    if (t <= 0) return e[0].from;
    if (t >= 1) return e[e.length - 1].to;
    let i = Math.floor(n * t);
    for (let s = 0; ; s++) {
      let { from: r, to: o } = e[s],
        l = o - r;
      if (i <= l) return r + i;
      i -= l;
    }
  }
  function En(n, e) {
    let t = 0;
    for (let { from: i, to: s } of n.ranges) {
      if (e <= s) {
        t += e - i;
        break;
      }
      t += s - i;
    }
    return t / n.total;
  }
  function jp(n, e) {
    for (let t of n) if (e(t)) return t;
  }
  var ih = {
      toDOM(n) {
        return n;
      },
      fromDOM(n) {
        return n;
      },
      scale: 1,
    },
    so = class {
      constructor(e, t, i) {
        let s = 0,
          r = 0,
          o = 0;
        (this.viewports = i.map(({ from: l, to: a }) => {
          let h = t.lineAt(l, G.ByPos, e, 0, 0).top,
            c = t.lineAt(a, G.ByPos, e, 0, 0).bottom;
          return (
            (s += c - h),
            { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 }
          );
        })),
          (this.scale = (7e6 - s) / (t.height - s));
        for (let l of this.viewports)
          (l.domTop = o + (l.top - r) * this.scale),
            (o = l.domBottom = l.domTop + (l.bottom - l.top)),
            (r = l.bottom);
      }
      toDOM(e) {
        for (let t = 0, i = 0, s = 0; ; t++) {
          let r = t < this.viewports.length ? this.viewports[t] : null;
          if (!r || e < r.top) return s + (e - i) * this.scale;
          if (e <= r.bottom) return r.domTop + (e - r.top);
          (i = r.bottom), (s = r.domBottom);
        }
      }
      fromDOM(e) {
        for (let t = 0, i = 0, s = 0; ; t++) {
          let r = t < this.viewports.length ? this.viewports[t] : null;
          if (!r || e < r.domTop) return i + (e - s) / this.scale;
          if (e <= r.domBottom) return r.top + (e - r.domTop);
          (i = r.bottom), (s = r.domBottom);
        }
      }
    };
  function Ti(n, e) {
    if (e.scale == 1) return n;
    let t = e.toDOM(n.top),
      i = e.toDOM(n.bottom);
    return new Ke(
      n.from,
      n.length,
      t,
      i - t,
      Array.isArray(n._content) ? n._content.map((s) => Ti(s, e)) : n._content
    );
  }
  var Dn = T.define({ combine: (n) => n.join(" ") }),
    ro = T.define({ combine: (n) => n.indexOf(!0) > -1 }),
    oo = Ee.newName(),
    rc = Ee.newName(),
    oc = Ee.newName(),
    lc = { "&light": "." + rc, "&dark": "." + oc };
  function lo(n, e, t) {
    return new Ee(e, {
      finish(i) {
        return /&/.test(i)
          ? i.replace(/&\w*/, (s) => {
              if (s == "&") return n;
              if (!t || !t[s])
                throw new RangeError(`Unsupported selector: ${s}`);
              return t[s];
            })
          : n + " " + i;
      },
    });
  }
  var qp = lo(
      "." + oo,
      {
        "&": {
          position: "relative !important",
          boxSizing: "border-box",
          "&.cm-focused": { outline: "1px dotted #212121" },
          display: "flex !important",
          flexDirection: "column",
        },
        ".cm-scroller": {
          display: "flex !important",
          alignItems: "flex-start !important",
          fontFamily: "monospace",
          lineHeight: 1.4,
          height: "100%",
          overflowX: "auto",
          position: "relative",
          zIndex: 0,
        },
        ".cm-content": {
          margin: 0,
          flexGrow: 2,
          flexShrink: 0,
          display: "block",
          whiteSpace: "pre",
          wordWrap: "normal",
          boxSizing: "border-box",
          minHeight: "100%",
          padding: "4px 0",
          outline: "none",
          "&[contenteditable=true]": {
            WebkitUserModify: "read-write-plaintext-only",
          },
        },
        ".cm-lineWrapping": {
          whiteSpace_fallback: "pre-wrap",
          whiteSpace: "break-spaces",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          flexShrink: 1,
        },
        "&light .cm-content": { caretColor: "black" },
        "&dark .cm-content": { caretColor: "white" },
        ".cm-line": { display: "block", padding: "0 2px 0 6px" },
        ".cm-layer": {
          position: "absolute",
          left: 0,
          top: 0,
          contain: "size style",
          "& > *": { position: "absolute" },
        },
        "&light .cm-selectionBackground": { background: "#d9d9d9" },
        "&dark .cm-selectionBackground": { background: "#222" },
        "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":
          { background: "#d7d4f0" },
        "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground":
          { background: "#233" },
        ".cm-cursorLayer": { pointerEvents: "none" },
        "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
          animation: "steps(1) cm-blink 1.2s infinite",
        },
        "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
        "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
        ".cm-cursor, .cm-dropCursor": {
          borderLeft: "1.2px solid black",
          marginLeft: "-0.6px",
          pointerEvents: "none",
        },
        ".cm-cursor": { display: "none" },
        "&dark .cm-cursor": { borderLeftColor: "#444" },
        ".cm-dropCursor": { position: "absolute" },
        "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
          display: "block",
        },
        ".cm-announced": { position: "fixed", top: "-10000px" },
        "@media print": { ".cm-announced": { display: "none" } },
        "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
        "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
        "&light .cm-specialChar": { color: "red" },
        "&dark .cm-specialChar": { color: "#f78" },
        ".cm-gutters": {
          flexShrink: 0,
          display: "flex",
          height: "100%",
          boxSizing: "border-box",
          insetInlineStart: 0,
          zIndex: 200,
        },
        "&light .cm-gutters": {
          backgroundColor: "#f5f5f5",
          color: "#6c6c6c",
          borderRight: "1px solid #ddd",
        },
        "&dark .cm-gutters": { backgroundColor: "#333338", color: "#ccc" },
        ".cm-gutter": {
          display: "flex !important",
          flexDirection: "column",
          flexShrink: 0,
          boxSizing: "border-box",
          minHeight: "100%",
          overflow: "hidden",
        },
        ".cm-gutterElement": { boxSizing: "border-box" },
        ".cm-lineNumbers .cm-gutterElement": {
          padding: "0 3px 0 5px",
          minWidth: "20px",
          textAlign: "right",
          whiteSpace: "nowrap",
        },
        "&light .cm-activeLineGutter": { backgroundColor: "#e2f2ff" },
        "&dark .cm-activeLineGutter": { backgroundColor: "#222227" },
        ".cm-panels": {
          boxSizing: "border-box",
          position: "sticky",
          left: 0,
          right: 0,
        },
        "&light .cm-panels": { backgroundColor: "#f5f5f5", color: "black" },
        "&light .cm-panels-top": { borderBottom: "1px solid #ddd" },
        "&light .cm-panels-bottom": { borderTop: "1px solid #ddd" },
        "&dark .cm-panels": { backgroundColor: "#333338", color: "white" },
        ".cm-tab": {
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "bottom",
        },
        ".cm-widgetBuffer": {
          verticalAlign: "text-top",
          height: "1em",
          width: 0,
          display: "inline",
        },
        ".cm-placeholder": {
          color: "#888",
          display: "inline-block",
          verticalAlign: "top",
        },
        ".cm-highlightSpace:before": {
          content: "attr(data-display)",
          position: "absolute",
          pointerEvents: "none",
          color: "#888",
        },
        ".cm-highlightTab": {
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
          backgroundSize: "auto 100%",
          backgroundPosition: "right 90%",
          backgroundRepeat: "no-repeat",
        },
        ".cm-trailingSpace": { backgroundColor: "#ff332255" },
        ".cm-button": {
          verticalAlign: "middle",
          color: "inherit",
          fontSize: "70%",
          padding: ".2em 1em",
          borderRadius: "1px",
        },
        "&light .cm-button": {
          backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
          border: "1px solid #888",
          "&:active": { backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)" },
        },
        "&dark .cm-button": {
          backgroundImage: "linear-gradient(#393939, #111)",
          border: "1px solid #888",
          "&:active": { backgroundImage: "linear-gradient(#111, #333)" },
        },
        ".cm-textfield": {
          verticalAlign: "middle",
          color: "inherit",
          fontSize: "70%",
          border: "1px solid silver",
          padding: ".2em .5em",
        },
        "&light .cm-textfield": { backgroundColor: "white" },
        "&dark .cm-textfield": {
          border: "1px solid #555",
          backgroundColor: "inherit",
        },
      },
      lc
    ),
    Ai = "\uFFFF",
    ao = class {
      constructor(e, t) {
        (this.points = e),
          (this.text = ""),
          (this.lineSeparator = t.facet(V.lineSeparator));
      }
      append(e) {
        this.text += e;
      }
      lineBreak() {
        this.text += Ai;
      }
      readRange(e, t) {
        if (!e) return this;
        let i = e.parentNode;
        for (let s = e; ; ) {
          this.findPointBefore(i, s);
          let r = this.text.length;
          this.readNode(s);
          let o = s.nextSibling;
          if (o == t) break;
          let l = H.get(s),
            a = H.get(o);
          (l && a
            ? l.breakAfter
            : (l ? l.breakAfter : nh(s)) ||
              (nh(o) &&
                (s.nodeName != "BR" || s.cmIgnore) &&
                this.text.length > r)) && this.lineBreak(),
            (s = o);
        }
        return this.findPointBefore(i, t), this;
      }
      readTextNode(e) {
        let t = e.nodeValue;
        for (let i of this.points)
          i.node == e &&
            (i.pos = this.text.length + Math.min(i.offset, t.length));
        for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
          let r = -1,
            o = 1,
            l;
          if (
            (this.lineSeparator
              ? ((r = t.indexOf(this.lineSeparator, i)),
                (o = this.lineSeparator.length))
              : (l = s.exec(t)) && ((r = l.index), (o = l[0].length)),
            this.append(t.slice(i, r < 0 ? t.length : r)),
            r < 0)
          )
            break;
          if ((this.lineBreak(), o > 1))
            for (let a of this.points)
              a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
          i = r + o;
        }
      }
      readNode(e) {
        if (e.cmIgnore) return;
        let t = H.get(e),
          i = t && t.overrideDOMText;
        if (i != null) {
          this.findPointInside(e, i.length);
          for (let s = i.iter(); !s.next().done; )
            s.lineBreak ? this.lineBreak() : this.append(s.value);
        } else
          e.nodeType == 3
            ? this.readTextNode(e)
            : e.nodeName == "BR"
            ? e.nextSibling && this.lineBreak()
            : e.nodeType == 1 && this.readRange(e.firstChild, null);
      }
      findPointBefore(e, t) {
        for (let i of this.points)
          i.node == e &&
            e.childNodes[i.offset] == t &&
            (i.pos = this.text.length);
      }
      findPointInside(e, t) {
        for (let i of this.points)
          (e.nodeType == 3 ? i.node == e : e.contains(i.node)) &&
            (i.pos = this.text.length + (Bp(e, i.node, i.offset) ? t : 0));
      }
    };
  function Bp(n, e, t) {
    for (;;) {
      if (!e || t < ht(e)) return !1;
      if (e == n) return !0;
      (t = qi(e) + 1), (e = e.parentNode);
    }
  }
  function nh(n) {
    return (
      n.nodeType == 1 &&
      /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName)
    );
  }
  var is = class {
      constructor(e, t) {
        (this.node = e), (this.offset = t), (this.pos = -1);
      }
    },
    ho = class {
      constructor(e, t, i, s) {
        (this.typeOver = s), (this.bounds = null), (this.text = "");
        let { impreciseHead: r, impreciseAnchor: o } = e.docView;
        if (e.state.readOnly && t > -1) this.newSel = null;
        else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
          let l = r || o ? [] : Lp(e),
            a = new ao(l, e.state);
          a.readRange(this.bounds.startDOM, this.bounds.endDOM),
            (this.text = a.text),
            (this.newSel = _p(l, this.bounds.from));
        } else {
          let l = e.observer.selectionRange,
            a =
              (r && r.node == l.focusNode && r.offset == l.focusOffset) ||
              !Xr(e.contentDOM, l.focusNode)
                ? e.state.selection.main.head
                : e.docView.posFromDOM(l.focusNode, l.focusOffset),
            h =
              (o && o.node == l.anchorNode && o.offset == l.anchorOffset) ||
              !Xr(e.contentDOM, l.anchorNode)
                ? e.state.selection.main.anchor
                : e.docView.posFromDOM(l.anchorNode, l.anchorOffset);
          this.newSel = w.single(h, a);
        }
      }
    };
  function ac(n, e) {
    let t,
      { newSel: i } = e,
      s = n.state.selection.main,
      r =
        n.inputState.lastKeyTime > Date.now() - 100
          ? n.inputState.lastKeyCode
          : -1;
    if (e.bounds) {
      let { from: o, to: l } = e.bounds,
        a = s.from,
        h = null;
      (r === 8 || (A.android && e.text.length < l - o)) &&
        ((a = s.to), (h = "end"));
      let c = Ip(n.state.doc.sliceString(o, l, Ai), e.text, a - o, h);
      c &&
        (A.chrome &&
          r == 13 &&
          c.toB == c.from + 2 &&
          e.text.slice(c.from, c.toB) == Ai + Ai &&
          c.toB--,
        (t = {
          from: o + c.from,
          to: o + c.toA,
          insert: j.of(e.text.slice(c.from, c.toB).split(Ai)),
        }));
    } else
      i && ((!n.hasFocus && n.state.facet(cs)) || i.main.eq(s)) && (i = null);
    if (!t && !i) return !1;
    if (
      (!t && e.typeOver && !s.empty && i && i.main.empty
        ? (t = {
            from: s.from,
            to: s.to,
            insert: n.state.doc.slice(s.from, s.to),
          })
        : t &&
          t.from >= s.from &&
          t.to <= s.to &&
          (t.from != s.from || t.to != s.to) &&
          s.to - s.from - (t.to - t.from) <= 4
        ? (t = {
            from: s.from,
            to: s.to,
            insert: n.state.doc
              .slice(s.from, t.from)
              .append(t.insert)
              .append(n.state.doc.slice(t.to, s.to)),
          })
        : (A.mac || A.android) &&
          t &&
          t.from == t.to &&
          t.from == s.head - 1 &&
          /^\. ?$/.test(t.insert.toString()) &&
          n.contentDOM.getAttribute("autocorrect") == "off"
        ? (i &&
            t.insert.length == 2 &&
            (i = w.single(i.main.anchor - 1, i.main.head - 1)),
          (t = { from: s.from, to: s.to, insert: j.of([" "]) }))
        : A.chrome &&
          t &&
          t.from == t.to &&
          t.from == s.head &&
          t.insert.toString() ==
            `
 ` &&
          n.lineWrapping &&
          (i && (i = w.single(i.main.anchor - 1, i.main.head - 1)),
          (t = { from: s.from, to: s.to, insert: j.of([" "]) })),
      t)
    ) {
      if (
        (A.ios && n.inputState.flushIOSKey()) ||
        (A.android &&
          ((t.from == s.from &&
            t.to == s.to &&
            t.insert.length == 1 &&
            t.insert.lines == 2 &&
            si(n.contentDOM, "Enter", 13)) ||
            (((t.from == s.from - 1 && t.to == s.to && t.insert.length == 0) ||
              (r == 8 && t.insert.length < t.to - t.from && t.to > s.head)) &&
              si(n.contentDOM, "Backspace", 8)) ||
            (t.from == s.from &&
              t.to == s.to + 1 &&
              t.insert.length == 0 &&
              si(n.contentDOM, "Delete", 46))))
      )
        return !0;
      let o = t.insert.toString();
      n.inputState.composing >= 0 && n.inputState.composing++;
      let l,
        a = () => l || (l = Vp(n, t, i));
      return (
        n.state.facet(Wh).some((h) => h(n, t.from, t.to, o, a)) ||
          n.dispatch(a()),
        !0
      );
    } else if (i && !i.main.eq(s)) {
      let o = !1,
        l = "select";
      return (
        n.inputState.lastSelectionTime > Date.now() - 50 &&
          (n.inputState.lastSelectionOrigin == "select" && (o = !0),
          (l = n.inputState.lastSelectionOrigin)),
        n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }),
        !0
      );
    } else return !1;
  }
  function Vp(n, e, t) {
    let i,
      s = n.state,
      r = s.selection.main;
    if (
      e.from >= r.from &&
      e.to <= r.to &&
      e.to - e.from >= (r.to - r.from) / 3 &&
      (!t || (t.main.empty && t.main.from == e.from + e.insert.length)) &&
      n.inputState.composing < 0
    ) {
      let l = r.from < e.from ? s.sliceDoc(r.from, e.from) : "",
        a = r.to > e.to ? s.sliceDoc(e.to, r.to) : "";
      i = s.replaceSelection(
        n.state.toText(
          l + e.insert.sliceString(0, void 0, n.state.lineBreak) + a
        )
      );
    } else {
      let l = s.changes(e),
        a = t && t.main.to <= l.newLength ? t.main : void 0;
      if (
        s.selection.ranges.length > 1 &&
        n.inputState.composing >= 0 &&
        e.to <= r.to &&
        e.to >= r.to - 10
      ) {
        let h = n.state.sliceDoc(e.from, e.to),
          c,
          f = t && zh(n, t.main.head);
        if (f) {
          let p = e.insert.length - (e.to - e.from);
          c = { from: f.from, to: f.to - p };
        } else c = n.state.doc.lineAt(r.head);
        let u = r.to - e.to,
          d = r.to - r.from;
        i = s.changeByRange((p) => {
          if (p.from == r.from && p.to == r.to)
            return { changes: l, range: a || p.map(l) };
          let g = p.to - u,
            m = g - h.length;
          if (
            p.to - p.from != d ||
            n.state.sliceDoc(m, g) != h ||
            (p.to >= c.from && p.from <= c.to)
          )
            return { range: p };
          let b = s.changes({ from: m, to: g, insert: e.insert }),
            k = p.to - r.to;
          return {
            changes: b,
            range: a
              ? w.range(Math.max(0, a.anchor + k), Math.max(0, a.head + k))
              : p.map(b),
          };
        });
      } else i = { changes: l, selection: a && s.selection.replaceRange(a) };
    }
    let o = "input.type";
    return (
      (n.composing ||
        (n.inputState.compositionPendingChange &&
          n.inputState.compositionEndedAt > Date.now() - 50)) &&
        ((n.inputState.compositionPendingChange = !1),
        (o += ".compose"),
        n.inputState.compositionFirstChange &&
          ((o += ".start"), (n.inputState.compositionFirstChange = !1))),
      s.update(i, { userEvent: o, scrollIntoView: !0 })
    );
  }
  function Ip(n, e, t, i) {
    let s = Math.min(n.length, e.length),
      r = 0;
    for (; r < s && n.charCodeAt(r) == e.charCodeAt(r); ) r++;
    if (r == s && n.length == e.length) return null;
    let o = n.length,
      l = e.length;
    for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
      o--, l--;
    if (i == "end") {
      let a = Math.max(0, r - Math.min(o, l));
      t -= o + a - r;
    }
    if (o < r && n.length < e.length) {
      let a = t <= r && t >= o ? r - t : 0;
      (r -= a), (l = r + (l - o)), (o = r);
    } else if (l < r) {
      let a = t <= r && t >= l ? r - t : 0;
      (r -= a), (o = r + (o - l)), (l = r);
    }
    return { from: r, toA: o, toB: l };
  }
  function Lp(n) {
    let e = [];
    if (n.root.activeElement != n.contentDOM) return e;
    let {
      anchorNode: t,
      anchorOffset: i,
      focusNode: s,
      focusOffset: r,
    } = n.observer.selectionRange;
    return (
      t && (e.push(new is(t, i)), (s != t || r != i) && e.push(new is(s, r))), e
    );
  }
  function _p(n, e) {
    if (n.length == 0) return null;
    let t = n[0].pos,
      i = n.length == 2 ? n[1].pos : t;
    return t > -1 && i > -1 ? w.single(t + e, i + e) : null;
  }
  var Np = {
      childList: !0,
      characterData: !0,
      subtree: !0,
      attributes: !0,
      characterDataOldValue: !0,
    },
    Ar = A.ie && A.ie_version <= 11,
    co = class {
      constructor(e) {
        (this.view = e),
          (this.active = !1),
          (this.selectionRange = new Mr()),
          (this.selectionChanged = !1),
          (this.delayedFlush = -1),
          (this.resizeTimeout = -1),
          (this.queue = []),
          (this.delayedAndroidKey = null),
          (this.flushingAndroidKey = -1),
          (this.lastChange = 0),
          (this.scrollTargets = []),
          (this.intersection = null),
          (this.resizeScroll = null),
          (this.intersecting = !1),
          (this.gapIntersection = null),
          (this.gaps = []),
          (this.parentCheck = -1),
          (this.dom = e.contentDOM),
          (this.observer = new MutationObserver((t) => {
            for (let i of t) this.queue.push(i);
            ((A.ie && A.ie_version <= 11) || (A.ios && e.composing)) &&
            t.some(
              (i) =>
                (i.type == "childList" && i.removedNodes.length) ||
                (i.type == "characterData" &&
                  i.oldValue.length > i.target.nodeValue.length)
            )
              ? this.flushSoon()
              : this.flush();
          })),
          Ar &&
            (this.onCharData = (t) => {
              this.queue.push({
                target: t.target,
                type: "characterData",
                oldValue: t.prevValue,
              }),
                this.flushSoon();
            }),
          (this.onSelectionChange = this.onSelectionChange.bind(this)),
          (this.onResize = this.onResize.bind(this)),
          (this.onPrint = this.onPrint.bind(this)),
          (this.onScroll = this.onScroll.bind(this)),
          typeof ResizeObserver == "function" &&
            ((this.resizeScroll = new ResizeObserver(() => {
              var t;
              ((t = this.view.docView) === null || t === void 0
                ? void 0
                : t.lastUpdate) <
                Date.now() - 75 && this.onResize();
            })),
            this.resizeScroll.observe(e.scrollDOM)),
          this.addWindowListeners((this.win = e.win)),
          this.start(),
          typeof IntersectionObserver == "function" &&
            ((this.intersection = new IntersectionObserver(
              (t) => {
                this.parentCheck < 0 &&
                  (this.parentCheck = setTimeout(
                    this.listenForScroll.bind(this),
                    1e3
                  )),
                  t.length > 0 &&
                    t[t.length - 1].intersectionRatio > 0 !=
                      this.intersecting &&
                    ((this.intersecting = !this.intersecting),
                    this.intersecting != this.view.inView &&
                      this.onScrollChanged(document.createEvent("Event")));
              },
              { threshold: [0, 0.001] }
            )),
            this.intersection.observe(this.dom),
            (this.gapIntersection = new IntersectionObserver((t) => {
              t.length > 0 &&
                t[t.length - 1].intersectionRatio > 0 &&
                this.onScrollChanged(document.createEvent("Event"));
            }, {}))),
          this.listenForScroll(),
          this.readSelectionRange();
      }
      onScrollChanged(e) {
        this.view.inputState.runHandlers("scroll", e),
          this.intersecting && this.view.measure();
      }
      onScroll(e) {
        this.intersecting && this.flush(!1), this.onScrollChanged(e);
      }
      onResize() {
        this.resizeTimeout < 0 &&
          (this.resizeTimeout = setTimeout(() => {
            (this.resizeTimeout = -1), this.view.requestMeasure();
          }, 50));
      }
      onPrint() {
        (this.view.viewState.printing = !0),
          this.view.measure(),
          setTimeout(() => {
            (this.view.viewState.printing = !1), this.view.requestMeasure();
          }, 500);
      }
      updateGaps(e) {
        if (
          this.gapIntersection &&
          (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))
        ) {
          this.gapIntersection.disconnect();
          for (let t of e) this.gapIntersection.observe(t);
          this.gaps = e;
        }
      }
      onSelectionChange(e) {
        let t = this.selectionChanged;
        if (!this.readSelectionRange() || this.delayedAndroidKey) return;
        let { view: i } = this,
          s = this.selectionRange;
        if (
          i.state.facet(cs) ? i.root.activeElement != this.dom : !Bn(i.dom, s)
        )
          return;
        let r = s.anchorNode && i.docView.nearest(s.anchorNode);
        if (r && r.ignoreEvent(e)) {
          t || (this.selectionChanged = !1);
          return;
        }
        ((A.ie && A.ie_version <= 11) || (A.android && A.chrome)) &&
        !i.state.selection.main.empty &&
        s.focusNode &&
        Gn(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset)
          ? this.flushSoon()
          : this.flush(!1);
      }
      readSelectionRange() {
        let { view: e } = this,
          t =
            (A.safari &&
              e.root.nodeType == 11 &&
              Ed(this.dom.ownerDocument) == this.dom &&
              zp(this.view)) ||
            zn(e.root);
        if (!t || this.selectionRange.eq(t)) return !1;
        let i = Bn(this.dom, t);
        return i &&
          !this.selectionChanged &&
          e.inputState.lastFocusTime > Date.now() - 200 &&
          e.inputState.lastTouchTime < Date.now() - 300 &&
          Vd(this.dom, t)
          ? ((this.view.inputState.lastFocusTime = 0),
            e.docView.updateSelection(),
            !1)
          : (this.selectionRange.setRange(t),
            i && (this.selectionChanged = !0),
            !0);
      }
      setSelectionRange(e, t) {
        this.selectionRange.set(e.node, e.offset, t.node, t.offset),
          (this.selectionChanged = !1);
      }
      clearSelectionRange() {
        this.selectionRange.set(null, 0, null, 0);
      }
      listenForScroll() {
        this.parentCheck = -1;
        let e = 0,
          t = null;
        for (let i = this.dom; i; )
          if (i.nodeType == 1)
            !t && e < this.scrollTargets.length && this.scrollTargets[e] == i
              ? e++
              : t || (t = this.scrollTargets.slice(0, e)),
              t && t.push(i),
              (i = i.assignedSlot || i.parentNode);
          else if (i.nodeType == 11) i = i.host;
          else break;
        if (
          (e < this.scrollTargets.length &&
            !t &&
            (t = this.scrollTargets.slice(0, e)),
          t)
        ) {
          for (let i of this.scrollTargets)
            i.removeEventListener("scroll", this.onScroll);
          for (let i of (this.scrollTargets = t))
            i.addEventListener("scroll", this.onScroll);
        }
      }
      ignore(e) {
        if (!this.active) return e();
        try {
          return this.stop(), e();
        } finally {
          this.start(), this.clear();
        }
      }
      start() {
        this.active ||
          (this.observer.observe(this.dom, Np),
          Ar &&
            this.dom.addEventListener(
              "DOMCharacterDataModified",
              this.onCharData
            ),
          (this.active = !0));
      }
      stop() {
        this.active &&
          ((this.active = !1),
          this.observer.disconnect(),
          Ar &&
            this.dom.removeEventListener(
              "DOMCharacterDataModified",
              this.onCharData
            ));
      }
      clear() {
        this.processRecords(),
          (this.queue.length = 0),
          (this.selectionChanged = !1);
      }
      delayAndroidKey(e, t) {
        var i;
        if (!this.delayedAndroidKey) {
          let s = () => {
            let r = this.delayedAndroidKey;
            r &&
              (this.clearDelayedAndroidKey(),
              (this.view.inputState.lastKeyCode = r.keyCode),
              (this.view.inputState.lastKeyTime = Date.now()),
              !this.flush() && r.force && si(this.dom, r.key, r.keyCode));
          };
          this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
        }
        (!this.delayedAndroidKey || e == "Enter") &&
          (this.delayedAndroidKey = {
            key: e,
            keyCode: t,
            force:
              this.lastChange < Date.now() - 50 ||
              !!(
                !((i = this.delayedAndroidKey) === null || i === void 0) &&
                i.force
              ),
          });
      }
      clearDelayedAndroidKey() {
        this.win.cancelAnimationFrame(this.flushingAndroidKey),
          (this.delayedAndroidKey = null),
          (this.flushingAndroidKey = -1);
      }
      flushSoon() {
        this.delayedFlush < 0 &&
          (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
            (this.delayedFlush = -1), this.flush();
          }));
      }
      forceFlush() {
        this.delayedFlush >= 0 &&
          (this.view.win.cancelAnimationFrame(this.delayedFlush),
          (this.delayedFlush = -1)),
          this.flush();
      }
      pendingRecords() {
        for (let e of this.observer.takeRecords()) this.queue.push(e);
        return this.queue;
      }
      processRecords() {
        let e = this.pendingRecords();
        e.length && (this.queue = []);
        let t = -1,
          i = -1,
          s = !1;
        for (let r of e) {
          let o = this.readMutation(r);
          o &&
            (o.typeOver && (s = !0),
            t == -1
              ? ({ from: t, to: i } = o)
              : ((t = Math.min(o.from, t)), (i = Math.max(o.to, i))));
        }
        return { from: t, to: i, typeOver: s };
      }
      readChange() {
        let { from: e, to: t, typeOver: i } = this.processRecords(),
          s = this.selectionChanged && Bn(this.dom, this.selectionRange);
        if (e < 0 && !s) return null;
        e > -1 && (this.lastChange = Date.now()),
          (this.view.inputState.lastFocusTime = 0),
          (this.selectionChanged = !1);
        let r = new ho(this.view, e, t, i);
        return (
          (this.view.docView.domChanged = {
            newSel: r.newSel ? r.newSel.main : null,
          }),
          r
        );
      }
      flush(e = !0) {
        if (this.delayedFlush >= 0 || this.delayedAndroidKey) return !1;
        e && this.readSelectionRange();
        let t = this.readChange();
        if (!t) return this.view.requestMeasure(), !1;
        let i = this.view.state,
          s = ac(this.view, t);
        return this.view.state == i && this.view.update([]), s;
      }
      readMutation(e) {
        let t = this.view.docView.nearest(e.target);
        if (!t || t.ignoreMutation(e)) return null;
        if (
          (t.markDirty(e.type == "attributes"),
          e.type == "attributes" && (t.flags |= 4),
          e.type == "childList")
        ) {
          let i = sh(t, e.previousSibling || e.target.previousSibling, -1),
            s = sh(t, e.nextSibling || e.target.nextSibling, 1);
          return {
            from: i ? t.posAfter(i) : t.posAtStart,
            to: s ? t.posBefore(s) : t.posAtEnd,
            typeOver: !1,
          };
        } else
          return e.type == "characterData"
            ? {
                from: t.posAtStart,
                to: t.posAtEnd,
                typeOver: e.target.nodeValue == e.oldValue,
              }
            : null;
      }
      setWindow(e) {
        e != this.win &&
          (this.removeWindowListeners(this.win),
          (this.win = e),
          this.addWindowListeners(this.win));
      }
      addWindowListeners(e) {
        e.addEventListener("resize", this.onResize),
          e.addEventListener("beforeprint", this.onPrint),
          e.addEventListener("scroll", this.onScroll),
          e.document.addEventListener(
            "selectionchange",
            this.onSelectionChange
          );
      }
      removeWindowListeners(e) {
        e.removeEventListener("scroll", this.onScroll),
          e.removeEventListener("resize", this.onResize),
          e.removeEventListener("beforeprint", this.onPrint),
          e.document.removeEventListener(
            "selectionchange",
            this.onSelectionChange
          );
      }
      destroy() {
        var e, t, i;
        this.stop(),
          (e = this.intersection) === null || e === void 0 || e.disconnect(),
          (t = this.gapIntersection) === null || t === void 0 || t.disconnect(),
          (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
        for (let s of this.scrollTargets)
          s.removeEventListener("scroll", this.onScroll);
        this.removeWindowListeners(this.win),
          clearTimeout(this.parentCheck),
          clearTimeout(this.resizeTimeout),
          this.win.cancelAnimationFrame(this.delayedFlush),
          this.win.cancelAnimationFrame(this.flushingAndroidKey);
      }
    };
  function sh(n, e, t) {
    for (; e; ) {
      let i = H.get(e);
      if (i && i.parent == n) return i;
      let s = e.parentNode;
      e = s != n.dom ? s : t > 0 ? e.nextSibling : e.previousSibling;
    }
    return null;
  }
  function zp(n) {
    let e = null;
    function t(a) {
      a.preventDefault(),
        a.stopImmediatePropagation(),
        (e = a.getTargetRanges()[0]);
    }
    if (
      (n.contentDOM.addEventListener("beforeinput", t, !0),
      n.dom.ownerDocument.execCommand("indent"),
      n.contentDOM.removeEventListener("beforeinput", t, !0),
      !e)
    )
      return null;
    let i = e.startContainer,
      s = e.startOffset,
      r = e.endContainer,
      o = e.endOffset,
      l = n.docView.domAtPos(n.state.selection.main.anchor);
    return (
      Gn(l.node, l.offset, r, o) && ([i, s, r, o] = [r, o, i, s]),
      { anchorNode: i, anchorOffset: s, focusNode: r, focusOffset: o }
    );
  }
  var v = class n {
    get state() {
      return this.viewState.state;
    }
    get viewport() {
      return this.viewState.viewport;
    }
    get visibleRanges() {
      return this.viewState.visibleRanges;
    }
    get inView() {
      return this.viewState.inView;
    }
    get composing() {
      return this.inputState.composing > 0;
    }
    get compositionStarted() {
      return this.inputState.composing >= 0;
    }
    get root() {
      return this._root;
    }
    get win() {
      return this.dom.ownerDocument.defaultView || window;
    }
    constructor(e = {}) {
      (this.plugins = []),
        (this.pluginMap = new Map()),
        (this.editorAttrs = {}),
        (this.contentAttrs = {}),
        (this.bidiCache = []),
        (this.destroyed = !1),
        (this.updateState = 2),
        (this.measureScheduled = -1),
        (this.measureRequests = []),
        (this.contentDOM = document.createElement("div")),
        (this.scrollDOM = document.createElement("div")),
        (this.scrollDOM.tabIndex = -1),
        (this.scrollDOM.className = "cm-scroller"),
        this.scrollDOM.appendChild(this.contentDOM),
        (this.announceDOM = document.createElement("div")),
        (this.announceDOM.className = "cm-announced"),
        this.announceDOM.setAttribute("aria-live", "polite"),
        (this.dom = document.createElement("div")),
        this.dom.appendChild(this.announceDOM),
        this.dom.appendChild(this.scrollDOM),
        e.parent && e.parent.appendChild(this.dom);
      let { dispatch: t } = e;
      (this.dispatchTransactions =
        e.dispatchTransactions ||
        (t && ((i) => i.forEach((s) => t(s, this)))) ||
        ((i) => this.update(i))),
        (this.dispatch = this.dispatch.bind(this)),
        (this._root = e.root || Bd(e.parent) || document),
        (this.viewState = new ts(e.state || V.create(e))),
        e.scrollTo &&
          e.scrollTo.is(Yn) &&
          (this.viewState.scrollTarget = e.scrollTo.value.clip(
            this.viewState.state
          )),
        (this.plugins = this.state.facet(Zi).map((i) => new Xi(i)));
      for (let i of this.plugins) i.update(this);
      (this.observer = new co(this)),
        (this.inputState = new Ur(this)),
        this.inputState.ensureHandlers(this.plugins),
        (this.docView = new Kn(this)),
        this.mountStyles(),
        this.updateAttrs(),
        (this.updateState = 0),
        this.requestMeasure();
    }
    dispatch(...e) {
      let t =
        e.length == 1 && e[0] instanceof ae
          ? e
          : e.length == 1 && Array.isArray(e[0])
          ? e[0]
          : [this.state.update(...e)];
      this.dispatchTransactions(t, this);
    }
    update(e) {
      if (this.updateState != 0)
        throw new Error(
          "Calls to EditorView.update are not allowed while an update is in progress"
        );
      let t = !1,
        i = !1,
        s,
        r = this.state;
      for (let u of e) {
        if (u.startState != r)
          throw new RangeError(
            "Trying to update state with a transaction that doesn't start from the previous state."
          );
        r = u.state;
      }
      if (this.destroyed) {
        this.viewState.state = r;
        return;
      }
      let o = this.hasFocus,
        l = 0,
        a = null;
      e.some((u) => u.annotation(ic))
        ? ((this.inputState.notifiedFocused = o), (l = 1))
        : o != this.inputState.notifiedFocused &&
          ((this.inputState.notifiedFocused = o), (a = nc(r, o)), a || (l = 1));
      let h = this.observer.delayedAndroidKey,
        c = null;
      if (
        (h
          ? (this.observer.clearDelayedAndroidKey(),
            (c = this.observer.readChange()),
            ((c && !this.state.doc.eq(r.doc)) ||
              !this.state.selection.eq(r.selection)) &&
              (c = null))
          : this.observer.clear(),
        r.facet(V.phrases) != this.state.facet(V.phrases))
      )
        return this.setState(r);
      (s = Hn.create(this, r, e)), (s.flags |= l);
      let f = this.viewState.scrollTarget;
      try {
        this.updateState = 2;
        for (let u of e) {
          if ((f && (f = f.map(u.changes)), u.scrollIntoView)) {
            let { main: d } = u.state.selection;
            f = new Wi(
              d.empty ? d : w.cursor(d.head, d.head > d.anchor ? -1 : 1)
            );
          }
          for (let d of u.effects) d.is(Yn) && (f = d.value.clip(this.state));
        }
        this.viewState.update(s, f),
          (this.bidiCache = ns.update(this.bidiCache, s.changes)),
          s.empty || (this.updatePlugins(s), this.inputState.update(s)),
          (t = this.docView.update(s)),
          this.state.facet(Ci) != this.styleModules && this.mountStyles(),
          (i = this.updateAttrs()),
          this.showAnnouncements(e),
          this.docView.updateSelection(
            t,
            e.some((u) => u.isUserEvent("select.pointer"))
          );
      } finally {
        this.updateState = 0;
      }
      if (
        (s.startState.facet(Dn) != s.state.facet(Dn) &&
          (this.viewState.mustMeasureContent = !0),
        (t ||
          i ||
          f ||
          this.viewState.mustEnforceCursorAssoc ||
          this.viewState.mustMeasureContent) &&
          this.requestMeasure(),
        !s.empty)
      )
        for (let u of this.state.facet(Ir))
          try {
            u(s);
          } catch (d) {
            be(this.state, d, "update listener");
          }
      (a || c) &&
        Promise.resolve().then(() => {
          a && this.state == a.startState && this.dispatch(a),
            c &&
              !ac(this, c) &&
              h.force &&
              si(this.contentDOM, h.key, h.keyCode);
        });
    }
    setState(e) {
      if (this.updateState != 0)
        throw new Error(
          "Calls to EditorView.setState are not allowed while an update is in progress"
        );
      if (this.destroyed) {
        this.viewState.state = e;
        return;
      }
      this.updateState = 2;
      let t = this.hasFocus;
      try {
        for (let i of this.plugins) i.destroy(this);
        (this.viewState = new ts(e)),
          (this.plugins = e.facet(Zi).map((i) => new Xi(i))),
          this.pluginMap.clear();
        for (let i of this.plugins) i.update(this);
        this.docView.destroy(),
          (this.docView = new Kn(this)),
          this.inputState.ensureHandlers(this.plugins),
          this.mountStyles(),
          this.updateAttrs(),
          (this.bidiCache = []);
      } finally {
        this.updateState = 0;
      }
      t && this.focus(), this.requestMeasure();
    }
    updatePlugins(e) {
      let t = e.startState.facet(Zi),
        i = e.state.facet(Zi);
      if (t != i) {
        let s = [];
        for (let r of i) {
          let o = t.indexOf(r);
          if (o < 0) s.push(new Xi(r));
          else {
            let l = this.plugins[o];
            (l.mustUpdate = e), s.push(l);
          }
        }
        for (let r of this.plugins) r.mustUpdate != e && r.destroy(this);
        (this.plugins = s), this.pluginMap.clear();
      } else for (let s of this.plugins) s.mustUpdate = e;
      for (let s = 0; s < this.plugins.length; s++)
        this.plugins[s].update(this);
      t != i && this.inputState.ensureHandlers(this.plugins);
    }
    measure(e = !0) {
      if (this.destroyed) return;
      if (
        (this.measureScheduled > -1 &&
          this.win.cancelAnimationFrame(this.measureScheduled),
        this.observer.delayedAndroidKey)
      ) {
        (this.measureScheduled = -1), this.requestMeasure();
        return;
      }
      (this.measureScheduled = 0), e && this.observer.forceFlush();
      let t = null,
        i = this.scrollDOM,
        s = i.scrollTop * this.scaleY,
        { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
      Math.abs(s - this.viewState.scrollTop) > 1 && (o = -1),
        (this.viewState.scrollAnchorHeight = -1);
      try {
        for (let l = 0; ; l++) {
          if (o < 0)
            if (Sh(i)) (r = -1), (o = this.viewState.heightMap.height);
            else {
              let d = this.viewState.scrollAnchorAt(s);
              (r = d.from), (o = d.top);
            }
          this.updateState = 1;
          let a = this.viewState.measure(this);
          if (
            !a &&
            !this.measureRequests.length &&
            this.viewState.scrollTarget == null
          )
            break;
          if (l > 5) {
            console.warn(
              this.measureRequests.length
                ? "Measure loop restarted more than 5 times"
                : "Viewport failed to stabilize"
            );
            break;
          }
          let h = [];
          a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
          let c = h.map((d) => {
              try {
                return d.read(this);
              } catch (p) {
                return be(this.state, p), rh;
              }
            }),
            f = Hn.create(this, this.state, []),
            u = !1;
          (f.flags |= a),
            t ? (t.flags |= a) : (t = f),
            (this.updateState = 2),
            f.empty ||
              (this.updatePlugins(f),
              this.inputState.update(f),
              this.updateAttrs(),
              (u = this.docView.update(f)));
          for (let d = 0; d < h.length; d++)
            if (c[d] != rh)
              try {
                let p = h[d];
                p.write && p.write(c[d], this);
              } catch (p) {
                be(this.state, p);
              }
          if (
            (u && this.docView.updateSelection(!0),
            !f.viewportChanged && this.measureRequests.length == 0)
          ) {
            if (this.viewState.editorHeight)
              if (this.viewState.scrollTarget) {
                this.docView.scrollIntoView(this.viewState.scrollTarget),
                  (this.viewState.scrollTarget = null),
                  (o = -1);
                continue;
              } else {
                let p =
                  (r < 0
                    ? this.viewState.heightMap.height
                    : this.viewState.lineBlockAt(r).top) - o;
                if (p > 1 || p < -1) {
                  (s = s + p), (i.scrollTop = s / this.scaleY), (o = -1);
                  continue;
                }
              }
            break;
          }
        }
      } finally {
        (this.updateState = 0), (this.measureScheduled = -1);
      }
      if (t && !t.empty) for (let l of this.state.facet(Ir)) l(t);
    }
    get themeClasses() {
      return (
        oo + " " + (this.state.facet(ro) ? oc : rc) + " " + this.state.facet(Dn)
      );
    }
    updateAttrs() {
      let e = oh(this, Dh, {
          class:
            "cm-editor" +
            (this.hasFocus ? " cm-focused " : " ") +
            this.themeClasses,
        }),
        t = {
          spellcheck: "false",
          autocorrect: "off",
          autocapitalize: "off",
          translate: "no",
          contenteditable: this.state.facet(cs) ? "true" : "false",
          class: "cm-content",
          style: `${A.tabSize}: ${this.state.tabSize}`,
          role: "textbox",
          "aria-multiline": "true",
        };
      this.state.readOnly && (t["aria-readonly"] = "true"), oh(this, Po, t);
      let i = this.observer.ignore(() => {
        let s = Br(this.contentDOM, this.contentAttrs, t),
          r = Br(this.dom, this.editorAttrs, e);
        return s || r;
      });
      return (this.editorAttrs = e), (this.contentAttrs = t), i;
    }
    showAnnouncements(e) {
      let t = !0;
      for (let i of e)
        for (let s of i.effects)
          if (s.is(n.announce)) {
            t && (this.announceDOM.textContent = ""), (t = !1);
            let r = this.announceDOM.appendChild(document.createElement("div"));
            r.textContent = s.value;
          }
    }
    mountStyles() {
      this.styleModules = this.state.facet(Ci);
      let e = this.state.facet(n.cspNonce);
      Ee.mount(
        this.root,
        this.styleModules.concat(qp).reverse(),
        e ? { nonce: e } : void 0
      );
    }
    readMeasured() {
      if (this.updateState == 2)
        throw new Error(
          "Reading the editor layout isn't allowed during an update"
        );
      this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
    }
    requestMeasure(e) {
      if (
        (this.measureScheduled < 0 &&
          (this.measureScheduled = this.win.requestAnimationFrame(() =>
            this.measure()
          )),
        e)
      ) {
        if (this.measureRequests.indexOf(e) > -1) return;
        if (e.key != null) {
          for (let t = 0; t < this.measureRequests.length; t++)
            if (this.measureRequests[t].key === e.key) {
              this.measureRequests[t] = e;
              return;
            }
        }
        this.measureRequests.push(e);
      }
    }
    plugin(e) {
      let t = this.pluginMap.get(e);
      return (
        (t === void 0 || (t && t.spec != e)) &&
          this.pluginMap.set(
            e,
            (t = this.plugins.find((i) => i.spec == e) || null)
          ),
        t && t.update(this).value
      );
    }
    get documentTop() {
      return (
        this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop
      );
    }
    get documentPadding() {
      return {
        top: this.viewState.paddingTop,
        bottom: this.viewState.paddingBottom,
      };
    }
    get scaleX() {
      return this.viewState.scaleX;
    }
    get scaleY() {
      return this.viewState.scaleY;
    }
    elementAtHeight(e) {
      return this.readMeasured(), this.viewState.elementAtHeight(e);
    }
    lineBlockAtHeight(e) {
      return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
    }
    get viewportLineBlocks() {
      return this.viewState.viewportLines;
    }
    lineBlockAt(e) {
      return this.viewState.lineBlockAt(e);
    }
    get contentHeight() {
      return this.viewState.contentHeight;
    }
    moveByChar(e, t, i) {
      return Tr(this, e, La(this, e, t, i));
    }
    moveByGroup(e, t) {
      return Tr(
        this,
        e,
        La(this, e, t, (i) => gp(this, e.head, i))
      );
    }
    moveToLineBoundary(e, t, i = !0) {
      return mp(this, e, t, i);
    }
    moveVertically(e, t, i) {
      return Tr(this, e, yp(this, e, t, i));
    }
    domAtPos(e) {
      return this.docView.domAtPos(e);
    }
    posAtDOM(e, t = 0) {
      return this.docView.posFromDOM(e, t);
    }
    posAtCoords(e, t = !0) {
      return this.readMeasured(), Uh(this, e, t);
    }
    coordsAtPos(e, t = 1) {
      this.readMeasured();
      let i = this.docView.coordsAt(e, t);
      if (!i || i.left == i.right) return i;
      let s = this.state.doc.lineAt(e),
        r = this.bidiSpans(s),
        o = r[Je.find(r, e - s.from, -1, t)];
      return ko(i, (o.dir == U.LTR) == t > 0);
    }
    coordsForChar(e) {
      return this.readMeasured(), this.docView.coordsForChar(e);
    }
    get defaultCharacterWidth() {
      return this.viewState.heightOracle.charWidth;
    }
    get defaultLineHeight() {
      return this.viewState.heightOracle.lineHeight;
    }
    get textDirection() {
      return this.viewState.defaultTextDirection;
    }
    textDirectionAt(e) {
      return !this.state.facet(Mh) ||
        e < this.viewport.from ||
        e > this.viewport.to
        ? this.textDirection
        : (this.readMeasured(), this.docView.textDirectionAt(e));
    }
    get lineWrapping() {
      return this.viewState.heightOracle.lineWrapping;
    }
    bidiSpans(e) {
      if (e.length > Gp) return _h(e.length);
      let t = this.textDirectionAt(e.from),
        i;
      for (let r of this.bidiCache)
        if (
          r.from == e.from &&
          r.dir == t &&
          (r.fresh || Lh(r.isolates, (i = ja(this, e.from, e.to))))
        )
          return r.order;
      i || (i = ja(this, e.from, e.to));
      let s = ip(e.text, t, i);
      return this.bidiCache.push(new ns(e.from, e.to, t, i, !0, s)), s;
    }
    get hasFocus() {
      var e;
      return (
        (this.dom.ownerDocument.hasFocus() ||
          (A.safari &&
            ((e = this.inputState) === null || e === void 0
              ? void 0
              : e.lastContextMenu) >
              Date.now() - 3e4)) &&
        this.root.activeElement == this.contentDOM
      );
    }
    focus() {
      this.observer.ignore(() => {
        bh(this.contentDOM), this.docView.updateSelection();
      });
    }
    setRoot(e) {
      this._root != e &&
        ((this._root = e),
        this.observer.setWindow(
          (e.nodeType == 9 ? e : e.ownerDocument).defaultView || window
        ),
        this.mountStyles());
    }
    destroy() {
      for (let e of this.plugins) e.destroy(this);
      (this.plugins = []),
        this.inputState.destroy(),
        this.docView.destroy(),
        this.dom.remove(),
        this.observer.destroy(),
        this.measureScheduled > -1 &&
          this.win.cancelAnimationFrame(this.measureScheduled),
        (this.destroyed = !0);
    }
    static scrollIntoView(e, t = {}) {
      return Yn.of(
        new Wi(
          typeof e == "number" ? w.cursor(e) : e,
          t.y,
          t.x,
          t.yMargin,
          t.xMargin
        )
      );
    }
    scrollSnapshot() {
      let { scrollTop: e, scrollLeft: t } = this.scrollDOM,
        i = this.viewState.scrollAnchorAt(e);
      return Yn.of(
        new Wi(w.cursor(i.from), "start", "start", i.top - e, t, !0)
      );
    }
    static domEventHandlers(e) {
      return J.define(() => ({}), { eventHandlers: e });
    }
    static domEventObservers(e) {
      return J.define(() => ({}), { eventObservers: e });
    }
    static theme(e, t) {
      let i = Ee.newName(),
        s = [Dn.of(i), Ci.of(lo(`.${i}`, e))];
      return t && t.dark && s.push(ro.of(!0)), s;
    }
    static baseTheme(e) {
      return Le.lowest(Ci.of(lo("." + oo, e, lc)));
    }
    static findFromDOM(e) {
      var t;
      let i = e.querySelector(".cm-content"),
        s = (i && H.get(i)) || H.get(e);
      return (
        ((t = s?.rootView) === null || t === void 0 ? void 0 : t.view) || null
      );
    }
  };
  v.styleModule = Ci;
  v.inputHandler = Wh;
  v.focusChangeEffect = Xh;
  v.perLineTextDirection = Mh;
  v.exceptionSink = Yh;
  v.updateListener = Ir;
  v.editable = cs;
  v.mouseSelectionStyle = Rh;
  v.dragMovesSelection = Ah;
  v.clickAddsSelectionRange = Th;
  v.decorations = _i;
  v.atomicRanges = $o;
  v.bidiIsolatedRanges = jh;
  v.scrollMargins = qh;
  v.darkTheme = ro;
  v.cspNonce = T.define({ combine: (n) => (n.length ? n[0] : "") });
  v.contentAttributes = Po;
  v.editorAttributes = Dh;
  v.lineWrapping = v.contentAttributes.of({ class: "cm-lineWrapping" });
  v.announce = Y.define();
  var Gp = 4096,
    rh = {},
    ns = class n {
      constructor(e, t, i, s, r, o) {
        (this.from = e),
          (this.to = t),
          (this.dir = i),
          (this.isolates = s),
          (this.fresh = r),
          (this.order = o);
      }
      static update(e, t) {
        if (t.empty && !e.some((r) => r.fresh)) return e;
        let i = [],
          s = e.length ? e[e.length - 1].dir : U.LTR;
        for (let r = Math.max(0, e.length - 10); r < e.length; r++) {
          let o = e[r];
          o.dir == s &&
            !t.touchesRange(o.from, o.to) &&
            i.push(
              new n(
                t.mapPos(o.from, 1),
                t.mapPos(o.to, -1),
                o.dir,
                o.isolates,
                !1,
                o.order
              )
            );
        }
        return i;
      }
    };
  function oh(n, e, t) {
    for (let i = n.state.facet(e), s = i.length - 1; s >= 0; s--) {
      let r = i[s],
        o = typeof r == "function" ? r(n) : r;
      o && qr(o, t);
    }
    return t;
  }
  var Up = A.mac ? "mac" : A.windows ? "win" : A.linux ? "linux" : "key";
  function Fp(n, e) {
    let t = n.split(/-(?!$)/),
      i = t[t.length - 1];
    i == "Space" && (i = " ");
    let s, r, o, l;
    for (let a = 0; a < t.length - 1; ++a) {
      let h = t[a];
      if (/^(cmd|meta|m)$/i.test(h)) l = !0;
      else if (/^a(lt)?$/i.test(h)) s = !0;
      else if (/^(c|ctrl|control)$/i.test(h)) r = !0;
      else if (/^s(hift)?$/i.test(h)) o = !0;
      else if (/^mod$/i.test(h)) e == "mac" ? (l = !0) : (r = !0);
      else throw new Error("Unrecognized modifier name: " + h);
    }
    return (
      s && (i = "Alt-" + i),
      r && (i = "Ctrl-" + i),
      l && (i = "Meta-" + i),
      o && (i = "Shift-" + i),
      i
    );
  }
  function jn(n, e, t) {
    return (
      e.altKey && (n = "Alt-" + n),
      e.ctrlKey && (n = "Ctrl-" + n),
      e.metaKey && (n = "Meta-" + n),
      t !== !1 && e.shiftKey && (n = "Shift-" + n),
      n
    );
  }
  var Hp = Le.default(
      v.domEventHandlers({
        keydown(n, e) {
          return fc(hc(e.state), n, e, "editor");
        },
      })
    ),
    bt = T.define({ enables: Hp }),
    lh = new WeakMap();
  function hc(n) {
    let e = n.facet(bt),
      t = lh.get(e);
    return t || lh.set(e, (t = Jp(e.reduce((i, s) => i.concat(s), [])))), t;
  }
  function cc(n, e, t) {
    return fc(hc(n.state), e, n, t);
  }
  var pt = null,
    Kp = 4e3;
  function Jp(n, e = Up) {
    let t = Object.create(null),
      i = Object.create(null),
      s = (o, l) => {
        let a = i[o];
        if (a == null) i[o] = l;
        else if (a != l)
          throw new Error(
            "Key binding " +
              o +
              " is used both as a regular binding and as a multi-stroke prefix"
          );
      },
      r = (o, l, a, h, c) => {
        var f, u;
        let d = t[o] || (t[o] = Object.create(null)),
          p = l.split(/ (?!$)/).map((b) => Fp(b, e));
        for (let b = 1; b < p.length; b++) {
          let k = p.slice(0, b).join(" ");
          s(k, !0),
            d[k] ||
              (d[k] = {
                preventDefault: !0,
                stopPropagation: !1,
                run: [
                  ($) => {
                    let P = (pt = { view: $, prefix: k, scope: o });
                    return (
                      setTimeout(() => {
                        pt == P && (pt = null);
                      }, Kp),
                      !0
                    );
                  },
                ],
              });
        }
        let g = p.join(" ");
        s(g, !1);
        let m =
          d[g] ||
          (d[g] = {
            preventDefault: !1,
            stopPropagation: !1,
            run:
              ((u = (f = d._any) === null || f === void 0 ? void 0 : f.run) ===
                null || u === void 0
                ? void 0
                : u.slice()) || [],
          });
        a && m.run.push(a),
          h && (m.preventDefault = !0),
          c && (m.stopPropagation = !0);
      };
    for (let o of n) {
      let l = o.scope ? o.scope.split(" ") : ["editor"];
      if (o.any)
        for (let h of l) {
          let c = t[h] || (t[h] = Object.create(null));
          c._any ||
            (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
          for (let f in c) c[f].run.push(o.any);
        }
      let a = o[e] || o.key;
      if (a)
        for (let h of l)
          r(h, a, o.run, o.preventDefault, o.stopPropagation),
            o.shift &&
              r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
    }
    return t;
  }
  function fc(n, e, t, i) {
    let s = Aa(e),
      r = ne(s, 0),
      o = Oe(r) == s.length && s != " ",
      l = "",
      a = !1,
      h = !1,
      c = !1;
    pt &&
      pt.view == t &&
      pt.scope == i &&
      ((l = pt.prefix + " "),
      Hh.indexOf(e.keyCode) < 0 && ((h = !0), (pt = null)));
    let f = new Set(),
      u = (m) => {
        if (m) {
          for (let b of m.run)
            if (!f.has(b) && (f.add(b), b(t, e)))
              return m.stopPropagation && (c = !0), !0;
          m.preventDefault && (m.stopPropagation && (c = !0), (h = !0));
        }
        return !1;
      },
      d = n[i],
      p,
      g;
    return (
      d &&
        (u(d[l + jn(s, e, !o)])
          ? (a = !0)
          : o &&
            (e.altKey || e.metaKey || e.ctrlKey) &&
            !(A.windows && e.ctrlKey && e.altKey) &&
            (p = at[e.keyCode]) &&
            p != s
          ? (u(d[l + jn(p, e, !0)]) ||
              (e.shiftKey &&
                (g = Jt[e.keyCode]) != s &&
                g != p &&
                u(d[l + jn(g, e, !1)]))) &&
            (a = !0)
          : o && e.shiftKey && u(d[l + jn(s, e, !0)]) && (a = !0),
        !a && u(d._any) && (a = !0)),
      h && (a = !0),
      a && c && e.stopPropagation(),
      a
    );
  }
  var zi = class n {
    constructor(e, t, i, s, r) {
      (this.className = e),
        (this.left = t),
        (this.top = i),
        (this.width = s),
        (this.height = r);
    }
    draw() {
      let e = document.createElement("div");
      return (e.className = this.className), this.adjust(e), e;
    }
    update(e, t) {
      return t.className != this.className ? !1 : (this.adjust(e), !0);
    }
    adjust(e) {
      (e.style.left = this.left + "px"),
        (e.style.top = this.top + "px"),
        this.width != null && (e.style.width = this.width + "px"),
        (e.style.height = this.height + "px");
    }
    eq(e) {
      return (
        this.left == e.left &&
        this.top == e.top &&
        this.width == e.width &&
        this.height == e.height &&
        this.className == e.className
      );
    }
    static forRange(e, t, i) {
      if (i.empty) {
        let s = e.coordsAtPos(i.head, i.assoc || 1);
        if (!s) return [];
        let r = uc(e);
        return [
          new n(t, s.left - r.left, s.top - r.top, null, s.bottom - s.top),
        ];
      } else return eO(e, t, i);
    }
  };
  function uc(n) {
    let e = n.scrollDOM.getBoundingClientRect();
    return {
      left:
        (n.textDirection == U.LTR
          ? e.left
          : e.right - n.scrollDOM.clientWidth * n.scaleX) -
        n.scrollDOM.scrollLeft * n.scaleX,
      top: e.top - n.scrollDOM.scrollTop * n.scaleY,
    };
  }
  function ah(n, e, t) {
    let i = w.cursor(e);
    return {
      from: Math.max(t.from, n.moveToLineBoundary(i, !1, !0).from),
      to: Math.min(t.to, n.moveToLineBoundary(i, !0, !0).from),
      type: ye.Text,
    };
  }
  function eO(n, e, t) {
    if (t.to <= n.viewport.from || t.from >= n.viewport.to) return [];
    let i = Math.max(t.from, n.viewport.from),
      s = Math.min(t.to, n.viewport.to),
      r = n.textDirection == U.LTR,
      o = n.contentDOM,
      l = o.getBoundingClientRect(),
      a = uc(n),
      h = o.querySelector(".cm-line"),
      c = h && window.getComputedStyle(h),
      f =
        l.left +
        (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0),
      u = l.right - (c ? parseInt(c.paddingRight) : 0),
      d = Gr(n, i),
      p = Gr(n, s),
      g = d.type == ye.Text ? d : null,
      m = p.type == ye.Text ? p : null;
    if (
      (g && (n.lineWrapping || d.widgetLineBreaks) && (g = ah(n, i, g)),
      m && (n.lineWrapping || p.widgetLineBreaks) && (m = ah(n, s, m)),
      g && m && g.from == m.from)
    )
      return k($(t.from, t.to, g));
    {
      let S = g ? $(t.from, null, g) : P(d, !1),
        C = m ? $(null, t.to, m) : P(p, !0),
        Z = [];
      return (
        (g || d).to < (m || p).from - (g && m ? 1 : 0) ||
        (d.widgetLineBreaks > 1 && S.bottom + n.defaultLineHeight / 2 < C.top)
          ? Z.push(b(f, S.bottom, u, C.top))
          : S.bottom < C.top &&
            n.elementAtHeight((S.bottom + C.top) / 2).type == ye.Text &&
            (S.bottom = C.top = (S.bottom + C.top) / 2),
        k(S).concat(Z).concat(k(C))
      );
    }
    function b(S, C, Z, X) {
      return new zi(e, S - a.left, C - a.top - 0.01, Z - S, X - C + 0.01);
    }
    function k({ top: S, bottom: C, horizontal: Z }) {
      let X = [];
      for (let D = 0; D < Z.length; D += 2) X.push(b(Z[D], S, Z[D + 1], C));
      return X;
    }
    function $(S, C, Z) {
      let X = 1e9,
        D = -1e9,
        q = [];
      function E(B, K, Se, xe, ve) {
        let Xe = n.coordsAtPos(B, B == Z.to ? -2 : 2),
          oe = n.coordsAtPos(Se, Se == Z.from ? 2 : -2);
        !Xe ||
          !oe ||
          ((X = Math.min(Xe.top, oe.top, X)),
          (D = Math.max(Xe.bottom, oe.bottom, D)),
          ve == U.LTR
            ? q.push(r && K ? f : Xe.left, r && xe ? u : oe.right)
            : q.push(!r && xe ? f : oe.left, !r && K ? u : Xe.right));
      }
      let M = S ?? Z.from,
        N = C ?? Z.to;
      for (let B of n.visibleRanges)
        if (B.to > M && B.from < N)
          for (let K = Math.max(B.from, M), Se = Math.min(B.to, N); ; ) {
            let xe = n.state.doc.lineAt(K);
            for (let ve of n.bidiSpans(xe)) {
              let Xe = ve.from + xe.from,
                oe = ve.to + xe.from;
              if (Xe >= Se) break;
              oe > K &&
                E(
                  Math.max(Xe, K),
                  S == null && Xe <= M,
                  Math.min(oe, Se),
                  C == null && oe >= N,
                  ve.dir
                );
            }
            if (((K = xe.to + 1), K >= Se)) break;
          }
      return (
        q.length == 0 && E(M, S == null, N, C == null, n.textDirection),
        { top: X, bottom: D, horizontal: q }
      );
    }
    function P(S, C) {
      let Z = l.top + (C ? S.top : S.bottom);
      return { top: Z, bottom: Z, horizontal: [] };
    }
  }
  function tO(n, e) {
    return n.constructor == e.constructor && n.eq(e);
  }
  var fo = class {
      constructor(e, t) {
        (this.view = e),
          (this.layer = t),
          (this.drawn = []),
          (this.scaleX = 1),
          (this.scaleY = 1),
          (this.measureReq = {
            read: this.measure.bind(this),
            write: this.draw.bind(this),
          }),
          (this.dom = e.scrollDOM.appendChild(document.createElement("div"))),
          this.dom.classList.add("cm-layer"),
          t.above && this.dom.classList.add("cm-layer-above"),
          t.class && this.dom.classList.add(t.class),
          this.scale(),
          this.dom.setAttribute("aria-hidden", "true"),
          this.setOrder(e.state),
          e.requestMeasure(this.measureReq),
          t.mount && t.mount(this.dom, e);
      }
      update(e) {
        e.startState.facet(Ln) != e.state.facet(Ln) && this.setOrder(e.state),
          (this.layer.update(e, this.dom) || e.geometryChanged) &&
            (this.scale(), e.view.requestMeasure(this.measureReq));
      }
      setOrder(e) {
        let t = 0,
          i = e.facet(Ln);
        for (; t < i.length && i[t] != this.layer; ) t++;
        this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
      }
      measure() {
        return this.layer.markers(this.view);
      }
      scale() {
        let { scaleX: e, scaleY: t } = this.view;
        (e != this.scaleX || t != this.scaleY) &&
          ((this.scaleX = e),
          (this.scaleY = t),
          (this.dom.style.transform = `scale(${1 / e}, ${1 / t})`));
      }
      draw(e) {
        if (
          e.length != this.drawn.length ||
          e.some((t, i) => !tO(t, this.drawn[i]))
        ) {
          let t = this.dom.firstChild,
            i = 0;
          for (let s of e)
            s.update &&
            t &&
            s.constructor &&
            this.drawn[i].constructor &&
            s.update(t, this.drawn[i])
              ? ((t = t.nextSibling), i++)
              : this.dom.insertBefore(s.draw(), t);
          for (; t; ) {
            let s = t.nextSibling;
            t.remove(), (t = s);
          }
          this.drawn = e;
        }
      }
      destroy() {
        this.layer.destroy && this.layer.destroy(this.dom, this.view),
          this.dom.remove();
      }
    },
    Ln = T.define();
  function dc(n) {
    return [J.define((e) => new fo(e, n)), Ln.of(n)];
  }
  var pc = !A.ios,
    Gi = T.define({
      combine(n) {
        return fe(
          n,
          { cursorBlinkRate: 1200, drawRangeCursor: !0 },
          {
            cursorBlinkRate: (e, t) => Math.min(e, t),
            drawRangeCursor: (e, t) => e || t,
          }
        );
      },
    });
  function Oc(n = {}) {
    return [Gi.of(n), iO, nO, sO, Eh.of(!0)];
  }
  function mc(n) {
    return n.startState.facet(Gi) != n.state.facet(Gi);
  }
  var iO = dc({
    above: !0,
    markers(n) {
      let { state: e } = n,
        t = e.facet(Gi),
        i = [];
      for (let s of e.selection.ranges) {
        let r = s == e.selection.main;
        if (s.empty ? !r || pc : t.drawRangeCursor) {
          let o = r
              ? "cm-cursor cm-cursor-primary"
              : "cm-cursor cm-cursor-secondary",
            l = s.empty ? s : w.cursor(s.head, s.head > s.anchor ? -1 : 1);
          for (let a of zi.forRange(n, o, l)) i.push(a);
        }
      }
      return i;
    },
    update(n, e) {
      n.transactions.some((i) => i.selection) &&
        (e.style.animationName =
          e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
      let t = mc(n);
      return t && hh(n.state, e), n.docChanged || n.selectionSet || t;
    },
    mount(n, e) {
      hh(e.state, n);
    },
    class: "cm-cursorLayer",
  });
  function hh(n, e) {
    e.style.animationDuration = n.facet(Gi).cursorBlinkRate + "ms";
  }
  var nO = dc({
      above: !1,
      markers(n) {
        return n.state.selection.ranges
          .map((e) =>
            e.empty ? [] : zi.forRange(n, "cm-selectionBackground", e)
          )
          .reduce((e, t) => e.concat(t));
      },
      update(n, e) {
        return n.docChanged || n.selectionSet || n.viewportChanged || mc(n);
      },
      class: "cm-selectionLayer",
    }),
    uo = {
      ".cm-line": {
        "& ::selection": { backgroundColor: "transparent !important" },
        "&::selection": { backgroundColor: "transparent !important" },
      },
    };
  pc &&
    ((uo[".cm-line"].caretColor = "transparent !important"),
    (uo[".cm-content"] = { caretColor: "transparent !important" }));
  var sO = Le.highest(v.theme(uo)),
    gc = Y.define({
      map(n, e) {
        return n == null ? null : e.mapPos(n);
      },
    }),
    Ri = F.define({
      create() {
        return null;
      },
      update(n, e) {
        return (
          n != null && (n = e.changes.mapPos(n)),
          e.effects.reduce((t, i) => (i.is(gc) ? i.value : t), n)
        );
      },
    }),
    rO = J.fromClass(
      class {
        constructor(n) {
          (this.view = n),
            (this.cursor = null),
            (this.measureReq = {
              read: this.readPos.bind(this),
              write: this.drawCursor.bind(this),
            });
        }
        update(n) {
          var e;
          let t = n.state.field(Ri);
          t == null
            ? this.cursor != null &&
              ((e = this.cursor) === null || e === void 0 || e.remove(),
              (this.cursor = null))
            : (this.cursor ||
                ((this.cursor = this.view.scrollDOM.appendChild(
                  document.createElement("div")
                )),
                (this.cursor.className = "cm-dropCursor")),
              (n.startState.field(Ri) != t ||
                n.docChanged ||
                n.geometryChanged) &&
                this.view.requestMeasure(this.measureReq));
        }
        readPos() {
          let { view: n } = this,
            e = n.state.field(Ri),
            t = e != null && n.coordsAtPos(e);
          if (!t) return null;
          let i = n.scrollDOM.getBoundingClientRect();
          return {
            left: t.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
            top: t.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
            height: t.bottom - t.top,
          };
        }
        drawCursor(n) {
          if (this.cursor) {
            let { scaleX: e, scaleY: t } = this.view;
            n
              ? ((this.cursor.style.left = n.left / e + "px"),
                (this.cursor.style.top = n.top / t + "px"),
                (this.cursor.style.height = n.height / t + "px"))
              : (this.cursor.style.left = "-100000px");
          }
        }
        destroy() {
          this.cursor && this.cursor.remove();
        }
        setDropPos(n) {
          this.view.state.field(Ri) != n &&
            this.view.dispatch({ effects: gc.of(n) });
        }
      },
      {
        eventObservers: {
          dragover(n) {
            this.setDropPos(
              this.view.posAtCoords({ x: n.clientX, y: n.clientY })
            );
          },
          dragleave(n) {
            (n.target == this.view.contentDOM ||
              !this.view.contentDOM.contains(n.relatedTarget)) &&
              this.setDropPos(null);
          },
          dragend() {
            this.setDropPos(null);
          },
          drop() {
            this.setDropPos(null);
          },
        },
      }
    );
  function yc() {
    return [Ri, rO];
  }
  function ch(n, e, t, i, s) {
    e.lastIndex = 0;
    for (
      let r = n.iterRange(t, i), o = t, l;
      !r.next().done;
      o += r.value.length
    )
      if (!r.lineBreak) for (; (l = e.exec(r.value)); ) s(o + l.index, l);
  }
  function oO(n, e) {
    let t = n.visibleRanges;
    if (
      t.length == 1 &&
      t[0].from == n.viewport.from &&
      t[0].to == n.viewport.to
    )
      return t;
    let i = [];
    for (let { from: s, to: r } of t)
      (s = Math.max(n.state.doc.lineAt(s).from, s - e)),
        (r = Math.min(n.state.doc.lineAt(r).to, r + e)),
        i.length && i[i.length - 1].to >= s
          ? (i[i.length - 1].to = r)
          : i.push({ from: s, to: r });
    return i;
  }
  var po = class {
      constructor(e) {
        let {
          regexp: t,
          decoration: i,
          decorate: s,
          boundary: r,
          maxLength: o = 1e3,
        } = e;
        if (!t.global)
          throw new RangeError(
            "The regular expression given to MatchDecorator should have its 'g' flag set"
          );
        if (((this.regexp = t), s))
          this.addMatch = (l, a, h, c) => s(c, h, h + l[0].length, l, a);
        else if (typeof i == "function")
          this.addMatch = (l, a, h, c) => {
            let f = i(l, a, h);
            f && c(h, h + l[0].length, f);
          };
        else if (i) this.addMatch = (l, a, h, c) => c(h, h + l[0].length, i);
        else
          throw new RangeError(
            "Either 'decorate' or 'decoration' should be provided to MatchDecorator"
          );
        (this.boundary = r), (this.maxLength = o);
      }
      createDeco(e) {
        let t = new Ie(),
          i = t.add.bind(t);
        for (let { from: s, to: r } of oO(e, this.maxLength))
          ch(e.state.doc, this.regexp, s, r, (o, l) =>
            this.addMatch(l, e, o, i)
          );
        return t.finish();
      }
      updateDeco(e, t) {
        let i = 1e9,
          s = -1;
        return (
          e.docChanged &&
            e.changes.iterChanges((r, o, l, a) => {
              a > e.view.viewport.from &&
                l < e.view.viewport.to &&
                ((i = Math.min(l, i)), (s = Math.max(a, s)));
            }),
          e.viewportChanged || s - i > 1e3
            ? this.createDeco(e.view)
            : s > -1
            ? this.updateRange(e.view, t.map(e.changes), i, s)
            : t
        );
      }
      updateRange(e, t, i, s) {
        for (let r of e.visibleRanges) {
          let o = Math.max(r.from, i),
            l = Math.min(r.to, s);
          if (l > o) {
            let a = e.state.doc.lineAt(o),
              h = a.to < l ? e.state.doc.lineAt(l) : a,
              c = Math.max(r.from, a.from),
              f = Math.min(r.to, h.to);
            if (this.boundary) {
              for (; o > a.from; o--)
                if (this.boundary.test(a.text[o - 1 - a.from])) {
                  c = o;
                  break;
                }
              for (; l < h.to; l++)
                if (this.boundary.test(h.text[l - h.from])) {
                  f = l;
                  break;
                }
            }
            let u = [],
              d,
              p = (g, m, b) => u.push(b.range(g, m));
            if (a == h)
              for (
                this.regexp.lastIndex = c - a.from;
                (d = this.regexp.exec(a.text)) && d.index < f - a.from;

              )
                this.addMatch(d, e, d.index + a.from, p);
            else
              ch(e.state.doc, this.regexp, c, f, (g, m) =>
                this.addMatch(m, e, g, p)
              );
            t = t.update({
              filterFrom: c,
              filterTo: f,
              filter: (g, m) => g < c || m > f,
              add: u,
            });
          }
        }
        return t;
      }
    },
    Oo = /x/.unicode != null ? "gu" : "g",
    lO = new RegExp(
      `[\0-\b
-\x7F-\x9F\xAD\u061C\u200B\u200E\u200F\u2028\u2029\u202D\u202E\u2066\u2067\u2069\uFEFF\uFFF9-\uFFFC]`,
      Oo
    ),
    aO = {
      0: "null",
      7: "bell",
      8: "backspace",
      10: "newline",
      11: "vertical tab",
      13: "carriage return",
      27: "escape",
      8203: "zero width space",
      8204: "zero width non-joiner",
      8205: "zero width joiner",
      8206: "left-to-right mark",
      8207: "right-to-left mark",
      8232: "line separator",
      8237: "left-to-right override",
      8238: "right-to-left override",
      8294: "left-to-right isolate",
      8295: "right-to-left isolate",
      8297: "pop directional isolate",
      8233: "paragraph separator",
      65279: "zero width no-break space",
      65532: "object replacement",
    },
    Rr = null;
  function hO() {
    var n;
    if (Rr == null && typeof document < "u" && document.body) {
      let e = document.body.style;
      Rr =
        ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
    }
    return Rr || !1;
  }
  var _n = T.define({
    combine(n) {
      let e = fe(n, { render: null, specialChars: lO, addSpecialChars: null });
      return (
        (e.replaceTabs = !hO()) &&
          (e.specialChars = new RegExp("	|" + e.specialChars.source, Oo)),
        e.addSpecialChars &&
          (e.specialChars = new RegExp(
            e.specialChars.source + "|" + e.addSpecialChars.source,
            Oo
          )),
        e
      );
    },
  });
  function bc(n = {}) {
    return [_n.of(n), cO()];
  }
  var fh = null;
  function cO() {
    return (
      fh ||
      (fh = J.fromClass(
        class {
          constructor(n) {
            (this.view = n),
              (this.decorations = R.none),
              (this.decorationCache = Object.create(null)),
              (this.decorator = this.makeDecorator(n.state.facet(_n))),
              (this.decorations = this.decorator.createDeco(n));
          }
          makeDecorator(n) {
            return new po({
              regexp: n.specialChars,
              decoration: (e, t, i) => {
                let { doc: s } = t.state,
                  r = ne(e[0], 0);
                if (r == 9) {
                  let o = s.lineAt(i),
                    l = t.state.tabSize,
                    a = lt(o.text, l, i - o.from);
                  return R.replace({
                    widget: new go(
                      ((l - (a % l)) * this.view.defaultCharacterWidth) /
                        this.view.scaleX
                    ),
                  });
                }
                return (
                  this.decorationCache[r] ||
                  (this.decorationCache[r] = R.replace({
                    widget: new mo(n, r),
                  }))
                );
              },
              boundary: n.replaceTabs ? void 0 : /[^]/,
            });
          }
          update(n) {
            let e = n.state.facet(_n);
            n.startState.facet(_n) != e
              ? ((this.decorator = this.makeDecorator(e)),
                (this.decorations = this.decorator.createDeco(n.view)))
              : (this.decorations = this.decorator.updateDeco(
                  n,
                  this.decorations
                ));
          }
        },
        { decorations: (n) => n.decorations }
      ))
    );
  }
  var fO = "\u2022";
  function uO(n) {
    return n >= 32 ? fO : n == 10 ? "\u2424" : String.fromCharCode(9216 + n);
  }
  var mo = class extends Qe {
      constructor(e, t) {
        super(), (this.options = e), (this.code = t);
      }
      eq(e) {
        return e.code == this.code;
      }
      toDOM(e) {
        let t = uO(this.code),
          i =
            e.state.phrase("Control character") +
            " " +
            (aO[this.code] || "0x" + this.code.toString(16)),
          s = this.options.render && this.options.render(this.code, i, t);
        if (s) return s;
        let r = document.createElement("span");
        return (
          (r.textContent = t),
          (r.title = i),
          r.setAttribute("aria-label", i),
          (r.className = "cm-specialChar"),
          r
        );
      }
      ignoreEvent() {
        return !1;
      }
    },
    go = class extends Qe {
      constructor(e) {
        super(), (this.width = e);
      }
      eq(e) {
        return e.width == this.width;
      }
      toDOM() {
        let e = document.createElement("span");
        return (
          (e.textContent = "	"),
          (e.className = "cm-tab"),
          (e.style.width = this.width + "px"),
          e
        );
      }
      ignoreEvent() {
        return !1;
      }
    };
  function wc() {
    return pO;
  }
  var dO = R.line({ class: "cm-activeLine" }),
    pO = J.fromClass(
      class {
        constructor(n) {
          this.decorations = this.getDeco(n);
        }
        update(n) {
          (n.docChanged || n.selectionSet) &&
            (this.decorations = this.getDeco(n.view));
        }
        getDeco(n) {
          let e = -1,
            t = [];
          for (let i of n.state.selection.ranges) {
            let s = n.lineBlockAt(i.head);
            s.from > e && (t.push(dO.range(s.from)), (e = s.from));
          }
          return R.set(t);
        }
      },
      { decorations: (n) => n.decorations }
    );
  var yo = 2e3;
  function OO(n, e, t) {
    let i = Math.min(e.line, t.line),
      s = Math.max(e.line, t.line),
      r = [];
    if (e.off > yo || t.off > yo || e.col < 0 || t.col < 0) {
      let o = Math.min(e.off, t.off),
        l = Math.max(e.off, t.off);
      for (let a = i; a <= s; a++) {
        let h = n.doc.line(a);
        h.length <= l && r.push(w.range(h.from + o, h.to + l));
      }
    } else {
      let o = Math.min(e.col, t.col),
        l = Math.max(e.col, t.col);
      for (let a = i; a <= s; a++) {
        let h = n.doc.line(a),
          c = Tn(h.text, o, n.tabSize, !0);
        if (c < 0) r.push(w.cursor(h.to));
        else {
          let f = Tn(h.text, l, n.tabSize);
          r.push(w.range(h.from + c, h.from + f));
        }
      }
    }
    return r;
  }
  function mO(n, e) {
    let t = n.coordsAtPos(n.viewport.from);
    return t
      ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth))
      : -1;
  }
  function uh(n, e) {
    let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1),
      i = n.state.doc.lineAt(t),
      s = t - i.from,
      r =
        s > yo
          ? -1
          : s == i.length
          ? mO(n, e.clientX)
          : lt(i.text, n.state.tabSize, t - i.from);
    return { line: i.number, col: r, off: s };
  }
  function gO(n, e) {
    let t = uh(n, e),
      i = n.state.selection;
    return t
      ? {
          update(s) {
            if (s.docChanged) {
              let r = s.changes.mapPos(s.startState.doc.line(t.line).from),
                o = s.state.doc.lineAt(r);
              (t = {
                line: o.number,
                col: t.col,
                off: Math.min(t.off, o.length),
              }),
                (i = i.map(s.changes));
            }
          },
          get(s, r, o) {
            let l = uh(n, s);
            if (!l) return i;
            let a = OO(n.state, t, l);
            return a.length
              ? o
                ? w.create(a.concat(i.ranges))
                : w.create(a)
              : i;
          },
        }
      : null;
  }
  function Sc(n) {
    let e = n?.eventFilter || ((t) => t.altKey && t.button == 0);
    return v.mouseSelectionStyle.of((t, i) => (e(i) ? gO(t, i) : null));
  }
  var yO = {
      Alt: [18, (n) => !!n.altKey],
      Control: [17, (n) => !!n.ctrlKey],
      Shift: [16, (n) => !!n.shiftKey],
      Meta: [91, (n) => !!n.metaKey],
    },
    bO = { style: "cursor: crosshair" };
  function xc(n = {}) {
    let [e, t] = yO[n.key || "Alt"],
      i = J.fromClass(
        class {
          constructor(s) {
            (this.view = s), (this.isDown = !1);
          }
          set(s) {
            this.isDown != s && ((this.isDown = s), this.view.update([]));
          }
        },
        {
          eventObservers: {
            keydown(s) {
              this.set(s.keyCode == e || t(s));
            },
            keyup(s) {
              (s.keyCode == e || !t(s)) && this.set(!1);
            },
            mousemove(s) {
              this.set(t(s));
            },
          },
        }
      );
    return [
      i,
      v.contentAttributes.of((s) => {
        var r;
        return !((r = s.plugin(i)) === null || r === void 0) && r.isDown
          ? bO
          : null;
      }),
    ];
  }
  var $i = "-10000px",
    ss = class {
      constructor(e, t, i) {
        (this.facet = t),
          (this.createTooltipView = i),
          (this.input = e.state.facet(t)),
          (this.tooltips = this.input.filter((s) => s)),
          (this.tooltipViews = this.tooltips.map(i));
      }
      update(e, t) {
        var i;
        let s = e.state.facet(this.facet),
          r = s.filter((a) => a);
        if (s === this.input) {
          for (let a of this.tooltipViews) a.update && a.update(e);
          return !1;
        }
        let o = [],
          l = t ? [] : null;
        for (let a = 0; a < r.length; a++) {
          let h = r[a],
            c = -1;
          if (h) {
            for (let f = 0; f < this.tooltips.length; f++) {
              let u = this.tooltips[f];
              u && u.create == h.create && (c = f);
            }
            if (c < 0)
              (o[a] = this.createTooltipView(h)), l && (l[a] = !!h.above);
            else {
              let f = (o[a] = this.tooltipViews[c]);
              l && (l[a] = t[c]), f.update && f.update(e);
            }
          }
        }
        for (let a of this.tooltipViews)
          o.indexOf(a) < 0 &&
            (a.dom.remove(),
            (i = a.destroy) === null || i === void 0 || i.call(a));
        return (
          t && (l.forEach((a, h) => (t[h] = a)), (t.length = l.length)),
          (this.input = s),
          (this.tooltips = r),
          (this.tooltipViews = o),
          !0
        );
      }
    };
  function wO(n) {
    let { win: e } = n;
    return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
  }
  var Yr = T.define({
      combine: (n) => {
        var e, t, i;
        return {
          position: A.ios
            ? "absolute"
            : ((e = n.find((s) => s.position)) === null || e === void 0
                ? void 0
                : e.position) || "fixed",
          parent:
            ((t = n.find((s) => s.parent)) === null || t === void 0
              ? void 0
              : t.parent) || null,
          tooltipSpace:
            ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0
              ? void 0
              : i.tooltipSpace) || wO,
        };
      },
    }),
    dh = new WeakMap(),
    Zo = J.fromClass(
      class {
        constructor(n) {
          (this.view = n),
            (this.above = []),
            (this.inView = !0),
            (this.madeAbsolute = !1),
            (this.lastTransaction = 0),
            (this.measureTimeout = -1);
          let e = n.state.facet(Yr);
          (this.position = e.position),
            (this.parent = e.parent),
            (this.classes = n.themeClasses),
            this.createContainer(),
            (this.measureReq = {
              read: this.readMeasure.bind(this),
              write: this.writeMeasure.bind(this),
              key: this,
            }),
            (this.manager = new ss(n, Ui, (t) => this.createTooltip(t))),
            (this.intersectionObserver =
              typeof IntersectionObserver == "function"
                ? new IntersectionObserver(
                    (t) => {
                      Date.now() > this.lastTransaction - 50 &&
                        t.length > 0 &&
                        t[t.length - 1].intersectionRatio < 1 &&
                        this.measureSoon();
                    },
                    { threshold: [1] }
                  )
                : null),
            this.observeIntersection(),
            n.win.addEventListener(
              "resize",
              (this.measureSoon = this.measureSoon.bind(this))
            ),
            this.maybeMeasure();
        }
        createContainer() {
          this.parent
            ? ((this.container = document.createElement("div")),
              (this.container.style.position = "relative"),
              (this.container.className = this.view.themeClasses),
              this.parent.appendChild(this.container))
            : (this.container = this.view.dom);
        }
        observeIntersection() {
          if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            for (let n of this.manager.tooltipViews)
              this.intersectionObserver.observe(n.dom);
          }
        }
        measureSoon() {
          this.measureTimeout < 0 &&
            (this.measureTimeout = setTimeout(() => {
              (this.measureTimeout = -1), this.maybeMeasure();
            }, 50));
        }
        update(n) {
          n.transactions.length && (this.lastTransaction = Date.now());
          let e = this.manager.update(n, this.above);
          e && this.observeIntersection();
          let t = e || n.geometryChanged,
            i = n.state.facet(Yr);
          if (i.position != this.position && !this.madeAbsolute) {
            this.position = i.position;
            for (let s of this.manager.tooltipViews)
              s.dom.style.position = this.position;
            t = !0;
          }
          if (i.parent != this.parent) {
            this.parent && this.container.remove(),
              (this.parent = i.parent),
              this.createContainer();
            for (let s of this.manager.tooltipViews)
              this.container.appendChild(s.dom);
            t = !0;
          } else
            this.parent &&
              this.view.themeClasses != this.classes &&
              (this.classes = this.container.className =
                this.view.themeClasses);
          t && this.maybeMeasure();
        }
        createTooltip(n) {
          let e = n.create(this.view);
          if (
            (e.dom.classList.add("cm-tooltip"),
            n.arrow && !e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow"))
          ) {
            let t = document.createElement("div");
            (t.className = "cm-tooltip-arrow"), e.dom.appendChild(t);
          }
          return (
            (e.dom.style.position = this.position),
            (e.dom.style.top = $i),
            (e.dom.style.left = "0px"),
            this.container.appendChild(e.dom),
            e.mount && e.mount(this.view),
            e
          );
        }
        destroy() {
          var n, e;
          this.view.win.removeEventListener("resize", this.measureSoon);
          for (let t of this.manager.tooltipViews)
            t.dom.remove(),
              (n = t.destroy) === null || n === void 0 || n.call(t);
          this.parent && this.container.remove(),
            (e = this.intersectionObserver) === null ||
              e === void 0 ||
              e.disconnect(),
            clearTimeout(this.measureTimeout);
        }
        readMeasure() {
          let n = this.view.dom.getBoundingClientRect(),
            e = 1,
            t = 1,
            i = !1;
          if (this.position == "fixed" && this.manager.tooltipViews.length) {
            let { dom: s } = this.manager.tooltipViews[0];
            if (A.gecko)
              i = s.offsetParent != this.container.ownerDocument.body;
            else if (s.style.top == $i && s.style.left == "0px") {
              let r = s.getBoundingClientRect();
              i = Math.abs(r.top + 1e4) > 1 || Math.abs(r.left) > 1;
            }
          }
          if (i || this.position == "absolute")
            if (this.parent) {
              let s = this.parent.getBoundingClientRect();
              s.width &&
                s.height &&
                ((e = s.width / this.parent.offsetWidth),
                (t = s.height / this.parent.offsetHeight));
            } else ({ scaleX: e, scaleY: t } = this.view.viewState);
          return {
            editor: n,
            parent: this.parent ? this.container.getBoundingClientRect() : n,
            pos: this.manager.tooltips.map((s, r) => {
              let o = this.manager.tooltipViews[r];
              return o.getCoords
                ? o.getCoords(s.pos)
                : this.view.coordsAtPos(s.pos);
            }),
            size: this.manager.tooltipViews.map(({ dom: s }) =>
              s.getBoundingClientRect()
            ),
            space: this.view.state.facet(Yr).tooltipSpace(this.view),
            scaleX: e,
            scaleY: t,
            makeAbsolute: i,
          };
        }
        writeMeasure(n) {
          var e;
          if (n.makeAbsolute) {
            (this.madeAbsolute = !0), (this.position = "absolute");
            for (let l of this.manager.tooltipViews)
              l.dom.style.position = "absolute";
          }
          let { editor: t, space: i, scaleX: s, scaleY: r } = n,
            o = [];
          for (let l = 0; l < this.manager.tooltips.length; l++) {
            let a = this.manager.tooltips[l],
              h = this.manager.tooltipViews[l],
              { dom: c } = h,
              f = n.pos[l],
              u = n.size[l];
            if (
              !f ||
              f.bottom <= Math.max(t.top, i.top) ||
              f.top >= Math.min(t.bottom, i.bottom) ||
              f.right < Math.max(t.left, i.left) - 0.1 ||
              f.left > Math.min(t.right, i.right) + 0.1
            ) {
              c.style.top = $i;
              continue;
            }
            let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null,
              p = d ? 7 : 0,
              g = u.right - u.left,
              m =
                (e = dh.get(h)) !== null && e !== void 0 ? e : u.bottom - u.top,
              b = h.offset || xO,
              k = this.view.textDirection == U.LTR,
              $ =
                u.width > i.right - i.left
                  ? k
                    ? i.left
                    : i.right - u.width
                  : k
                  ? Math.min(f.left - (d ? 14 : 0) + b.x, i.right - g)
                  : Math.max(i.left, f.left - g + (d ? 14 : 0) - b.x),
              P = this.above[l];
            !a.strictSide &&
              (P
                ? f.top - (u.bottom - u.top) - b.y < i.top
                : f.bottom + (u.bottom - u.top) + b.y > i.bottom) &&
              P == i.bottom - f.bottom > f.top - i.top &&
              (P = this.above[l] = !P);
            let S = (P ? f.top - i.top : i.bottom - f.bottom) - p;
            if (S < m && h.resize !== !1) {
              if (S < this.view.defaultLineHeight) {
                c.style.top = $i;
                continue;
              }
              dh.set(h, m), (c.style.height = (m = S) / r + "px");
            } else c.style.height && (c.style.height = "");
            let C = P ? f.top - m - p - b.y : f.bottom + p + b.y,
              Z = $ + g;
            if (h.overlap !== !0)
              for (let X of o)
                X.left < Z &&
                  X.right > $ &&
                  X.top < C + m &&
                  X.bottom > C &&
                  (C = P ? X.top - m - 2 - p : X.bottom + p + 2);
            if (
              (this.position == "absolute"
                ? ((c.style.top = (C - n.parent.top) / r + "px"),
                  (c.style.left = ($ - n.parent.left) / s + "px"))
                : ((c.style.top = C / r + "px"), (c.style.left = $ / s + "px")),
              d)
            ) {
              let X = f.left + (k ? b.x : -b.x) - ($ + 14 - 7);
              d.style.left = X / s + "px";
            }
            h.overlap !== !0 &&
              o.push({ left: $, top: C, right: Z, bottom: C + m }),
              c.classList.toggle("cm-tooltip-above", P),
              c.classList.toggle("cm-tooltip-below", !P),
              h.positioned && h.positioned(n.space);
          }
        }
        maybeMeasure() {
          if (
            this.manager.tooltips.length &&
            (this.view.inView && this.view.requestMeasure(this.measureReq),
            this.inView != this.view.inView &&
              ((this.inView = this.view.inView), !this.inView))
          )
            for (let n of this.manager.tooltipViews) n.dom.style.top = $i;
        }
      },
      {
        eventObservers: {
          scroll() {
            this.maybeMeasure();
          },
        },
      }
    ),
    SO = v.baseTheme({
      ".cm-tooltip": { zIndex: 100, boxSizing: "border-box" },
      "&light .cm-tooltip": {
        border: "1px solid #bbb",
        backgroundColor: "#f5f5f5",
      },
      "&light .cm-tooltip-section:not(:first-child)": {
        borderTop: "1px solid #bbb",
      },
      "&dark .cm-tooltip": { backgroundColor: "#333338", color: "white" },
      ".cm-tooltip-arrow": {
        height: "7px",
        width: `${7 * 2}px`,
        position: "absolute",
        zIndex: -1,
        overflow: "hidden",
        "&:before, &:after": {
          content: "''",
          position: "absolute",
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
        },
        ".cm-tooltip-above &": {
          bottom: "-7px",
          "&:before": { borderTop: "7px solid #bbb" },
          "&:after": { borderTop: "7px solid #f5f5f5", bottom: "1px" },
        },
        ".cm-tooltip-below &": {
          top: "-7px",
          "&:before": { borderBottom: "7px solid #bbb" },
          "&:after": { borderBottom: "7px solid #f5f5f5", top: "1px" },
        },
      },
      "&dark .cm-tooltip .cm-tooltip-arrow": {
        "&:before": { borderTopColor: "#333338", borderBottomColor: "#333338" },
        "&:after": {
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
        },
      },
    }),
    xO = { x: 0, y: 0 },
    Ui = T.define({ enables: [Zo, SO] }),
    rs = T.define(),
    os = class n {
      static create(e) {
        return new n(e);
      }
      constructor(e) {
        (this.view = e),
          (this.mounted = !1),
          (this.dom = document.createElement("div")),
          this.dom.classList.add("cm-tooltip-hover"),
          (this.manager = new ss(e, rs, (t) => this.createHostedView(t)));
      }
      createHostedView(e) {
        let t = e.create(this.view);
        return (
          t.dom.classList.add("cm-tooltip-section"),
          this.dom.appendChild(t.dom),
          this.mounted && t.mount && t.mount(this.view),
          t
        );
      }
      mount(e) {
        for (let t of this.manager.tooltipViews) t.mount && t.mount(e);
        this.mounted = !0;
      }
      positioned(e) {
        for (let t of this.manager.tooltipViews)
          t.positioned && t.positioned(e);
      }
      update(e) {
        this.manager.update(e);
      }
      destroy() {
        var e;
        for (let t of this.manager.tooltipViews)
          (e = t.destroy) === null || e === void 0 || e.call(t);
      }
      passProp(e) {
        let t;
        for (let i of this.manager.tooltipViews) {
          let s = i[e];
          if (s !== void 0) {
            if (t === void 0) t = s;
            else if (t !== s) return;
          }
        }
        return t;
      }
      get offset() {
        return this.passProp("offset");
      }
      get getCoords() {
        return this.passProp("getCoords");
      }
      get overlap() {
        return this.passProp("overlap");
      }
      get resize() {
        return this.passProp("resize");
      }
    },
    kO = Ui.compute([rs], (n) => {
      let e = n.facet(rs).filter((t) => t);
      return e.length === 0
        ? null
        : {
            pos: Math.min(...e.map((t) => t.pos)),
            end: Math.max(
              ...e.map((t) => {
                var i;
                return (i = t.end) !== null && i !== void 0 ? i : t.pos;
              })
            ),
            create: os.create,
            above: e[0].above,
            arrow: e.some((t) => t.arrow),
          };
    }),
    bo = class {
      constructor(e, t, i, s, r) {
        (this.view = e),
          (this.source = t),
          (this.field = i),
          (this.setHover = s),
          (this.hoverTime = r),
          (this.hoverTimeout = -1),
          (this.restartTimeout = -1),
          (this.pending = null),
          (this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }),
          (this.checkHover = this.checkHover.bind(this)),
          e.dom.addEventListener(
            "mouseleave",
            (this.mouseleave = this.mouseleave.bind(this))
          ),
          e.dom.addEventListener(
            "mousemove",
            (this.mousemove = this.mousemove.bind(this))
          );
      }
      update() {
        this.pending &&
          ((this.pending = null),
          clearTimeout(this.restartTimeout),
          (this.restartTimeout = setTimeout(() => this.startHover(), 20)));
      }
      get active() {
        return this.view.state.field(this.field);
      }
      checkHover() {
        if (((this.hoverTimeout = -1), this.active)) return;
        let e = Date.now() - this.lastMove.time;
        e < this.hoverTime
          ? (this.hoverTimeout = setTimeout(
              this.checkHover,
              this.hoverTime - e
            ))
          : this.startHover();
      }
      startHover() {
        clearTimeout(this.restartTimeout);
        let { view: e, lastMove: t } = this,
          i = e.docView.nearest(t.target);
        if (!i) return;
        let s,
          r = 1;
        if (i instanceof Bi) s = i.posAtStart;
        else {
          if (((s = e.posAtCoords(t)), s == null)) return;
          let l = e.coordsAtPos(s);
          if (
            !l ||
            t.y < l.top ||
            t.y > l.bottom ||
            t.x < l.left - e.defaultCharacterWidth ||
            t.x > l.right + e.defaultCharacterWidth
          )
            return;
          let a = e
              .bidiSpans(e.state.doc.lineAt(s))
              .find((c) => c.from <= s && c.to >= s),
            h = a && a.dir == U.RTL ? -1 : 1;
          r = t.x < l.left ? -h : h;
        }
        let o = this.source(e, s, r);
        if (o?.then) {
          let l = (this.pending = { pos: s });
          o.then(
            (a) => {
              this.pending == l &&
                ((this.pending = null),
                a && e.dispatch({ effects: this.setHover.of(a) }));
            },
            (a) => be(e.state, a, "hover tooltip")
          );
        } else o && e.dispatch({ effects: this.setHover.of(o) });
      }
      get tooltip() {
        let e = this.view.plugin(Zo),
          t = e
            ? e.manager.tooltips.findIndex((i) => i.create == os.create)
            : -1;
        return t > -1 ? e.manager.tooltipViews[t] : null;
      }
      mousemove(e) {
        var t;
        (this.lastMove = {
          x: e.clientX,
          y: e.clientY,
          target: e.target,
          time: Date.now(),
        }),
          this.hoverTimeout < 0 &&
            (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
        let { active: i, tooltip: s } = this;
        if ((i && s && !QO(s.dom, e)) || this.pending) {
          let { pos: r } = i || this.pending,
            o = (t = i?.end) !== null && t !== void 0 ? t : r;
          (r == o
            ? this.view.posAtCoords(this.lastMove) != r
            : !vO(this.view, r, o, e.clientX, e.clientY)) &&
            (this.view.dispatch({ effects: this.setHover.of(null) }),
            (this.pending = null));
        }
      }
      mouseleave(e) {
        clearTimeout(this.hoverTimeout), (this.hoverTimeout = -1);
        let { active: t } = this;
        if (t) {
          let { tooltip: i } = this;
          i && i.dom.contains(e.relatedTarget)
            ? this.watchTooltipLeave(i.dom)
            : this.view.dispatch({ effects: this.setHover.of(null) });
        }
      }
      watchTooltipLeave(e) {
        let t = (i) => {
          e.removeEventListener("mouseleave", t),
            this.active &&
              !this.view.dom.contains(i.relatedTarget) &&
              this.view.dispatch({ effects: this.setHover.of(null) });
        };
        e.addEventListener("mouseleave", t);
      }
      destroy() {
        clearTimeout(this.hoverTimeout),
          this.view.dom.removeEventListener("mouseleave", this.mouseleave),
          this.view.dom.removeEventListener("mousemove", this.mousemove);
      }
    },
    qn = 4;
  function QO(n, e) {
    let t = n.getBoundingClientRect();
    return (
      e.clientX >= t.left - qn &&
      e.clientX <= t.right + qn &&
      e.clientY >= t.top - qn &&
      e.clientY <= t.bottom + qn
    );
  }
  function vO(n, e, t, i, s, r) {
    let o = n.scrollDOM.getBoundingClientRect(),
      l = n.documentTop + n.documentPadding.top + n.contentHeight;
    if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
      return !1;
    let a = n.posAtCoords({ x: i, y: s }, !1);
    return a >= e && a <= t;
  }
  function kc(n, e = {}) {
    let t = Y.define(),
      i = F.define({
        create() {
          return null;
        },
        update(s, r) {
          if (
            s &&
            ((e.hideOnChange && (r.docChanged || r.selection)) ||
              (e.hideOn && e.hideOn(r, s)))
          )
            return null;
          if (s && r.docChanged) {
            let o = r.changes.mapPos(s.pos, -1, le.TrackDel);
            if (o == null) return null;
            let l = Object.assign(Object.create(null), s);
            (l.pos = o),
              s.end != null && (l.end = r.changes.mapPos(s.end)),
              (s = l);
          }
          for (let o of r.effects)
            o.is(t) && (s = o.value), o.is(PO) && (s = null);
          return s;
        },
        provide: (s) => rs.from(s),
      });
    return [i, J.define((s) => new bo(s, n, i, t, e.hoverTime || 300)), kO];
  }
  function Co(n, e) {
    let t = n.plugin(Zo);
    if (!t) return null;
    let i = t.manager.tooltips.indexOf(e);
    return i < 0 ? null : t.manager.tooltipViews[i];
  }
  var PO = Y.define();
  var ph = T.define({
    combine(n) {
      let e, t;
      for (let i of n) (e = e || i.topContainer), (t = t || i.bottomContainer);
      return { topContainer: e, bottomContainer: t };
    },
  });
  function Mt(n, e) {
    let t = n.plugin(Qc),
      i = t ? t.specs.indexOf(e) : -1;
    return i > -1 ? t.panels[i] : null;
  }
  var Qc = J.fromClass(
      class {
        constructor(n) {
          (this.input = n.state.facet(Xt)),
            (this.specs = this.input.filter((t) => t)),
            (this.panels = this.specs.map((t) => t(n)));
          let e = n.state.facet(ph);
          (this.top = new ii(n, !0, e.topContainer)),
            (this.bottom = new ii(n, !1, e.bottomContainer)),
            this.top.sync(this.panels.filter((t) => t.top)),
            this.bottom.sync(this.panels.filter((t) => !t.top));
          for (let t of this.panels)
            t.dom.classList.add("cm-panel"), t.mount && t.mount();
        }
        update(n) {
          let e = n.state.facet(ph);
          this.top.container != e.topContainer &&
            (this.top.sync([]),
            (this.top = new ii(n.view, !0, e.topContainer))),
            this.bottom.container != e.bottomContainer &&
              (this.bottom.sync([]),
              (this.bottom = new ii(n.view, !1, e.bottomContainer))),
            this.top.syncClasses(),
            this.bottom.syncClasses();
          let t = n.state.facet(Xt);
          if (t != this.input) {
            let i = t.filter((a) => a),
              s = [],
              r = [],
              o = [],
              l = [];
            for (let a of i) {
              let h = this.specs.indexOf(a),
                c;
              h < 0
                ? ((c = a(n.view)), l.push(c))
                : ((c = this.panels[h]), c.update && c.update(n)),
                s.push(c),
                (c.top ? r : o).push(c);
            }
            (this.specs = i),
              (this.panels = s),
              this.top.sync(r),
              this.bottom.sync(o);
            for (let a of l)
              a.dom.classList.add("cm-panel"), a.mount && a.mount();
          } else for (let i of this.panels) i.update && i.update(n);
        }
        destroy() {
          this.top.sync([]), this.bottom.sync([]);
        }
      },
      {
        provide: (n) =>
          v.scrollMargins.of((e) => {
            let t = e.plugin(n);
            return (
              t && {
                top: t.top.scrollMargin(),
                bottom: t.bottom.scrollMargin(),
              }
            );
          }),
      }
    ),
    ii = class {
      constructor(e, t, i) {
        (this.view = e),
          (this.top = t),
          (this.container = i),
          (this.dom = void 0),
          (this.classes = ""),
          (this.panels = []),
          this.syncClasses();
      }
      sync(e) {
        for (let t of this.panels) t.destroy && e.indexOf(t) < 0 && t.destroy();
        (this.panels = e), this.syncDOM();
      }
      syncDOM() {
        if (this.panels.length == 0) {
          this.dom && (this.dom.remove(), (this.dom = void 0));
          return;
        }
        if (!this.dom) {
          (this.dom = document.createElement("div")),
            (this.dom.className = this.top
              ? "cm-panels cm-panels-top"
              : "cm-panels cm-panels-bottom"),
            (this.dom.style[this.top ? "top" : "bottom"] = "0");
          let t = this.container || this.view.dom;
          t.insertBefore(this.dom, this.top ? t.firstChild : null);
        }
        let e = this.dom.firstChild;
        for (let t of this.panels)
          if (t.dom.parentNode == this.dom) {
            for (; e != t.dom; ) e = Oh(e);
            e = e.nextSibling;
          } else this.dom.insertBefore(t.dom, e);
        for (; e; ) e = Oh(e);
      }
      scrollMargin() {
        return !this.dom || this.container
          ? 0
          : Math.max(
              0,
              this.top
                ? this.dom.getBoundingClientRect().bottom -
                    Math.max(0, this.view.scrollDOM.getBoundingClientRect().top)
                : Math.min(
                    innerHeight,
                    this.view.scrollDOM.getBoundingClientRect().bottom
                  ) - this.dom.getBoundingClientRect().top
            );
      }
      syncClasses() {
        if (!(!this.container || this.classes == this.view.themeClasses)) {
          for (let e of this.classes.split(" "))
            e && this.container.classList.remove(e);
          for (let e of (this.classes = this.view.themeClasses).split(" "))
            e && this.container.classList.add(e);
        }
      }
    };
  function Oh(n) {
    let e = n.nextSibling;
    return n.remove(), e;
  }
  var Xt = T.define({ enables: Qc }),
    Ce = class extends Ve {
      compare(e) {
        return this == e || (this.constructor == e.constructor && this.eq(e));
      }
      eq(e) {
        return !1;
      }
      destroy(e) {}
    };
  Ce.prototype.elementClass = "";
  Ce.prototype.toDOM = void 0;
  Ce.prototype.mapMode = le.TrackBefore;
  Ce.prototype.startSide = Ce.prototype.endSide = -1;
  Ce.prototype.point = !0;
  var Nn = T.define(),
    $O = {
      class: "",
      renderEmptyElements: !1,
      elementStyle: "",
      markers: () => I.empty,
      lineMarker: () => null,
      widgetMarker: () => null,
      lineMarkerChange: null,
      initialSpacer: null,
      updateSpacer: null,
      domEventHandlers: {},
    },
    Ei = T.define();
  function To(n) {
    return [vc(), Ei.of(Object.assign(Object.assign({}, $O), n))];
  }
  var wo = T.define({ combine: (n) => n.some((e) => e) });
  function vc(n) {
    let e = [ZO];
    return n && n.fixed === !1 && e.push(wo.of(!0)), e;
  }
  var ZO = J.fromClass(
    class {
      constructor(n) {
        (this.view = n),
          (this.prevViewport = n.viewport),
          (this.dom = document.createElement("div")),
          (this.dom.className = "cm-gutters"),
          this.dom.setAttribute("aria-hidden", "true"),
          (this.dom.style.minHeight =
            this.view.contentHeight / this.view.scaleY + "px"),
          (this.gutters = n.state.facet(Ei).map((e) => new ls(n, e)));
        for (let e of this.gutters) this.dom.appendChild(e.dom);
        (this.fixed = !n.state.facet(wo)),
          this.fixed && (this.dom.style.position = "sticky"),
          this.syncGutters(!1),
          n.scrollDOM.insertBefore(this.dom, n.contentDOM);
      }
      update(n) {
        if (this.updateGutters(n)) {
          let e = this.prevViewport,
            t = n.view.viewport,
            i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
          this.syncGutters(i < (t.to - t.from) * 0.8);
        }
        n.geometryChanged &&
          (this.dom.style.minHeight = this.view.contentHeight + "px"),
          this.view.state.facet(wo) != !this.fixed &&
            ((this.fixed = !this.fixed),
            (this.dom.style.position = this.fixed ? "sticky" : "")),
          (this.prevViewport = n.view.viewport);
      }
      syncGutters(n) {
        let e = this.dom.nextSibling;
        n && this.dom.remove();
        let t = I.iter(this.view.state.facet(Nn), this.view.viewport.from),
          i = [],
          s = this.gutters.map(
            (r) => new xo(r, this.view.viewport, -this.view.documentPadding.top)
          );
        for (let r of this.view.viewportLineBlocks)
          if ((i.length && (i = []), Array.isArray(r.type))) {
            let o = !0;
            for (let l of r.type)
              if (l.type == ye.Text && o) {
                So(t, i, l.from);
                for (let a of s) a.line(this.view, l, i);
                o = !1;
              } else if (l.widget) for (let a of s) a.widget(this.view, l);
          } else if (r.type == ye.Text) {
            So(t, i, r.from);
            for (let o of s) o.line(this.view, r, i);
          } else if (r.widget) for (let o of s) o.widget(this.view, r);
        for (let r of s) r.finish();
        n && this.view.scrollDOM.insertBefore(this.dom, e);
      }
      updateGutters(n) {
        let e = n.startState.facet(Ei),
          t = n.state.facet(Ei),
          i =
            n.docChanged ||
            n.heightChanged ||
            n.viewportChanged ||
            !I.eq(
              n.startState.facet(Nn),
              n.state.facet(Nn),
              n.view.viewport.from,
              n.view.viewport.to
            );
        if (e == t) for (let s of this.gutters) s.update(n) && (i = !0);
        else {
          i = !0;
          let s = [];
          for (let r of t) {
            let o = e.indexOf(r);
            o < 0
              ? s.push(new ls(this.view, r))
              : (this.gutters[o].update(n), s.push(this.gutters[o]));
          }
          for (let r of this.gutters)
            r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
          for (let r of s) this.dom.appendChild(r.dom);
          this.gutters = s;
        }
        return i;
      }
      destroy() {
        for (let n of this.gutters) n.destroy();
        this.dom.remove();
      }
    },
    {
      provide: (n) =>
        v.scrollMargins.of((e) => {
          let t = e.plugin(n);
          return !t || t.gutters.length == 0 || !t.fixed
            ? null
            : e.textDirection == U.LTR
            ? { left: t.dom.offsetWidth * e.scaleX }
            : { right: t.dom.offsetWidth * e.scaleX };
        }),
    }
  );
  function mh(n) {
    return Array.isArray(n) ? n : [n];
  }
  function So(n, e, t) {
    for (; n.value && n.from <= t; ) n.from == t && e.push(n.value), n.next();
  }
  var xo = class {
      constructor(e, t, i) {
        (this.gutter = e),
          (this.height = i),
          (this.i = 0),
          (this.cursor = I.iter(e.markers, t.from));
      }
      addElement(e, t, i) {
        let { gutter: s } = this,
          r = (t.top - this.height) / e.scaleY,
          o = t.height / e.scaleY;
        if (this.i == s.elements.length) {
          let l = new as(e, o, r, i);
          s.elements.push(l), s.dom.appendChild(l.dom);
        } else s.elements[this.i].update(e, o, r, i);
        (this.height = t.bottom), this.i++;
      }
      line(e, t, i) {
        let s = [];
        So(this.cursor, s, t.from), i.length && (s = s.concat(i));
        let r = this.gutter.config.lineMarker(e, t, s);
        r && s.unshift(r);
        let o = this.gutter;
        (s.length == 0 && !o.config.renderEmptyElements) ||
          this.addElement(e, t, s);
      }
      widget(e, t) {
        let i = this.gutter.config.widgetMarker(e, t.widget, t);
        i && this.addElement(e, t, [i]);
      }
      finish() {
        let e = this.gutter;
        for (; e.elements.length > this.i; ) {
          let t = e.elements.pop();
          e.dom.removeChild(t.dom), t.destroy();
        }
      }
    },
    ls = class {
      constructor(e, t) {
        (this.view = e),
          (this.config = t),
          (this.elements = []),
          (this.spacer = null),
          (this.dom = document.createElement("div")),
          (this.dom.className =
            "cm-gutter" + (this.config.class ? " " + this.config.class : ""));
        for (let i in t.domEventHandlers)
          this.dom.addEventListener(i, (s) => {
            let r = s.target,
              o;
            if (r != this.dom && this.dom.contains(r)) {
              for (; r.parentNode != this.dom; ) r = r.parentNode;
              let a = r.getBoundingClientRect();
              o = (a.top + a.bottom) / 2;
            } else o = s.clientY;
            let l = e.lineBlockAtHeight(o - e.documentTop);
            t.domEventHandlers[i](e, l, s) && s.preventDefault();
          });
        (this.markers = mh(t.markers(e))),
          t.initialSpacer &&
            ((this.spacer = new as(e, 0, 0, [t.initialSpacer(e)])),
            this.dom.appendChild(this.spacer.dom),
            (this.spacer.dom.style.cssText +=
              "visibility: hidden; pointer-events: none"));
      }
      update(e) {
        let t = this.markers;
        if (
          ((this.markers = mh(this.config.markers(e.view))),
          this.spacer && this.config.updateSpacer)
        ) {
          let s = this.config.updateSpacer(this.spacer.markers[0], e);
          s != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [s]);
        }
        let i = e.view.viewport;
        return (
          !I.eq(this.markers, t, i.from, i.to) ||
          (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1)
        );
      }
      destroy() {
        for (let e of this.elements) e.destroy();
      }
    },
    as = class {
      constructor(e, t, i, s) {
        (this.height = -1),
          (this.above = 0),
          (this.markers = []),
          (this.dom = document.createElement("div")),
          (this.dom.className = "cm-gutterElement"),
          this.update(e, t, i, s);
      }
      update(e, t, i, s) {
        this.height != t &&
          ((this.height = t), (this.dom.style.height = t + "px")),
          this.above != i &&
            (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""),
          CO(this.markers, s) || this.setMarkers(e, s);
      }
      setMarkers(e, t) {
        let i = "cm-gutterElement",
          s = this.dom.firstChild;
        for (let r = 0, o = 0; ; ) {
          let l = o,
            a = r < t.length ? t[r++] : null,
            h = !1;
          if (a) {
            let c = a.elementClass;
            c && (i += " " + c);
            for (let f = o; f < this.markers.length; f++)
              if (this.markers[f].compare(a)) {
                (l = f), (h = !0);
                break;
              }
          } else l = this.markers.length;
          for (; o < l; ) {
            let c = this.markers[o++];
            if (c.toDOM) {
              c.destroy(s);
              let f = s.nextSibling;
              s.remove(), (s = f);
            }
          }
          if (!a) break;
          a.toDOM &&
            (h ? (s = s.nextSibling) : this.dom.insertBefore(a.toDOM(e), s)),
            h && o++;
        }
        (this.dom.className = i), (this.markers = t);
      }
      destroy() {
        this.setMarkers(null, []);
      }
    };
  function CO(n, e) {
    if (n.length != e.length) return !1;
    for (let t = 0; t < n.length; t++) if (!n[t].compare(e[t])) return !1;
    return !0;
  }
  var TO = T.define(),
    ni = T.define({
      combine(n) {
        return fe(
          n,
          { formatNumber: String, domEventHandlers: {} },
          {
            domEventHandlers(e, t) {
              let i = Object.assign({}, e);
              for (let s in t) {
                let r = i[s],
                  o = t[s];
                i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
              }
              return i;
            },
          }
        );
      },
    }),
    Di = class extends Ce {
      constructor(e) {
        super(), (this.number = e);
      }
      eq(e) {
        return this.number == e.number;
      }
      toDOM() {
        return document.createTextNode(this.number);
      }
    };
  function Wr(n, e) {
    return n.state.facet(ni).formatNumber(e, n.state);
  }
  var AO = Ei.compute([ni], (n) => ({
    class: "cm-lineNumbers",
    renderEmptyElements: !1,
    markers(e) {
      return e.state.facet(TO);
    },
    lineMarker(e, t, i) {
      return i.some((s) => s.toDOM)
        ? null
        : new Di(Wr(e, e.state.doc.lineAt(t.from).number));
    },
    widgetMarker: () => null,
    lineMarkerChange: (e) => e.startState.facet(ni) != e.state.facet(ni),
    initialSpacer(e) {
      return new Di(Wr(e, gh(e.state.doc.lines)));
    },
    updateSpacer(e, t) {
      let i = Wr(t.view, gh(t.view.state.doc.lines));
      return i == e.number ? e : new Di(i);
    },
    domEventHandlers: n.facet(ni).domEventHandlers,
  }));
  function Pc(n = {}) {
    return [ni.of(n), vc(), AO];
  }
  function gh(n) {
    let e = 9;
    for (; e < n; ) e = e * 10 + 9;
    return e;
  }
  var RO = new (class extends Ce {
      constructor() {
        super(...arguments), (this.elementClass = "cm-activeLineGutter");
      }
    })(),
    YO = Nn.compute(["selection"], (n) => {
      let e = [],
        t = -1;
      for (let i of n.selection.ranges) {
        let s = n.doc.lineAt(i.head).from;
        s > t && ((t = s), e.push(RO.range(s)));
      }
      return I.of(e);
    });
  function $c() {
    return YO;
  }
  var WO = 0,
    Fi = class {
      constructor(e, t) {
        (this.from = e), (this.to = t);
      }
    },
    W = class {
      constructor(e = {}) {
        (this.id = WO++),
          (this.perNode = !!e.perNode),
          (this.deserialize =
            e.deserialize ||
            (() => {
              throw new Error(
                "This node type doesn't define a deserialize function"
              );
            }));
      }
      add(e) {
        if (this.perNode)
          throw new RangeError("Can't add per-node props to node types");
        return (
          typeof e != "function" && (e = ue.match(e)),
          (t) => {
            let i = e(t);
            return i === void 0 ? null : [this, i];
          }
        );
      }
    };
  W.closedBy = new W({ deserialize: (n) => n.split(" ") });
  W.openedBy = new W({ deserialize: (n) => n.split(" ") });
  W.group = new W({ deserialize: (n) => n.split(" ") });
  W.contextHash = new W({ perNode: !0 });
  W.lookAhead = new W({ perNode: !0 });
  W.mounted = new W({ perNode: !0 });
  var oi = class {
      constructor(e, t, i) {
        (this.tree = e), (this.overlay = t), (this.parser = i);
      }
      static get(e) {
        return e && e.props && e.props[W.mounted.id];
      }
    },
    XO = Object.create(null),
    ue = class n {
      constructor(e, t, i, s = 0) {
        (this.name = e), (this.props = t), (this.id = i), (this.flags = s);
      }
      static define(e) {
        let t = e.props && e.props.length ? Object.create(null) : XO,
          i =
            (e.top ? 1 : 0) |
            (e.skipped ? 2 : 0) |
            (e.error ? 4 : 0) |
            (e.name == null ? 8 : 0),
          s = new n(e.name || "", t, e.id, i);
        if (e.props) {
          for (let r of e.props)
            if ((Array.isArray(r) || (r = r(s)), r)) {
              if (r[0].perNode)
                throw new RangeError(
                  "Can't store a per-node prop on a node type"
                );
              t[r[0].id] = r[1];
            }
        }
        return s;
      }
      prop(e) {
        return this.props[e.id];
      }
      get isTop() {
        return (this.flags & 1) > 0;
      }
      get isSkipped() {
        return (this.flags & 2) > 0;
      }
      get isError() {
        return (this.flags & 4) > 0;
      }
      get isAnonymous() {
        return (this.flags & 8) > 0;
      }
      is(e) {
        if (typeof e == "string") {
          if (this.name == e) return !0;
          let t = this.prop(W.group);
          return t ? t.indexOf(e) > -1 : !1;
        }
        return this.id == e;
      }
      static match(e) {
        let t = Object.create(null);
        for (let i in e) for (let s of i.split(" ")) t[s] = e[i];
        return (i) => {
          for (let s = i.prop(W.group), r = -1; r < (s ? s.length : 0); r++) {
            let o = t[r < 0 ? i.name : s[r]];
            if (o) return o;
          }
        };
      }
    };
  ue.none = new ue("", Object.create(null), 0, 8);
  var Hi = class n {
      constructor(e) {
        this.types = e;
        for (let t = 0; t < e.length; t++)
          if (e[t].id != t)
            throw new RangeError(
              "Node type ids should correspond to array positions when creating a node set"
            );
      }
      extend(...e) {
        let t = [];
        for (let i of this.types) {
          let s = null;
          for (let r of e) {
            let o = r(i);
            o && (s || (s = Object.assign({}, i.props)), (s[o[0].id] = o[1]));
          }
          t.push(s ? new ue(i.name, s, i.id, i.flags) : i);
        }
        return new n(t);
      }
    },
    fs = new WeakMap(),
    Zc = new WeakMap(),
    ee;
  (function (n) {
    (n[(n.ExcludeBuffers = 1)] = "ExcludeBuffers"),
      (n[(n.IncludeAnonymous = 2)] = "IncludeAnonymous"),
      (n[(n.IgnoreMounts = 4)] = "IgnoreMounts"),
      (n[(n.IgnoreOverlays = 8)] = "IgnoreOverlays");
  })(ee || (ee = {}));
  var ie = class n {
    constructor(e, t, i, s, r) {
      if (
        ((this.type = e),
        (this.children = t),
        (this.positions = i),
        (this.length = s),
        (this.props = null),
        r && r.length)
      ) {
        this.props = Object.create(null);
        for (let [o, l] of r) this.props[typeof o == "number" ? o : o.id] = l;
      }
    }
    toString() {
      let e = oi.get(this);
      if (e && !e.overlay) return e.tree.toString();
      let t = "";
      for (let i of this.children) {
        let s = i.toString();
        s && (t && (t += ","), (t += s));
      }
      return this.type.name
        ? (/\W/.test(this.type.name) && !this.type.isError
            ? JSON.stringify(this.type.name)
            : this.type.name) + (t.length ? "(" + t + ")" : "")
        : t;
    }
    cursor(e = 0) {
      return new Ji(this.topNode, e);
    }
    cursorAt(e, t = 0, i = 0) {
      let s = fs.get(this) || this.topNode,
        r = new Ji(s);
      return r.moveTo(e, t), fs.set(this, r._tree), r;
    }
    get topNode() {
      return new je(this, 0, 0, null);
    }
    resolve(e, t = 0) {
      let i = Ki(fs.get(this) || this.topNode, e, t, !1);
      return fs.set(this, i), i;
    }
    resolveInner(e, t = 0) {
      let i = Ki(Zc.get(this) || this.topNode, e, t, !0);
      return Zc.set(this, i), i;
    }
    resolveStack(e, t = 0) {
      return MO(this, e, t);
    }
    iterate(e) {
      let { enter: t, leave: i, from: s = 0, to: r = this.length } = e,
        o = e.mode || 0,
        l = (o & ee.IncludeAnonymous) > 0;
      for (let a = this.cursor(o | ee.IncludeAnonymous); ; ) {
        let h = !1;
        if (
          a.from <= r &&
          a.to >= s &&
          ((!l && a.type.isAnonymous) || t(a) !== !1)
        ) {
          if (a.firstChild()) continue;
          h = !0;
        }
        for (
          ;
          h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling();

        ) {
          if (!a.parent()) return;
          h = !0;
        }
      }
    }
    prop(e) {
      return e.perNode
        ? this.props
          ? this.props[e.id]
          : void 0
        : this.type.prop(e);
    }
    get propValues() {
      let e = [];
      if (this.props) for (let t in this.props) e.push([+t, this.props[t]]);
      return e;
    }
    balance(e = {}) {
      return this.children.length <= 8
        ? this
        : Eo(
            ue.none,
            this.children,
            this.positions,
            0,
            this.children.length,
            0,
            this.length,
            (t, i, s) => new n(this.type, t, i, s, this.propValues),
            e.makeTree || ((t, i, s) => new n(ue.none, t, i, s))
          );
    }
    static build(e) {
      return EO(e);
    }
  };
  ie.empty = new ie(ue.none, [], [], 0);
  var Ao = class n {
      constructor(e, t) {
        (this.buffer = e), (this.index = t);
      }
      get id() {
        return this.buffer[this.index - 4];
      }
      get start() {
        return this.buffer[this.index - 3];
      }
      get end() {
        return this.buffer[this.index - 2];
      }
      get size() {
        return this.buffer[this.index - 1];
      }
      get pos() {
        return this.index;
      }
      next() {
        this.index -= 4;
      }
      fork() {
        return new n(this.buffer, this.index);
      }
    },
    wt = class n {
      constructor(e, t, i) {
        (this.buffer = e), (this.length = t), (this.set = i);
      }
      get type() {
        return ue.none;
      }
      toString() {
        let e = [];
        for (let t = 0; t < this.buffer.length; )
          e.push(this.childString(t)), (t = this.buffer[t + 3]);
        return e.join(",");
      }
      childString(e) {
        let t = this.buffer[e],
          i = this.buffer[e + 3],
          s = this.set.types[t],
          r = s.name;
        if (
          (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)),
          (e += 4),
          i == e)
        )
          return r;
        let o = [];
        for (; e < i; ) o.push(this.childString(e)), (e = this.buffer[e + 3]);
        return r + "(" + o.join(",") + ")";
      }
      findChild(e, t, i, s, r) {
        let { buffer: o } = this,
          l = -1;
        for (
          let a = e;
          a != t && !(Ac(r, s, o[a + 1], o[a + 2]) && ((l = a), i > 0));
          a = o[a + 3]
        );
        return l;
      }
      slice(e, t, i) {
        let s = this.buffer,
          r = new Uint16Array(t - e),
          o = 0;
        for (let l = e, a = 0; l < t; ) {
          (r[a++] = s[l++]), (r[a++] = s[l++] - i);
          let h = (r[a++] = s[l++] - i);
          (r[a++] = s[l++] - e), (o = Math.max(o, h));
        }
        return new n(r, o, this.set);
      }
    };
  function Ac(n, e, t, i) {
    switch (n) {
      case -2:
        return t < e;
      case -1:
        return i >= e && t < e;
      case 0:
        return t < e && i > e;
      case 1:
        return t <= e && i > e;
      case 2:
        return i > e;
      case 4:
        return !0;
    }
  }
  function Ki(n, e, t, i) {
    for (
      var s;
      n.from == n.to ||
      (t < 1 ? n.from >= e : n.from > e) ||
      (t > -1 ? n.to <= e : n.to < e);

    ) {
      let o = !i && n instanceof je && n.index < 0 ? null : n.parent;
      if (!o) return n;
      n = o;
    }
    let r = i ? 0 : ee.IgnoreOverlays;
    if (i)
      for (let o = n, l = o.parent; l; o = l, l = o.parent)
        o instanceof je &&
          o.index < 0 &&
          ((s = l.enter(e, t, r)) === null || s === void 0 ? void 0 : s.from) !=
            o.from &&
          (n = l);
    for (;;) {
      let o = n.enter(e, t, r);
      if (!o) return n;
      n = o;
    }
  }
  var ds = class {
      cursor(e = 0) {
        return new Ji(this, e);
      }
      getChild(e, t = null, i = null) {
        let s = Cc(this, e, t, i);
        return s.length ? s[0] : null;
      }
      getChildren(e, t = null, i = null) {
        return Cc(this, e, t, i);
      }
      resolve(e, t = 0) {
        return Ki(this, e, t, !1);
      }
      resolveInner(e, t = 0) {
        return Ki(this, e, t, !0);
      }
      matchContext(e) {
        return Ro(this, e);
      }
      enterUnfinishedNodesBefore(e) {
        let t = this.childBefore(e),
          i = this;
        for (; t; ) {
          let s = t.lastChild;
          if (!s || s.to != t.to) break;
          s.type.isError && s.from == s.to
            ? ((i = t), (t = s.prevSibling))
            : (t = s);
        }
        return i;
      }
      get node() {
        return this;
      }
      get next() {
        return this.parent;
      }
    },
    je = class n extends ds {
      constructor(e, t, i, s) {
        super(),
          (this._tree = e),
          (this.from = t),
          (this.index = i),
          (this._parent = s);
      }
      get type() {
        return this._tree.type;
      }
      get name() {
        return this._tree.type.name;
      }
      get to() {
        return this.from + this._tree.length;
      }
      nextChild(e, t, i, s, r = 0) {
        for (let o = this; ; ) {
          for (
            let { children: l, positions: a } = o._tree,
              h = t > 0 ? l.length : -1;
            e != h;
            e += t
          ) {
            let c = l[e],
              f = a[e] + o.from;
            if (Ac(s, i, f, f + c.length)) {
              if (c instanceof wt) {
                if (r & ee.ExcludeBuffers) continue;
                let u = c.findChild(0, c.buffer.length, t, i - f, s);
                if (u > -1) return new Et(new Yo(o, c, e, f), null, u);
              } else if (
                r & ee.IncludeAnonymous ||
                !c.type.isAnonymous ||
                Mo(c)
              ) {
                let u;
                if (!(r & ee.IgnoreMounts) && (u = oi.get(c)) && !u.overlay)
                  return new n(u.tree, f, e, o);
                let d = new n(c, f, e, o);
                return r & ee.IncludeAnonymous || !d.type.isAnonymous
                  ? d
                  : d.nextChild(t < 0 ? c.children.length - 1 : 0, t, i, s);
              }
            }
          }
          if (
            r & ee.IncludeAnonymous ||
            !o.type.isAnonymous ||
            (o.index >= 0
              ? (e = o.index + t)
              : (e = t < 0 ? -1 : o._parent._tree.children.length),
            (o = o._parent),
            !o)
          )
            return null;
        }
      }
      get firstChild() {
        return this.nextChild(0, 1, 0, 4);
      }
      get lastChild() {
        return this.nextChild(this._tree.children.length - 1, -1, 0, 4);
      }
      childAfter(e) {
        return this.nextChild(0, 1, e, 2);
      }
      childBefore(e) {
        return this.nextChild(this._tree.children.length - 1, -1, e, -2);
      }
      enter(e, t, i = 0) {
        let s;
        if (!(i & ee.IgnoreOverlays) && (s = oi.get(this._tree)) && s.overlay) {
          let r = e - this.from;
          for (let { from: o, to: l } of s.overlay)
            if ((t > 0 ? o <= r : o < r) && (t < 0 ? l >= r : l > r))
              return new n(s.tree, s.overlay[0].from + this.from, -1, this);
        }
        return this.nextChild(0, 1, e, t, i);
      }
      nextSignificantParent() {
        let e = this;
        for (; e.type.isAnonymous && e._parent; ) e = e._parent;
        return e;
      }
      get parent() {
        return this._parent ? this._parent.nextSignificantParent() : null;
      }
      get nextSibling() {
        return this._parent && this.index >= 0
          ? this._parent.nextChild(this.index + 1, 1, 0, 4)
          : null;
      }
      get prevSibling() {
        return this._parent && this.index >= 0
          ? this._parent.nextChild(this.index - 1, -1, 0, 4)
          : null;
      }
      get tree() {
        return this._tree;
      }
      toTree() {
        return this._tree;
      }
      toString() {
        return this._tree.toString();
      }
    };
  function Cc(n, e, t, i) {
    let s = n.cursor(),
      r = [];
    if (!s.firstChild()) return r;
    if (t != null) {
      for (; !s.type.is(t); ) if (!s.nextSibling()) return r;
    }
    for (;;) {
      if (i != null && s.type.is(i)) return r;
      if ((s.type.is(e) && r.push(s.node), !s.nextSibling()))
        return i == null ? r : [];
    }
  }
  function Ro(n, e, t = e.length - 1) {
    for (let i = n.parent; t >= 0; i = i.parent) {
      if (!i) return !1;
      if (!i.type.isAnonymous) {
        if (e[t] && e[t] != i.name) return !1;
        t--;
      }
    }
    return !0;
  }
  var Yo = class {
      constructor(e, t, i, s) {
        (this.parent = e),
          (this.buffer = t),
          (this.index = i),
          (this.start = s);
      }
    },
    Et = class n extends ds {
      get name() {
        return this.type.name;
      }
      get from() {
        return this.context.start + this.context.buffer.buffer[this.index + 1];
      }
      get to() {
        return this.context.start + this.context.buffer.buffer[this.index + 2];
      }
      constructor(e, t, i) {
        super(),
          (this.context = e),
          (this._parent = t),
          (this.index = i),
          (this.type = e.buffer.set.types[e.buffer.buffer[i]]);
      }
      child(e, t, i) {
        let { buffer: s } = this.context,
          r = s.findChild(
            this.index + 4,
            s.buffer[this.index + 3],
            e,
            t - this.context.start,
            i
          );
        return r < 0 ? null : new n(this.context, this, r);
      }
      get firstChild() {
        return this.child(1, 0, 4);
      }
      get lastChild() {
        return this.child(-1, 0, 4);
      }
      childAfter(e) {
        return this.child(1, e, 2);
      }
      childBefore(e) {
        return this.child(-1, e, -2);
      }
      enter(e, t, i = 0) {
        if (i & ee.ExcludeBuffers) return null;
        let { buffer: s } = this.context,
          r = s.findChild(
            this.index + 4,
            s.buffer[this.index + 3],
            t > 0 ? 1 : -1,
            e - this.context.start,
            t
          );
        return r < 0 ? null : new n(this.context, this, r);
      }
      get parent() {
        return this._parent || this.context.parent.nextSignificantParent();
      }
      externalSibling(e) {
        return this._parent
          ? null
          : this.context.parent.nextChild(this.context.index + e, e, 0, 4);
      }
      get nextSibling() {
        let { buffer: e } = this.context,
          t = e.buffer[this.index + 3];
        return t <
          (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length)
          ? new n(this.context, this._parent, t)
          : this.externalSibling(1);
      }
      get prevSibling() {
        let { buffer: e } = this.context,
          t = this._parent ? this._parent.index + 4 : 0;
        return this.index == t
          ? this.externalSibling(-1)
          : new n(
              this.context,
              this._parent,
              e.findChild(t, this.index, -1, 0, 4)
            );
      }
      get tree() {
        return null;
      }
      toTree() {
        let e = [],
          t = [],
          { buffer: i } = this.context,
          s = this.index + 4,
          r = i.buffer[this.index + 3];
        if (r > s) {
          let o = i.buffer[this.index + 1];
          e.push(i.slice(s, r, o)), t.push(0);
        }
        return new ie(this.type, e, t, this.to - this.from);
      }
      toString() {
        return this.context.buffer.childString(this.index);
      }
    };
  function Rc(n) {
    if (!n.length) return null;
    let e = 0,
      t = n[0];
    for (let r = 1; r < n.length; r++) {
      let o = n[r];
      (o.from > t.from || o.to < t.to) && ((t = o), (e = r));
    }
    let i = t instanceof je && t.index < 0 ? null : t.parent,
      s = n.slice();
    return i ? (s[e] = i) : s.splice(e, 1), new Wo(s, t);
  }
  var Wo = class {
    constructor(e, t) {
      (this.heads = e), (this.node = t);
    }
    get next() {
      return Rc(this.heads);
    }
  };
  function MO(n, e, t) {
    let i = n.resolveInner(e, t),
      s = null;
    for (let r = i instanceof je ? i : i.context.parent; r; r = r.parent)
      if (r.index < 0) {
        let o = r.parent;
        (s || (s = [i])).push(o.resolve(e, t)), (r = o);
      } else {
        let o = oi.get(r.tree);
        if (
          o &&
          o.overlay &&
          o.overlay[0].from <= e &&
          o.overlay[o.overlay.length - 1].to >= e
        ) {
          let l = new je(o.tree, o.overlay[0].from + r.from, -1, r);
          (s || (s = [i])).push(Ki(l, e, t, !1));
        }
      }
    return s ? Rc(s) : i;
  }
  var Ji = class {
    get name() {
      return this.type.name;
    }
    constructor(e, t = 0) {
      if (
        ((this.mode = t),
        (this.buffer = null),
        (this.stack = []),
        (this.index = 0),
        (this.bufferNode = null),
        e instanceof je)
      )
        this.yieldNode(e);
      else {
        (this._tree = e.context.parent), (this.buffer = e.context);
        for (let i = e._parent; i; i = i._parent) this.stack.unshift(i.index);
        (this.bufferNode = e), this.yieldBuf(e.index);
      }
    }
    yieldNode(e) {
      return e
        ? ((this._tree = e),
          (this.type = e.type),
          (this.from = e.from),
          (this.to = e.to),
          !0)
        : !1;
    }
    yieldBuf(e, t) {
      this.index = e;
      let { start: i, buffer: s } = this.buffer;
      return (
        (this.type = t || s.set.types[s.buffer[e]]),
        (this.from = i + s.buffer[e + 1]),
        (this.to = i + s.buffer[e + 2]),
        !0
      );
    }
    yield(e) {
      return e
        ? e instanceof je
          ? ((this.buffer = null), this.yieldNode(e))
          : ((this.buffer = e.context), this.yieldBuf(e.index, e.type))
        : !1;
    }
    toString() {
      return this.buffer
        ? this.buffer.buffer.childString(this.index)
        : this._tree.toString();
    }
    enterChild(e, t, i) {
      if (!this.buffer)
        return this.yield(
          this._tree.nextChild(
            e < 0 ? this._tree._tree.children.length - 1 : 0,
            e,
            t,
            i,
            this.mode
          )
        );
      let { buffer: s } = this.buffer,
        r = s.findChild(
          this.index + 4,
          s.buffer[this.index + 3],
          e,
          t - this.buffer.start,
          i
        );
      return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
    }
    firstChild() {
      return this.enterChild(1, 0, 4);
    }
    lastChild() {
      return this.enterChild(-1, 0, 4);
    }
    childAfter(e) {
      return this.enterChild(1, e, 2);
    }
    childBefore(e) {
      return this.enterChild(-1, e, -2);
    }
    enter(e, t, i = this.mode) {
      return this.buffer
        ? i & ee.ExcludeBuffers
          ? !1
          : this.enterChild(1, e, t)
        : this.yield(this._tree.enter(e, t, i));
    }
    parent() {
      if (!this.buffer)
        return this.yieldNode(
          this.mode & ee.IncludeAnonymous
            ? this._tree._parent
            : this._tree.parent
        );
      if (this.stack.length) return this.yieldBuf(this.stack.pop());
      let e =
        this.mode & ee.IncludeAnonymous
          ? this.buffer.parent
          : this.buffer.parent.nextSignificantParent();
      return (this.buffer = null), this.yieldNode(e);
    }
    sibling(e) {
      if (!this.buffer)
        return this._tree._parent
          ? this.yield(
              this._tree.index < 0
                ? null
                : this._tree._parent.nextChild(
                    this._tree.index + e,
                    e,
                    0,
                    4,
                    this.mode
                  )
            )
          : !1;
      let { buffer: t } = this.buffer,
        i = this.stack.length - 1;
      if (e < 0) {
        let s = i < 0 ? 0 : this.stack[i] + 4;
        if (this.index != s)
          return this.yieldBuf(t.findChild(s, this.index, -1, 0, 4));
      } else {
        let s = t.buffer[this.index + 3];
        if (s < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
          return this.yieldBuf(s);
      }
      return i < 0
        ? this.yield(
            this.buffer.parent.nextChild(
              this.buffer.index + e,
              e,
              0,
              4,
              this.mode
            )
          )
        : !1;
    }
    nextSibling() {
      return this.sibling(1);
    }
    prevSibling() {
      return this.sibling(-1);
    }
    atLastNode(e) {
      let t,
        i,
        { buffer: s } = this;
      if (s) {
        if (e > 0) {
          if (this.index < s.buffer.buffer.length) return !1;
        } else
          for (let r = 0; r < this.index; r++)
            if (s.buffer.buffer[r + 3] < this.index) return !1;
        ({ index: t, parent: i } = s);
      } else ({ index: t, _parent: i } = this._tree);
      for (; i; { index: t, _parent: i } = i)
        if (t > -1)
          for (
            let r = t + e, o = e < 0 ? -1 : i._tree.children.length;
            r != o;
            r += e
          ) {
            let l = i._tree.children[r];
            if (
              this.mode & ee.IncludeAnonymous ||
              l instanceof wt ||
              !l.type.isAnonymous ||
              Mo(l)
            )
              return !1;
          }
      return !0;
    }
    move(e, t) {
      if (t && this.enterChild(e, 0, 4)) return !0;
      for (;;) {
        if (this.sibling(e)) return !0;
        if (this.atLastNode(e) || !this.parent()) return !1;
      }
    }
    next(e = !0) {
      return this.move(1, e);
    }
    prev(e = !0) {
      return this.move(-1, e);
    }
    moveTo(e, t = 0) {
      for (
        ;
        (this.from == this.to ||
          (t < 1 ? this.from >= e : this.from > e) ||
          (t > -1 ? this.to <= e : this.to < e)) &&
        this.parent();

      );
      for (; this.enterChild(1, e, t); );
      return this;
    }
    get node() {
      if (!this.buffer) return this._tree;
      let e = this.bufferNode,
        t = null,
        i = 0;
      if (e && e.context == this.buffer)
        e: for (let s = this.index, r = this.stack.length; r >= 0; ) {
          for (let o = e; o; o = o._parent)
            if (o.index == s) {
              if (s == this.index) return o;
              (t = o), (i = r + 1);
              break e;
            }
          s = this.stack[--r];
        }
      for (let s = i; s < this.stack.length; s++)
        t = new Et(this.buffer, t, this.stack[s]);
      return (this.bufferNode = new Et(this.buffer, t, this.index));
    }
    get tree() {
      return this.buffer ? null : this._tree._tree;
    }
    iterate(e, t) {
      for (let i = 0; ; ) {
        let s = !1;
        if (this.type.isAnonymous || e(this) !== !1) {
          if (this.firstChild()) {
            i++;
            continue;
          }
          this.type.isAnonymous || (s = !0);
        }
        for (
          ;
          s && t && t(this), (s = this.type.isAnonymous), !this.nextSibling();

        ) {
          if (!i) return;
          this.parent(), i--, (s = !0);
        }
      }
    }
    matchContext(e) {
      if (!this.buffer) return Ro(this.node, e);
      let { buffer: t } = this.buffer,
        { types: i } = t.set;
      for (let s = e.length - 1, r = this.stack.length - 1; s >= 0; r--) {
        if (r < 0) return Ro(this.node, e, s);
        let o = i[t.buffer[this.stack[r]]];
        if (!o.isAnonymous) {
          if (e[s] && e[s] != o.name) return !1;
          s--;
        }
      }
      return !0;
    }
  };
  function Mo(n) {
    return n.children.some(
      (e) => e instanceof wt || !e.type.isAnonymous || Mo(e)
    );
  }
  function EO(n) {
    var e;
    let {
        buffer: t,
        nodeSet: i,
        maxBufferLength: s = 1024,
        reused: r = [],
        minRepeatType: o = i.types.length,
      } = n,
      l = Array.isArray(t) ? new Ao(t, t.length) : t,
      a = i.types,
      h = 0,
      c = 0;
    function f(S, C, Z, X, D, q) {
      let { id: E, start: M, end: N, size: B } = l,
        K = c;
      for (; B < 0; )
        if ((l.next(), B == -1)) {
          let oe = r[E];
          Z.push(oe), X.push(M - S);
          return;
        } else if (B == -3) {
          h = E;
          return;
        } else if (B == -4) {
          c = E;
          return;
        } else throw new RangeError(`Unrecognized record size: ${B}`);
      let Se = a[E],
        xe,
        ve,
        Xe = M - S;
      if (N - M <= s && (ve = m(l.pos - C, D))) {
        let oe = new Uint16Array(ve.size - ve.skip),
          Me = l.pos - ve.size,
          Fe = oe.length;
        for (; l.pos > Me; ) Fe = b(ve.start, oe, Fe);
        (xe = new wt(oe, N - ve.start, i)), (Xe = ve.start - S);
      } else {
        let oe = l.pos - B;
        l.next();
        let Me = [],
          Fe = [],
          Ct = E >= o ? E : -1,
          Nt = 0,
          bn = N;
        for (; l.pos > oe; )
          Ct >= 0 && l.id == Ct && l.size >= 0
            ? (l.end <= bn - s &&
                (p(Me, Fe, M, Nt, l.end, bn, Ct, K),
                (Nt = Me.length),
                (bn = l.end)),
              l.next())
            : q > 2500
            ? u(M, oe, Me, Fe)
            : f(M, oe, Me, Fe, Ct, q + 1);
        if (
          (Ct >= 0 &&
            Nt > 0 &&
            Nt < Me.length &&
            p(Me, Fe, M, Nt, M, bn, Ct, K),
          Me.reverse(),
          Fe.reverse(),
          Ct > -1 && Nt > 0)
        ) {
          let oa = d(Se);
          xe = Eo(Se, Me, Fe, 0, Me.length, 0, N - M, oa, oa);
        } else xe = g(Se, Me, Fe, N - M, K - N);
      }
      Z.push(xe), X.push(Xe);
    }
    function u(S, C, Z, X) {
      let D = [],
        q = 0,
        E = -1;
      for (; l.pos > C; ) {
        let { id: M, start: N, end: B, size: K } = l;
        if (K > 4) l.next();
        else {
          if (E > -1 && N < E) break;
          E < 0 && (E = B - s), D.push(M, N, B), q++, l.next();
        }
      }
      if (q) {
        let M = new Uint16Array(q * 4),
          N = D[D.length - 2];
        for (let B = D.length - 3, K = 0; B >= 0; B -= 3)
          (M[K++] = D[B]),
            (M[K++] = D[B + 1] - N),
            (M[K++] = D[B + 2] - N),
            (M[K++] = K);
        Z.push(new wt(M, D[2] - N, i)), X.push(N - S);
      }
    }
    function d(S) {
      return (C, Z, X) => {
        let D = 0,
          q = C.length - 1,
          E,
          M;
        if (q >= 0 && (E = C[q]) instanceof ie) {
          if (!q && E.type == S && E.length == X) return E;
          (M = E.prop(W.lookAhead)) && (D = Z[q] + E.length + M);
        }
        return g(S, C, Z, X, D);
      };
    }
    function p(S, C, Z, X, D, q, E, M) {
      let N = [],
        B = [];
      for (; S.length > X; ) N.push(S.pop()), B.push(C.pop() + Z - D);
      S.push(g(i.types[E], N, B, q - D, M - q)), C.push(D - Z);
    }
    function g(S, C, Z, X, D = 0, q) {
      if (h) {
        let E = [W.contextHash, h];
        q = q ? [E].concat(q) : [E];
      }
      if (D > 25) {
        let E = [W.lookAhead, D];
        q = q ? [E].concat(q) : [E];
      }
      return new ie(S, C, Z, X, q);
    }
    function m(S, C) {
      let Z = l.fork(),
        X = 0,
        D = 0,
        q = 0,
        E = Z.end - s,
        M = { size: 0, start: 0, skip: 0 };
      e: for (let N = Z.pos - S; Z.pos > N; ) {
        let B = Z.size;
        if (Z.id == C && B >= 0) {
          (M.size = X),
            (M.start = D),
            (M.skip = q),
            (q += 4),
            (X += 4),
            Z.next();
          continue;
        }
        let K = Z.pos - B;
        if (B < 0 || K < N || Z.start < E) break;
        let Se = Z.id >= o ? 4 : 0,
          xe = Z.start;
        for (Z.next(); Z.pos > K; ) {
          if (Z.size < 0)
            if (Z.size == -3) Se += 4;
            else break e;
          else Z.id >= o && (Se += 4);
          Z.next();
        }
        (D = xe), (X += B), (q += Se);
      }
      return (
        (C < 0 || X == S) && ((M.size = X), (M.start = D), (M.skip = q)),
        M.size > 4 ? M : void 0
      );
    }
    function b(S, C, Z) {
      let { id: X, start: D, end: q, size: E } = l;
      if ((l.next(), E >= 0 && X < o)) {
        let M = Z;
        if (E > 4) {
          let N = l.pos - (E - 4);
          for (; l.pos > N; ) Z = b(S, C, Z);
        }
        (C[--Z] = M), (C[--Z] = q - S), (C[--Z] = D - S), (C[--Z] = X);
      } else E == -3 ? (h = X) : E == -4 && (c = X);
      return Z;
    }
    let k = [],
      $ = [];
    for (; l.pos > 0; ) f(n.start || 0, n.bufferStart || 0, k, $, -1, 0);
    let P =
      (e = n.length) !== null && e !== void 0
        ? e
        : k.length
        ? $[0] + k[0].length
        : 0;
    return new ie(a[n.topID], k.reverse(), $.reverse(), P);
  }
  var Tc = new WeakMap();
  function us(n, e) {
    if (!n.isAnonymous || e instanceof wt || e.type != n) return 1;
    let t = Tc.get(e);
    if (t == null) {
      t = 1;
      for (let i of e.children) {
        if (i.type != n || !(i instanceof ie)) {
          t = 1;
          break;
        }
        t += us(n, i);
      }
      Tc.set(e, t);
    }
    return t;
  }
  function Eo(n, e, t, i, s, r, o, l, a) {
    let h = 0;
    for (let p = i; p < s; p++) h += us(n, e[p]);
    let c = Math.ceil((h * 1.5) / 8),
      f = [],
      u = [];
    function d(p, g, m, b, k) {
      for (let $ = m; $ < b; ) {
        let P = $,
          S = g[$],
          C = us(n, p[$]);
        for ($++; $ < b; $++) {
          let Z = us(n, p[$]);
          if (C + Z >= c) break;
          C += Z;
        }
        if ($ == P + 1) {
          if (C > c) {
            let Z = p[P];
            d(Z.children, Z.positions, 0, Z.children.length, g[P] + k);
            continue;
          }
          f.push(p[P]);
        } else {
          let Z = g[$ - 1] + p[$ - 1].length - S;
          f.push(Eo(n, p, g, P, $, S, Z, null, a));
        }
        u.push(S + k - r);
      }
    }
    return d(e, t, i, s, 0), (l || a)(f, u, o);
  }
  var ps = class {
      constructor() {
        this.map = new WeakMap();
      }
      setBuffer(e, t, i) {
        let s = this.map.get(e);
        s || this.map.set(e, (s = new Map())), s.set(t, i);
      }
      getBuffer(e, t) {
        let i = this.map.get(e);
        return i && i.get(t);
      }
      set(e, t) {
        e instanceof Et
          ? this.setBuffer(e.context.buffer, e.index, t)
          : e instanceof je && this.map.set(e.tree, t);
      }
      get(e) {
        return e instanceof Et
          ? this.getBuffer(e.context.buffer, e.index)
          : e instanceof je
          ? this.map.get(e.tree)
          : void 0;
      }
      cursorSet(e, t) {
        e.buffer
          ? this.setBuffer(e.buffer.buffer, e.index, t)
          : this.map.set(e.tree, t);
      }
      cursorGet(e) {
        return e.buffer
          ? this.getBuffer(e.buffer.buffer, e.index)
          : this.map.get(e.tree);
      }
    },
    Dt = class n {
      constructor(e, t, i, s, r = !1, o = !1) {
        (this.from = e),
          (this.to = t),
          (this.tree = i),
          (this.offset = s),
          (this.open = (r ? 1 : 0) | (o ? 2 : 0));
      }
      get openStart() {
        return (this.open & 1) > 0;
      }
      get openEnd() {
        return (this.open & 2) > 0;
      }
      static addTree(e, t = [], i = !1) {
        let s = [new n(0, e.length, e, 0, !1, i)];
        for (let r of t) r.to > e.length && s.push(r);
        return s;
      }
      static applyChanges(e, t, i = 128) {
        if (!t.length) return e;
        let s = [],
          r = 1,
          o = e.length ? e[0] : null;
        for (let l = 0, a = 0, h = 0; ; l++) {
          let c = l < t.length ? t[l] : null,
            f = c ? c.fromA : 1e9;
          if (f - a >= i)
            for (; o && o.from < f; ) {
              let u = o;
              if (a >= u.from || f <= u.to || h) {
                let d = Math.max(u.from, a) - h,
                  p = Math.min(u.to, f) - h;
                u =
                  d >= p ? null : new n(d, p, u.tree, u.offset + h, l > 0, !!c);
              }
              if ((u && s.push(u), o.to > f)) break;
              o = r < e.length ? e[r++] : null;
            }
          if (!c) break;
          (a = c.toA), (h = c.toA - c.toB);
        }
        return s;
      }
    },
    li = class {
      startParse(e, t, i) {
        return (
          typeof e == "string" && (e = new Xo(e)),
          (i = i
            ? i.length
              ? i.map((s) => new Fi(s.from, s.to))
              : [new Fi(0, 0)]
            : [new Fi(0, e.length)]),
          this.createParse(e, t || [], i)
        );
      }
      parse(e, t, i) {
        let s = this.startParse(e, t, i);
        for (;;) {
          let r = s.advance();
          if (r) return r;
        }
      }
    },
    Xo = class {
      constructor(e) {
        this.string = e;
      }
      get length() {
        return this.string.length;
      }
      chunk(e) {
        return this.string.slice(e);
      }
      get lineChunks() {
        return !1;
      }
      read(e, t) {
        return this.string.slice(e, t);
      }
    };
  var hy = new W({ perNode: !0 });
  var DO = 0,
    st = class n {
      constructor(e, t, i) {
        (this.set = e), (this.base = t), (this.modified = i), (this.id = DO++);
      }
      static define(e) {
        if (e?.base) throw new Error("Can not derive from a modified tag");
        let t = new n([], null, []);
        if ((t.set.push(t), e)) for (let i of e.set) t.set.push(i);
        return t;
      }
      static defineModifier() {
        let e = new ys();
        return (t) =>
          t.modified.indexOf(e) > -1
            ? t
            : ys.get(
                t.base || t,
                t.modified.concat(e).sort((i, s) => i.id - s.id)
              );
      }
    },
    jO = 0,
    ys = class n {
      constructor() {
        (this.instances = []), (this.id = jO++);
      }
      static get(e, t) {
        if (!t.length) return e;
        let i = t[0].instances.find((l) => l.base == e && qO(t, l.modified));
        if (i) return i;
        let s = [],
          r = new st(s, e, t);
        for (let l of t) l.instances.push(r);
        let o = BO(t);
        for (let l of e.set)
          if (!l.modified.length) for (let a of o) s.push(n.get(l, a));
        return r;
      }
    };
  function qO(n, e) {
    return n.length == e.length && n.every((t, i) => t == e[i]);
  }
  function BO(n) {
    let e = [[]];
    for (let t = 0; t < n.length; t++)
      for (let i = 0, s = e.length; i < s; i++) e.push(e[i].concat(n[t]));
    return e.sort((t, i) => i.length - t.length);
  }
  function bs(n) {
    let e = Object.create(null);
    for (let t in n) {
      let i = n[t];
      Array.isArray(i) || (i = [i]);
      for (let s of t.split(" "))
        if (s) {
          let r = [],
            o = 2,
            l = s;
          for (let f = 0; ; ) {
            if (l == "..." && f > 0 && f + 3 == s.length) {
              o = 1;
              break;
            }
            let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
            if (!u) throw new RangeError("Invalid path: " + s);
            if (
              (r.push(
                u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]
              ),
              (f += u[0].length),
              f == s.length)
            )
              break;
            let d = s[f++];
            if (f == s.length && d == "!") {
              o = 0;
              break;
            }
            if (d != "/") throw new RangeError("Invalid path: " + s);
            l = s.slice(f);
          }
          let a = r.length - 1,
            h = r[a];
          if (!h) throw new RangeError("Invalid path: " + s);
          let c = new ai(i, o, a > 0 ? r.slice(0, a) : null);
          e[h] = c.sort(e[h]);
        }
    }
    return Xc.add(e);
  }
  var Xc = new W(),
    ai = class {
      constructor(e, t, i, s) {
        (this.tags = e), (this.mode = t), (this.context = i), (this.next = s);
      }
      get opaque() {
        return this.mode == 0;
      }
      get inherit() {
        return this.mode == 1;
      }
      sort(e) {
        return !e || e.depth < this.depth
          ? ((this.next = e), this)
          : ((e.next = this.sort(e.next)), e);
      }
      get depth() {
        return this.context ? this.context.length : 0;
      }
    };
  ai.empty = new ai([], 2, null);
  function Bo(n, e) {
    let t = Object.create(null);
    for (let r of n)
      if (!Array.isArray(r.tag)) t[r.tag.id] = r.class;
      else for (let o of r.tag) t[o.id] = r.class;
    let { scope: i, all: s = null } = e || {};
    return {
      style: (r) => {
        let o = s;
        for (let l of r)
          for (let a of l.set) {
            let h = t[a.id];
            if (h) {
              o = o ? o + " " + h : h;
              break;
            }
          }
        return o;
      },
      scope: i,
    };
  }
  function VO(n, e) {
    let t = null;
    for (let i of n) {
      let s = i.style(e);
      s && (t = t ? t + " " + s : s);
    }
    return t;
  }
  function Mc(n, e, t, i = 0, s = n.length) {
    let r = new jo(i, Array.isArray(e) ? e : [e], t);
    r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
  }
  var jo = class {
    constructor(e, t, i) {
      (this.at = e),
        (this.highlighters = t),
        (this.span = i),
        (this.class = "");
    }
    startSpan(e, t) {
      t != this.class &&
        (this.flush(e), e > this.at && (this.at = e), (this.class = t));
    }
    flush(e) {
      e > this.at && this.class && this.span(this.at, e, this.class);
    }
    highlightRange(e, t, i, s, r) {
      let { type: o, from: l, to: a } = e;
      if (l >= i || a <= t) return;
      o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
      let h = s,
        c = IO(e) || ai.empty,
        f = VO(r, c.tags);
      if (
        (f &&
          (h && (h += " "), (h += f), c.mode == 1 && (s += (s ? " " : "") + f)),
        this.startSpan(Math.max(t, l), h),
        c.opaque)
      )
        return;
      let u = e.tree && e.tree.prop(W.mounted);
      if (u && u.overlay) {
        let d = e.node.enter(u.overlay[0].from + l, 1),
          p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)),
          g = e.firstChild();
        for (let m = 0, b = l; ; m++) {
          let k = m < u.overlay.length ? u.overlay[m] : null,
            $ = k ? k.from + l : a,
            P = Math.max(t, b),
            S = Math.min(i, $);
          if (P < S && g)
            for (
              ;
              e.from < S &&
              (this.highlightRange(e, P, S, s, r),
              this.startSpan(Math.min(S, e.to), h),
              !(e.to >= $ || !e.nextSibling()));

            );
          if (!k || $ > i) break;
          (b = k.to + l),
            b > t &&
              (this.highlightRange(
                d.cursor(),
                Math.max(t, k.from + l),
                Math.min(i, b),
                "",
                p
              ),
              this.startSpan(Math.min(i, b), h));
        }
        g && e.parent();
      } else if (e.firstChild()) {
        u && (s = "");
        do
          if (!(e.to <= t)) {
            if (e.from >= i) break;
            this.highlightRange(e, t, i, s, r),
              this.startSpan(Math.min(i, e.to), h);
          }
        while (e.nextSibling());
        e.parent();
      }
    }
  };
  function IO(n) {
    let e = n.type.prop(Xc);
    for (; e && e.context && !n.matchContext(e.context); ) e = e.next;
    return e || null;
  }
  var Q = st.define,
    Os = Q(),
    St = Q(),
    Yc = Q(St),
    Wc = Q(St),
    xt = Q(),
    ms = Q(xt),
    Do = Q(xt),
    nt = Q(),
    jt = Q(nt),
    tt = Q(),
    it = Q(),
    qo = Q(),
    en = Q(qo),
    gs = Q(),
    O = {
      comment: Os,
      lineComment: Q(Os),
      blockComment: Q(Os),
      docComment: Q(Os),
      name: St,
      variableName: Q(St),
      typeName: Yc,
      tagName: Q(Yc),
      propertyName: Wc,
      attributeName: Q(Wc),
      className: Q(St),
      labelName: Q(St),
      namespace: Q(St),
      macroName: Q(St),
      literal: xt,
      string: ms,
      docString: Q(ms),
      character: Q(ms),
      attributeValue: Q(ms),
      number: Do,
      integer: Q(Do),
      float: Q(Do),
      bool: Q(xt),
      regexp: Q(xt),
      escape: Q(xt),
      color: Q(xt),
      url: Q(xt),
      keyword: tt,
      self: Q(tt),
      null: Q(tt),
      atom: Q(tt),
      unit: Q(tt),
      modifier: Q(tt),
      operatorKeyword: Q(tt),
      controlKeyword: Q(tt),
      definitionKeyword: Q(tt),
      moduleKeyword: Q(tt),
      operator: it,
      derefOperator: Q(it),
      arithmeticOperator: Q(it),
      logicOperator: Q(it),
      bitwiseOperator: Q(it),
      compareOperator: Q(it),
      updateOperator: Q(it),
      definitionOperator: Q(it),
      typeOperator: Q(it),
      controlOperator: Q(it),
      punctuation: qo,
      separator: Q(qo),
      bracket: en,
      angleBracket: Q(en),
      squareBracket: Q(en),
      paren: Q(en),
      brace: Q(en),
      content: nt,
      heading: jt,
      heading1: Q(jt),
      heading2: Q(jt),
      heading3: Q(jt),
      heading4: Q(jt),
      heading5: Q(jt),
      heading6: Q(jt),
      contentSeparator: Q(nt),
      list: Q(nt),
      quote: Q(nt),
      emphasis: Q(nt),
      strong: Q(nt),
      link: Q(nt),
      monospace: Q(nt),
      strikethrough: Q(nt),
      inserted: Q(),
      deleted: Q(),
      changed: Q(),
      invalid: Q(),
      meta: gs,
      documentMeta: Q(gs),
      annotation: Q(gs),
      processingInstruction: Q(gs),
      definition: st.defineModifier(),
      constant: st.defineModifier(),
      function: st.defineModifier(),
      standard: st.defineModifier(),
      local: st.defineModifier(),
      special: st.defineModifier(),
    },
    uy = Bo([
      { tag: O.link, class: "tok-link" },
      { tag: O.heading, class: "tok-heading" },
      { tag: O.emphasis, class: "tok-emphasis" },
      { tag: O.strong, class: "tok-strong" },
      { tag: O.keyword, class: "tok-keyword" },
      { tag: O.atom, class: "tok-atom" },
      { tag: O.bool, class: "tok-bool" },
      { tag: O.url, class: "tok-url" },
      { tag: O.labelName, class: "tok-labelName" },
      { tag: O.inserted, class: "tok-inserted" },
      { tag: O.deleted, class: "tok-deleted" },
      { tag: O.literal, class: "tok-literal" },
      { tag: O.string, class: "tok-string" },
      { tag: O.number, class: "tok-number" },
      { tag: [O.regexp, O.escape, O.special(O.string)], class: "tok-string2" },
      { tag: O.variableName, class: "tok-variableName" },
      { tag: O.local(O.variableName), class: "tok-variableName tok-local" },
      {
        tag: O.definition(O.variableName),
        class: "tok-variableName tok-definition",
      },
      { tag: O.special(O.variableName), class: "tok-variableName2" },
      {
        tag: O.definition(O.propertyName),
        class: "tok-propertyName tok-definition",
      },
      { tag: O.typeName, class: "tok-typeName" },
      { tag: O.namespace, class: "tok-namespace" },
      { tag: O.className, class: "tok-className" },
      { tag: O.macroName, class: "tok-macroName" },
      { tag: O.propertyName, class: "tok-propertyName" },
      { tag: O.operator, class: "tok-operator" },
      { tag: O.comment, class: "tok-comment" },
      { tag: O.meta, class: "tok-meta" },
      { tag: O.invalid, class: "tok-invalid" },
      { tag: O.punctuation, class: "tok-punctuation" },
    ]);
  var Vo,
    hi = new W();
  function el(n) {
    return T.define({ combine: n ? (e) => e.concat(n) : void 0 });
  }
  var Qs = new W(),
    Te = class {
      constructor(e, t, i = [], s = "") {
        (this.data = e),
          (this.name = s),
          V.prototype.hasOwnProperty("tree") ||
            Object.defineProperty(V.prototype, "tree", {
              get() {
                return te(this);
              },
            }),
          (this.parser = t),
          (this.extension = [
            kt.of(this),
            V.languageData.of((r, o, l) => {
              let a = Ec(r, o, l),
                h = a.type.prop(hi);
              if (!h) return [];
              let c = r.facet(h),
                f = a.type.prop(Qs);
              if (f) {
                let u = a.resolve(o - a.from, l);
                for (let d of f)
                  if (d.test(u, r)) {
                    let p = r.facet(d.facet);
                    return d.type == "replace" ? p : p.concat(c);
                  }
              }
              return c;
            }),
          ].concat(i));
      }
      isActiveAt(e, t, i = -1) {
        return Ec(e, t, i).type.prop(hi) == this.data;
      }
      findRegions(e) {
        let t = e.facet(kt);
        if (t?.data == this.data) return [{ from: 0, to: e.doc.length }];
        if (!t || !t.allowsNesting) return [];
        let i = [],
          s = (r, o) => {
            if (r.prop(hi) == this.data) {
              i.push({ from: o, to: o + r.length });
              return;
            }
            let l = r.prop(W.mounted);
            if (l) {
              if (l.tree.prop(hi) == this.data) {
                if (l.overlay)
                  for (let a of l.overlay)
                    i.push({ from: a.from + o, to: a.to + o });
                else i.push({ from: o, to: o + r.length });
                return;
              } else if (l.overlay) {
                let a = i.length;
                if ((s(l.tree, l.overlay[0].from + o), i.length > a)) return;
              }
            }
            for (let a = 0; a < r.children.length; a++) {
              let h = r.children[a];
              h instanceof ie && s(h, r.positions[a] + o);
            }
          };
        return s(te(e), 0), i;
      }
      get allowsNesting() {
        return !0;
      }
    };
  Te.setState = Y.define();
  function Ec(n, e, t) {
    let i = n.facet(kt),
      s = te(n).topNode;
    if (!i || i.allowsNesting)
      for (let r = s; r; r = r.enter(e, t, ee.ExcludeBuffers))
        r.type.isTop && (s = r);
    return s;
  }
  var ws = class n extends Te {
    constructor(e, t, i) {
      super(e, t, [], i), (this.parser = t);
    }
    static define(e) {
      let t = el(e.languageData);
      return new n(
        t,
        e.parser.configure({ props: [hi.add((i) => (i.isTop ? t : void 0))] }),
        e.name
      );
    }
    configure(e, t) {
      return new n(this.data, this.parser.configure(e), t || this.name);
    }
    get allowsNesting() {
      return this.parser.hasWrappers();
    }
  };
  function te(n) {
    let e = n.field(Te.state, !1);
    return e ? e.tree : ie.empty;
  }
  var No = class {
      constructor(e) {
        (this.doc = e),
          (this.cursorPos = 0),
          (this.string = ""),
          (this.cursor = e.iter());
      }
      get length() {
        return this.doc.length;
      }
      syncTo(e) {
        return (
          (this.string = this.cursor.next(e - this.cursorPos).value),
          (this.cursorPos = e + this.string.length),
          this.cursorPos - this.string.length
        );
      }
      chunk(e) {
        return this.syncTo(e), this.string;
      }
      get lineChunks() {
        return !0;
      }
      read(e, t) {
        let i = this.cursorPos - this.string.length;
        return e < i || t >= this.cursorPos
          ? this.doc.sliceString(e, t)
          : this.string.slice(e - i, t - i);
      }
    },
    tn = null,
    zo = class n {
      constructor(e, t, i = [], s, r, o, l, a) {
        (this.parser = e),
          (this.state = t),
          (this.fragments = i),
          (this.tree = s),
          (this.treeLen = r),
          (this.viewport = o),
          (this.skipped = l),
          (this.scheduleOn = a),
          (this.parse = null),
          (this.tempSkipped = []);
      }
      static create(e, t, i) {
        return new n(e, t, [], ie.empty, 0, i, [], null);
      }
      startParse() {
        return this.parser.startParse(new No(this.state.doc), this.fragments);
      }
      work(e, t) {
        return (
          t != null && t >= this.state.doc.length && (t = void 0),
          this.tree != ie.empty && this.isDone(t ?? this.state.doc.length)
            ? (this.takeTree(), !0)
            : this.withContext(() => {
                var i;
                if (typeof e == "number") {
                  let s = Date.now() + e;
                  e = () => Date.now() > s;
                }
                for (
                  this.parse || (this.parse = this.startParse()),
                    t != null &&
                      (this.parse.stoppedAt == null ||
                        this.parse.stoppedAt > t) &&
                      t < this.state.doc.length &&
                      this.parse.stopAt(t);
                  ;

                ) {
                  let s = this.parse.advance();
                  if (s)
                    if (
                      ((this.fragments = this.withoutTempSkipped(
                        Dt.addTree(
                          s,
                          this.fragments,
                          this.parse.stoppedAt != null
                        )
                      )),
                      (this.treeLen =
                        (i = this.parse.stoppedAt) !== null && i !== void 0
                          ? i
                          : this.state.doc.length),
                      (this.tree = s),
                      (this.parse = null),
                      this.treeLen < (t ?? this.state.doc.length))
                    )
                      this.parse = this.startParse();
                    else return !0;
                  if (e()) return !1;
                }
              })
        );
      }
      takeTree() {
        let e, t;
        this.parse &&
          (e = this.parse.parsedPos) >= this.treeLen &&
          ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) &&
            this.parse.stopAt(e),
          this.withContext(() => {
            for (; !(t = this.parse.advance()); );
          }),
          (this.treeLen = e),
          (this.tree = t),
          (this.fragments = this.withoutTempSkipped(
            Dt.addTree(this.tree, this.fragments, !0)
          )),
          (this.parse = null));
      }
      withContext(e) {
        let t = tn;
        tn = this;
        try {
          return e();
        } finally {
          tn = t;
        }
      }
      withoutTempSkipped(e) {
        for (let t; (t = this.tempSkipped.pop()); ) e = Dc(e, t.from, t.to);
        return e;
      }
      changes(e, t) {
        let {
          fragments: i,
          tree: s,
          treeLen: r,
          viewport: o,
          skipped: l,
        } = this;
        if ((this.takeTree(), !e.empty)) {
          let a = [];
          if (
            (e.iterChangedRanges((h, c, f, u) =>
              a.push({ fromA: h, toA: c, fromB: f, toB: u })
            ),
            (i = Dt.applyChanges(i, a)),
            (s = ie.empty),
            (r = 0),
            (o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }),
            this.skipped.length)
          ) {
            l = [];
            for (let h of this.skipped) {
              let c = e.mapPos(h.from, 1),
                f = e.mapPos(h.to, -1);
              c < f && l.push({ from: c, to: f });
            }
          }
        }
        return new n(this.parser, t, i, s, r, o, l, this.scheduleOn);
      }
      updateViewport(e) {
        if (this.viewport.from == e.from && this.viewport.to == e.to) return !1;
        this.viewport = e;
        let t = this.skipped.length;
        for (let i = 0; i < this.skipped.length; i++) {
          let { from: s, to: r } = this.skipped[i];
          s < e.to &&
            r > e.from &&
            ((this.fragments = Dc(this.fragments, s, r)),
            this.skipped.splice(i--, 1));
        }
        return this.skipped.length >= t ? !1 : (this.reset(), !0);
      }
      reset() {
        this.parse && (this.takeTree(), (this.parse = null));
      }
      skipUntilInView(e, t) {
        this.skipped.push({ from: e, to: t });
      }
      static getSkippingParser(e) {
        return new (class extends li {
          createParse(t, i, s) {
            let r = s[0].from,
              o = s[s.length - 1].to;
            return {
              parsedPos: r,
              advance() {
                let a = tn;
                if (a) {
                  for (let h of s) a.tempSkipped.push(h);
                  e &&
                    (a.scheduleOn = a.scheduleOn
                      ? Promise.all([a.scheduleOn, e])
                      : e);
                }
                return (this.parsedPos = o), new ie(ue.none, [], [], o - r);
              },
              stoppedAt: null,
              stopAt() {},
            };
          }
        })();
      }
      isDone(e) {
        e = Math.min(e, this.state.doc.length);
        let t = this.fragments;
        return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
      }
      static get() {
        return tn;
      }
    };
  function Dc(n, e, t) {
    return Dt.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
  }
  var sn = class n {
    constructor(e) {
      (this.context = e), (this.tree = e.tree);
    }
    apply(e) {
      if (!e.docChanged && this.tree == this.context.tree) return this;
      let t = this.context.changes(e.changes, e.state),
        i =
          this.context.treeLen == e.startState.doc.length
            ? void 0
            : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
      return t.work(20, i) || t.takeTree(), new n(t);
    }
    static init(e) {
      let t = Math.min(3e3, e.doc.length),
        i = zo.create(e.facet(kt).parser, e, { from: 0, to: t });
      return i.work(20, t) || i.takeTree(), new n(i);
    }
  };
  Te.state = F.define({
    create: sn.init,
    update(n, e) {
      for (let t of e.effects) if (t.is(Te.setState)) return t.value;
      return e.startState.facet(kt) != e.state.facet(kt)
        ? sn.init(e.state)
        : n.apply(e);
    },
  });
  var Ic = (n) => {
    let e = setTimeout(() => n(), 500);
    return () => clearTimeout(e);
  };
  typeof requestIdleCallback < "u" &&
    (Ic = (n) => {
      let e = -1,
        t = setTimeout(() => {
          e = requestIdleCallback(n, { timeout: 400 });
        }, 100);
      return () => (e < 0 ? clearTimeout(t) : cancelIdleCallback(e));
    });
  var Io =
      typeof navigator < "u" &&
      !((Vo = navigator.scheduling) === null || Vo === void 0) &&
      Vo.isInputPending
        ? () => navigator.scheduling.isInputPending()
        : null,
    LO = J.fromClass(
      class {
        constructor(e) {
          (this.view = e),
            (this.working = null),
            (this.workScheduled = 0),
            (this.chunkEnd = -1),
            (this.chunkBudget = -1),
            (this.work = this.work.bind(this)),
            this.scheduleWork();
        }
        update(e) {
          let t = this.view.state.field(Te.state).context;
          (t.updateViewport(e.view.viewport) ||
            this.view.viewport.to > t.treeLen) &&
            this.scheduleWork(),
            (e.docChanged || e.selectionSet) &&
              (this.view.hasFocus && (this.chunkBudget += 50),
              this.scheduleWork()),
            this.checkAsyncSchedule(t);
        }
        scheduleWork() {
          if (this.working) return;
          let { state: e } = this.view,
            t = e.field(Te.state);
          (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) &&
            (this.working = Ic(this.work));
        }
        work(e) {
          this.working = null;
          let t = Date.now();
          if (
            (this.chunkEnd < t &&
              (this.chunkEnd < 0 || this.view.hasFocus) &&
              ((this.chunkEnd = t + 3e4), (this.chunkBudget = 3e3)),
            this.chunkBudget <= 0)
          )
            return;
          let {
              state: i,
              viewport: { to: s },
            } = this.view,
            r = i.field(Te.state);
          if (r.tree == r.context.tree && r.context.isDone(s + 1e5)) return;
          let o =
              Date.now() +
              Math.min(
                this.chunkBudget,
                100,
                e && !Io ? Math.max(25, e.timeRemaining() - 5) : 1e9
              ),
            l = r.context.treeLen < s && i.doc.length > s + 1e3,
            a = r.context.work(
              () => (Io && Io()) || Date.now() > o,
              s + (l ? 0 : 1e5)
            );
          (this.chunkBudget -= Date.now() - t),
            (a || this.chunkBudget <= 0) &&
              (r.context.takeTree(),
              this.view.dispatch({
                effects: Te.setState.of(new sn(r.context)),
              })),
            this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(),
            this.checkAsyncSchedule(r.context);
        }
        checkAsyncSchedule(e) {
          e.scheduleOn &&
            (this.workScheduled++,
            e.scheduleOn
              .then(() => this.scheduleWork())
              .catch((t) => be(this.view.state, t))
              .then(() => this.workScheduled--),
            (e.scheduleOn = null));
        }
        destroy() {
          this.working && this.working();
        }
        isWorking() {
          return !!(this.working || this.workScheduled > 0);
        }
      },
      {
        eventHandlers: {
          focus() {
            this.scheduleWork();
          },
        },
      }
    ),
    kt = T.define({
      combine(n) {
        return n.length ? n[0] : null;
      },
      enables: (n) => [
        Te.state,
        LO,
        v.contentAttributes.compute([n], (e) => {
          let t = e.facet(n);
          return t && t.name ? { "data-language": t.name } : {};
        }),
      ],
    }),
    Ss = class {
      constructor(e, t = []) {
        (this.language = e), (this.support = t), (this.extension = [e, t]);
      }
    };
  var _O = T.define(),
    fi = T.define({
      combine: (n) => {
        if (!n.length) return "  ";
        let e = n[0];
        if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
          throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
        return e;
      },
    });
  function rn(n) {
    let e = n.facet(fi);
    return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
  }
  function ui(n, e) {
    let t = "",
      i = n.tabSize,
      s = n.facet(fi)[0];
    if (s == "	") {
      for (; e >= i; ) (t += "	"), (e -= i);
      s = " ";
    }
    for (let r = 0; r < e; r++) t += s;
    return t;
  }
  function vs(n, e) {
    n instanceof V && (n = new qt(n));
    for (let i of n.state.facet(_O)) {
      let s = i(n, e);
      if (s !== void 0) return s;
    }
    let t = te(n.state);
    return t.length >= e ? NO(n, t, e) : null;
  }
  var qt = class {
      constructor(e, t = {}) {
        (this.state = e), (this.options = t), (this.unit = rn(e));
      }
      lineAt(e, t = 1) {
        let i = this.state.doc.lineAt(e),
          { simulateBreak: s, simulateDoubleBreak: r } = this.options;
        return s != null && s >= i.from && s <= i.to
          ? r && s == e
            ? { text: "", from: e }
            : (t < 0 ? s < e : s <= e)
            ? { text: i.text.slice(s - i.from), from: s }
            : { text: i.text.slice(0, s - i.from), from: i.from }
          : i;
      }
      textAfterPos(e, t = 1) {
        if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
          return "";
        let { text: i, from: s } = this.lineAt(e, t);
        return i.slice(e - s, Math.min(i.length, e + 100 - s));
      }
      column(e, t = 1) {
        let { text: i, from: s } = this.lineAt(e, t),
          r = this.countColumn(i, e - s),
          o = this.options.overrideIndentation
            ? this.options.overrideIndentation(s)
            : -1;
        return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
      }
      countColumn(e, t = e.length) {
        return lt(e, this.state.tabSize, t);
      }
      lineIndent(e, t = 1) {
        let { text: i, from: s } = this.lineAt(e, t),
          r = this.options.overrideIndentation;
        if (r) {
          let o = r(s);
          if (o > -1) return o;
        }
        return this.countColumn(i, i.search(/\S|$/));
      }
      get simulatedBreak() {
        return this.options.simulateBreak || null;
      }
    },
    tl = new W();
  function NO(n, e, t) {
    let i = e.resolveStack(t),
      s = i.node.enterUnfinishedNodesBefore(t);
    if (s != i.node) {
      let r = [];
      for (let o = s; o != i.node; o = o.parent) r.push(o);
      for (let o = r.length - 1; o >= 0; o--) i = { node: r[o], next: i };
    }
    return Lc(i, n, t);
  }
  function Lc(n, e, t) {
    for (let i = n; i; i = i.next) {
      let s = GO(i.node);
      if (s) return s(Go.create(e, t, i));
    }
    return 0;
  }
  function zO(n) {
    return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
  }
  function GO(n) {
    let e = n.type.prop(tl);
    if (e) return e;
    let t = n.firstChild,
      i;
    if (t && (i = t.type.prop(W.closedBy))) {
      let s = n.lastChild,
        r = s && i.indexOf(s.name) > -1;
      return (o) => Nc(o, !0, 1, void 0, r && !zO(o) ? s.from : void 0);
    }
    return n.parent == null ? UO : null;
  }
  function UO() {
    return 0;
  }
  var Go = class n extends qt {
    constructor(e, t, i) {
      super(e.state, e.options),
        (this.base = e),
        (this.pos = t),
        (this.context = i);
    }
    get node() {
      return this.context.node;
    }
    static create(e, t, i) {
      return new n(e, t, i);
    }
    get textAfter() {
      return this.textAfterPos(this.pos);
    }
    get baseIndent() {
      return this.baseIndentFor(this.node);
    }
    baseIndentFor(e) {
      let t = this.state.doc.lineAt(e.from);
      for (;;) {
        let i = e.resolve(t.from);
        for (; i.parent && i.parent.from == i.from; ) i = i.parent;
        if (FO(i, e)) break;
        t = this.state.doc.lineAt(i.from);
      }
      return this.lineIndent(t.from);
    }
    continue() {
      return Lc(this.context.next, this.base, this.pos);
    }
  };
  function FO(n, e) {
    for (let t = e; t; t = t.parent) if (n == t) return !0;
    return !1;
  }
  function HO(n) {
    let e = n.node,
      t = e.childAfter(e.from),
      i = e.lastChild;
    if (!t) return null;
    let s = n.options.simulateBreak,
      r = n.state.doc.lineAt(t.from),
      o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
    for (let l = t.to; ; ) {
      let a = e.childAfter(l);
      if (!a || a == i) return null;
      if (!a.type.isSkipped) return a.from < o ? t : null;
      l = a.to;
    }
  }
  function _c({ closing: n, align: e = !0, units: t = 1 }) {
    return (i) => Nc(i, e, t, n);
  }
  function Nc(n, e, t, i, s) {
    let r = n.textAfter,
      o = r.match(/^\s*/)[0].length,
      l = (i && r.slice(o, o + i.length) == i) || s == n.pos + o,
      a = e ? HO(n) : null;
    return a
      ? l
        ? n.column(a.from)
        : n.column(a.to)
      : n.baseIndent + (l ? 0 : n.unit * t);
  }
  var zc = (n) => n.baseIndent;
  function Ps({ except: n, units: e = 1 } = {}) {
    return (t) => {
      let i = n && n.test(t.textAfter);
      return t.baseIndent + (i ? 0 : e * t.unit);
    };
  }
  var KO = 200;
  function Gc() {
    return V.transactionFilter.of((n) => {
      if (
        !n.docChanged ||
        (!n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      )
        return n;
      let e = n.startState.languageDataAt(
        "indentOnInput",
        n.startState.selection.main.head
      );
      if (!e.length) return n;
      let t = n.newDoc,
        { head: i } = n.newSelection.main,
        s = t.lineAt(i);
      if (i > s.from + KO) return n;
      let r = t.sliceString(s.from, i);
      if (!e.some((h) => h.test(r))) return n;
      let { state: o } = n,
        l = -1,
        a = [];
      for (let { head: h } of o.selection.ranges) {
        let c = o.doc.lineAt(h);
        if (c.from == l) continue;
        l = c.from;
        let f = vs(o, c.from);
        if (f == null) continue;
        let u = /^\s*/.exec(c.text)[0],
          d = ui(o, f);
        u != d && a.push({ from: c.from, to: c.from + u.length, insert: d });
      }
      return a.length ? [n, { changes: a, sequential: !0 }] : n;
    });
  }
  var JO = T.define(),
    il = new W();
  function Uc(n) {
    let e = n.firstChild,
      t = n.lastChild;
    return e && e.to < t.from
      ? { from: e.to, to: t.type.isError ? n.to : t.from }
      : null;
  }
  function em(n, e, t) {
    let i = te(n);
    if (i.length < t) return null;
    let s = i.resolveStack(t, 1),
      r = null;
    for (let o = s; o; o = o.next) {
      let l = o.node;
      if (l.to <= t || l.from > t) continue;
      if (r && l.from < e) break;
      let a = l.type.prop(il);
      if (a && (l.to < i.length - 50 || i.length == n.doc.length || !tm(l))) {
        let h = a(l, n);
        h && h.from <= t && h.from >= e && h.to > t && (r = h);
      }
    }
    return r;
  }
  function tm(n) {
    let e = n.lastChild;
    return e && e.to == n.to && e.type.isError;
  }
  function xs(n, e, t) {
    for (let i of n.facet(JO)) {
      let s = i(n, e, t);
      if (s) return s;
    }
    return em(n, e, t);
  }
  function Fc(n, e) {
    let t = e.mapPos(n.from, 1),
      i = e.mapPos(n.to, -1);
    return t >= i ? void 0 : { from: t, to: i };
  }
  var $s = Y.define({ map: Fc }),
    on = Y.define({ map: Fc });
  function Hc(n) {
    let e = [];
    for (let { head: t } of n.state.selection.ranges)
      e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
    return e;
  }
  var Bt = F.define({
    create() {
      return R.none;
    },
    update(n, e) {
      n = n.map(e.changes);
      for (let t of e.effects)
        if (t.is($s) && !im(n, t.value.from, t.value.to)) {
          let { preparePlaceholder: i } = e.state.facet(nl),
            s = i ? R.replace({ widget: new Uo(i(e.state, t.value)) }) : jc;
          n = n.update({ add: [s.range(t.value.from, t.value.to)] });
        } else
          t.is(on) &&
            (n = n.update({
              filter: (i, s) => t.value.from != i || t.value.to != s,
              filterFrom: t.value.from,
              filterTo: t.value.to,
            }));
      if (e.selection) {
        let t = !1,
          { head: i } = e.selection.main;
        n.between(i, i, (s, r) => {
          s < i && r > i && (t = !0);
        }),
          t &&
            (n = n.update({
              filterFrom: i,
              filterTo: i,
              filter: (s, r) => r <= i || s >= i,
            }));
      }
      return n;
    },
    provide: (n) => v.decorations.from(n),
    toJSON(n, e) {
      let t = [];
      return (
        n.between(0, e.doc.length, (i, s) => {
          t.push(i, s);
        }),
        t
      );
    },
    fromJSON(n) {
      if (!Array.isArray(n) || n.length % 2)
        throw new RangeError("Invalid JSON for fold state");
      let e = [];
      for (let t = 0; t < n.length; ) {
        let i = n[t++],
          s = n[t++];
        if (typeof i != "number" || typeof s != "number")
          throw new RangeError("Invalid JSON for fold state");
        e.push(jc.range(i, s));
      }
      return R.set(e, !0);
    },
  });
  function ks(n, e, t) {
    var i;
    let s = null;
    return (
      (i = n.field(Bt, !1)) === null ||
        i === void 0 ||
        i.between(e, t, (r, o) => {
          (!s || s.from > r) && (s = { from: r, to: o });
        }),
      s
    );
  }
  function im(n, e, t) {
    let i = !1;
    return (
      n.between(e, e, (s, r) => {
        s == e && r == t && (i = !0);
      }),
      i
    );
  }
  function Kc(n, e) {
    return n.field(Bt, !1) ? e : e.concat(Y.appendConfig.of(tf()));
  }
  var nm = (n) => {
      for (let e of Hc(n)) {
        let t = xs(n.state, e.from, e.to);
        if (t)
          return n.dispatch({ effects: Kc(n.state, [$s.of(t), Jc(n, t)]) }), !0;
      }
      return !1;
    },
    sm = (n) => {
      if (!n.state.field(Bt, !1)) return !1;
      let e = [];
      for (let t of Hc(n)) {
        let i = ks(n.state, t.from, t.to);
        i && e.push(on.of(i), Jc(n, i, !1));
      }
      return e.length && n.dispatch({ effects: e }), e.length > 0;
    };
  function Jc(n, e, t = !0) {
    let i = n.state.doc.lineAt(e.from).number,
      s = n.state.doc.lineAt(e.to).number;
    return v.announce.of(
      `${n.state.phrase(
        t ? "Folded lines" : "Unfolded lines"
      )} ${i} ${n.state.phrase("to")} ${s}.`
    );
  }
  var rm = (n) => {
      let { state: e } = n,
        t = [];
      for (let i = 0; i < e.doc.length; ) {
        let s = n.lineBlockAt(i),
          r = xs(e, s.from, s.to);
        r && t.push($s.of(r)), (i = (r ? n.lineBlockAt(r.to) : s).to + 1);
      }
      return t.length && n.dispatch({ effects: Kc(n.state, t) }), !!t.length;
    },
    om = (n) => {
      let e = n.state.field(Bt, !1);
      if (!e || !e.size) return !1;
      let t = [];
      return (
        e.between(0, n.state.doc.length, (i, s) => {
          t.push(on.of({ from: i, to: s }));
        }),
        n.dispatch({ effects: t }),
        !0
      );
    };
  var ef = [
      { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: nm },
      { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: sm },
      { key: "Ctrl-Alt-[", run: rm },
      { key: "Ctrl-Alt-]", run: om },
    ],
    lm = {
      placeholderDOM: null,
      preparePlaceholder: null,
      placeholderText: "\u2026",
    },
    nl = T.define({
      combine(n) {
        return fe(n, lm);
      },
    });
  function tf(n) {
    let e = [Bt, hm];
    return n && e.push(nl.of(n)), e;
  }
  function nf(n, e) {
    let { state: t } = n,
      i = t.facet(nl),
      s = (o) => {
        let l = n.lineBlockAt(n.posAtDOM(o.target)),
          a = ks(n.state, l.from, l.to);
        a && n.dispatch({ effects: on.of(a) }), o.preventDefault();
      };
    if (i.placeholderDOM) return i.placeholderDOM(n, s, e);
    let r = document.createElement("span");
    return (
      (r.textContent = i.placeholderText),
      r.setAttribute("aria-label", t.phrase("folded code")),
      (r.title = t.phrase("unfold")),
      (r.className = "cm-foldPlaceholder"),
      (r.onclick = s),
      r
    );
  }
  var jc = R.replace({
      widget: new (class extends Qe {
        toDOM(n) {
          return nf(n, null);
        }
      })(),
    }),
    Uo = class extends Qe {
      constructor(e) {
        super(), (this.value = e);
      }
      eq(e) {
        return this.value == e.value;
      }
      toDOM(e) {
        return nf(e, this.value);
      }
    },
    am = {
      openText: "\u2304",
      closedText: "\u203A",
      markerDOM: null,
      domEventHandlers: {},
      foldingChanged: () => !1,
    },
    nn = class extends Ce {
      constructor(e, t) {
        super(), (this.config = e), (this.open = t);
      }
      eq(e) {
        return this.config == e.config && this.open == e.open;
      }
      toDOM(e) {
        if (this.config.markerDOM) return this.config.markerDOM(this.open);
        let t = document.createElement("span");
        return (
          (t.textContent = this.open
            ? this.config.openText
            : this.config.closedText),
          (t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line")),
          t
        );
      }
    };
  function sf(n = {}) {
    let e = Object.assign(Object.assign({}, am), n),
      t = new nn(e, !0),
      i = new nn(e, !1),
      s = J.fromClass(
        class {
          constructor(o) {
            (this.from = o.viewport.from),
              (this.markers = this.buildMarkers(o));
          }
          update(o) {
            (o.docChanged ||
              o.viewportChanged ||
              o.startState.facet(kt) != o.state.facet(kt) ||
              o.startState.field(Bt, !1) != o.state.field(Bt, !1) ||
              te(o.startState) != te(o.state) ||
              e.foldingChanged(o)) &&
              (this.markers = this.buildMarkers(o.view));
          }
          buildMarkers(o) {
            let l = new Ie();
            for (let a of o.viewportLineBlocks) {
              let h = ks(o.state, a.from, a.to)
                ? i
                : xs(o.state, a.from, a.to)
                ? t
                : null;
              h && l.add(a.from, a.from, h);
            }
            return l.finish();
          }
        }
      ),
      { domEventHandlers: r } = e;
    return [
      s,
      To({
        class: "cm-foldGutter",
        markers(o) {
          var l;
          return (
            ((l = o.plugin(s)) === null || l === void 0 ? void 0 : l.markers) ||
            I.empty
          );
        },
        initialSpacer() {
          return new nn(e, !1);
        },
        domEventHandlers: Object.assign(Object.assign({}, r), {
          click: (o, l, a) => {
            if (r.click && r.click(o, l, a)) return !0;
            let h = ks(o.state, l.from, l.to);
            if (h) return o.dispatch({ effects: on.of(h) }), !0;
            let c = xs(o.state, l.from, l.to);
            return c ? (o.dispatch({ effects: $s.of(c) }), !0) : !1;
          },
        }),
      }),
      tf(),
    ];
  }
  var hm = v.baseTheme({
      ".cm-foldPlaceholder": {
        backgroundColor: "#eee",
        border: "1px solid #ddd",
        color: "#888",
        borderRadius: ".2em",
        margin: "0 1px",
        padding: "0 1px",
        cursor: "pointer",
      },
      ".cm-foldGutter span": { padding: "0 1px", cursor: "pointer" },
    }),
    ci = class n {
      constructor(e, t) {
        this.specs = e;
        let i;
        function s(l) {
          let a = Ee.newName();
          return ((i || (i = Object.create(null)))["." + a] = l), a;
        }
        let r = typeof t.all == "string" ? t.all : t.all ? s(t.all) : void 0,
          o = t.scope;
        (this.scope =
          o instanceof Te
            ? (l) => l.prop(hi) == o.data
            : o
            ? (l) => l == o
            : void 0),
          (this.style = Bo(
            e.map((l) => ({
              tag: l.tag,
              class: l.class || s(Object.assign({}, l, { tag: null })),
            })),
            { all: r }
          ).style),
          (this.module = i ? new Ee(i) : null),
          (this.themeType = t.themeType);
      }
      static define(e, t) {
        return new n(e, t || {});
      }
    },
    Fo = T.define(),
    rf = T.define({
      combine(n) {
        return n.length ? [n[0]] : null;
      },
    });
  function Lo(n) {
    let e = n.facet(Fo);
    return e.length ? e : n.facet(rf);
  }
  function Zs(n, e) {
    let t = [cm],
      i;
    return (
      n instanceof ci &&
        (n.module && t.push(v.styleModule.of(n.module)), (i = n.themeType)),
      e?.fallback
        ? t.push(rf.of(n))
        : i
        ? t.push(
            Fo.computeN([v.darkTheme], (s) =>
              s.facet(v.darkTheme) == (i == "dark") ? [n] : []
            )
          )
        : t.push(Fo.of(n)),
      t
    );
  }
  var Ho = class {
      constructor(e) {
        (this.markCache = Object.create(null)),
          (this.tree = te(e.state)),
          (this.decorations = this.buildDeco(e, Lo(e.state)));
      }
      update(e) {
        let t = te(e.state),
          i = Lo(e.state),
          s = i != Lo(e.startState);
        t.length < e.view.viewport.to && !s && t.type == this.tree.type
          ? (this.decorations = this.decorations.map(e.changes))
          : (t != this.tree || e.viewportChanged || s) &&
            ((this.tree = t), (this.decorations = this.buildDeco(e.view, i)));
      }
      buildDeco(e, t) {
        if (!t || !this.tree.length) return R.none;
        let i = new Ie();
        for (let { from: s, to: r } of e.visibleRanges)
          Mc(
            this.tree,
            t,
            (o, l, a) => {
              i.add(
                o,
                l,
                this.markCache[a] || (this.markCache[a] = R.mark({ class: a }))
              );
            },
            s,
            r
          );
        return i.finish();
      }
    },
    cm = Le.high(J.fromClass(Ho, { decorations: (n) => n.decorations })),
    of = ci.define([
      { tag: O.meta, color: "#404740" },
      { tag: O.link, textDecoration: "underline" },
      { tag: O.heading, textDecoration: "underline", fontWeight: "bold" },
      { tag: O.emphasis, fontStyle: "italic" },
      { tag: O.strong, fontWeight: "bold" },
      { tag: O.strikethrough, textDecoration: "line-through" },
      { tag: O.keyword, color: "#708" },
      {
        tag: [O.atom, O.bool, O.url, O.contentSeparator, O.labelName],
        color: "#219",
      },
      { tag: [O.literal, O.inserted], color: "#164" },
      { tag: [O.string, O.deleted], color: "#a11" },
      { tag: [O.regexp, O.escape, O.special(O.string)], color: "#e40" },
      { tag: O.definition(O.variableName), color: "#00f" },
      { tag: O.local(O.variableName), color: "#30a" },
      { tag: [O.typeName, O.namespace], color: "#085" },
      { tag: O.className, color: "#167" },
      { tag: [O.special(O.variableName), O.macroName], color: "#256" },
      { tag: O.definition(O.propertyName), color: "#00c" },
      { tag: O.comment, color: "#940" },
      { tag: O.invalid, color: "#f00" },
    ]),
    fm = v.baseTheme({
      "&.cm-focused .cm-matchingBracket": { backgroundColor: "#328c8252" },
      "&.cm-focused .cm-nonmatchingBracket": { backgroundColor: "#bb555544" },
    }),
    lf = 1e4,
    af = "()[]{}",
    hf = T.define({
      combine(n) {
        return fe(n, {
          afterCursor: !0,
          brackets: af,
          maxScanDistance: lf,
          renderMatch: pm,
        });
      },
    }),
    um = R.mark({ class: "cm-matchingBracket" }),
    dm = R.mark({ class: "cm-nonmatchingBracket" });
  function pm(n) {
    let e = [],
      t = n.matched ? um : dm;
    return (
      e.push(t.range(n.start.from, n.start.to)),
      n.end && e.push(t.range(n.end.from, n.end.to)),
      e
    );
  }
  var Om = F.define({
      create() {
        return R.none;
      },
      update(n, e) {
        if (!e.docChanged && !e.selection) return n;
        let t = [],
          i = e.state.facet(hf);
        for (let s of e.state.selection.ranges) {
          if (!s.empty) continue;
          let r =
            ze(e.state, s.head, -1, i) ||
            (s.head > 0 && ze(e.state, s.head - 1, 1, i)) ||
            (i.afterCursor &&
              (ze(e.state, s.head, 1, i) ||
                (s.head < e.state.doc.length &&
                  ze(e.state, s.head + 1, -1, i))));
          r && (t = t.concat(i.renderMatch(r, e.state)));
        }
        return R.set(t, !0);
      },
      provide: (n) => v.decorations.from(n),
    }),
    mm = [Om, fm];
  function cf(n = {}) {
    return [hf.of(n), mm];
  }
  var gm = new W();
  function Ko(n, e, t) {
    let i = n.prop(e < 0 ? W.openedBy : W.closedBy);
    if (i) return i;
    if (n.name.length == 1) {
      let s = t.indexOf(n.name);
      if (s > -1 && s % 2 == (e < 0 ? 1 : 0)) return [t[s + e]];
    }
    return null;
  }
  function Jo(n) {
    let e = n.type.prop(gm);
    return e ? e(n.node) : n;
  }
  function ze(n, e, t, i = {}) {
    let s = i.maxScanDistance || lf,
      r = i.brackets || af,
      o = te(n),
      l = o.resolveInner(e, t);
    for (let a = l; a; a = a.parent) {
      let h = Ko(a.type, t, r);
      if (h && a.from < a.to) {
        let c = Jo(a);
        if (c && (t > 0 ? e >= c.from && e < c.to : e > c.from && e <= c.to))
          return ym(n, e, t, a, c, h, r);
      }
    }
    return bm(n, e, t, o, l.type, s, r);
  }
  function ym(n, e, t, i, s, r, o) {
    let l = i.parent,
      a = { from: s.from, to: s.to },
      h = 0,
      c = l?.cursor();
    if (c && (t < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
      do
        if (t < 0 ? c.to <= i.from : c.from >= i.to) {
          if (h == 0 && r.indexOf(c.type.name) > -1 && c.from < c.to) {
            let f = Jo(c);
            return {
              start: a,
              end: f ? { from: f.from, to: f.to } : void 0,
              matched: !0,
            };
          } else if (Ko(c.type, t, o)) h++;
          else if (Ko(c.type, -t, o)) {
            if (h == 0) {
              let f = Jo(c);
              return {
                start: a,
                end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
                matched: !1,
              };
            }
            h--;
          }
        }
      while (t < 0 ? c.prevSibling() : c.nextSibling());
    return { start: a, matched: !1 };
  }
  function bm(n, e, t, i, s, r, o) {
    let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1),
      a = o.indexOf(l);
    if (a < 0 || (a % 2 == 0) != t > 0) return null;
    let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e },
      c = n.doc.iterRange(e, t > 0 ? n.doc.length : 0),
      f = 0;
    for (let u = 0; !c.next().done && u <= r; ) {
      let d = c.value;
      t < 0 && (u += d.length);
      let p = e + u * t;
      for (
        let g = t > 0 ? 0 : d.length - 1, m = t > 0 ? d.length : -1;
        g != m;
        g += t
      ) {
        let b = o.indexOf(d[g]);
        if (!(b < 0 || i.resolveInner(p + g, 1).type != s))
          if ((b % 2 == 0) == t > 0) f++;
          else {
            if (f == 1)
              return {
                start: h,
                end: { from: p + g, to: p + g + 1 },
                matched: b >> 1 == a >> 1,
              };
            f--;
          }
      }
      t > 0 && (u += d.length);
    }
    return c.done ? { start: h, matched: !1 } : null;
  }
  var wm = Object.create(null),
    qc = [ue.none];
  var Bc = [],
    Vc = Object.create(null),
    Sm = Object.create(null);
  for (let [n, e] of [
    ["variable", "variableName"],
    ["variable-2", "variableName.special"],
    ["string-2", "string.special"],
    ["def", "variableName.definition"],
    ["tag", "tagName"],
    ["attribute", "attributeName"],
    ["type", "typeName"],
    ["builtin", "variableName.standard"],
    ["qualifier", "modifier"],
    ["error", "invalid"],
    ["header", "heading"],
    ["property", "propertyName"],
  ])
    Sm[n] = xm(wm, e);
  function _o(n, e) {
    Bc.indexOf(n) > -1 || (Bc.push(n), console.warn(e));
  }
  function xm(n, e) {
    let t = [];
    for (let l of e.split(" ")) {
      let a = [];
      for (let h of l.split(".")) {
        let c = n[h] || O[h];
        c
          ? typeof c == "function"
            ? a.length
              ? (a = a.map(c))
              : _o(h, `Modifier ${h} used at start of tag`)
            : a.length
            ? _o(h, `Tag ${h} used as modifier`)
            : (a = Array.isArray(c) ? c : [c])
          : _o(h, `Unknown highlighting tag ${h}`);
      }
      for (let h of a) t.push(h);
    }
    if (!t.length) return 0;
    let i = e.replace(/ /g, "_"),
      s = i + " " + t.map((l) => l.id),
      r = Vc[s];
    if (r) return r.id;
    let o = (Vc[s] = ue.define({
      id: qc.length,
      name: i,
      props: [bs({ [i]: t })],
    }));
    return qc.push(o), o.id;
  }
  var al = (n) => {
    let { state: e } = n,
      t = e.doc.lineAt(e.selection.main.from),
      i = cl(n.state, t.from);
    return i.line ? km(n) : i.block ? vm(n) : !1;
  };
  function hl(n, e) {
    return ({ state: t, dispatch: i }) => {
      if (t.readOnly) return !1;
      let s = n(e, t);
      return s ? (i(t.update(s)), !0) : !1;
    };
  }
  var km = hl(Zm, 0);
  var Qm = hl(yf, 0);
  var vm = hl((n, e) => yf(n, e, $m(e)), 0);
  function cl(n, e) {
    let t = n.languageDataAt("commentTokens", e);
    return t.length ? t[0] : {};
  }
  var ln = 50;
  function Pm(n, { open: e, close: t }, i, s) {
    let r = n.sliceDoc(i - ln, i),
      o = n.sliceDoc(s, s + ln),
      l = /\s*$/.exec(r)[0].length,
      a = /^\s*/.exec(o)[0].length,
      h = r.length - l;
    if (r.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
      return {
        open: { pos: i - l, margin: l && 1 },
        close: { pos: s + a, margin: a && 1 },
      };
    let c, f;
    s - i <= 2 * ln
      ? (c = f = n.sliceDoc(i, s))
      : ((c = n.sliceDoc(i, i + ln)), (f = n.sliceDoc(s - ln, s)));
    let u = /^\s*/.exec(c)[0].length,
      d = /\s*$/.exec(f)[0].length,
      p = f.length - d - t.length;
    return c.slice(u, u + e.length) == e && f.slice(p, p + t.length) == t
      ? {
          open: {
            pos: i + u + e.length,
            margin: /\s/.test(c.charAt(u + e.length)) ? 1 : 0,
          },
          close: {
            pos: s - d - t.length,
            margin: /\s/.test(f.charAt(p - 1)) ? 1 : 0,
          },
        }
      : null;
  }
  function $m(n) {
    let e = [];
    for (let t of n.selection.ranges) {
      let i = n.doc.lineAt(t.from),
        s = t.to <= i.to ? i : n.doc.lineAt(t.to),
        r = e.length - 1;
      r >= 0 && e[r].to > i.from
        ? (e[r].to = s.to)
        : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
    }
    return e;
  }
  function yf(n, e, t = e.selection.ranges) {
    let i = t.map((r) => cl(e, r.from).block);
    if (!i.every((r) => r)) return null;
    let s = t.map((r, o) => Pm(e, i[o], r.from, r.to));
    if (n != 2 && !s.every((r) => r))
      return {
        changes: e.changes(
          t.map((r, o) =>
            s[o]
              ? []
              : [
                  { from: r.from, insert: i[o].open + " " },
                  { from: r.to, insert: " " + i[o].close },
                ]
          )
        ),
      };
    if (n != 1 && s.some((r) => r)) {
      let r = [];
      for (let o = 0, l; o < s.length; o++)
        if ((l = s[o])) {
          let a = i[o],
            { open: h, close: c } = l;
          r.push(
            { from: h.pos - a.open.length, to: h.pos + h.margin },
            { from: c.pos - c.margin, to: c.pos + a.close.length }
          );
        }
      return { changes: r };
    }
    return null;
  }
  function Zm(n, e, t = e.selection.ranges) {
    let i = [],
      s = -1;
    for (let { from: r, to: o } of t) {
      let l = i.length,
        a = 1e9,
        h = cl(e, r).line;
      if (h) {
        for (let c = r; c <= o; ) {
          let f = e.doc.lineAt(c);
          if (f.from > s && (r == o || o > f.from)) {
            s = f.from;
            let u = /^\s*/.exec(f.text)[0].length,
              d = u == f.length,
              p = f.text.slice(u, u + h.length) == h ? u : -1;
            u < f.text.length && u < a && (a = u),
              i.push({
                line: f,
                comment: p,
                token: h,
                indent: u,
                empty: d,
                single: !1,
              });
          }
          c = f.to + 1;
        }
        if (a < 1e9)
          for (let c = l; c < i.length; c++)
            i[c].indent < i[c].line.text.length && (i[c].indent = a);
        i.length == l + 1 && (i[l].single = !0);
      }
    }
    if (n != 2 && i.some((r) => r.comment < 0 && (!r.empty || r.single))) {
      let r = [];
      for (let { line: l, token: a, indent: h, empty: c, single: f } of i)
        (f || !c) && r.push({ from: l.from + h, insert: a + " " });
      let o = e.changes(r);
      return { changes: o, selection: e.selection.map(o, 1) };
    } else if (n != 1 && i.some((r) => r.comment >= 0)) {
      let r = [];
      for (let { line: o, comment: l, token: a } of i)
        if (l >= 0) {
          let h = o.from + l,
            c = h + a.length;
          o.text[c - o.from] == " " && c++, r.push({ from: h, to: c });
        }
      return { changes: r };
    }
    return null;
  }
  var rl = ke.define(),
    Cm = ke.define(),
    Tm = T.define(),
    bf = T.define({
      combine(n) {
        return fe(
          n,
          { minDepth: 100, newGroupDelay: 500, joinToEvent: (e, t) => t },
          {
            minDepth: Math.max,
            newGroupDelay: Math.min,
            joinToEvent: (e, t) => (i, s) => e(i, s) || t(i, s),
          }
        );
      },
    }),
    wf = F.define({
      create() {
        return Vt.empty;
      },
      update(n, e) {
        let t = e.state.facet(bf),
          i = e.annotation(rl);
        if (i) {
          let a = Ge.fromTransaction(e, i.selection),
            h = i.side,
            c = h == 0 ? n.undone : n.done;
          return (
            a
              ? (c = Ts(c, c.length, t.minDepth, a))
              : (c = kf(c, e.startState.selection)),
            new Vt(h == 0 ? i.rest : c, h == 0 ? c : i.rest)
          );
        }
        let s = e.annotation(Cm);
        if (
          ((s == "full" || s == "before") && (n = n.isolate()),
          e.annotation(ae.addToHistory) === !1)
        )
          return e.changes.empty ? n : n.addMapping(e.changes.desc);
        let r = Ge.fromTransaction(e),
          o = e.annotation(ae.time),
          l = e.annotation(ae.userEvent);
        return (
          r
            ? (n = n.addChanges(r, o, l, t, e))
            : e.selection &&
              (n = n.addSelection(
                e.startState.selection,
                o,
                l,
                t.newGroupDelay
              )),
          (s == "full" || s == "after") && (n = n.isolate()),
          n
        );
      },
      toJSON(n) {
        return {
          done: n.done.map((e) => e.toJSON()),
          undone: n.undone.map((e) => e.toJSON()),
        };
      },
      fromJSON(n) {
        return new Vt(n.done.map(Ge.fromJSON), n.undone.map(Ge.fromJSON));
      },
    });
  function Sf(n = {}) {
    return [
      wf,
      bf.of(n),
      v.domEventHandlers({
        beforeinput(e, t) {
          let i =
            e.inputType == "historyUndo"
              ? Rs
              : e.inputType == "historyRedo"
              ? an
              : null;
          return i ? (e.preventDefault(), i(t)) : !1;
        },
      }),
    ];
  }
  function As(n, e) {
    return function ({ state: t, dispatch: i }) {
      if (!e && t.readOnly) return !1;
      let s = t.field(wf, !1);
      if (!s) return !1;
      let r = s.pop(n, t, e);
      return r ? (i(r), !0) : !1;
    };
  }
  var Rs = As(0, !1),
    an = As(1, !1),
    Am = As(0, !0),
    Rm = As(1, !0);
  var Ge = class n {
    constructor(e, t, i, s, r) {
      (this.changes = e),
        (this.effects = t),
        (this.mapped = i),
        (this.startSelection = s),
        (this.selectionsAfter = r);
    }
    setSelAfter(e) {
      return new n(
        this.changes,
        this.effects,
        this.mapped,
        this.startSelection,
        e
      );
    }
    toJSON() {
      var e, t, i;
      return {
        changes:
          (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
        mapped:
          (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
        startSelection:
          (i = this.startSelection) === null || i === void 0
            ? void 0
            : i.toJSON(),
        selectionsAfter: this.selectionsAfter.map((s) => s.toJSON()),
      };
    }
    static fromJSON(e) {
      return new n(
        e.changes && me.fromJSON(e.changes),
        [],
        e.mapped && ot.fromJSON(e.mapped),
        e.startSelection && w.fromJSON(e.startSelection),
        e.selectionsAfter.map(w.fromJSON)
      );
    }
    static fromTransaction(e, t) {
      let i = qe;
      for (let s of e.startState.facet(Tm)) {
        let r = s(e);
        r.length && (i = i.concat(r));
      }
      return !i.length && e.changes.empty
        ? null
        : new n(
            e.changes.invert(e.startState.doc),
            i,
            void 0,
            t || e.startState.selection,
            qe
          );
    }
    static selection(e) {
      return new n(void 0, qe, void 0, void 0, e);
    }
  };
  function Ts(n, e, t, i) {
    let s = e + 1 > t + 20 ? e - t - 1 : 0,
      r = n.slice(s, e);
    return r.push(i), r;
  }
  function Ym(n, e) {
    let t = [],
      i = !1;
    return (
      n.iterChangedRanges((s, r) => t.push(s, r)),
      e.iterChangedRanges((s, r, o, l) => {
        for (let a = 0; a < t.length; ) {
          let h = t[a++],
            c = t[a++];
          l >= h && o <= c && (i = !0);
        }
      }),
      i
    );
  }
  function Wm(n, e) {
    return (
      n.ranges.length == e.ranges.length &&
      n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0
    );
  }
  function xf(n, e) {
    return n.length ? (e.length ? n.concat(e) : n) : e;
  }
  var qe = [],
    Xm = 200;
  function kf(n, e) {
    if (n.length) {
      let t = n[n.length - 1],
        i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - Xm));
      return i.length && i[i.length - 1].eq(e)
        ? n
        : (i.push(e), Ts(n, n.length - 1, 1e9, t.setSelAfter(i)));
    } else return [Ge.selection([e])];
  }
  function Mm(n) {
    let e = n[n.length - 1],
      t = n.slice();
    return (
      (t[n.length - 1] = e.setSelAfter(
        e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)
      )),
      t
    );
  }
  function sl(n, e) {
    if (!n.length) return n;
    let t = n.length,
      i = qe;
    for (; t; ) {
      let s = Em(n[t - 1], e, i);
      if ((s.changes && !s.changes.empty) || s.effects.length) {
        let r = n.slice(0, t);
        return (r[t - 1] = s), r;
      } else (e = s.mapped), t--, (i = s.selectionsAfter);
    }
    return i.length ? [Ge.selection(i)] : qe;
  }
  function Em(n, e, t) {
    let i = xf(
      n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(e)) : qe,
      t
    );
    if (!n.changes) return Ge.selection(i);
    let s = n.changes.map(e),
      r = e.mapDesc(n.changes, !0),
      o = n.mapped ? n.mapped.composeDesc(r) : r;
    return new Ge(s, Y.mapEffects(n.effects, e), o, n.startSelection.map(r), i);
  }
  var Dm = /^(input\.type|delete)($|\.)/,
    Vt = class n {
      constructor(e, t, i = 0, s = void 0) {
        (this.done = e),
          (this.undone = t),
          (this.prevTime = i),
          (this.prevUserEvent = s);
      }
      isolate() {
        return this.prevTime ? new n(this.done, this.undone) : this;
      }
      addChanges(e, t, i, s, r) {
        let o = this.done,
          l = o[o.length - 1];
        return (
          l &&
          l.changes &&
          !l.changes.empty &&
          e.changes &&
          (!i || Dm.test(i)) &&
          ((!l.selectionsAfter.length &&
            t - this.prevTime < s.newGroupDelay &&
            s.joinToEvent(r, Ym(l.changes, e.changes))) ||
            i == "input.type.compose")
            ? (o = Ts(
                o,
                o.length - 1,
                s.minDepth,
                new Ge(
                  e.changes.compose(l.changes),
                  xf(e.effects, l.effects),
                  l.mapped,
                  l.startSelection,
                  qe
                )
              ))
            : (o = Ts(o, o.length, s.minDepth, e)),
          new n(o, qe, t, i)
        );
      }
      addSelection(e, t, i, s) {
        let r = this.done.length
          ? this.done[this.done.length - 1].selectionsAfter
          : qe;
        return r.length > 0 &&
          t - this.prevTime < s &&
          i == this.prevUserEvent &&
          i &&
          /^select($|\.)/.test(i) &&
          Wm(r[r.length - 1], e)
          ? this
          : new n(kf(this.done, e), this.undone, t, i);
      }
      addMapping(e) {
        return new n(
          sl(this.done, e),
          sl(this.undone, e),
          this.prevTime,
          this.prevUserEvent
        );
      }
      pop(e, t, i) {
        let s = e == 0 ? this.done : this.undone;
        if (s.length == 0) return null;
        let r = s[s.length - 1],
          o = r.selectionsAfter[0] || t.selection;
        if (i && r.selectionsAfter.length)
          return t.update({
            selection: r.selectionsAfter[r.selectionsAfter.length - 1],
            annotations: rl.of({ side: e, rest: Mm(s), selection: o }),
            userEvent: e == 0 ? "select.undo" : "select.redo",
            scrollIntoView: !0,
          });
        if (r.changes) {
          let l = s.length == 1 ? qe : s.slice(0, s.length - 1);
          return (
            r.mapped && (l = sl(l, r.mapped)),
            t.update({
              changes: r.changes,
              selection: r.startSelection,
              effects: r.effects,
              annotations: rl.of({ side: e, rest: l, selection: o }),
              filter: !1,
              userEvent: e == 0 ? "undo" : "redo",
              scrollIntoView: !0,
            })
          );
        } else return null;
      }
    };
  Vt.empty = new Vt(qe, qe);
  var Qf = [
    { key: "Mod-z", run: Rs, preventDefault: !0 },
    { key: "Mod-y", mac: "Mod-Shift-z", run: an, preventDefault: !0 },
    { linux: "Ctrl-Shift-z", run: an, preventDefault: !0 },
    { key: "Mod-u", run: Am, preventDefault: !0 },
    { key: "Alt-u", mac: "Mod-Shift-u", run: Rm, preventDefault: !0 },
  ];
  function di(n, e) {
    return w.create(n.ranges.map(e), n.mainIndex);
  }
  function rt(n, e) {
    return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
  }
  function Ue({ state: n, dispatch: e }, t) {
    let i = di(n.selection, t);
    return i.eq(n.selection) ? !1 : (e(rt(n, i)), !0);
  }
  function Ys(n, e) {
    return w.cursor(e ? n.to : n.from);
  }
  function vf(n, e) {
    return Ue(n, (t) => (t.empty ? n.moveByChar(t, e) : Ys(t, e)));
  }
  function de(n) {
    return n.textDirectionAt(n.state.selection.main.head) == U.LTR;
  }
  var Pf = (n) => vf(n, !de(n)),
    $f = (n) => vf(n, de(n));
  function Zf(n, e) {
    return Ue(n, (t) => (t.empty ? n.moveByGroup(t, e) : Ys(t, e)));
  }
  var jm = (n) => Zf(n, !de(n)),
    qm = (n) => Zf(n, de(n));
  var Zy =
    typeof Intl < "u" && Intl.Segmenter
      ? new Intl.Segmenter(void 0, { granularity: "word" })
      : null;
  function Bm(n, e, t) {
    if (e.type.prop(t)) return !0;
    let i = e.to - e.from;
    return (
      (i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to)))) ||
      e.firstChild
    );
  }
  function Ws(n, e, t) {
    let i = te(n).resolveInner(e.head),
      s = t ? W.closedBy : W.openedBy;
    for (let a = e.head; ; ) {
      let h = t ? i.childAfter(a) : i.childBefore(a);
      if (!h) break;
      Bm(n, h, s) ? (i = h) : (a = t ? h.to : h.from);
    }
    let r = i.type.prop(s),
      o,
      l;
    return (
      r && (o = t ? ze(n, i.from, 1) : ze(n, i.to, -1)) && o.matched
        ? (l = t ? o.end.to : o.end.from)
        : (l = t ? i.to : i.from),
      w.cursor(l, t ? -1 : 1)
    );
  }
  var Vm = (n) => Ue(n, (e) => Ws(n.state, e, !de(n))),
    Im = (n) => Ue(n, (e) => Ws(n.state, e, de(n)));
  function Cf(n, e) {
    return Ue(n, (t) => {
      if (!t.empty) return Ys(t, e);
      let i = n.moveVertically(t, e);
      return i.head != t.head ? i : n.moveToLineBoundary(t, e);
    });
  }
  var Tf = (n) => Cf(n, !1),
    Af = (n) => Cf(n, !0);
  function Rf(n) {
    let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2,
      t = 0,
      i = 0,
      s;
    if (e) {
      for (let r of n.state.facet(v.scrollMargins)) {
        let o = r(n);
        o?.top && (t = Math.max(o?.top, t)),
          o?.bottom && (i = Math.max(o?.bottom, i));
      }
      s = n.scrollDOM.clientHeight - t - i;
    } else s = (n.dom.ownerDocument.defaultView || window).innerHeight;
    return {
      marginTop: t,
      marginBottom: i,
      selfScroll: e,
      height: Math.max(n.defaultLineHeight, s - 5),
    };
  }
  function Yf(n, e) {
    let t = Rf(n),
      { state: i } = n,
      s = di(i.selection, (o) =>
        o.empty ? n.moveVertically(o, e, t.height) : Ys(o, e)
      );
    if (s.eq(i.selection)) return !1;
    let r;
    if (t.selfScroll) {
      let o = n.coordsAtPos(i.selection.main.head),
        l = n.scrollDOM.getBoundingClientRect(),
        a = l.top + t.marginTop,
        h = l.bottom - t.marginBottom;
      o &&
        o.top > a &&
        o.bottom < h &&
        (r = v.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
    }
    return n.dispatch(rt(i, s), { effects: r }), !0;
  }
  var ff = (n) => Yf(n, !1),
    ol = (n) => Yf(n, !0);
  function Qt(n, e, t) {
    let i = n.lineBlockAt(e.head),
      s = n.moveToLineBoundary(e, t);
    if (
      (s.head == e.head &&
        s.head != (t ? i.to : i.from) &&
        (s = n.moveToLineBoundary(e, t, !1)),
      !t && s.head == i.from && i.length)
    ) {
      let r = /^\s*/.exec(
        n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to))
      )[0].length;
      r && e.head != i.from + r && (s = w.cursor(i.from + r));
    }
    return s;
  }
  var Lm = (n) => Ue(n, (e) => Qt(n, e, !0)),
    _m = (n) => Ue(n, (e) => Qt(n, e, !1)),
    Nm = (n) => Ue(n, (e) => Qt(n, e, !de(n))),
    zm = (n) => Ue(n, (e) => Qt(n, e, de(n))),
    Gm = (n) => Ue(n, (e) => w.cursor(n.lineBlockAt(e.head).from, 1)),
    Um = (n) => Ue(n, (e) => w.cursor(n.lineBlockAt(e.head).to, -1));
  function Fm(n, e, t) {
    let i = !1,
      s = di(n.selection, (r) => {
        let o =
          ze(n, r.head, -1) ||
          ze(n, r.head, 1) ||
          (r.head > 0 && ze(n, r.head - 1, 1)) ||
          (r.head < n.doc.length && ze(n, r.head + 1, -1));
        if (!o || !o.end) return r;
        i = !0;
        let l = o.start.from == r.head ? o.end.to : o.end.from;
        return t ? w.range(r.anchor, l) : w.cursor(l);
      });
    return i ? (e(rt(n, s)), !0) : !1;
  }
  var Hm = ({ state: n, dispatch: e }) => Fm(n, e, !1);
  function Be(n, e) {
    let t = di(n.state.selection, (i) => {
      let s = e(i);
      return w.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0);
    });
    return t.eq(n.state.selection) ? !1 : (n.dispatch(rt(n.state, t)), !0);
  }
  function Wf(n, e) {
    return Be(n, (t) => n.moveByChar(t, e));
  }
  var Xf = (n) => Wf(n, !de(n)),
    Mf = (n) => Wf(n, de(n));
  function Ef(n, e) {
    return Be(n, (t) => n.moveByGroup(t, e));
  }
  var Km = (n) => Ef(n, !de(n)),
    Jm = (n) => Ef(n, de(n));
  var eg = (n) => Be(n, (e) => Ws(n.state, e, !de(n))),
    tg = (n) => Be(n, (e) => Ws(n.state, e, de(n)));
  function Df(n, e) {
    return Be(n, (t) => n.moveVertically(t, e));
  }
  var jf = (n) => Df(n, !1),
    qf = (n) => Df(n, !0);
  function Bf(n, e) {
    return Be(n, (t) => n.moveVertically(t, e, Rf(n).height));
  }
  var uf = (n) => Bf(n, !1),
    df = (n) => Bf(n, !0),
    ig = (n) => Be(n, (e) => Qt(n, e, !0)),
    ng = (n) => Be(n, (e) => Qt(n, e, !1)),
    sg = (n) => Be(n, (e) => Qt(n, e, !de(n))),
    rg = (n) => Be(n, (e) => Qt(n, e, de(n))),
    og = (n) => Be(n, (e) => w.cursor(n.lineBlockAt(e.head).from)),
    lg = (n) => Be(n, (e) => w.cursor(n.lineBlockAt(e.head).to)),
    pf = ({ state: n, dispatch: e }) => (e(rt(n, { anchor: 0 })), !0),
    Of = ({ state: n, dispatch: e }) => (
      e(rt(n, { anchor: n.doc.length })), !0
    ),
    mf = ({ state: n, dispatch: e }) => (
      e(rt(n, { anchor: n.selection.main.anchor, head: 0 })), !0
    ),
    gf = ({ state: n, dispatch: e }) => (
      e(rt(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0
    ),
    ag = ({ state: n, dispatch: e }) => (
      e(
        n.update({
          selection: { anchor: 0, head: n.doc.length },
          userEvent: "select",
        })
      ),
      !0
    ),
    hg = ({ state: n, dispatch: e }) => {
      let t = Xs(n).map(({ from: i, to: s }) =>
        w.range(i, Math.min(s + 1, n.doc.length))
      );
      return e(n.update({ selection: w.create(t), userEvent: "select" })), !0;
    },
    cg = ({ state: n, dispatch: e }) => {
      let t = di(n.selection, (i) => {
        var s;
        let r = te(n).resolveStack(i.from, 1);
        for (let o = r; o; o = o.next) {
          let { node: l } = o;
          if (
            ((l.from < i.from && l.to >= i.to) ||
              (l.to > i.to && l.from <= i.from)) &&
            !((s = l.parent) === null || s === void 0) &&
            s.parent
          )
            return w.range(l.to, l.from);
        }
        return i;
      });
      return e(rt(n, t)), !0;
    },
    fg = ({ state: n, dispatch: e }) => {
      let t = n.selection,
        i = null;
      return (
        t.ranges.length > 1
          ? (i = w.create([t.main]))
          : t.main.empty || (i = w.create([w.cursor(t.main.head)])),
        i ? (e(rt(n, i)), !0) : !1
      );
    };
  function hn(n, e) {
    if (n.state.readOnly) return !1;
    let t = "delete.selection",
      { state: i } = n,
      s = i.changeByRange((r) => {
        let { from: o, to: l } = r;
        if (o == l) {
          let a = e(r);
          a < o
            ? ((t = "delete.backward"), (a = Cs(n, a, !1)))
            : a > o && ((t = "delete.forward"), (a = Cs(n, a, !0))),
            (o = Math.min(o, a)),
            (l = Math.max(l, a));
        } else (o = Cs(n, o, !1)), (l = Cs(n, l, !0));
        return o == l
          ? { range: r }
          : {
              changes: { from: o, to: l },
              range: w.cursor(o, o < r.head ? -1 : 1),
            };
      });
    return s.changes.empty
      ? !1
      : (n.dispatch(
          i.update(s, {
            scrollIntoView: !0,
            userEvent: t,
            effects:
              t == "delete.selection"
                ? v.announce.of(i.phrase("Selection deleted"))
                : void 0,
          })
        ),
        !0);
  }
  function Cs(n, e, t) {
    if (n instanceof v)
      for (let i of n.state.facet(v.atomicRanges).map((s) => s(n)))
        i.between(e, e, (s, r) => {
          s < e && r > e && (e = t ? r : s);
        });
    return e;
  }
  var Vf = (n, e) =>
      hn(n, (t) => {
        let i = t.from,
          { state: s } = n,
          r = s.doc.lineAt(i),
          o,
          l;
        if (
          !e &&
          i > r.from &&
          i < r.from + 200 &&
          !/[^ \t]/.test((o = r.text.slice(0, i - r.from)))
        ) {
          if (o[o.length - 1] == "	") return i - 1;
          let a = lt(o, s.tabSize),
            h = a % rn(s) || rn(s);
          for (let c = 0; c < h && o[o.length - 1 - c] == " "; c++) i--;
          l = i;
        } else
          (l = se(r.text, i - r.from, e, e) + r.from),
            l == i && r.number != (e ? s.doc.lines : 1)
              ? (l += e ? 1 : -1)
              : !e &&
                /[\ufe00-\ufe0f]/.test(r.text.slice(l - r.from, i - r.from)) &&
                (l = se(r.text, l - r.from, !1, !1) + r.from);
        return l;
      }),
    ll = (n) => Vf(n, !1),
    If = (n) => Vf(n, !0),
    Lf = (n, e) =>
      hn(n, (t) => {
        let i = t.head,
          { state: s } = n,
          r = s.doc.lineAt(i),
          o = s.charCategorizer(i);
        for (let l = null; ; ) {
          if (i == (e ? r.to : r.from)) {
            i == t.head &&
              r.number != (e ? s.doc.lines : 1) &&
              (i += e ? 1 : -1);
            break;
          }
          let a = se(r.text, i - r.from, e) + r.from,
            h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from),
            c = o(h);
          if (l != null && c != l) break;
          (h != " " || i != t.head) && (l = c), (i = a);
        }
        return i;
      }),
    _f = (n) => Lf(n, !1),
    ug = (n) => Lf(n, !0),
    dg = (n) =>
      hn(n, (e) => {
        let t = n.lineBlockAt(e.head).to;
        return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
      });
  var pg = (n) =>
      hn(n, (e) => {
        let t = n.moveToLineBoundary(e, !1).head;
        return e.head > t ? t : Math.max(0, e.head - 1);
      }),
    Og = (n) =>
      hn(n, (e) => {
        let t = n.moveToLineBoundary(e, !0).head;
        return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
      });
  var mg = ({ state: n, dispatch: e }) => {
      if (n.readOnly) return !1;
      let t = n.changeByRange((i) => ({
        changes: { from: i.from, to: i.to, insert: j.of(["", ""]) },
        range: w.cursor(i.from),
      }));
      return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
    },
    gg = ({ state: n, dispatch: e }) => {
      if (n.readOnly) return !1;
      let t = n.changeByRange((i) => {
        if (!i.empty || i.from == 0 || i.from == n.doc.length)
          return { range: i };
        let s = i.from,
          r = n.doc.lineAt(s),
          o = s == r.from ? s - 1 : se(r.text, s - r.from, !1) + r.from,
          l = s == r.to ? s + 1 : se(r.text, s - r.from, !0) + r.from;
        return {
          changes: {
            from: o,
            to: l,
            insert: n.doc.slice(s, l).append(n.doc.slice(o, s)),
          },
          range: w.cursor(l),
        };
      });
      return t.changes.empty
        ? !1
        : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })),
          !0);
    };
  function Xs(n) {
    let e = [],
      t = -1;
    for (let i of n.selection.ranges) {
      let s = n.doc.lineAt(i.from),
        r = n.doc.lineAt(i.to);
      if (
        (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)),
        t >= s.number)
      ) {
        let o = e[e.length - 1];
        (o.to = r.to), o.ranges.push(i);
      } else e.push({ from: s.from, to: r.to, ranges: [i] });
      t = r.number + 1;
    }
    return e;
  }
  function Nf(n, e, t) {
    if (n.readOnly) return !1;
    let i = [],
      s = [];
    for (let r of Xs(n)) {
      if (t ? r.to == n.doc.length : r.from == 0) continue;
      let o = n.doc.lineAt(t ? r.to + 1 : r.from - 1),
        l = o.length + 1;
      if (t) {
        i.push(
          { from: r.to, to: o.to },
          { from: r.from, insert: o.text + n.lineBreak }
        );
        for (let a of r.ranges)
          s.push(
            w.range(
              Math.min(n.doc.length, a.anchor + l),
              Math.min(n.doc.length, a.head + l)
            )
          );
      } else {
        i.push(
          { from: o.from, to: r.from },
          { from: r.to, insert: n.lineBreak + o.text }
        );
        for (let a of r.ranges) s.push(w.range(a.anchor - l, a.head - l));
      }
    }
    return i.length
      ? (e(
          n.update({
            changes: i,
            scrollIntoView: !0,
            selection: w.create(s, n.selection.mainIndex),
            userEvent: "move.line",
          })
        ),
        !0)
      : !1;
  }
  var yg = ({ state: n, dispatch: e }) => Nf(n, e, !1),
    bg = ({ state: n, dispatch: e }) => Nf(n, e, !0);
  function zf(n, e, t) {
    if (n.readOnly) return !1;
    let i = [];
    for (let s of Xs(n))
      t
        ? i.push({
            from: s.from,
            insert: n.doc.slice(s.from, s.to) + n.lineBreak,
          })
        : i.push({
            from: s.to,
            insert: n.lineBreak + n.doc.slice(s.from, s.to),
          });
    return (
      e(
        n.update({
          changes: i,
          scrollIntoView: !0,
          userEvent: "input.copyline",
        })
      ),
      !0
    );
  }
  var wg = ({ state: n, dispatch: e }) => zf(n, e, !1),
    Sg = ({ state: n, dispatch: e }) => zf(n, e, !0),
    xg = (n) => {
      if (n.state.readOnly) return !1;
      let { state: e } = n,
        t = e.changes(
          Xs(e).map(
            ({ from: s, to: r }) => (
              s > 0 ? s-- : r < e.doc.length && r++, { from: s, to: r }
            )
          )
        ),
        i = di(e.selection, (s) => n.moveVertically(s, !0)).map(t);
      return (
        n.dispatch({
          changes: t,
          selection: i,
          scrollIntoView: !0,
          userEvent: "delete.line",
        }),
        !0
      );
    };
  function kg(n, e) {
    if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
      return { from: e, to: e };
    let t = te(n).resolveInner(e),
      i = t.childBefore(e),
      s = t.childAfter(e),
      r;
    return i &&
      s &&
      i.to <= e &&
      s.from >= e &&
      (r = i.type.prop(W.closedBy)) &&
      r.indexOf(s.name) > -1 &&
      n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from &&
      !/\S/.test(n.sliceDoc(i.to, s.from))
      ? { from: i.to, to: s.from }
      : null;
  }
  var Qg = Gf(!1),
    vg = Gf(!0);
  function Gf(n) {
    return ({ state: e, dispatch: t }) => {
      if (e.readOnly) return !1;
      let i = e.changeByRange((s) => {
        let { from: r, to: o } = s,
          l = e.doc.lineAt(r),
          a = !n && r == o && kg(e, r);
        n && (r = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
        let h = new qt(e, { simulateBreak: r, simulateDoubleBreak: !!a }),
          c = vs(h, r);
        for (
          c == null &&
          (c = lt(/^\s*/.exec(e.doc.lineAt(r).text)[0], e.tabSize));
          o < l.to && /\s/.test(l.text[o - l.from]);

        )
          o++;
        a
          ? ({ from: r, to: o } = a)
          : r > l.from &&
            r < l.from + 100 &&
            !/\S/.test(l.text.slice(0, r)) &&
            (r = l.from);
        let f = ["", ui(e, c)];
        return (
          a && f.push(ui(e, h.lineIndent(l.from, -1))),
          {
            changes: { from: r, to: o, insert: j.of(f) },
            range: w.cursor(r + 1 + f[1].length),
          }
        );
      });
      return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
    };
  }
  function fl(n, e) {
    let t = -1;
    return n.changeByRange((i) => {
      let s = [];
      for (let o = i.from; o <= i.to; ) {
        let l = n.doc.lineAt(o);
        l.number > t &&
          (i.empty || i.to > l.from) &&
          (e(l, s, i), (t = l.number)),
          (o = l.to + 1);
      }
      let r = n.changes(s);
      return {
        changes: s,
        range: w.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1)),
      };
    });
  }
  var Pg = ({ state: n, dispatch: e }) => {
      if (n.readOnly) return !1;
      let t = Object.create(null),
        i = new qt(n, {
          overrideIndentation: (r) => {
            let o = t[r];
            return o ?? -1;
          },
        }),
        s = fl(n, (r, o, l) => {
          let a = vs(i, r.from);
          if (a == null) return;
          /\S/.test(r.text) || (a = 0);
          let h = /^\s*/.exec(r.text)[0],
            c = ui(n, a);
          (h != c || l.from < r.from + h.length) &&
            ((t[r.from] = a),
            o.push({ from: r.from, to: r.from + h.length, insert: c }));
        });
      return s.changes.empty || e(n.update(s, { userEvent: "indent" })), !0;
    },
    Ms = ({ state: n, dispatch: e }) =>
      n.readOnly
        ? !1
        : (e(
            n.update(
              fl(n, (t, i) => {
                i.push({ from: t.from, insert: n.facet(fi) });
              }),
              { userEvent: "input.indent" }
            )
          ),
          !0),
    Uf = ({ state: n, dispatch: e }) =>
      n.readOnly
        ? !1
        : (e(
            n.update(
              fl(n, (t, i) => {
                let s = /^\s*/.exec(t.text)[0];
                if (!s) return;
                let r = lt(s, n.tabSize),
                  o = 0,
                  l = ui(n, Math.max(0, r - rn(n)));
                for (
                  ;
                  o < s.length &&
                  o < l.length &&
                  s.charCodeAt(o) == l.charCodeAt(o);

                )
                  o++;
                i.push({
                  from: t.from + o,
                  to: t.from + s.length,
                  insert: l.slice(o),
                });
              }),
              { userEvent: "delete.dedent" }
            )
          ),
          !0);
  var $g = [
      { key: "Ctrl-b", run: Pf, shift: Xf, preventDefault: !0 },
      { key: "Ctrl-f", run: $f, shift: Mf },
      { key: "Ctrl-p", run: Tf, shift: jf },
      { key: "Ctrl-n", run: Af, shift: qf },
      { key: "Ctrl-a", run: Gm, shift: og },
      { key: "Ctrl-e", run: Um, shift: lg },
      { key: "Ctrl-d", run: If },
      { key: "Ctrl-h", run: ll },
      { key: "Ctrl-k", run: dg },
      { key: "Ctrl-Alt-h", run: _f },
      { key: "Ctrl-o", run: mg },
      { key: "Ctrl-t", run: gg },
      { key: "Ctrl-v", run: ol },
    ],
    Zg = [
      { key: "ArrowLeft", run: Pf, shift: Xf, preventDefault: !0 },
      {
        key: "Mod-ArrowLeft",
        mac: "Alt-ArrowLeft",
        run: jm,
        shift: Km,
        preventDefault: !0,
      },
      { mac: "Cmd-ArrowLeft", run: Nm, shift: sg, preventDefault: !0 },
      { key: "ArrowRight", run: $f, shift: Mf, preventDefault: !0 },
      {
        key: "Mod-ArrowRight",
        mac: "Alt-ArrowRight",
        run: qm,
        shift: Jm,
        preventDefault: !0,
      },
      { mac: "Cmd-ArrowRight", run: zm, shift: rg, preventDefault: !0 },
      { key: "ArrowUp", run: Tf, shift: jf, preventDefault: !0 },
      { mac: "Cmd-ArrowUp", run: pf, shift: mf },
      { mac: "Ctrl-ArrowUp", run: ff, shift: uf },
      { key: "ArrowDown", run: Af, shift: qf, preventDefault: !0 },
      { mac: "Cmd-ArrowDown", run: Of, shift: gf },
      { mac: "Ctrl-ArrowDown", run: ol, shift: df },
      { key: "PageUp", run: ff, shift: uf },
      { key: "PageDown", run: ol, shift: df },
      { key: "Home", run: _m, shift: ng, preventDefault: !0 },
      { key: "Mod-Home", run: pf, shift: mf },
      { key: "End", run: Lm, shift: ig, preventDefault: !0 },
      { key: "Mod-End", run: Of, shift: gf },
      { key: "Enter", run: Qg },
      { key: "Mod-a", run: ag },
      { key: "Backspace", run: ll, shift: ll },
      { key: "Delete", run: If },
      { key: "Mod-Backspace", mac: "Alt-Backspace", run: _f },
      { key: "Mod-Delete", mac: "Alt-Delete", run: ug },
      { mac: "Mod-Backspace", run: pg },
      { mac: "Mod-Delete", run: Og },
    ].concat($g.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))),
    Ff = [
      { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: Vm, shift: eg },
      { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: Im, shift: tg },
      { key: "Alt-ArrowUp", run: yg },
      { key: "Shift-Alt-ArrowUp", run: wg },
      { key: "Alt-ArrowDown", run: bg },
      { key: "Shift-Alt-ArrowDown", run: Sg },
      { key: "Escape", run: fg },
      { key: "Mod-Enter", run: vg },
      { key: "Alt-l", mac: "Ctrl-l", run: hg },
      { key: "Mod-i", run: cg, preventDefault: !0 },
      { key: "Mod-[", run: Uf },
      { key: "Mod-]", run: Ms },
      { key: "Mod-Alt-\\", run: Pg },
      { key: "Shift-Mod-k", run: xg },
      { key: "Shift-Mod-\\", run: Hm },
      { key: "Mod-/", run: al },
      { key: "Alt-A", run: Qm },
    ].concat(Zg),
    Hf = { key: "Tab", run: Ms, shift: Uf };
  function L() {
    var n = arguments[0];
    typeof n == "string" && (n = document.createElement(n));
    var e = 1,
      t = arguments[1];
    if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
      for (var i in t)
        if (Object.prototype.hasOwnProperty.call(t, i)) {
          var s = t[i];
          typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
        }
      e++;
    }
    for (; e < arguments.length; e++) Kf(n, arguments[e]);
    return n;
  }
  function Kf(n, e) {
    if (typeof e == "string") n.appendChild(document.createTextNode(e));
    else if (e != null)
      if (e.nodeType != null) n.appendChild(e);
      else if (Array.isArray(e)) for (var t = 0; t < e.length; t++) Kf(n, e[t]);
      else throw new RangeError("Unsupported child node: " + e);
  }
  var Jf =
      typeof String.prototype.normalize == "function"
        ? (n) => n.normalize("NFKD")
        : (n) => n,
    Pt = class {
      constructor(e, t, i = 0, s = e.length, r, o) {
        (this.test = o),
          (this.value = { from: 0, to: 0 }),
          (this.done = !1),
          (this.matches = []),
          (this.buffer = ""),
          (this.bufferPos = 0),
          (this.iter = e.iterRange(i, s)),
          (this.bufferStart = i),
          (this.normalize = r ? (l) => r(Jf(l)) : Jf),
          (this.query = this.normalize(t));
      }
      peek() {
        if (this.bufferPos == this.buffer.length) {
          if (
            ((this.bufferStart += this.buffer.length),
            this.iter.next(),
            this.iter.done)
          )
            return -1;
          (this.bufferPos = 0), (this.buffer = this.iter.value);
        }
        return ne(this.buffer, this.bufferPos);
      }
      next() {
        for (; this.matches.length; ) this.matches.pop();
        return this.nextOverlapping();
      }
      nextOverlapping() {
        for (;;) {
          let e = this.peek();
          if (e < 0) return (this.done = !0), this;
          let t = Pi(e),
            i = this.bufferStart + this.bufferPos;
          this.bufferPos += Oe(e);
          let s = this.normalize(t);
          for (let r = 0, o = i; ; r++) {
            let l = s.charCodeAt(r),
              a = this.match(l, o);
            if (r == s.length - 1) {
              if (a) return (this.value = a), this;
              break;
            }
            o == i && r < t.length && t.charCodeAt(r) == l && o++;
          }
        }
      }
      match(e, t) {
        let i = null;
        for (let s = 0; s < this.matches.length; s += 2) {
          let r = this.matches[s],
            o = !1;
          this.query.charCodeAt(r) == e &&
            (r == this.query.length - 1
              ? (i = { from: this.matches[s + 1], to: t + 1 })
              : (this.matches[s]++, (o = !0))),
            o || (this.matches.splice(s, 2), (s -= 2));
        }
        return (
          this.query.charCodeAt(0) == e &&
            (this.query.length == 1
              ? (i = { from: t, to: t + 1 })
              : this.matches.push(1, t)),
          i &&
            this.test &&
            !this.test(i.from, i.to, this.buffer, this.bufferStart) &&
            (i = null),
          i
        );
      }
    };
  typeof Symbol < "u" &&
    (Pt.prototype[Symbol.iterator] = function () {
      return this;
    });
  var nu = { from: -1, to: -1, match: /.*/.exec("") },
    yl = "gm" + (/x/.unicode == null ? "" : "u"),
    js = class {
      constructor(e, t, i, s = 0, r = e.length) {
        if (
          ((this.text = e),
          (this.to = r),
          (this.curLine = ""),
          (this.done = !1),
          (this.value = nu),
          /\\[sWDnr]|\n|\r|\[\^/.test(t))
        )
          return new Bs(e, t, i, s, r);
        (this.re = new RegExp(t, yl + (i?.ignoreCase ? "i" : ""))),
          (this.test = i?.test),
          (this.iter = e.iter());
        let o = e.lineAt(s);
        (this.curLineStart = o.from),
          (this.matchPos = Vs(e, s)),
          this.getLine(this.curLineStart);
      }
      getLine(e) {
        this.iter.next(e),
          this.iter.lineBreak
            ? (this.curLine = "")
            : ((this.curLine = this.iter.value),
              this.curLineStart + this.curLine.length > this.to &&
                (this.curLine = this.curLine.slice(
                  0,
                  this.to - this.curLineStart
                )),
              this.iter.next());
      }
      nextLine() {
        (this.curLineStart = this.curLineStart + this.curLine.length + 1),
          this.curLineStart > this.to ? (this.curLine = "") : this.getLine(0);
      }
      next() {
        for (let e = this.matchPos - this.curLineStart; ; ) {
          this.re.lastIndex = e;
          let t = this.matchPos <= this.to && this.re.exec(this.curLine);
          if (t) {
            let i = this.curLineStart + t.index,
              s = i + t[0].length;
            if (
              ((this.matchPos = Vs(this.text, s + (i == s ? 1 : 0))),
              i == this.curLineStart + this.curLine.length && this.nextLine(),
              (i < s || i > this.value.to) &&
                (!this.test || this.test(i, s, t)))
            )
              return (this.value = { from: i, to: s, match: t }), this;
            e = this.matchPos - this.curLineStart;
          } else if (this.curLineStart + this.curLine.length < this.to)
            this.nextLine(), (e = 0);
          else return (this.done = !0), this;
        }
      }
    },
    ul = new WeakMap(),
    qs = class n {
      constructor(e, t) {
        (this.from = e), (this.text = t);
      }
      get to() {
        return this.from + this.text.length;
      }
      static get(e, t, i) {
        let s = ul.get(e);
        if (!s || s.from >= i || s.to <= t) {
          let l = new n(t, e.sliceString(t, i));
          return ul.set(e, l), l;
        }
        if (s.from == t && s.to == i) return s;
        let { text: r, from: o } = s;
        return (
          o > t && ((r = e.sliceString(t, o) + r), (o = t)),
          s.to < i && (r += e.sliceString(s.to, i)),
          ul.set(e, new n(o, r)),
          new n(t, r.slice(t - o, i - o))
        );
      }
    },
    Bs = class {
      constructor(e, t, i, s, r) {
        (this.text = e),
          (this.to = r),
          (this.done = !1),
          (this.value = nu),
          (this.matchPos = Vs(e, s)),
          (this.re = new RegExp(t, yl + (i?.ignoreCase ? "i" : ""))),
          (this.test = i?.test),
          (this.flat = qs.get(e, s, this.chunkEnd(s + 5e3)));
      }
      chunkEnd(e) {
        return e >= this.to ? this.to : this.text.lineAt(e).to;
      }
      next() {
        for (;;) {
          let e = (this.re.lastIndex = this.matchPos - this.flat.from),
            t = this.re.exec(this.flat.text);
          if (
            (t &&
              !t[0] &&
              t.index == e &&
              ((this.re.lastIndex = e + 1), (t = this.re.exec(this.flat.text))),
            t)
          ) {
            let i = this.flat.from + t.index,
              s = i + t[0].length;
            if (
              (this.flat.to >= this.to ||
                t.index + t[0].length <= this.flat.text.length - 10) &&
              (!this.test || this.test(i, s, t))
            )
              return (
                (this.value = { from: i, to: s, match: t }),
                (this.matchPos = Vs(this.text, s + (i == s ? 1 : 0))),
                this
              );
          }
          if (this.flat.to == this.to) return (this.done = !0), this;
          this.flat = qs.get(
            this.text,
            this.flat.from,
            this.chunkEnd(this.flat.from + this.flat.text.length * 2)
          );
        }
      }
    };
  typeof Symbol < "u" &&
    (js.prototype[Symbol.iterator] = Bs.prototype[Symbol.iterator] =
      function () {
        return this;
      });
  function Cg(n) {
    try {
      return new RegExp(n, yl), !0;
    } catch {
      return !1;
    }
  }
  function Vs(n, e) {
    if (e >= n.length) return e;
    let t = n.lineAt(e),
      i;
    for (
      ;
      e < t.to && (i = t.text.charCodeAt(e - t.from)) >= 56320 && i < 57344;

    )
      e++;
    return e;
  }
  function dl(n) {
    let e = String(n.state.doc.lineAt(n.state.selection.main.head).number),
      t = L("input", { class: "cm-textfield", name: "line", value: e }),
      i = L(
        "form",
        {
          class: "cm-gotoLine",
          onkeydown: (r) => {
            r.keyCode == 27
              ? (r.preventDefault(),
                n.dispatch({ effects: Is.of(!1) }),
                n.focus())
              : r.keyCode == 13 && (r.preventDefault(), s());
          },
          onsubmit: (r) => {
            r.preventDefault(), s();
          },
        },
        L("label", n.state.phrase("Go to line"), ": ", t),
        " ",
        L(
          "button",
          { class: "cm-button", type: "submit" },
          n.state.phrase("go")
        )
      );
    function s() {
      let r = /^([+-])?(\d+)?(:\d+)?(%)?$/.exec(t.value);
      if (!r) return;
      let { state: o } = n,
        l = o.doc.lineAt(o.selection.main.head),
        [, a, h, c, f] = r,
        u = c ? +c.slice(1) : 0,
        d = h ? +h : l.number;
      if (h && f) {
        let m = d / 100;
        a && (m = m * (a == "-" ? -1 : 1) + l.number / o.doc.lines),
          (d = Math.round(o.doc.lines * m));
      } else h && a && (d = d * (a == "-" ? -1 : 1) + l.number);
      let p = o.doc.line(Math.max(1, Math.min(o.doc.lines, d))),
        g = w.cursor(p.from + Math.max(0, Math.min(u, p.length)));
      n.dispatch({
        effects: [Is.of(!1), v.scrollIntoView(g.from, { y: "center" })],
        selection: g,
      }),
        n.focus();
    }
    return { dom: i };
  }
  var Is = Y.define(),
    eu = F.define({
      create() {
        return !0;
      },
      update(n, e) {
        for (let t of e.effects) t.is(Is) && (n = t.value);
        return n;
      },
      provide: (n) => Xt.from(n, (e) => (e ? dl : null)),
    }),
    Tg = (n) => {
      let e = Mt(n, dl);
      if (!e) {
        let t = [Is.of(!0)];
        n.state.field(eu, !1) == null && t.push(Y.appendConfig.of([eu, Ag])),
          n.dispatch({ effects: t }),
          (e = Mt(n, dl));
      }
      return e && e.dom.querySelector("input").select(), !0;
    },
    Ag = v.baseTheme({
      ".cm-panel.cm-gotoLine": {
        padding: "2px 6px 4px",
        "& label": { fontSize: "80%" },
      },
    }),
    Rg = {
      highlightWordAroundCursor: !1,
      minSelectionLength: 1,
      maxMatches: 100,
      wholeWords: !1,
    },
    su = T.define({
      combine(n) {
        return fe(n, Rg, {
          highlightWordAroundCursor: (e, t) => e || t,
          minSelectionLength: Math.min,
          maxMatches: Math.min,
        });
      },
    });
  function ru(n) {
    let e = [Eg, Mg];
    return n && e.push(su.of(n)), e;
  }
  var Yg = R.mark({ class: "cm-selectionMatch" }),
    Wg = R.mark({ class: "cm-selectionMatch cm-selectionMatch-main" });
  function tu(n, e, t, i) {
    return (
      (t == 0 || n(e.sliceDoc(t - 1, t)) != _.Word) &&
      (i == e.doc.length || n(e.sliceDoc(i, i + 1)) != _.Word)
    );
  }
  function Xg(n, e, t, i) {
    return (
      n(e.sliceDoc(t, t + 1)) == _.Word && n(e.sliceDoc(i - 1, i)) == _.Word
    );
  }
  var Mg = J.fromClass(
      class {
        constructor(n) {
          this.decorations = this.getDeco(n);
        }
        update(n) {
          (n.selectionSet || n.docChanged || n.viewportChanged) &&
            (this.decorations = this.getDeco(n.view));
        }
        getDeco(n) {
          let e = n.state.facet(su),
            { state: t } = n,
            i = t.selection;
          if (i.ranges.length > 1) return R.none;
          let s = i.main,
            r,
            o = null;
          if (s.empty) {
            if (!e.highlightWordAroundCursor) return R.none;
            let a = t.wordAt(s.head);
            if (!a) return R.none;
            (o = t.charCategorizer(s.head)), (r = t.sliceDoc(a.from, a.to));
          } else {
            let a = s.to - s.from;
            if (a < e.minSelectionLength || a > 200) return R.none;
            if (e.wholeWords) {
              if (
                ((r = t.sliceDoc(s.from, s.to)),
                (o = t.charCategorizer(s.head)),
                !(tu(o, t, s.from, s.to) && Xg(o, t, s.from, s.to)))
              )
                return R.none;
            } else if (((r = t.sliceDoc(s.from, s.to).trim()), !r))
              return R.none;
          }
          let l = [];
          for (let a of n.visibleRanges) {
            let h = new Pt(t.doc, r, a.from, a.to);
            for (; !h.next().done; ) {
              let { from: c, to: f } = h.value;
              if (
                (!o || tu(o, t, c, f)) &&
                (s.empty && c <= s.from && f >= s.to
                  ? l.push(Wg.range(c, f))
                  : (c >= s.to || f <= s.from) && l.push(Yg.range(c, f)),
                l.length > e.maxMatches)
              )
                return R.none;
            }
          }
          return R.set(l);
        }
      },
      { decorations: (n) => n.decorations }
    ),
    Eg = v.baseTheme({
      ".cm-selectionMatch": { backgroundColor: "#99ff7780" },
      ".cm-searchMatch .cm-selectionMatch": { backgroundColor: "transparent" },
    }),
    Dg = ({ state: n, dispatch: e }) => {
      let { selection: t } = n,
        i = w.create(
          t.ranges.map((s) => n.wordAt(s.head) || w.cursor(s.head)),
          t.mainIndex
        );
      return i.eq(t) ? !1 : (e(n.update({ selection: i })), !0);
    };
  function jg(n, e) {
    let { main: t, ranges: i } = n.selection,
      s = n.wordAt(t.head),
      r = s && s.from == t.from && s.to == t.to;
    for (let o = !1, l = new Pt(n.doc, e, i[i.length - 1].to); ; )
      if ((l.next(), l.done)) {
        if (o) return null;
        (l = new Pt(n.doc, e, 0, Math.max(0, i[i.length - 1].from - 1))),
          (o = !0);
      } else {
        if (o && i.some((a) => a.from == l.value.from)) continue;
        if (r) {
          let a = n.wordAt(l.value.from);
          if (!a || a.from != l.value.from || a.to != l.value.to) continue;
        }
        return l.value;
      }
  }
  var qg = ({ state: n, dispatch: e }) => {
      let { ranges: t } = n.selection;
      if (t.some((r) => r.from === r.to)) return Dg({ state: n, dispatch: e });
      let i = n.sliceDoc(t[0].from, t[0].to);
      if (n.selection.ranges.some((r) => n.sliceDoc(r.from, r.to) != i))
        return !1;
      let s = jg(n, i);
      return s
        ? (e(
            n.update({
              selection: n.selection.addRange(w.range(s.from, s.to), !1),
              effects: v.scrollIntoView(s.to),
            })
          ),
          !0)
        : !1;
    },
    mi = T.define({
      combine(n) {
        return fe(n, {
          top: !1,
          caseSensitive: !1,
          literal: !1,
          regexp: !1,
          wholeWord: !1,
          createPanel: (e) => new gl(e),
          scrollToMatch: (e) => v.scrollIntoView(e),
        });
      },
    });
  var Ls = class {
      constructor(e) {
        (this.search = e.search),
          (this.caseSensitive = !!e.caseSensitive),
          (this.literal = !!e.literal),
          (this.regexp = !!e.regexp),
          (this.replace = e.replace || ""),
          (this.valid = !!this.search && (!this.regexp || Cg(this.search))),
          (this.unquoted = this.unquote(this.search)),
          (this.wholeWord = !!e.wholeWord);
      }
      unquote(e) {
        return this.literal
          ? e
          : e.replace(/\\([nrt\\])/g, (t, i) =>
              i == "n"
                ? `
`
                : i == "r"
                ? "\r"
                : i == "t"
                ? "	"
                : "\\"
            );
      }
      eq(e) {
        return (
          this.search == e.search &&
          this.replace == e.replace &&
          this.caseSensitive == e.caseSensitive &&
          this.regexp == e.regexp &&
          this.wholeWord == e.wholeWord
        );
      }
      create() {
        return this.regexp ? new Ol(this) : new pl(this);
      }
      getCursor(e, t = 0, i) {
        let s = e.doc ? e : V.create({ doc: e });
        return (
          i == null && (i = s.doc.length),
          this.regexp ? Oi(this, s, t, i) : pi(this, s, t, i)
        );
      }
    },
    _s = class {
      constructor(e) {
        this.spec = e;
      }
    };
  function pi(n, e, t, i) {
    return new Pt(
      e.doc,
      n.unquoted,
      t,
      i,
      n.caseSensitive ? void 0 : (s) => s.toLowerCase(),
      n.wholeWord ? Bg(e.doc, e.charCategorizer(e.selection.main.head)) : void 0
    );
  }
  function Bg(n, e) {
    return (t, i, s, r) => (
      (r > t || r + s.length < i) &&
        ((r = Math.max(0, t - 2)),
        (s = n.sliceString(r, Math.min(n.length, i + 2)))),
      (e(Ns(s, t - r)) != _.Word || e(zs(s, t - r)) != _.Word) &&
        (e(zs(s, i - r)) != _.Word || e(Ns(s, i - r)) != _.Word)
    );
  }
  var pl = class extends _s {
    constructor(e) {
      super(e);
    }
    nextMatch(e, t, i) {
      let s = pi(this.spec, e, i, e.doc.length).nextOverlapping();
      return (
        s.done && (s = pi(this.spec, e, 0, t).nextOverlapping()),
        s.done ? null : s.value
      );
    }
    prevMatchInRange(e, t, i) {
      for (let s = i; ; ) {
        let r = Math.max(t, s - 1e4 - this.spec.unquoted.length),
          o = pi(this.spec, e, r, s),
          l = null;
        for (; !o.nextOverlapping().done; ) l = o.value;
        if (l) return l;
        if (r == t) return null;
        s -= 1e4;
      }
    }
    prevMatch(e, t, i) {
      return (
        this.prevMatchInRange(e, 0, t) ||
        this.prevMatchInRange(e, i, e.doc.length)
      );
    }
    getReplacement(e) {
      return this.spec.unquote(this.spec.replace);
    }
    matchAll(e, t) {
      let i = pi(this.spec, e, 0, e.doc.length),
        s = [];
      for (; !i.next().done; ) {
        if (s.length >= t) return null;
        s.push(i.value);
      }
      return s;
    }
    highlight(e, t, i, s) {
      let r = pi(
        this.spec,
        e,
        Math.max(0, t - this.spec.unquoted.length),
        Math.min(i + this.spec.unquoted.length, e.doc.length)
      );
      for (; !r.next().done; ) s(r.value.from, r.value.to);
    }
  };
  function Oi(n, e, t, i) {
    return new js(
      e.doc,
      n.search,
      {
        ignoreCase: !n.caseSensitive,
        test: n.wholeWord
          ? Vg(e.charCategorizer(e.selection.main.head))
          : void 0,
      },
      t,
      i
    );
  }
  function Ns(n, e) {
    return n.slice(se(n, e, !1), e);
  }
  function zs(n, e) {
    return n.slice(e, se(n, e));
  }
  function Vg(n) {
    return (e, t, i) =>
      !i[0].length ||
      ((n(Ns(i.input, i.index)) != _.Word ||
        n(zs(i.input, i.index)) != _.Word) &&
        (n(zs(i.input, i.index + i[0].length)) != _.Word ||
          n(Ns(i.input, i.index + i[0].length)) != _.Word));
  }
  var Ol = class extends _s {
      nextMatch(e, t, i) {
        let s = Oi(this.spec, e, i, e.doc.length).next();
        return (
          s.done && (s = Oi(this.spec, e, 0, t).next()), s.done ? null : s.value
        );
      }
      prevMatchInRange(e, t, i) {
        for (let s = 1; ; s++) {
          let r = Math.max(t, i - s * 1e4),
            o = Oi(this.spec, e, r, i),
            l = null;
          for (; !o.next().done; ) l = o.value;
          if (l && (r == t || l.from > r + 10)) return l;
          if (r == t) return null;
        }
      }
      prevMatch(e, t, i) {
        return (
          this.prevMatchInRange(e, 0, t) ||
          this.prevMatchInRange(e, i, e.doc.length)
        );
      }
      getReplacement(e) {
        return this.spec
          .unquote(this.spec.replace)
          .replace(/\$([$&\d+])/g, (t, i) =>
            i == "$"
              ? "$"
              : i == "&"
              ? e.match[0]
              : i != "0" && +i < e.match.length
              ? e.match[i]
              : t
          );
      }
      matchAll(e, t) {
        let i = Oi(this.spec, e, 0, e.doc.length),
          s = [];
        for (; !i.next().done; ) {
          if (s.length >= t) return null;
          s.push(i.value);
        }
        return s;
      }
      highlight(e, t, i, s) {
        let r = Oi(
          this.spec,
          e,
          Math.max(0, t - 250),
          Math.min(i + 250, e.doc.length)
        );
        for (; !r.next().done; ) s(r.value.from, r.value.to);
      }
    },
    fn = Y.define(),
    bl = Y.define(),
    vt = F.define({
      create(n) {
        return new cn(ml(n).create(), null);
      },
      update(n, e) {
        for (let t of e.effects)
          t.is(fn)
            ? (n = new cn(t.value.create(), n.panel))
            : t.is(bl) && (n = new cn(n.query, t.value ? wl : null));
        return n;
      },
      provide: (n) => Xt.from(n, (e) => e.panel),
    });
  var cn = class {
      constructor(e, t) {
        (this.query = e), (this.panel = t);
      }
    },
    Ig = R.mark({ class: "cm-searchMatch" }),
    Lg = R.mark({ class: "cm-searchMatch cm-searchMatch-selected" }),
    _g = J.fromClass(
      class {
        constructor(n) {
          (this.view = n),
            (this.decorations = this.highlight(n.state.field(vt)));
        }
        update(n) {
          let e = n.state.field(vt);
          (e != n.startState.field(vt) ||
            n.docChanged ||
            n.selectionSet ||
            n.viewportChanged) &&
            (this.decorations = this.highlight(e));
        }
        highlight({ query: n, panel: e }) {
          if (!e || !n.spec.valid) return R.none;
          let { view: t } = this,
            i = new Ie();
          for (let s = 0, r = t.visibleRanges, o = r.length; s < o; s++) {
            let { from: l, to: a } = r[s];
            for (; s < o - 1 && a > r[s + 1].from - 2 * 250; ) a = r[++s].to;
            n.highlight(t.state, l, a, (h, c) => {
              let f = t.state.selection.ranges.some(
                (u) => u.from == h && u.to == c
              );
              i.add(h, c, f ? Lg : Ig);
            });
          }
          return i.finish();
        }
      },
      { decorations: (n) => n.decorations }
    );
  function un(n) {
    return (e) => {
      let t = e.state.field(vt, !1);
      return t && t.query.spec.valid ? n(e, t) : au(e);
    };
  }
  var Gs = un((n, { query: e }) => {
      let { to: t } = n.state.selection.main,
        i = e.nextMatch(n.state, t, t);
      if (!i) return !1;
      let s = w.single(i.from, i.to),
        r = n.state.facet(mi);
      return (
        n.dispatch({
          selection: s,
          effects: [Sl(n, i), r.scrollToMatch(s.main, n)],
          userEvent: "select.search",
        }),
        lu(n),
        !0
      );
    }),
    Us = un((n, { query: e }) => {
      let { state: t } = n,
        { from: i } = t.selection.main,
        s = e.prevMatch(t, i, i);
      if (!s) return !1;
      let r = w.single(s.from, s.to),
        o = n.state.facet(mi);
      return (
        n.dispatch({
          selection: r,
          effects: [Sl(n, s), o.scrollToMatch(r.main, n)],
          userEvent: "select.search",
        }),
        lu(n),
        !0
      );
    }),
    Ng = un((n, { query: e }) => {
      let t = e.matchAll(n.state, 1e3);
      return !t || !t.length
        ? !1
        : (n.dispatch({
            selection: w.create(t.map((i) => w.range(i.from, i.to))),
            userEvent: "select.search.matches",
          }),
          !0);
    }),
    zg = ({ state: n, dispatch: e }) => {
      let t = n.selection;
      if (t.ranges.length > 1 || t.main.empty) return !1;
      let { from: i, to: s } = t.main,
        r = [],
        o = 0;
      for (let l = new Pt(n.doc, n.sliceDoc(i, s)); !l.next().done; ) {
        if (r.length > 1e3) return !1;
        l.value.from == i && (o = r.length),
          r.push(w.range(l.value.from, l.value.to));
      }
      return (
        e(
          n.update({
            selection: w.create(r, o),
            userEvent: "select.search.matches",
          })
        ),
        !0
      );
    },
    iu = un((n, { query: e }) => {
      let { state: t } = n,
        { from: i, to: s } = t.selection.main;
      if (t.readOnly) return !1;
      let r = e.nextMatch(t, i, i);
      if (!r) return !1;
      let o = [],
        l,
        a,
        h = [];
      if (
        (r.from == i &&
          r.to == s &&
          ((a = t.toText(e.getReplacement(r))),
          o.push({ from: r.from, to: r.to, insert: a }),
          (r = e.nextMatch(t, r.from, r.to)),
          h.push(
            v.announce.of(
              t.phrase("replaced match on line $", t.doc.lineAt(i).number) + "."
            )
          )),
        r)
      ) {
        let c =
          o.length == 0 || o[0].from >= r.to ? 0 : r.to - r.from - a.length;
        (l = w.single(r.from - c, r.to - c)),
          h.push(Sl(n, r)),
          h.push(t.facet(mi).scrollToMatch(l.main, n));
      }
      return (
        n.dispatch({
          changes: o,
          selection: l,
          effects: h,
          userEvent: "input.replace",
        }),
        !0
      );
    }),
    Gg = un((n, { query: e }) => {
      if (n.state.readOnly) return !1;
      let t = e.matchAll(n.state, 1e9).map((s) => {
        let { from: r, to: o } = s;
        return { from: r, to: o, insert: e.getReplacement(s) };
      });
      if (!t.length) return !1;
      let i = n.state.phrase("replaced $ matches", t.length) + ".";
      return (
        n.dispatch({
          changes: t,
          effects: v.announce.of(i),
          userEvent: "input.replace.all",
        }),
        !0
      );
    });
  function wl(n) {
    return n.state.facet(mi).createPanel(n);
  }
  function ml(n, e) {
    var t, i, s, r, o;
    let l = n.selection.main,
      a = l.empty || l.to > l.from + 100 ? "" : n.sliceDoc(l.from, l.to);
    if (e && !a) return e;
    let h = n.facet(mi);
    return new Ls({
      search: ((t = e?.literal) !== null && t !== void 0 ? t : h.literal)
        ? a
        : a.replace(/\n/g, "\\n"),
      caseSensitive:
        (i = e?.caseSensitive) !== null && i !== void 0 ? i : h.caseSensitive,
      literal: (s = e?.literal) !== null && s !== void 0 ? s : h.literal,
      regexp: (r = e?.regexp) !== null && r !== void 0 ? r : h.regexp,
      wholeWord: (o = e?.wholeWord) !== null && o !== void 0 ? o : h.wholeWord,
    });
  }
  function ou(n) {
    let e = Mt(n, wl);
    return e && e.dom.querySelector("[main-field]");
  }
  function lu(n) {
    let e = ou(n);
    e && e == n.root.activeElement && e.select();
  }
  var au = (n) => {
      let e = n.state.field(vt, !1);
      if (e && e.panel) {
        let t = ou(n);
        if (t && t != n.root.activeElement) {
          let i = ml(n.state, e.query.spec);
          i.valid && n.dispatch({ effects: fn.of(i) }), t.focus(), t.select();
        }
      } else
        n.dispatch({
          effects: [
            bl.of(!0),
            e ? fn.of(ml(n.state, e.query.spec)) : Y.appendConfig.of(Fg),
          ],
        });
      return !0;
    },
    hu = (n) => {
      let e = n.state.field(vt, !1);
      if (!e || !e.panel) return !1;
      let t = Mt(n, wl);
      return (
        t && t.dom.contains(n.root.activeElement) && n.focus(),
        n.dispatch({ effects: bl.of(!1) }),
        !0
      );
    },
    cu = [
      { key: "Mod-f", run: au, scope: "editor search-panel" },
      {
        key: "F3",
        run: Gs,
        shift: Us,
        scope: "editor search-panel",
        preventDefault: !0,
      },
      {
        key: "Mod-g",
        run: Gs,
        shift: Us,
        scope: "editor search-panel",
        preventDefault: !0,
      },
      { key: "Escape", run: hu, scope: "editor search-panel" },
      { key: "Mod-Shift-l", run: zg },
      { key: "Mod-Alt-g", run: Tg },
      { key: "Mod-d", run: qg, preventDefault: !0 },
    ],
    gl = class {
      constructor(e) {
        this.view = e;
        let t = (this.query = e.state.field(vt).query.spec);
        (this.commit = this.commit.bind(this)),
          (this.searchField = L("input", {
            value: t.search,
            placeholder: Ae(e, "Find"),
            "aria-label": Ae(e, "Find"),
            class: "cm-textfield",
            name: "search",
            form: "",
            "main-field": "true",
            onchange: this.commit,
            onkeyup: this.commit,
          })),
          (this.replaceField = L("input", {
            value: t.replace,
            placeholder: Ae(e, "Replace"),
            "aria-label": Ae(e, "Replace"),
            class: "cm-textfield",
            name: "replace",
            form: "",
            onchange: this.commit,
            onkeyup: this.commit,
          })),
          (this.caseField = L("input", {
            type: "checkbox",
            name: "case",
            form: "",
            checked: t.caseSensitive,
            onchange: this.commit,
          })),
          (this.reField = L("input", {
            type: "checkbox",
            name: "re",
            form: "",
            checked: t.regexp,
            onchange: this.commit,
          })),
          (this.wordField = L("input", {
            type: "checkbox",
            name: "word",
            form: "",
            checked: t.wholeWord,
            onchange: this.commit,
          }));
        function i(s, r, o) {
          return L(
            "button",
            { class: "cm-button", name: s, onclick: r, type: "button" },
            o
          );
        }
        this.dom = L(
          "div",
          { onkeydown: (s) => this.keydown(s), class: "cm-search" },
          [
            this.searchField,
            i("next", () => Gs(e), [Ae(e, "next")]),
            i("prev", () => Us(e), [Ae(e, "previous")]),
            i("select", () => Ng(e), [Ae(e, "all")]),
            L("label", null, [this.caseField, Ae(e, "match case")]),
            L("label", null, [this.reField, Ae(e, "regexp")]),
            L("label", null, [this.wordField, Ae(e, "by word")]),
            ...(e.state.readOnly
              ? []
              : [
                  L("br"),
                  this.replaceField,
                  i("replace", () => iu(e), [Ae(e, "replace")]),
                  i("replaceAll", () => Gg(e), [Ae(e, "replace all")]),
                ]),
            L(
              "button",
              {
                name: "close",
                onclick: () => hu(e),
                "aria-label": Ae(e, "close"),
                type: "button",
              },
              ["\xD7"]
            ),
          ]
        );
      }
      commit() {
        let e = new Ls({
          search: this.searchField.value,
          caseSensitive: this.caseField.checked,
          regexp: this.reField.checked,
          wholeWord: this.wordField.checked,
          replace: this.replaceField.value,
        });
        e.eq(this.query) ||
          ((this.query = e), this.view.dispatch({ effects: fn.of(e) }));
      }
      keydown(e) {
        cc(this.view, e, "search-panel")
          ? e.preventDefault()
          : e.keyCode == 13 && e.target == this.searchField
          ? (e.preventDefault(), (e.shiftKey ? Us : Gs)(this.view))
          : e.keyCode == 13 &&
            e.target == this.replaceField &&
            (e.preventDefault(), iu(this.view));
      }
      update(e) {
        for (let t of e.transactions)
          for (let i of t.effects)
            i.is(fn) && !i.value.eq(this.query) && this.setQuery(i.value);
      }
      setQuery(e) {
        (this.query = e),
          (this.searchField.value = e.search),
          (this.replaceField.value = e.replace),
          (this.caseField.checked = e.caseSensitive),
          (this.reField.checked = e.regexp),
          (this.wordField.checked = e.wholeWord);
      }
      mount() {
        this.searchField.select();
      }
      get pos() {
        return 80;
      }
      get top() {
        return this.view.state.facet(mi).top;
      }
    };
  function Ae(n, e) {
    return n.state.phrase(e);
  }
  var Es = 30,
    Ds = /[\s\.,:;?!]/;
  function Sl(n, { from: e, to: t }) {
    let i = n.state.doc.lineAt(e),
      s = n.state.doc.lineAt(t).to,
      r = Math.max(i.from, e - Es),
      o = Math.min(s, t + Es),
      l = n.state.sliceDoc(r, o);
    if (r != i.from) {
      for (let a = 0; a < Es; a++)
        if (!Ds.test(l[a + 1]) && Ds.test(l[a])) {
          l = l.slice(a);
          break;
        }
    }
    if (o != s) {
      for (let a = l.length - 1; a > l.length - Es; a--)
        if (!Ds.test(l[a - 1]) && Ds.test(l[a])) {
          l = l.slice(0, a);
          break;
        }
    }
    return v.announce.of(
      `${n.state.phrase("current match")}. ${l} ${n.state.phrase("on line")} ${
        i.number
      }.`
    );
  }
  var Ug = v.baseTheme({
      ".cm-panel.cm-search": {
        padding: "2px 6px 4px",
        position: "relative",
        "& [name=close]": {
          position: "absolute",
          top: "0",
          right: "4px",
          backgroundColor: "inherit",
          border: "none",
          font: "inherit",
          padding: 0,
          margin: 0,
        },
        "& input, & button, & label": { margin: ".2em .6em .2em 0" },
        "& input[type=checkbox]": { marginRight: ".2em" },
        "& label": { fontSize: "80%", whiteSpace: "pre" },
      },
      "&light .cm-searchMatch": { backgroundColor: "#ffff0054" },
      "&dark .cm-searchMatch": { backgroundColor: "#00ffff8a" },
      "&light .cm-searchMatch-selected": { backgroundColor: "#ff6a0054" },
      "&dark .cm-searchMatch-selected": { backgroundColor: "#ff00ff8a" },
    }),
    Fg = [vt, Le.low(_g), Ug];
  var Hs = class {
    constructor(e, t, i) {
      (this.state = e),
        (this.pos = t),
        (this.explicit = i),
        (this.abortListeners = []);
    }
    tokenBefore(e) {
      let t = te(this.state).resolveInner(this.pos, -1);
      for (; t && e.indexOf(t.name) < 0; ) t = t.parent;
      return t
        ? {
            from: t.from,
            to: this.pos,
            text: this.state.sliceDoc(t.from, this.pos),
            type: t.type,
          }
        : null;
    }
    matchBefore(e) {
      let t = this.state.doc.lineAt(this.pos),
        i = Math.max(t.from, this.pos - 250),
        s = t.text.slice(i - t.from, this.pos - t.from),
        r = s.search(wu(e, !1));
      return r < 0 ? null : { from: i + r, to: this.pos, text: s.slice(r) };
    }
    get aborted() {
      return this.abortListeners == null;
    }
    addEventListener(e, t) {
      e == "abort" && this.abortListeners && this.abortListeners.push(t);
    }
  };
  function fu(n) {
    let e = Object.keys(n).join(""),
      t = /\w/.test(e);
    return (
      t && (e = e.replace(/\w/g, "")),
      `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`
    );
  }
  function Hg(n) {
    let e = Object.create(null),
      t = Object.create(null);
    for (let { label: s } of n) {
      e[s[0]] = !0;
      for (let r = 1; r < s.length; r++) t[s[r]] = !0;
    }
    let i = fu(e) + fu(t) + "*$";
    return [new RegExp("^" + i), new RegExp(i)];
  }
  function Yl(n) {
    let e = n.map((s) => (typeof s == "string" ? { label: s } : s)),
      [t, i] = e.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : Hg(e);
    return (s) => {
      let r = s.matchBefore(i);
      return r || s.explicit
        ? { from: r ? r.from : s.pos, options: e, validFor: t }
        : null;
    };
  }
  function bu(n, e) {
    return (t) => {
      for (let i = te(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
        if (n.indexOf(i.name) > -1) return null;
        if (i.type.isTop) break;
      }
      return e(t);
    };
  }
  var Ks = class {
    constructor(e, t, i, s) {
      (this.completion = e),
        (this.source = t),
        (this.match = i),
        (this.score = s);
    }
  };
  function $t(n) {
    return n.selection.main.from;
  }
  function wu(n, e) {
    var t;
    let { source: i } = n,
      s = e && i[0] != "^",
      r = i[i.length - 1] != "$";
    return !s && !r
      ? n
      : new RegExp(
          `${s ? "^" : ""}(?:${i})${r ? "$" : ""}`,
          (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : ""
        );
  }
  var Su = ke.define();
  function Kg(n, e, t, i) {
    let { main: s } = n.selection,
      r = t - s.from,
      o = i - s.from;
    return Object.assign(
      Object.assign(
        {},
        n.changeByRange((l) =>
          l != s &&
          t != i &&
          n.sliceDoc(l.from + r, l.from + o) != n.sliceDoc(t, i)
            ? { range: l }
            : {
                changes: {
                  from: l.from + r,
                  to: i == s.from ? l.to : l.from + o,
                  insert: e,
                },
                range: w.cursor(l.from + r + e.length),
              }
        )
      ),
      { scrollIntoView: !0, userEvent: "input.complete" }
    );
  }
  var uu = new WeakMap();
  function Jg(n) {
    if (!Array.isArray(n)) return n;
    let e = uu.get(n);
    return e || uu.set(n, (e = Yl(n))), e;
  }
  var Wl = Y.define(),
    dn = Y.define(),
    Ql = class {
      constructor(e) {
        (this.pattern = e),
          (this.chars = []),
          (this.folded = []),
          (this.any = []),
          (this.precise = []),
          (this.byWord = []),
          (this.score = 0),
          (this.matched = []);
        for (let t = 0; t < e.length; ) {
          let i = ne(e, t),
            s = Oe(i);
          this.chars.push(i);
          let r = e.slice(t, t + s),
            o = r.toUpperCase();
          this.folded.push(ne(o == r ? r.toLowerCase() : o, 0)), (t += s);
        }
        this.astral = e.length != this.chars.length;
      }
      ret(e, t) {
        return (this.score = e), (this.matched = t), !0;
      }
      match(e) {
        if (this.pattern.length == 0) return this.ret(-100, []);
        if (e.length < this.pattern.length) return !1;
        let { chars: t, folded: i, any: s, precise: r, byWord: o } = this;
        if (t.length == 1) {
          let k = ne(e, 0),
            $ = Oe(k),
            P = $ == e.length ? 0 : -100;
          if (k != t[0])
            if (k == i[0]) P += -200;
            else return !1;
          return this.ret(P, [0, $]);
        }
        let l = e.indexOf(this.pattern);
        if (l == 0)
          return this.ret(e.length == this.pattern.length ? 0 : -100, [
            0,
            this.pattern.length,
          ]);
        let a = t.length,
          h = 0;
        if (l < 0) {
          for (let k = 0, $ = Math.min(e.length, 200); k < $ && h < a; ) {
            let P = ne(e, k);
            (P == t[h] || P == i[h]) && (s[h++] = k), (k += Oe(P));
          }
          if (h < a) return !1;
        }
        let c = 0,
          f = 0,
          u = !1,
          d = 0,
          p = -1,
          g = -1,
          m = /[a-z]/.test(e),
          b = !0;
        for (let k = 0, $ = Math.min(e.length, 200), P = 0; k < $ && f < a; ) {
          let S = ne(e, k);
          l < 0 &&
            (c < a && S == t[c] && (r[c++] = k),
            d < a &&
              (S == t[d] || S == i[d]
                ? (d == 0 && (p = k), (g = k + 1), d++)
                : (d = 0)));
          let C,
            Z =
              S < 255
                ? (S >= 48 && S <= 57) || (S >= 97 && S <= 122)
                  ? 2
                  : S >= 65 && S <= 90
                  ? 1
                  : 0
                : (C = Pi(S)) != C.toLowerCase()
                ? 1
                : C != C.toUpperCase()
                ? 2
                : 0;
          (!k || (Z == 1 && m) || (P == 0 && Z != 0)) &&
            (t[f] == S || (i[f] == S && (u = !0))
              ? (o[f++] = k)
              : o.length && (b = !1)),
            (P = Z),
            (k += Oe(S));
        }
        return f == a && o[0] == 0 && b
          ? this.result(-100 + (u ? -200 : 0), o, e)
          : d == a && p == 0
          ? this.ret(-200 - e.length + (g == e.length ? 0 : -100), [0, g])
          : l > -1
          ? this.ret(-700 - e.length, [l, l + this.pattern.length])
          : d == a
          ? this.ret(-900 - e.length, [p, g])
          : f == a
          ? this.result(-100 + (u ? -200 : 0) + -700 + (b ? 0 : -1100), o, e)
          : t.length == 2
          ? !1
          : this.result((s[0] ? -700 : 0) + -200 + -1100, s, e);
      }
      result(e, t, i) {
        let s = [],
          r = 0;
        for (let o of t) {
          let l = o + (this.astral ? Oe(ne(i, o)) : 1);
          r && s[r - 1] == o ? (s[r - 1] = l) : ((s[r++] = o), (s[r++] = l));
        }
        return this.ret(e - i.length, s);
      }
    },
    pe = T.define({
      combine(n) {
        return fe(
          n,
          {
            activateOnTyping: !0,
            selectOnOpen: !0,
            override: null,
            closeOnBlur: !0,
            maxRenderedOptions: 100,
            defaultKeymap: !0,
            tooltipClass: () => "",
            optionClass: () => "",
            aboveCursor: !1,
            icons: !0,
            addToOptions: [],
            positionInfo: e0,
            compareCompletions: (e, t) => e.label.localeCompare(t.label),
            interactionDelay: 75,
            updateSyncTime: 100,
          },
          {
            defaultKeymap: (e, t) => e && t,
            closeOnBlur: (e, t) => e && t,
            icons: (e, t) => e && t,
            tooltipClass: (e, t) => (i) => du(e(i), t(i)),
            optionClass: (e, t) => (i) => du(e(i), t(i)),
            addToOptions: (e, t) => e.concat(t),
          }
        );
      },
    });
  function du(n, e) {
    return n ? (e ? n + " " + e : n) : e;
  }
  function e0(n, e, t, i, s, r) {
    let o = n.textDirection == U.RTL,
      l = o,
      a = !1,
      h = "top",
      c,
      f,
      u = e.left - s.left,
      d = s.right - e.right,
      p = i.right - i.left,
      g = i.bottom - i.top;
    if (
      (l && u < Math.min(p, d)
        ? (l = !1)
        : !l && d < Math.min(p, u) && (l = !0),
      p <= (l ? u : d))
    )
      (c = Math.max(s.top, Math.min(t.top, s.bottom - g)) - e.top),
        (f = Math.min(400, l ? u : d));
    else {
      (a = !0), (f = Math.min(400, (o ? e.right : s.right - e.left) - 30));
      let k = s.bottom - e.bottom;
      k >= g || k > e.top
        ? (c = t.bottom - e.top)
        : ((h = "bottom"), (c = e.bottom - t.top));
    }
    let m = (e.bottom - e.top) / r.offsetHeight,
      b = (e.right - e.left) / r.offsetWidth;
    return {
      style: `${h}: ${c / m}px; max-width: ${f / b}px`,
      class:
        "cm-completionInfo-" +
        (a ? (o ? "left-narrow" : "right-narrow") : l ? "left" : "right"),
    };
  }
  function t0(n) {
    let e = n.addToOptions.slice();
    return (
      n.icons &&
        e.push({
          render(t) {
            let i = document.createElement("div");
            return (
              i.classList.add("cm-completionIcon"),
              t.type &&
                i.classList.add(
                  ...t.type.split(/\s+/g).map((s) => "cm-completionIcon-" + s)
                ),
              i.setAttribute("aria-hidden", "true"),
              i
            );
          },
          position: 20,
        }),
      e.push(
        {
          render(t, i, s, r) {
            let o = document.createElement("span");
            o.className = "cm-completionLabel";
            let l = t.displayLabel || t.label,
              a = 0;
            for (let h = 0; h < r.length; ) {
              let c = r[h++],
                f = r[h++];
              c > a && o.appendChild(document.createTextNode(l.slice(a, c)));
              let u = o.appendChild(document.createElement("span"));
              u.appendChild(document.createTextNode(l.slice(c, f))),
                (u.className = "cm-completionMatchedText"),
                (a = f);
            }
            return (
              a < l.length &&
                o.appendChild(document.createTextNode(l.slice(a))),
              o
            );
          },
          position: 50,
        },
        {
          render(t) {
            if (!t.detail) return null;
            let i = document.createElement("span");
            return (
              (i.className = "cm-completionDetail"),
              (i.textContent = t.detail),
              i
            );
          },
          position: 80,
        }
      ),
      e.sort((t, i) => t.position - i.position).map((t) => t.render)
    );
  }
  function xl(n, e, t) {
    if (n <= t) return { from: 0, to: n };
    if ((e < 0 && (e = 0), e <= n >> 1)) {
      let s = Math.floor(e / t);
      return { from: s * t, to: (s + 1) * t };
    }
    let i = Math.floor((n - e) / t);
    return { from: n - (i + 1) * t, to: n - i * t };
  }
  var vl = class {
    constructor(e, t, i) {
      (this.view = e),
        (this.stateField = t),
        (this.applyCompletion = i),
        (this.info = null),
        (this.infoDestroy = null),
        (this.placeInfoReq = {
          read: () => this.measureInfo(),
          write: (a) => this.placeInfo(a),
          key: this,
        }),
        (this.space = null),
        (this.currentClass = "");
      let s = e.state.field(t),
        { options: r, selected: o } = s.open,
        l = e.state.facet(pe);
      (this.optionContent = t0(l)),
        (this.optionClass = l.optionClass),
        (this.tooltipClass = l.tooltipClass),
        (this.range = xl(r.length, o, l.maxRenderedOptions)),
        (this.dom = document.createElement("div")),
        (this.dom.className = "cm-tooltip-autocomplete"),
        this.updateTooltipClass(e.state),
        this.dom.addEventListener("mousedown", (a) => {
          let { options: h } = e.state.field(t).open;
          for (let c = a.target, f; c && c != this.dom; c = c.parentNode)
            if (
              c.nodeName == "LI" &&
              (f = /-(\d+)$/.exec(c.id)) &&
              +f[1] < h.length
            ) {
              this.applyCompletion(e, h[+f[1]]), a.preventDefault();
              return;
            }
        }),
        this.dom.addEventListener("focusout", (a) => {
          let h = e.state.field(this.stateField, !1);
          h &&
            h.tooltip &&
            e.state.facet(pe).closeOnBlur &&
            a.relatedTarget != e.contentDOM &&
            e.dispatch({ effects: dn.of(null) });
        }),
        this.showOptions(r, s.id);
    }
    mount() {
      this.updateSel();
    }
    showOptions(e, t) {
      this.list && this.list.remove(),
        (this.list = this.dom.appendChild(
          this.createListBox(e, t, this.range)
        )),
        this.list.addEventListener("scroll", () => {
          this.info && this.view.requestMeasure(this.placeInfoReq);
        });
    }
    update(e) {
      var t;
      let i = e.state.field(this.stateField),
        s = e.startState.field(this.stateField);
      if ((this.updateTooltipClass(e.state), i != s)) {
        let { options: r, selected: o, disabled: l } = i.open;
        (!s.open || s.open.options != r) &&
          ((this.range = xl(r.length, o, e.state.facet(pe).maxRenderedOptions)),
          this.showOptions(r, i.id)),
          this.updateSel(),
          l != ((t = s.open) === null || t === void 0 ? void 0 : t.disabled) &&
            this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
      }
    }
    updateTooltipClass(e) {
      let t = this.tooltipClass(e);
      if (t != this.currentClass) {
        for (let i of this.currentClass.split(" "))
          i && this.dom.classList.remove(i);
        for (let i of t.split(" ")) i && this.dom.classList.add(i);
        this.currentClass = t;
      }
    }
    positioned(e) {
      (this.space = e),
        this.info && this.view.requestMeasure(this.placeInfoReq);
    }
    updateSel() {
      let e = this.view.state.field(this.stateField),
        t = e.open;
      if (
        (((t.selected > -1 && t.selected < this.range.from) ||
          t.selected >= this.range.to) &&
          ((this.range = xl(
            t.options.length,
            t.selected,
            this.view.state.facet(pe).maxRenderedOptions
          )),
          this.showOptions(t.options, e.id)),
        this.updateSelectedOption(t.selected))
      ) {
        this.destroyInfo();
        let { completion: i } = t.options[t.selected],
          { info: s } = i;
        if (!s) return;
        let r = typeof s == "string" ? document.createTextNode(s) : s(i);
        if (!r) return;
        "then" in r
          ? r
              .then((o) => {
                o &&
                  this.view.state.field(this.stateField, !1) == e &&
                  this.addInfoPane(o, i);
              })
              .catch((o) => be(this.view.state, o, "completion info"))
          : this.addInfoPane(r, i);
      }
    }
    addInfoPane(e, t) {
      this.destroyInfo();
      let i = (this.info = document.createElement("div"));
      if (((i.className = "cm-tooltip cm-completionInfo"), e.nodeType != null))
        i.appendChild(e), (this.infoDestroy = null);
      else {
        let { dom: s, destroy: r } = e;
        i.appendChild(s), (this.infoDestroy = r || null);
      }
      this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
    }
    updateSelectedOption(e) {
      let t = null;
      for (
        let i = this.list.firstChild, s = this.range.from;
        i;
        i = i.nextSibling, s++
      )
        i.nodeName != "LI" || !i.id
          ? s--
          : s == e
          ? i.hasAttribute("aria-selected") ||
            (i.setAttribute("aria-selected", "true"), (t = i))
          : i.hasAttribute("aria-selected") &&
            i.removeAttribute("aria-selected");
      return t && n0(this.list, t), t;
    }
    measureInfo() {
      let e = this.dom.querySelector("[aria-selected]");
      if (!e || !this.info) return null;
      let t = this.dom.getBoundingClientRect(),
        i = this.info.getBoundingClientRect(),
        s = e.getBoundingClientRect(),
        r = this.space;
      if (!r) {
        let o = this.dom.ownerDocument.defaultView || window;
        r = { left: 0, top: 0, right: o.innerWidth, bottom: o.innerHeight };
      }
      return s.top > Math.min(r.bottom, t.bottom) - 10 ||
        s.bottom < Math.max(r.top, t.top) + 10
        ? null
        : this.view.state
            .facet(pe)
            .positionInfo(this.view, t, s, i, r, this.dom);
    }
    placeInfo(e) {
      this.info &&
        (e
          ? (e.style && (this.info.style.cssText = e.style),
            (this.info.className =
              "cm-tooltip cm-completionInfo " + (e.class || "")))
          : (this.info.style.cssText = "top: -1e6px"));
    }
    createListBox(e, t, i) {
      let s = document.createElement("ul");
      (s.id = t),
        s.setAttribute("role", "listbox"),
        s.setAttribute("aria-expanded", "true"),
        s.setAttribute("aria-label", this.view.state.phrase("Completions"));
      let r = null;
      for (let o = i.from; o < i.to; o++) {
        let { completion: l, match: a } = e[o],
          { section: h } = l;
        if (h) {
          let u = typeof h == "string" ? h : h.name;
          if (u != r && (o > i.from || i.from == 0))
            if (((r = u), typeof h != "string" && h.header))
              s.appendChild(h.header(h));
            else {
              let d = s.appendChild(
                document.createElement("completion-section")
              );
              d.textContent = u;
            }
        }
        let c = s.appendChild(document.createElement("li"));
        (c.id = t + "-" + o), c.setAttribute("role", "option");
        let f = this.optionClass(l);
        f && (c.className = f);
        for (let u of this.optionContent) {
          let d = u(l, this.view.state, this.view, a);
          d && c.appendChild(d);
        }
      }
      return (
        i.from && s.classList.add("cm-completionListIncompleteTop"),
        i.to < e.length && s.classList.add("cm-completionListIncompleteBottom"),
        s
      );
    }
    destroyInfo() {
      this.info &&
        (this.infoDestroy && this.infoDestroy(),
        this.info.remove(),
        (this.info = null));
    }
    destroy() {
      this.destroyInfo();
    }
  };
  function i0(n, e) {
    return (t) => new vl(t, n, e);
  }
  function n0(n, e) {
    let t = n.getBoundingClientRect(),
      i = e.getBoundingClientRect(),
      s = t.height / n.offsetHeight;
    i.top < t.top
      ? (n.scrollTop -= (t.top - i.top) / s)
      : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / s);
  }
  function pu(n) {
    return (
      (n.boost || 0) * 100 +
      (n.apply ? 10 : 0) +
      (n.info ? 5 : 0) +
      (n.type ? 1 : 0)
    );
  }
  function s0(n, e) {
    let t = [],
      i = null,
      s = (a) => {
        t.push(a);
        let { section: h } = a.completion;
        if (h) {
          i || (i = []);
          let c = typeof h == "string" ? h : h.name;
          i.some((f) => f.name == c) ||
            i.push(typeof h == "string" ? { name: c } : h);
        }
      };
    for (let a of n)
      if (a.hasResult()) {
        let h = a.result.getMatch;
        if (a.result.filter === !1)
          for (let c of a.result.options)
            s(new Ks(c, a.source, h ? h(c) : [], 1e9 - t.length));
        else {
          let c = new Ql(e.sliceDoc(a.from, a.to));
          for (let f of a.result.options)
            if (c.match(f.label)) {
              let u = f.displayLabel ? (h ? h(f, c.matched) : []) : c.matched;
              s(new Ks(f, a.source, u, c.score + (f.boost || 0)));
            }
        }
      }
    if (i) {
      let a = Object.create(null),
        h = 0,
        c = (f, u) => {
          var d, p;
          return (
            ((d = f.rank) !== null && d !== void 0 ? d : 1e9) -
              ((p = u.rank) !== null && p !== void 0 ? p : 1e9) ||
            (f.name < u.name ? -1 : 1)
          );
        };
      for (let f of i.sort(c)) (h -= 1e5), (a[f.name] = h);
      for (let f of t) {
        let { section: u } = f.completion;
        u && (f.score += a[typeof u == "string" ? u : u.name]);
      }
    }
    let r = [],
      o = null,
      l = e.facet(pe).compareCompletions;
    for (let a of t.sort(
      (h, c) => c.score - h.score || l(h.completion, c.completion)
    )) {
      let h = a.completion;
      !o ||
      o.label != h.label ||
      o.detail != h.detail ||
      (o.type != null && h.type != null && o.type != h.type) ||
      o.apply != h.apply ||
      o.boost != h.boost
        ? r.push(a)
        : pu(a.completion) > pu(o) && (r[r.length - 1] = a),
        (o = a.completion);
    }
    return r;
  }
  var Pl = class n {
      constructor(e, t, i, s, r, o) {
        (this.options = e),
          (this.attrs = t),
          (this.tooltip = i),
          (this.timestamp = s),
          (this.selected = r),
          (this.disabled = o);
      }
      setSelected(e, t) {
        return e == this.selected || e >= this.options.length
          ? this
          : new n(
              this.options,
              Ou(t, e),
              this.tooltip,
              this.timestamp,
              e,
              this.disabled
            );
      }
      static build(e, t, i, s, r) {
        let o = s0(e, t);
        if (!o.length)
          return s && e.some((a) => a.state == 1)
            ? new n(s.options, s.attrs, s.tooltip, s.timestamp, s.selected, !0)
            : null;
        let l = t.facet(pe).selectOnOpen ? 0 : -1;
        if (s && s.selected != l && s.selected != -1) {
          let a = s.options[s.selected].completion;
          for (let h = 0; h < o.length; h++)
            if (o[h].completion == a) {
              l = h;
              break;
            }
        }
        return new n(
          o,
          Ou(i, l),
          {
            pos: e.reduce(
              (a, h) => (h.hasResult() ? Math.min(a, h.from) : a),
              1e8
            ),
            create: h0,
            above: r.aboveCursor,
          },
          s ? s.timestamp : Date.now(),
          l,
          !1
        );
      }
      map(e) {
        return new n(
          this.options,
          this.attrs,
          Object.assign(Object.assign({}, this.tooltip), {
            pos: e.mapPos(this.tooltip.pos),
          }),
          this.timestamp,
          this.selected,
          this.disabled
        );
      }
    },
    $l = class n {
      constructor(e, t, i) {
        (this.active = e), (this.id = t), (this.open = i);
      }
      static start() {
        return new n(
          l0,
          "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36),
          null
        );
      }
      update(e) {
        let { state: t } = e,
          i = t.facet(pe),
          r = (
            i.override || t.languageDataAt("autocomplete", $t(t)).map(Jg)
          ).map((l) =>
            (
              this.active.find((h) => h.source == l) ||
              new ct(l, this.active.some((h) => h.state != 0) ? 1 : 0)
            ).update(e, i)
          );
        r.length == this.active.length &&
          r.every((l, a) => l == this.active[a]) &&
          (r = this.active);
        let o = this.open;
        o && e.docChanged && (o = o.map(e.changes)),
          e.selection ||
          r.some(
            (l) => l.hasResult() && e.changes.touchesRange(l.from, l.to)
          ) ||
          !r0(r, this.active)
            ? (o = Pl.build(r, t, this.id, o, i))
            : o && o.disabled && !r.some((l) => l.state == 1) && (o = null),
          !o &&
            r.every((l) => l.state != 1) &&
            r.some((l) => l.hasResult()) &&
            (r = r.map((l) => (l.hasResult() ? new ct(l.source, 0) : l)));
        for (let l of e.effects)
          l.is(ku) && (o = o && o.setSelected(l.value, this.id));
        return r == this.active && o == this.open ? this : new n(r, this.id, o);
      }
      get tooltip() {
        return this.open ? this.open.tooltip : null;
      }
      get attrs() {
        return this.open ? this.open.attrs : o0;
      }
    };
  function r0(n, e) {
    if (n == e) return !0;
    for (let t = 0, i = 0; ; ) {
      for (; t < n.length && !n[t].hasResult; ) t++;
      for (; i < e.length && !e[i].hasResult; ) i++;
      let s = t == n.length,
        r = i == e.length;
      if (s || r) return s == r;
      if (n[t++].result != e[i++].result) return !1;
    }
  }
  var o0 = { "aria-autocomplete": "list" };
  function Ou(n, e) {
    let t = {
      "aria-autocomplete": "list",
      "aria-haspopup": "listbox",
      "aria-controls": n,
    };
    return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
  }
  var l0 = [];
  function Zl(n) {
    return n.isUserEvent("input.type")
      ? "input"
      : n.isUserEvent("delete.backward")
      ? "delete"
      : null;
  }
  var ct = class n {
      constructor(e, t, i = -1) {
        (this.source = e), (this.state = t), (this.explicitPos = i);
      }
      hasResult() {
        return !1;
      }
      update(e, t) {
        let i = Zl(e),
          s = this;
        i
          ? (s = s.handleUserEvent(e, i, t))
          : e.docChanged
          ? (s = s.handleChange(e))
          : e.selection && s.state != 0 && (s = new n(s.source, 0));
        for (let r of e.effects)
          if (r.is(Wl)) s = new n(s.source, 1, r.value ? $t(e.state) : -1);
          else if (r.is(dn)) s = new n(s.source, 0);
          else if (r.is(xu))
            for (let o of r.value) o.source == s.source && (s = o);
        return s;
      }
      handleUserEvent(e, t, i) {
        return t == "delete" || !i.activateOnTyping
          ? this.map(e.changes)
          : new n(this.source, 1);
      }
      handleChange(e) {
        return e.changes.touchesRange($t(e.startState))
          ? new n(this.source, 0)
          : this.map(e.changes);
      }
      map(e) {
        return e.empty || this.explicitPos < 0
          ? this
          : new n(this.source, this.state, e.mapPos(this.explicitPos));
      }
    },
    Js = class n extends ct {
      constructor(e, t, i, s, r) {
        super(e, 2, t), (this.result = i), (this.from = s), (this.to = r);
      }
      hasResult() {
        return !0;
      }
      handleUserEvent(e, t, i) {
        var s;
        let r = e.changes.mapPos(this.from),
          o = e.changes.mapPos(this.to, 1),
          l = $t(e.state);
        if (
          (this.explicitPos < 0 ? l <= r : l < this.from) ||
          l > o ||
          (t == "delete" && $t(e.startState) == this.from)
        )
          return new ct(
            this.source,
            t == "input" && i.activateOnTyping ? 1 : 0
          );
        let a = this.explicitPos < 0 ? -1 : e.changes.mapPos(this.explicitPos),
          h;
        return a0(this.result.validFor, e.state, r, o)
          ? new n(this.source, a, this.result, r, o)
          : this.result.update &&
            (h = this.result.update(
              this.result,
              r,
              o,
              new Hs(e.state, l, a >= 0)
            ))
          ? new n(
              this.source,
              a,
              h,
              h.from,
              (s = h.to) !== null && s !== void 0 ? s : $t(e.state)
            )
          : new ct(this.source, 1, a);
      }
      handleChange(e) {
        return e.changes.touchesRange(this.from, this.to)
          ? new ct(this.source, 0)
          : this.map(e.changes);
      }
      map(e) {
        return e.empty
          ? this
          : new n(
              this.source,
              this.explicitPos < 0 ? -1 : e.mapPos(this.explicitPos),
              this.result,
              e.mapPos(this.from),
              e.mapPos(this.to, 1)
            );
      }
    };
  function a0(n, e, t, i) {
    if (!n) return !1;
    let s = e.sliceDoc(t, i);
    return typeof n == "function" ? n(s, t, i, e) : wu(n, !0).test(s);
  }
  var xu = Y.define({
      map(n, e) {
        return n.map((t) => t.map(e));
      },
    }),
    ku = Y.define(),
    Re = F.define({
      create() {
        return $l.start();
      },
      update(n, e) {
        return n.update(e);
      },
      provide: (n) => [
        Ui.from(n, (e) => e.tooltip),
        v.contentAttributes.from(n, (e) => e.attrs),
      ],
    });
  function Qu(n, e) {
    let t = e.completion.apply || e.completion.label,
      i = n.state.field(Re).active.find((s) => s.source == e.source);
    return i instanceof Js
      ? (typeof t == "string"
          ? n.dispatch(
              Object.assign(Object.assign({}, Kg(n.state, t, i.from, i.to)), {
                annotations: Su.of(e.completion),
              })
            )
          : t(n, e.completion, i.from, i.to),
        !0)
      : !1;
  }
  var h0 = i0(Re, Qu);
  function Fs(n, e = "option") {
    return (t) => {
      let i = t.state.field(Re, !1);
      if (
        !i ||
        !i.open ||
        i.open.disabled ||
        Date.now() - i.open.timestamp < t.state.facet(pe).interactionDelay
      )
        return !1;
      let s = 1,
        r;
      e == "page" &&
        (r = Co(t, i.open.tooltip)) &&
        (s = Math.max(
          2,
          Math.floor(
            r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight
          ) - 1
        ));
      let { length: o } = i.open.options,
        l =
          i.open.selected > -1
            ? i.open.selected + s * (n ? 1 : -1)
            : n
            ? 0
            : o - 1;
      return (
        l < 0
          ? (l = e == "page" ? 0 : o - 1)
          : l >= o && (l = e == "page" ? o - 1 : 0),
        t.dispatch({ effects: ku.of(l) }),
        !0
      );
    };
  }
  var c0 = (n) => {
      let e = n.state.field(Re, !1);
      return n.state.readOnly ||
        !e ||
        !e.open ||
        e.open.selected < 0 ||
        e.open.disabled ||
        Date.now() - e.open.timestamp < n.state.facet(pe).interactionDelay
        ? !1
        : Qu(n, e.open.options[e.open.selected]);
    },
    f0 = (n) =>
      n.state.field(Re, !1) ? (n.dispatch({ effects: Wl.of(!0) }), !0) : !1,
    u0 = (n) => {
      let e = n.state.field(Re, !1);
      return !e || !e.active.some((t) => t.state != 0)
        ? !1
        : (n.dispatch({ effects: dn.of(null) }), !0);
    },
    Cl = class {
      constructor(e, t) {
        (this.active = e),
          (this.context = t),
          (this.time = Date.now()),
          (this.updates = []),
          (this.done = void 0);
      }
    },
    d0 = 50,
    p0 = 1e3,
    O0 = J.fromClass(
      class {
        constructor(n) {
          (this.view = n),
            (this.debounceUpdate = -1),
            (this.running = []),
            (this.debounceAccept = -1),
            (this.composing = 0);
          for (let e of n.state.field(Re).active)
            e.state == 1 && this.startQuery(e);
        }
        update(n) {
          let e = n.state.field(Re);
          if (!n.selectionSet && !n.docChanged && n.startState.field(Re) == e)
            return;
          let t = n.transactions.some(
            (i) => (i.selection || i.docChanged) && !Zl(i)
          );
          for (let i = 0; i < this.running.length; i++) {
            let s = this.running[i];
            if (
              t ||
              (s.updates.length + n.transactions.length > d0 &&
                Date.now() - s.time > p0)
            ) {
              for (let r of s.context.abortListeners)
                try {
                  r();
                } catch (o) {
                  be(this.view.state, o);
                }
              (s.context.abortListeners = null), this.running.splice(i--, 1);
            } else s.updates.push(...n.transactions);
          }
          if (
            (this.debounceUpdate > -1 && clearTimeout(this.debounceUpdate),
            (this.debounceUpdate = e.active.some(
              (i) =>
                i.state == 1 &&
                !this.running.some((s) => s.active.source == i.source)
            )
              ? setTimeout(() => this.startUpdate(), 50)
              : -1),
            this.composing != 0)
          )
            for (let i of n.transactions)
              Zl(i) == "input"
                ? (this.composing = 2)
                : this.composing == 2 && i.selection && (this.composing = 3);
        }
        startUpdate() {
          this.debounceUpdate = -1;
          let { state: n } = this.view,
            e = n.field(Re);
          for (let t of e.active)
            t.state == 1 &&
              !this.running.some((i) => i.active.source == t.source) &&
              this.startQuery(t);
        }
        startQuery(n) {
          let { state: e } = this.view,
            t = $t(e),
            i = new Hs(e, t, n.explicitPos == t),
            s = new Cl(n, i);
          this.running.push(s),
            Promise.resolve(n.source(i)).then(
              (r) => {
                s.context.aborted ||
                  ((s.done = r || null), this.scheduleAccept());
              },
              (r) => {
                this.view.dispatch({ effects: dn.of(null) }),
                  be(this.view.state, r);
              }
            );
        }
        scheduleAccept() {
          this.running.every((n) => n.done !== void 0)
            ? this.accept()
            : this.debounceAccept < 0 &&
              (this.debounceAccept = setTimeout(
                () => this.accept(),
                this.view.state.facet(pe).updateSyncTime
              ));
        }
        accept() {
          var n;
          this.debounceAccept > -1 && clearTimeout(this.debounceAccept),
            (this.debounceAccept = -1);
          let e = [],
            t = this.view.state.facet(pe);
          for (let i = 0; i < this.running.length; i++) {
            let s = this.running[i];
            if (s.done === void 0) continue;
            if ((this.running.splice(i--, 1), s.done)) {
              let o = new Js(
                s.active.source,
                s.active.explicitPos,
                s.done,
                s.done.from,
                (n = s.done.to) !== null && n !== void 0
                  ? n
                  : $t(
                      s.updates.length
                        ? s.updates[0].startState
                        : this.view.state
                    )
              );
              for (let l of s.updates) o = o.update(l, t);
              if (o.hasResult()) {
                e.push(o);
                continue;
              }
            }
            let r = this.view.state
              .field(Re)
              .active.find((o) => o.source == s.active.source);
            if (r && r.state == 1)
              if (s.done == null) {
                let o = new ct(s.active.source, 0);
                for (let l of s.updates) o = o.update(l, t);
                o.state != 1 && e.push(o);
              } else this.startQuery(r);
          }
          e.length && this.view.dispatch({ effects: xu.of(e) });
        }
      },
      {
        eventHandlers: {
          blur(n) {
            let e = this.view.state.field(Re, !1);
            if (e && e.tooltip && this.view.state.facet(pe).closeOnBlur) {
              let t = e.open && Co(this.view, e.open.tooltip);
              (!t || !t.dom.contains(n.relatedTarget)) &&
                this.view.dispatch({ effects: dn.of(null) });
            }
          },
          compositionstart() {
            this.composing = 1;
          },
          compositionend() {
            this.composing == 3 &&
              setTimeout(() => this.view.dispatch({ effects: Wl.of(!1) }), 20),
              (this.composing = 0);
          },
        },
      }
    ),
    vu = v.baseTheme({
      ".cm-tooltip.cm-tooltip-autocomplete": {
        "& > ul": {
          fontFamily: "monospace",
          whiteSpace: "nowrap",
          overflow: "hidden auto",
          maxWidth_fallback: "700px",
          maxWidth: "min(700px, 95vw)",
          minWidth: "250px",
          maxHeight: "10em",
          height: "100%",
          listStyle: "none",
          margin: 0,
          padding: 0,
          "& > li, & > completion-section": {
            padding: "1px 3px",
            lineHeight: 1.2,
          },
          "& > li": {
            overflowX: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer",
          },
          "& > completion-section": {
            display: "list-item",
            borderBottom: "1px solid silver",
            paddingLeft: "0.5em",
            opacity: 0.7,
          },
        },
      },
      "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
        background: "#17c",
        color: "white",
      },
      "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
        background: "#777",
      },
      "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
        background: "#347",
        color: "white",
      },
      "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
        background: "#444",
      },
      ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after":
        {
          content: '"\xB7\xB7\xB7"',
          opacity: 0.5,
          display: "block",
          textAlign: "center",
        },
      ".cm-tooltip.cm-completionInfo": {
        position: "absolute",
        padding: "3px 9px",
        width: "max-content",
        maxWidth: "400px",
        boxSizing: "border-box",
      },
      ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
      ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
      ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
      ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
      "&light .cm-snippetField": { backgroundColor: "#00000022" },
      "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
      ".cm-snippetFieldPosition": {
        verticalAlign: "text-top",
        width: 0,
        height: "1.15em",
        display: "inline-block",
        margin: "0 -0.7px -.7em",
        borderLeft: "1.4px dotted #888",
      },
      ".cm-completionMatchedText": { textDecoration: "underline" },
      ".cm-completionDetail": { marginLeft: "0.5em", fontStyle: "italic" },
      ".cm-completionIcon": {
        fontSize: "90%",
        width: ".8em",
        display: "inline-block",
        textAlign: "center",
        paddingRight: ".6em",
        opacity: "0.6",
        boxSizing: "content-box",
      },
      ".cm-completionIcon-function, .cm-completionIcon-method": {
        "&:after": { content: "'\u0192'" },
      },
      ".cm-completionIcon-class": { "&:after": { content: "'\u25CB'" } },
      ".cm-completionIcon-interface": { "&:after": { content: "'\u25CC'" } },
      ".cm-completionIcon-variable": { "&:after": { content: "'\u{1D465}'" } },
      ".cm-completionIcon-constant": { "&:after": { content: "'\u{1D436}'" } },
      ".cm-completionIcon-type": { "&:after": { content: "'\u{1D461}'" } },
      ".cm-completionIcon-enum": { "&:after": { content: "'\u222A'" } },
      ".cm-completionIcon-property": { "&:after": { content: "'\u25A1'" } },
      ".cm-completionIcon-keyword": {
        "&:after": { content: "'\u{1F511}\uFE0E'" },
      },
      ".cm-completionIcon-namespace": { "&:after": { content: "'\u25A2'" } },
      ".cm-completionIcon-text": {
        "&:after": {
          content: "'abc'",
          fontSize: "50%",
          verticalAlign: "middle",
        },
      },
    }),
    Tl = class {
      constructor(e, t, i, s) {
        (this.field = e), (this.line = t), (this.from = i), (this.to = s);
      }
    },
    Al = class n {
      constructor(e, t, i) {
        (this.field = e), (this.from = t), (this.to = i);
      }
      map(e) {
        let t = e.mapPos(this.from, -1, le.TrackDel),
          i = e.mapPos(this.to, 1, le.TrackDel);
        return t == null || i == null ? null : new n(this.field, t, i);
      }
    },
    Rl = class n {
      constructor(e, t) {
        (this.lines = e), (this.fieldPositions = t);
      }
      instantiate(e, t) {
        let i = [],
          s = [t],
          r = e.doc.lineAt(t),
          o = /^\s*/.exec(r.text)[0];
        for (let a of this.lines) {
          if (i.length) {
            let h = o,
              c = /^\t*/.exec(a)[0].length;
            for (let f = 0; f < c; f++) h += e.facet(fi);
            s.push(t + h.length - c), (a = h + a.slice(c));
          }
          i.push(a), (t += a.length + 1);
        }
        let l = this.fieldPositions.map(
          (a) => new Al(a.field, s[a.line] + a.from, s[a.line] + a.to)
        );
        return { text: i, ranges: l };
      }
      static parse(e) {
        let t = [],
          i = [],
          s = [],
          r;
        for (let o of e.split(/\r\n?|\n/)) {
          for (; (r = /[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(o)); ) {
            let l = r[1] ? +r[1] : null,
              a = r[2] || r[3] || "",
              h = -1;
            for (let c = 0; c < t.length; c++)
              (l != null ? t[c].seq == l : a && t[c].name == a) && (h = c);
            if (h < 0) {
              let c = 0;
              for (
                ;
                c < t.length &&
                (l == null || (t[c].seq != null && t[c].seq < l));

              )
                c++;
              t.splice(c, 0, { seq: l, name: a }), (h = c);
              for (let f of s) f.field >= h && f.field++;
            }
            s.push(new Tl(h, i.length, r.index, r.index + a.length)),
              (o = o.slice(0, r.index) + a + o.slice(r.index + r[0].length));
          }
          for (let l; (l = /\\([{}])/.exec(o)); ) {
            o = o.slice(0, l.index) + l[1] + o.slice(l.index + l[0].length);
            for (let a of s)
              a.line == i.length && a.from > l.index && (a.from--, a.to--);
          }
          i.push(o);
        }
        return new n(i, s);
      }
    },
    m0 = R.widget({
      widget: new (class extends Qe {
        toDOM() {
          let n = document.createElement("span");
          return (n.className = "cm-snippetFieldPosition"), n;
        }
        ignoreEvent() {
          return !1;
        }
      })(),
    }),
    g0 = R.mark({ class: "cm-snippetField" }),
    gi = class n {
      constructor(e, t) {
        (this.ranges = e),
          (this.active = t),
          (this.deco = R.set(
            e.map((i) => (i.from == i.to ? m0 : g0).range(i.from, i.to))
          ));
      }
      map(e) {
        let t = [];
        for (let i of this.ranges) {
          let s = i.map(e);
          if (!s) return null;
          t.push(s);
        }
        return new n(t, this.active);
      }
      selectionInsideField(e) {
        return e.ranges.every((t) =>
          this.ranges.some(
            (i) => i.field == this.active && i.from <= t.from && i.to >= t.to
          )
        );
      }
    },
    mn = Y.define({
      map(n, e) {
        return n && n.map(e);
      },
    }),
    y0 = Y.define(),
    pn = F.define({
      create() {
        return null;
      },
      update(n, e) {
        for (let t of e.effects) {
          if (t.is(mn)) return t.value;
          if (t.is(y0) && n) return new gi(n.ranges, t.value);
        }
        return (
          n && e.docChanged && (n = n.map(e.changes)),
          n &&
            e.selection &&
            !n.selectionInsideField(e.selection) &&
            (n = null),
          n
        );
      },
      provide: (n) => v.decorations.from(n, (e) => (e ? e.deco : R.none)),
    });
  function Xl(n, e) {
    return w.create(
      n.filter((t) => t.field == e).map((t) => w.range(t.from, t.to))
    );
  }
  function b0(n) {
    let e = Rl.parse(n);
    return (t, i, s, r) => {
      let { text: o, ranges: l } = e.instantiate(t.state, s),
        a = {
          changes: { from: s, to: r, insert: j.of(o) },
          scrollIntoView: !0,
          annotations: i ? Su.of(i) : void 0,
        };
      if ((l.length && (a.selection = Xl(l, 0)), l.length > 1)) {
        let h = new gi(l, 0),
          c = (a.effects = [mn.of(h)]);
        t.state.field(pn, !1) === void 0 &&
          c.push(Y.appendConfig.of([pn, Q0, v0, vu]));
      }
      t.dispatch(t.state.update(a));
    };
  }
  function Pu(n) {
    return ({ state: e, dispatch: t }) => {
      let i = e.field(pn, !1);
      if (!i || (n < 0 && i.active == 0)) return !1;
      let s = i.active + n,
        r = n > 0 && !i.ranges.some((o) => o.field == s + n);
      return (
        t(
          e.update({
            selection: Xl(i.ranges, s),
            effects: mn.of(r ? null : new gi(i.ranges, s)),
            scrollIntoView: !0,
          })
        ),
        !0
      );
    };
  }
  var w0 = ({ state: n, dispatch: e }) =>
      n.field(pn, !1) ? (e(n.update({ effects: mn.of(null) })), !0) : !1,
    S0 = Pu(1),
    x0 = Pu(-1);
  var k0 = [
      { key: "Tab", run: S0, shift: x0 },
      { key: "Escape", run: w0 },
    ],
    mu = T.define({
      combine(n) {
        return n.length ? n[0] : k0;
      },
    }),
    Q0 = Le.highest(bt.compute([mu], (n) => n.facet(mu)));
  function we(n, e) {
    return Object.assign(Object.assign({}, e), { apply: b0(n) });
  }
  var v0 = v.domEventHandlers({
    mousedown(n, e) {
      let t = e.state.field(pn, !1),
        i;
      if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
        return !1;
      let s = t.ranges.find((r) => r.from <= i && r.to >= i);
      return !s || s.field == t.active
        ? !1
        : (e.dispatch({
            selection: Xl(t.ranges, s.field),
            effects: mn.of(
              t.ranges.some((r) => r.field > s.field)
                ? new gi(t.ranges, s.field)
                : null
            ),
            scrollIntoView: !0,
          }),
          !0);
    },
  });
  var On = {
      brackets: ["(", "[", "{", "'", '"'],
      before: ")]}:;>",
      stringPrefixes: [],
    },
    It = Y.define({
      map(n, e) {
        let t = e.mapPos(n, -1, le.TrackAfter);
        return t ?? void 0;
      },
    }),
    Ml = new (class extends Ve {})();
  Ml.startSide = 1;
  Ml.endSide = -1;
  var $u = F.define({
    create() {
      return I.empty;
    },
    update(n, e) {
      if (((n = n.map(e.changes)), e.selection)) {
        let t = e.state.doc.lineAt(e.selection.main.head);
        n = n.update({ filter: (i) => i >= t.from && i <= t.to });
      }
      for (let t of e.effects)
        t.is(It) && (n = n.update({ add: [Ml.range(t.value, t.value + 1)] }));
      return n;
    },
  });
  function Zu() {
    return [$0, $u];
  }
  var kl = "()[]{}<>";
  function Cu(n) {
    for (let e = 0; e < kl.length; e += 2)
      if (kl.charCodeAt(e) == n) return kl.charAt(e + 1);
    return Pi(n < 128 ? n : n + 1);
  }
  function Tu(n, e) {
    return n.languageDataAt("closeBrackets", e)[0] || On;
  }
  var P0 =
      typeof navigator == "object" && /Android\b/.test(navigator.userAgent),
    $0 = v.inputHandler.of((n, e, t, i) => {
      if ((P0 ? n.composing : n.compositionStarted) || n.state.readOnly)
        return !1;
      let s = n.state.selection.main;
      if (
        i.length > 2 ||
        (i.length == 2 && Oe(ne(i, 0)) == 1) ||
        e != s.from ||
        t != s.to
      )
        return !1;
      let r = C0(n.state, i);
      return r ? (n.dispatch(r), !0) : !1;
    }),
    Z0 = ({ state: n, dispatch: e }) => {
      if (n.readOnly) return !1;
      let i = Tu(n, n.selection.main.head).brackets || On.brackets,
        s = null,
        r = n.changeByRange((o) => {
          if (o.empty) {
            let l = T0(n.doc, o.head);
            for (let a of i)
              if (a == l && er(n.doc, o.head) == Cu(ne(a, 0)))
                return {
                  changes: { from: o.head - a.length, to: o.head + a.length },
                  range: w.cursor(o.head - a.length),
                };
          }
          return { range: (s = o) };
        });
      return (
        s ||
          e(n.update(r, { scrollIntoView: !0, userEvent: "delete.backward" })),
        !s
      );
    },
    Au = [{ key: "Backspace", run: Z0 }];
  function C0(n, e) {
    let t = Tu(n, n.selection.main.head),
      i = t.brackets || On.brackets;
    for (let s of i) {
      let r = Cu(ne(s, 0));
      if (e == s)
        return r == s
          ? Y0(n, s, i.indexOf(s + s + s) > -1, t)
          : A0(n, s, r, t.before || On.before);
      if (e == r && Ru(n, n.selection.main.from)) return R0(n, s, r);
    }
    return null;
  }
  function Ru(n, e) {
    let t = !1;
    return (
      n.field($u).between(0, n.doc.length, (i) => {
        i == e && (t = !0);
      }),
      t
    );
  }
  function er(n, e) {
    let t = n.sliceString(e, e + 2);
    return t.slice(0, Oe(ne(t, 0)));
  }
  function T0(n, e) {
    let t = n.sliceString(e - 2, e);
    return Oe(ne(t, 0)) == t.length ? t : t.slice(1);
  }
  function A0(n, e, t, i) {
    let s = null,
      r = n.changeByRange((o) => {
        if (!o.empty)
          return {
            changes: [
              { insert: e, from: o.from },
              { insert: t, from: o.to },
            ],
            effects: It.of(o.to + e.length),
            range: w.range(o.anchor + e.length, o.head + e.length),
          };
        let l = er(n.doc, o.head);
        return !l || /\s/.test(l) || i.indexOf(l) > -1
          ? {
              changes: { insert: e + t, from: o.head },
              effects: It.of(o.head + e.length),
              range: w.cursor(o.head + e.length),
            }
          : { range: (s = o) };
      });
    return s
      ? null
      : n.update(r, { scrollIntoView: !0, userEvent: "input.type" });
  }
  function R0(n, e, t) {
    let i = null,
      s = n.changeByRange((r) =>
        r.empty && er(n.doc, r.head) == t
          ? {
              changes: { from: r.head, to: r.head + t.length, insert: t },
              range: w.cursor(r.head + t.length),
            }
          : (i = { range: r })
      );
    return i
      ? null
      : n.update(s, { scrollIntoView: !0, userEvent: "input.type" });
  }
  function Y0(n, e, t, i) {
    let s = i.stringPrefixes || On.stringPrefixes,
      r = null,
      o = n.changeByRange((l) => {
        if (!l.empty)
          return {
            changes: [
              { insert: e, from: l.from },
              { insert: e, from: l.to },
            ],
            effects: It.of(l.to + e.length),
            range: w.range(l.anchor + e.length, l.head + e.length),
          };
        let a = l.head,
          h = er(n.doc, a),
          c;
        if (h == e) {
          if (gu(n, a))
            return {
              changes: { insert: e + e, from: a },
              effects: It.of(a + e.length),
              range: w.cursor(a + e.length),
            };
          if (Ru(n, a)) {
            let u =
              t && n.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
            return {
              changes: { from: a, to: a + u.length, insert: u },
              range: w.cursor(a + u.length),
            };
          }
        } else {
          if (
            t &&
            n.sliceDoc(a - 2 * e.length, a) == e + e &&
            (c = yu(n, a - 2 * e.length, s)) > -1 &&
            gu(n, c)
          )
            return {
              changes: { insert: e + e + e + e, from: a },
              effects: It.of(a + e.length),
              range: w.cursor(a + e.length),
            };
          if (
            n.charCategorizer(a)(h) != _.Word &&
            yu(n, a, s) > -1 &&
            !W0(n, a, e, s)
          )
            return {
              changes: { insert: e + e, from: a },
              effects: It.of(a + e.length),
              range: w.cursor(a + e.length),
            };
        }
        return { range: (r = l) };
      });
    return r
      ? null
      : n.update(o, { scrollIntoView: !0, userEvent: "input.type" });
  }
  function gu(n, e) {
    let t = te(n).resolveInner(e + 1);
    return t.parent && t.from == e;
  }
  function W0(n, e, t, i) {
    let s = te(n).resolveInner(e, -1),
      r = i.reduce((o, l) => Math.max(o, l.length), 0);
    for (let o = 0; o < 5; o++) {
      let l = n.sliceDoc(s.from, Math.min(s.to, s.from + t.length + r)),
        a = l.indexOf(t);
      if (!a || (a > -1 && i.indexOf(l.slice(0, a)) > -1)) {
        let c = s.firstChild;
        for (; c && c.from == s.from && c.to - c.from > t.length + a; ) {
          if (n.sliceDoc(c.to - t.length, c.to) == t) return !1;
          c = c.firstChild;
        }
        return !0;
      }
      let h = s.to == e && s.parent;
      if (!h) break;
      s = h;
    }
    return !1;
  }
  function yu(n, e, t) {
    let i = n.charCategorizer(e);
    if (i(n.sliceDoc(e - 1, e)) != _.Word) return e;
    for (let s of t) {
      let r = e - s.length;
      if (n.sliceDoc(r, e) == s && i(n.sliceDoc(r - 1, r)) != _.Word) return r;
    }
    return -1;
  }
  function Yu(n = {}) {
    return [Re, pe.of(n), O0, X0, vu];
  }
  var El = [
      { key: "Ctrl-Space", run: f0 },
      { key: "Escape", run: u0 },
      { key: "ArrowDown", run: Fs(!0) },
      { key: "ArrowUp", run: Fs(!1) },
      { key: "PageDown", run: Fs(!0, "page") },
      { key: "PageUp", run: Fs(!1, "page") },
      { key: "Enter", run: c0 },
    ],
    X0 = Le.highest(
      bt.computeN([pe], (n) => (n.facet(pe).defaultKeymap ? [El] : []))
    );
  var Dl = class {
      constructor(e, t, i) {
        (this.from = e), (this.to = t), (this.diagnostic = i);
      }
    },
    Lt = class n {
      constructor(e, t, i) {
        (this.diagnostics = e), (this.panel = t), (this.selected = i);
      }
      static init(e, t, i) {
        let s = e,
          r = i.facet(Du).markerFilter;
        r && (s = r(s));
        let o = R.set(
          s.map((l) =>
            l.from == l.to ||
            (l.from == l.to - 1 && i.doc.lineAt(l.from).to == l.from)
              ? R.widget({ widget: new jl(l), diagnostic: l }).range(l.from)
              : R.mark({
                  attributes: {
                    class:
                      "cm-lintRange cm-lintRange-" +
                      l.severity +
                      (l.markClass ? " " + l.markClass : ""),
                  },
                  diagnostic: l,
                }).range(l.from, l.to)
          ),
          !0
        );
        return new n(o, t, yi(o));
      }
    };
  function yi(n, e = null, t = 0) {
    let i = null;
    return (
      n.between(t, 1e9, (s, r, { spec: o }) => {
        if (!(e && o.diagnostic != e))
          return (i = new Dl(s, r, o.diagnostic)), !1;
      }),
      i
    );
  }
  function M0(n, e) {
    let t = n.startState.doc.lineAt(e.pos);
    return !!(
      n.effects.some((i) => i.is(Xu)) || n.changes.touchesRange(t.from, t.to)
    );
  }
  function E0(n, e) {
    return n.field(Ye, !1) ? e : e.concat(Y.appendConfig.of(_0));
  }
  var Xu = Y.define(),
    ql = Y.define(),
    Mu = Y.define(),
    Ye = F.define({
      create() {
        return new Lt(R.none, null, null);
      },
      update(n, e) {
        if (e.docChanged) {
          let t = n.diagnostics.map(e.changes),
            i = null;
          if (n.selected) {
            let s = e.changes.mapPos(n.selected.from, 1);
            i = yi(t, n.selected.diagnostic, s) || yi(t, null, s);
          }
          n = new Lt(t, n.panel, i);
        }
        for (let t of e.effects)
          t.is(Xu)
            ? (n = Lt.init(t.value, n.panel, e.state))
            : t.is(ql)
            ? (n = new Lt(n.diagnostics, t.value ? nr.open : null, n.selected))
            : t.is(Mu) && (n = new Lt(n.diagnostics, n.panel, t.value));
        return n;
      },
      provide: (n) => [
        Xt.from(n, (e) => e.panel),
        v.decorations.from(n, (e) => e.diagnostics),
      ],
    });
  var D0 = R.mark({ class: "cm-lintRange cm-lintRange-active" });
  function j0(n, e, t) {
    let { diagnostics: i } = n.state.field(Ye),
      s = [],
      r = 2e8,
      o = 0;
    i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: c }) => {
      e >= a &&
        e <= h &&
        (a == h || ((e > a || t > 0) && (e < h || t < 0))) &&
        (s.push(c.diagnostic), (r = Math.min(a, r)), (o = Math.max(h, o)));
    });
    let l = n.state.facet(Du).tooltipFilter;
    return (
      l && (s = l(s)),
      s.length
        ? {
            pos: r,
            end: o,
            above: n.state.doc.lineAt(r).to < o,
            create() {
              return { dom: q0(n, s) };
            },
          }
        : null
    );
  }
  function q0(n, e) {
    return L(
      "ul",
      { class: "cm-tooltip-lint" },
      e.map((t) => qu(n, t, !1))
    );
  }
  var B0 = (n) => {
      let e = n.state.field(Ye, !1);
      (!e || !e.panel) && n.dispatch({ effects: E0(n.state, [ql.of(!0)]) });
      let t = Mt(n, nr.open);
      return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
    },
    Wu = (n) => {
      let e = n.state.field(Ye, !1);
      return !e || !e.panel ? !1 : (n.dispatch({ effects: ql.of(!1) }), !0);
    },
    V0 = (n) => {
      let e = n.state.field(Ye, !1);
      if (!e) return !1;
      let t = n.state.selection.main,
        i = e.diagnostics.iter(t.to + 1);
      return !i.value &&
        ((i = e.diagnostics.iter(0)),
        !i.value || (i.from == t.from && i.to == t.to))
        ? !1
        : (n.dispatch({
            selection: { anchor: i.from, head: i.to },
            scrollIntoView: !0,
          }),
          !0);
    };
  var Eu = [
    { key: "Mod-Shift-m", run: B0, preventDefault: !0 },
    { key: "F8", run: V0 },
  ];
  var Du = T.define({
    combine(n) {
      return Object.assign(
        { sources: n.map((e) => e.source) },
        fe(
          n.map((e) => e.config),
          {
            delay: 750,
            markerFilter: null,
            tooltipFilter: null,
            needsRefresh: null,
          },
          { needsRefresh: (e, t) => (e ? (t ? (i) => e(i) || t(i) : e) : t) }
        )
      );
    },
  });
  function ju(n) {
    let e = [];
    if (n)
      e: for (let { name: t } of n) {
        for (let i = 0; i < t.length; i++) {
          let s = t[i];
          if (
            /[a-zA-Z]/.test(s) &&
            !e.some((r) => r.toLowerCase() == s.toLowerCase())
          ) {
            e.push(s);
            continue e;
          }
        }
        e.push("");
      }
    return e;
  }
  function qu(n, e, t) {
    var i;
    let s = t ? ju(e.actions) : [];
    return L(
      "li",
      { class: "cm-diagnostic cm-diagnostic-" + e.severity },
      L(
        "span",
        { class: "cm-diagnosticText" },
        e.renderMessage ? e.renderMessage() : e.message
      ),
      (i = e.actions) === null || i === void 0
        ? void 0
        : i.map((r, o) => {
            let l = !1,
              a = (u) => {
                if ((u.preventDefault(), l)) return;
                l = !0;
                let d = yi(n.state.field(Ye).diagnostics, e);
                d && r.apply(n, d.from, d.to);
              },
              { name: h } = r,
              c = s[o] ? h.indexOf(s[o]) : -1,
              f =
                c < 0
                  ? h
                  : [h.slice(0, c), L("u", h.slice(c, c + 1)), h.slice(c + 1)];
            return L(
              "button",
              {
                type: "button",
                class: "cm-diagnosticAction",
                onclick: a,
                onmousedown: a,
                "aria-label": ` Action: ${h}${
                  c < 0 ? "" : ` (access key "${s[o]})"`
                }.`,
              },
              f
            );
          }),
      e.source && L("div", { class: "cm-diagnosticSource" }, e.source)
    );
  }
  var jl = class extends Qe {
      constructor(e) {
        super(), (this.diagnostic = e);
      }
      eq(e) {
        return e.diagnostic == this.diagnostic;
      }
      toDOM() {
        return L("span", {
          class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity,
        });
      }
    },
    ir = class {
      constructor(e, t) {
        (this.diagnostic = t),
          (this.id =
            "item_" + Math.floor(Math.random() * 4294967295).toString(16)),
          (this.dom = qu(e, t, !0)),
          (this.dom.id = this.id),
          this.dom.setAttribute("role", "option");
      }
    },
    nr = class n {
      constructor(e) {
        (this.view = e), (this.items = []);
        let t = (s) => {
            if (s.keyCode == 27) Wu(this.view), this.view.focus();
            else if (s.keyCode == 38 || s.keyCode == 33)
              this.moveSelection(
                (this.selectedIndex - 1 + this.items.length) % this.items.length
              );
            else if (s.keyCode == 40 || s.keyCode == 34)
              this.moveSelection((this.selectedIndex + 1) % this.items.length);
            else if (s.keyCode == 36) this.moveSelection(0);
            else if (s.keyCode == 35) this.moveSelection(this.items.length - 1);
            else if (s.keyCode == 13) this.view.focus();
            else if (
              s.keyCode >= 65 &&
              s.keyCode <= 90 &&
              this.selectedIndex >= 0
            ) {
              let { diagnostic: r } = this.items[this.selectedIndex],
                o = ju(r.actions);
              for (let l = 0; l < o.length; l++)
                if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
                  let a = yi(this.view.state.field(Ye).diagnostics, r);
                  a && r.actions[l].apply(e, a.from, a.to);
                }
            } else return;
            s.preventDefault();
          },
          i = (s) => {
            for (let r = 0; r < this.items.length; r++)
              this.items[r].dom.contains(s.target) && this.moveSelection(r);
          };
        (this.list = L("ul", {
          tabIndex: 0,
          role: "listbox",
          "aria-label": this.view.state.phrase("Diagnostics"),
          onkeydown: t,
          onclick: i,
        })),
          (this.dom = L(
            "div",
            { class: "cm-panel-lint" },
            this.list,
            L(
              "button",
              {
                type: "button",
                name: "close",
                "aria-label": this.view.state.phrase("close"),
                onclick: () => Wu(this.view),
              },
              "\xD7"
            )
          )),
          this.update();
      }
      get selectedIndex() {
        let e = this.view.state.field(Ye).selected;
        if (!e) return -1;
        for (let t = 0; t < this.items.length; t++)
          if (this.items[t].diagnostic == e.diagnostic) return t;
        return -1;
      }
      update() {
        let { diagnostics: e, selected: t } = this.view.state.field(Ye),
          i = 0,
          s = !1,
          r = null;
        for (
          e.between(0, this.view.state.doc.length, (o, l, { spec: a }) => {
            let h = -1,
              c;
            for (let f = i; f < this.items.length; f++)
              if (this.items[f].diagnostic == a.diagnostic) {
                h = f;
                break;
              }
            h < 0
              ? ((c = new ir(this.view, a.diagnostic)),
                this.items.splice(i, 0, c),
                (s = !0))
              : ((c = this.items[h]),
                h > i && (this.items.splice(i, h - i), (s = !0))),
              t && c.diagnostic == t.diagnostic
                ? c.dom.hasAttribute("aria-selected") ||
                  (c.dom.setAttribute("aria-selected", "true"), (r = c))
                : c.dom.hasAttribute("aria-selected") &&
                  c.dom.removeAttribute("aria-selected"),
              i++;
          });
          i < this.items.length &&
          !(this.items.length == 1 && this.items[0].diagnostic.from < 0);

        )
          (s = !0), this.items.pop();
        this.items.length == 0 &&
          (this.items.push(
            new ir(this.view, {
              from: -1,
              to: -1,
              severity: "info",
              message: this.view.state.phrase("No diagnostics"),
            })
          ),
          (s = !0)),
          r
            ? (this.list.setAttribute("aria-activedescendant", r.id),
              this.view.requestMeasure({
                key: this,
                read: () => ({
                  sel: r.dom.getBoundingClientRect(),
                  panel: this.list.getBoundingClientRect(),
                }),
                write: ({ sel: o, panel: l }) => {
                  let a = l.height / this.list.offsetHeight;
                  o.top < l.top
                    ? (this.list.scrollTop -= (l.top - o.top) / a)
                    : o.bottom > l.bottom &&
                      (this.list.scrollTop += (o.bottom - l.bottom) / a);
                },
              }))
            : this.selectedIndex < 0 &&
              this.list.removeAttribute("aria-activedescendant"),
          s && this.sync();
      }
      sync() {
        let e = this.list.firstChild;
        function t() {
          let i = e;
          (e = i.nextSibling), i.remove();
        }
        for (let i of this.items)
          if (i.dom.parentNode == this.list) {
            for (; e != i.dom; ) t();
            e = i.dom.nextSibling;
          } else this.list.insertBefore(i.dom, e);
        for (; e; ) t();
      }
      moveSelection(e) {
        if (this.selectedIndex < 0) return;
        let t = this.view.state.field(Ye),
          i = yi(t.diagnostics, this.items[e].diagnostic);
        i &&
          this.view.dispatch({
            selection: { anchor: i.from, head: i.to },
            scrollIntoView: !0,
            effects: Mu.of(i),
          });
      }
      static open(e) {
        return new n(e);
      }
    };
  function I0(n, e = 'viewBox="0 0 40 40"') {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(
      n
    )}</svg>')`;
  }
  function tr(n) {
    return I0(
      `<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`,
      'width="6" height="3"'
    );
  }
  var L0 = v.baseTheme({
    ".cm-diagnostic": {
      padding: "3px 6px 3px 8px",
      marginLeft: "-1px",
      display: "block",
      whiteSpace: "pre-wrap",
    },
    ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
    ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
    ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
    ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
    ".cm-diagnosticAction": {
      font: "inherit",
      border: "none",
      padding: "2px 4px",
      backgroundColor: "#444",
      color: "white",
      borderRadius: "3px",
      marginLeft: "8px",
      cursor: "pointer",
    },
    ".cm-diagnosticSource": { fontSize: "70%", opacity: 0.7 },
    ".cm-lintRange": {
      backgroundPosition: "left bottom",
      backgroundRepeat: "repeat-x",
      paddingBottom: "0.7px",
    },
    ".cm-lintRange-error": { backgroundImage: tr("#d11") },
    ".cm-lintRange-warning": { backgroundImage: tr("orange") },
    ".cm-lintRange-info": { backgroundImage: tr("#999") },
    ".cm-lintRange-hint": { backgroundImage: tr("#66d") },
    ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
    ".cm-tooltip-lint": { padding: 0, margin: 0 },
    ".cm-lintPoint": {
      position: "relative",
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: "-2px",
        borderLeft: "3px solid transparent",
        borderRight: "3px solid transparent",
        borderBottom: "4px solid #d11",
      },
    },
    ".cm-lintPoint-warning": { "&:after": { borderBottomColor: "orange" } },
    ".cm-lintPoint-info": { "&:after": { borderBottomColor: "#999" } },
    ".cm-lintPoint-hint": { "&:after": { borderBottomColor: "#66d" } },
    ".cm-panel.cm-panel-lint": {
      position: "relative",
      "& ul": {
        maxHeight: "100px",
        overflowY: "auto",
        "& [aria-selected]": {
          backgroundColor: "#ddd",
          "& u": { textDecoration: "underline" },
        },
        "&:focus [aria-selected]": {
          background_fallback: "#bdf",
          backgroundColor: "Highlight",
          color_fallback: "white",
          color: "HighlightText",
        },
        "& u": { textDecoration: "none" },
        padding: 0,
        margin: 0,
      },
      "& [name=close]": {
        position: "absolute",
        top: "0",
        right: "2px",
        background: "inherit",
        border: "none",
        font: "inherit",
        padding: 0,
        margin: 0,
      },
    },
  });
  var _0 = [
    Ye,
    v.decorations.compute([Ye], (n) => {
      let { selected: e, panel: t } = n.field(Ye);
      return !e || !t || e.from == e.to
        ? R.none
        : R.set([D0.range(e.from, e.to)]);
    }),
    kc(j0, { hideOn: M0 }),
    L0,
  ];
  var Bu = [
    Pc(),
    $c(),
    bc(),
    Sf(),
    sf(),
    Oc(),
    yc(),
    V.allowMultipleSelections.of(!0),
    Gc(),
    Zs(of, { fallback: !0 }),
    cf(),
    Zu(),
    Yu(),
    Sc(),
    xc(),
    wc(),
    ru(),
    bt.of([...Au, ...Ff, ...cu, ...Qf, ...ef, ...El, ...Eu]),
  ];
  var Il = class n {
      constructor(e, t, i, s, r, o, l, a, h, c = 0, f) {
        (this.p = e),
          (this.stack = t),
          (this.state = i),
          (this.reducePos = s),
          (this.pos = r),
          (this.score = o),
          (this.buffer = l),
          (this.bufferBase = a),
          (this.curContext = h),
          (this.lookAhead = c),
          (this.parent = f);
      }
      toString() {
        return `[${this.stack
          .filter((e, t) => t % 3 == 0)
          .concat(this.state)}]@${this.pos}${
          this.score ? "!" + this.score : ""
        }`;
      }
      static start(e, t, i = 0) {
        let s = e.parser.context;
        return new n(
          e,
          [],
          t,
          i,
          i,
          0,
          [],
          0,
          s ? new sr(s, s.start) : null,
          0,
          null
        );
      }
      get context() {
        return this.curContext ? this.curContext.context : null;
      }
      pushState(e, t) {
        this.stack.push(this.state, t, this.bufferBase + this.buffer.length),
          (this.state = e);
      }
      reduce(e) {
        var t;
        let i = e >> 19,
          s = e & 65535,
          { parser: r } = this.p,
          o = r.dynamicPrecedence(s);
        if ((o && (this.score += o), i == 0)) {
          this.pushState(r.getGoto(this.state, s, !0), this.reducePos),
            s < r.minRepeatTerm &&
              this.storeNode(s, this.reducePos, this.reducePos, 4, !0),
            this.reduceContext(s, this.reducePos);
          return;
        }
        let l = this.stack.length - (i - 1) * 3 - (e & 262144 ? 6 : 0),
          a = l ? this.stack[l - 2] : this.p.ranges[0].from,
          h = this.reducePos - a;
        h >= 2e3 &&
          !(
            !((t = this.p.parser.nodeSet.types[s]) === null || t === void 0) &&
            t.isAnonymous
          ) &&
          (a == this.p.lastBigReductionStart
            ? (this.p.bigReductionCount++, (this.p.lastBigReductionSize = h))
            : this.p.lastBigReductionSize < h &&
              ((this.p.bigReductionCount = 1),
              (this.p.lastBigReductionStart = a),
              (this.p.lastBigReductionSize = h)));
        let c = l ? this.stack[l - 1] : 0,
          f = this.bufferBase + this.buffer.length - c;
        if (s < r.minRepeatTerm || e & 131072) {
          let u = r.stateFlag(this.state, 1) ? this.pos : this.reducePos;
          this.storeNode(s, a, u, f + 4, !0);
        }
        if (e & 262144) this.state = this.stack[l];
        else {
          let u = this.stack[l - 3];
          this.state = r.getGoto(u, s, !0);
        }
        for (; this.stack.length > l; ) this.stack.pop();
        this.reduceContext(s, a);
      }
      storeNode(e, t, i, s = 4, r = !1) {
        if (
          e == 0 &&
          (!this.stack.length ||
            this.stack[this.stack.length - 1] <
              this.buffer.length + this.bufferBase)
        ) {
          let o = this,
            l = this.buffer.length;
          if (
            (l == 0 &&
              o.parent &&
              ((l = o.bufferBase - o.parent.bufferBase), (o = o.parent)),
            l > 0 && o.buffer[l - 4] == 0 && o.buffer[l - 1] > -1)
          ) {
            if (t == i) return;
            if (o.buffer[l - 2] >= t) {
              o.buffer[l - 2] = i;
              return;
            }
          }
        }
        if (!r || this.pos == i) this.buffer.push(e, t, i, s);
        else {
          let o = this.buffer.length;
          if (o > 0 && this.buffer[o - 4] != 0)
            for (; o > 0 && this.buffer[o - 2] > i; )
              (this.buffer[o] = this.buffer[o - 4]),
                (this.buffer[o + 1] = this.buffer[o - 3]),
                (this.buffer[o + 2] = this.buffer[o - 2]),
                (this.buffer[o + 3] = this.buffer[o - 1]),
                (o -= 4),
                s > 4 && (s -= 4);
          (this.buffer[o] = e),
            (this.buffer[o + 1] = t),
            (this.buffer[o + 2] = i),
            (this.buffer[o + 3] = s);
        }
      }
      shift(e, t, i, s) {
        if (e & 131072) this.pushState(e & 65535, this.pos);
        else if (e & 262144)
          (this.pos = s),
            this.shiftContext(t, i),
            t <= this.p.parser.maxNode && this.buffer.push(t, i, s, 4);
        else {
          let r = e,
            { parser: o } = this.p;
          (s > this.pos || t <= o.maxNode) &&
            ((this.pos = s), o.stateFlag(r, 1) || (this.reducePos = s)),
            this.pushState(r, i),
            this.shiftContext(t, i),
            t <= o.maxNode && this.buffer.push(t, i, s, 4);
        }
      }
      apply(e, t, i, s) {
        e & 65536 ? this.reduce(e) : this.shift(e, t, i, s);
      }
      useNode(e, t) {
        let i = this.p.reused.length - 1;
        (i < 0 || this.p.reused[i] != e) && (this.p.reused.push(e), i++);
        let s = this.pos;
        (this.reducePos = this.pos = s + e.length),
          this.pushState(t, s),
          this.buffer.push(i, s, this.reducePos, -1),
          this.curContext &&
            this.updateContext(
              this.curContext.tracker.reuse(
                this.curContext.context,
                e,
                this,
                this.p.stream.reset(this.pos - e.length)
              )
            );
      }
      split() {
        let e = this,
          t = e.buffer.length;
        for (; t > 0 && e.buffer[t - 2] > e.reducePos; ) t -= 4;
        let i = e.buffer.slice(t),
          s = e.bufferBase + t;
        for (; e && s == e.bufferBase; ) e = e.parent;
        return new n(
          this.p,
          this.stack.slice(),
          this.state,
          this.reducePos,
          this.pos,
          this.score,
          i,
          s,
          this.curContext,
          this.lookAhead,
          e
        );
      }
      recoverByDelete(e, t) {
        let i = e <= this.p.parser.maxNode;
        i && this.storeNode(e, this.pos, t, 4),
          this.storeNode(0, this.pos, t, i ? 8 : 4),
          (this.pos = this.reducePos = t),
          (this.score -= 190);
      }
      canShift(e) {
        for (let t = new Ll(this); ; ) {
          let i =
            this.p.parser.stateSlot(t.state, 4) ||
            this.p.parser.hasAction(t.state, e);
          if (i == 0) return !1;
          if (!(i & 65536)) return !0;
          t.reduce(i);
        }
      }
      recoverByInsert(e) {
        if (this.stack.length >= 300) return [];
        let t = this.p.parser.nextStates(this.state);
        if (t.length > 8 || this.stack.length >= 120) {
          let s = [];
          for (let r = 0, o; r < t.length; r += 2)
            (o = t[r + 1]) != this.state &&
              this.p.parser.hasAction(o, e) &&
              s.push(t[r], o);
          if (this.stack.length < 120)
            for (let r = 0; s.length < 8 && r < t.length; r += 2) {
              let o = t[r + 1];
              s.some((l, a) => a & 1 && l == o) || s.push(t[r], o);
            }
          t = s;
        }
        let i = [];
        for (let s = 0; s < t.length && i.length < 4; s += 2) {
          let r = t[s + 1];
          if (r == this.state) continue;
          let o = this.split();
          o.pushState(r, this.pos),
            o.storeNode(0, o.pos, o.pos, 4, !0),
            o.shiftContext(t[s], this.pos),
            (o.reducePos = this.pos),
            (o.score -= 200),
            i.push(o);
        }
        return i;
      }
      forceReduce() {
        let { parser: e } = this.p,
          t = e.stateSlot(this.state, 5);
        if (!(t & 65536)) return !1;
        if (!e.validAction(this.state, t)) {
          let i = t >> 19,
            s = t & 65535,
            r = this.stack.length - i * 3;
          if (r < 0 || e.getGoto(this.stack[r], s, !1) < 0) {
            let o = this.findForcedReduction();
            if (o == null) return !1;
            t = o;
          }
          this.storeNode(0, this.pos, this.pos, 4, !0), (this.score -= 100);
        }
        return (this.reducePos = this.pos), this.reduce(t), !0;
      }
      findForcedReduction() {
        let { parser: e } = this.p,
          t = [],
          i = (s, r) => {
            if (!t.includes(s))
              return (
                t.push(s),
                e.allActions(s, (o) => {
                  if (!(o & 393216))
                    if (o & 65536) {
                      let l = (o >> 19) - r;
                      if (l > 1) {
                        let a = o & 65535,
                          h = this.stack.length - l * 3;
                        if (h >= 0 && e.getGoto(this.stack[h], a, !1) >= 0)
                          return (l << 19) | 65536 | a;
                      }
                    } else {
                      let l = i(o, r + 1);
                      if (l != null) return l;
                    }
                })
              );
          };
        return i(this.state, 0);
      }
      forceAll() {
        for (; !this.p.parser.stateFlag(this.state, 2); )
          if (!this.forceReduce()) {
            this.storeNode(0, this.pos, this.pos, 4, !0);
            break;
          }
        return this;
      }
      get deadEnd() {
        if (this.stack.length != 3) return !1;
        let { parser: e } = this.p;
        return (
          e.data[e.stateSlot(this.state, 1)] == 65535 &&
          !e.stateSlot(this.state, 4)
        );
      }
      restart() {
        this.storeNode(0, this.pos, this.pos, 4, !0),
          (this.state = this.stack[0]),
          (this.stack.length = 0);
      }
      sameState(e) {
        if (this.state != e.state || this.stack.length != e.stack.length)
          return !1;
        for (let t = 0; t < this.stack.length; t += 3)
          if (this.stack[t] != e.stack[t]) return !1;
        return !0;
      }
      get parser() {
        return this.p.parser;
      }
      dialectEnabled(e) {
        return this.p.parser.dialect.flags[e];
      }
      shiftContext(e, t) {
        this.curContext &&
          this.updateContext(
            this.curContext.tracker.shift(
              this.curContext.context,
              e,
              this,
              this.p.stream.reset(t)
            )
          );
      }
      reduceContext(e, t) {
        this.curContext &&
          this.updateContext(
            this.curContext.tracker.reduce(
              this.curContext.context,
              e,
              this,
              this.p.stream.reset(t)
            )
          );
      }
      emitContext() {
        let e = this.buffer.length - 1;
        (e < 0 || this.buffer[e] != -3) &&
          this.buffer.push(this.curContext.hash, this.pos, this.pos, -3);
      }
      emitLookAhead() {
        let e = this.buffer.length - 1;
        (e < 0 || this.buffer[e] != -4) &&
          this.buffer.push(this.lookAhead, this.pos, this.pos, -4);
      }
      updateContext(e) {
        if (e != this.curContext.context) {
          let t = new sr(this.curContext.tracker, e);
          t.hash != this.curContext.hash && this.emitContext(),
            (this.curContext = t);
        }
      }
      setLookAhead(e) {
        e > this.lookAhead && (this.emitLookAhead(), (this.lookAhead = e));
      }
      close() {
        this.curContext && this.curContext.tracker.strict && this.emitContext(),
          this.lookAhead > 0 && this.emitLookAhead();
      }
    },
    sr = class {
      constructor(e, t) {
        (this.tracker = e),
          (this.context = t),
          (this.hash = e.strict ? e.hash(t) : 0);
      }
    },
    Ll = class {
      constructor(e) {
        (this.start = e),
          (this.state = e.state),
          (this.stack = e.stack),
          (this.base = this.stack.length);
      }
      reduce(e) {
        let t = e & 65535,
          i = e >> 19;
        i == 0
          ? (this.stack == this.start.stack &&
              (this.stack = this.stack.slice()),
            this.stack.push(this.state, 0, 0),
            (this.base += 3))
          : (this.base -= (i - 1) * 3);
        let s = this.start.p.parser.getGoto(this.stack[this.base - 3], t, !0);
        this.state = s;
      }
    },
    _l = class n {
      constructor(e, t, i) {
        (this.stack = e),
          (this.pos = t),
          (this.index = i),
          (this.buffer = e.buffer),
          this.index == 0 && this.maybeNext();
      }
      static create(e, t = e.bufferBase + e.buffer.length) {
        return new n(e, t, t - e.bufferBase);
      }
      maybeNext() {
        let e = this.stack.parent;
        e != null &&
          ((this.index = this.stack.bufferBase - e.bufferBase),
          (this.stack = e),
          (this.buffer = e.buffer));
      }
      get id() {
        return this.buffer[this.index - 4];
      }
      get start() {
        return this.buffer[this.index - 3];
      }
      get end() {
        return this.buffer[this.index - 2];
      }
      get size() {
        return this.buffer[this.index - 1];
      }
      next() {
        (this.index -= 4), (this.pos -= 4), this.index == 0 && this.maybeNext();
      }
      fork() {
        return new n(this.stack, this.pos, this.index);
      }
    };
  function gn(n, e = Uint16Array) {
    if (typeof n != "string") return n;
    let t = null;
    for (let i = 0, s = 0; i < n.length; ) {
      let r = 0;
      for (;;) {
        let o = n.charCodeAt(i++),
          l = !1;
        if (o == 126) {
          r = 65535;
          break;
        }
        o >= 92 && o--, o >= 34 && o--;
        let a = o - 32;
        if ((a >= 46 && ((a -= 46), (l = !0)), (r += a), l)) break;
        r *= 46;
      }
      t ? (t[s++] = r) : (t = new e(r));
    }
    return t;
  }
  var bi = class {
      constructor() {
        (this.start = -1),
          (this.value = -1),
          (this.end = -1),
          (this.extended = -1),
          (this.lookAhead = 0),
          (this.mask = 0),
          (this.context = 0);
      }
    },
    Vu = new bi(),
    Nl = class {
      constructor(e, t) {
        (this.input = e),
          (this.ranges = t),
          (this.chunk = ""),
          (this.chunkOff = 0),
          (this.chunk2 = ""),
          (this.chunk2Pos = 0),
          (this.next = -1),
          (this.token = Vu),
          (this.rangeIndex = 0),
          (this.pos = this.chunkPos = t[0].from),
          (this.range = t[0]),
          (this.end = t[t.length - 1].to),
          this.readNext();
      }
      resolveOffset(e, t) {
        let i = this.range,
          s = this.rangeIndex,
          r = this.pos + e;
        for (; r < i.from; ) {
          if (!s) return null;
          let o = this.ranges[--s];
          (r -= i.from - o.to), (i = o);
        }
        for (; t < 0 ? r > i.to : r >= i.to; ) {
          if (s == this.ranges.length - 1) return null;
          let o = this.ranges[++s];
          (r += o.from - i.to), (i = o);
        }
        return r;
      }
      clipPos(e) {
        if (e >= this.range.from && e < this.range.to) return e;
        for (let t of this.ranges) if (t.to > e) return Math.max(e, t.from);
        return this.end;
      }
      peek(e) {
        let t = this.chunkOff + e,
          i,
          s;
        if (t >= 0 && t < this.chunk.length)
          (i = this.pos + e), (s = this.chunk.charCodeAt(t));
        else {
          let r = this.resolveOffset(e, 1);
          if (r == null) return -1;
          if (
            ((i = r),
            i >= this.chunk2Pos && i < this.chunk2Pos + this.chunk2.length)
          )
            s = this.chunk2.charCodeAt(i - this.chunk2Pos);
          else {
            let o = this.rangeIndex,
              l = this.range;
            for (; l.to <= i; ) l = this.ranges[++o];
            (this.chunk2 = this.input.chunk((this.chunk2Pos = i))),
              i + this.chunk2.length > l.to &&
                (this.chunk2 = this.chunk2.slice(0, l.to - i)),
              (s = this.chunk2.charCodeAt(0));
          }
        }
        return i >= this.token.lookAhead && (this.token.lookAhead = i + 1), s;
      }
      acceptToken(e, t = 0) {
        let i = t ? this.resolveOffset(t, -1) : this.pos;
        if (i == null || i < this.token.start)
          throw new RangeError("Token end out of bounds");
        (this.token.value = e), (this.token.end = i);
      }
      getChunk() {
        if (
          this.pos >= this.chunk2Pos &&
          this.pos < this.chunk2Pos + this.chunk2.length
        ) {
          let { chunk: e, chunkPos: t } = this;
          (this.chunk = this.chunk2),
            (this.chunkPos = this.chunk2Pos),
            (this.chunk2 = e),
            (this.chunk2Pos = t),
            (this.chunkOff = this.pos - this.chunkPos);
        } else {
          (this.chunk2 = this.chunk), (this.chunk2Pos = this.chunkPos);
          let e = this.input.chunk(this.pos),
            t = this.pos + e.length;
          (this.chunk =
            t > this.range.to ? e.slice(0, this.range.to - this.pos) : e),
            (this.chunkPos = this.pos),
            (this.chunkOff = 0);
        }
      }
      readNext() {
        return this.chunkOff >= this.chunk.length &&
          (this.getChunk(), this.chunkOff == this.chunk.length)
          ? (this.next = -1)
          : (this.next = this.chunk.charCodeAt(this.chunkOff));
      }
      advance(e = 1) {
        for (this.chunkOff += e; this.pos + e >= this.range.to; ) {
          if (this.rangeIndex == this.ranges.length - 1) return this.setDone();
          (e -= this.range.to - this.pos),
            (this.range = this.ranges[++this.rangeIndex]),
            (this.pos = this.range.from);
        }
        return (
          (this.pos += e),
          this.pos >= this.token.lookAhead &&
            (this.token.lookAhead = this.pos + 1),
          this.readNext()
        );
      }
      setDone() {
        return (
          (this.pos = this.chunkPos = this.end),
          (this.range =
            this.ranges[(this.rangeIndex = this.ranges.length - 1)]),
          (this.chunk = ""),
          (this.next = -1)
        );
      }
      reset(e, t) {
        if (
          (t
            ? ((this.token = t),
              (t.start = e),
              (t.lookAhead = e + 1),
              (t.value = t.extended = -1))
            : (this.token = Vu),
          this.pos != e)
        ) {
          if (((this.pos = e), e == this.end)) return this.setDone(), this;
          for (; e < this.range.from; )
            this.range = this.ranges[--this.rangeIndex];
          for (; e >= this.range.to; )
            this.range = this.ranges[++this.rangeIndex];
          e >= this.chunkPos && e < this.chunkPos + this.chunk.length
            ? (this.chunkOff = e - this.chunkPos)
            : ((this.chunk = ""), (this.chunkOff = 0)),
            this.readNext();
        }
        return this;
      }
      read(e, t) {
        if (e >= this.chunkPos && t <= this.chunkPos + this.chunk.length)
          return this.chunk.slice(e - this.chunkPos, t - this.chunkPos);
        if (e >= this.chunk2Pos && t <= this.chunk2Pos + this.chunk2.length)
          return this.chunk2.slice(e - this.chunk2Pos, t - this.chunk2Pos);
        if (e >= this.range.from && t <= this.range.to)
          return this.input.read(e, t);
        let i = "";
        for (let s of this.ranges) {
          if (s.from >= t) break;
          s.to > e &&
            (i += this.input.read(Math.max(s.from, e), Math.min(s.to, t)));
        }
        return i;
      }
    },
    Zt = class {
      constructor(e, t) {
        (this.data = e), (this.id = t);
      }
      token(e, t) {
        let { parser: i } = t.p;
        zu(this.data, e, t, this.id, i.data, i.tokenPrecTable);
      }
    };
  Zt.prototype.contextual = Zt.prototype.fallback = Zt.prototype.extend = !1;
  var wi = class {
    constructor(e, t, i) {
      (this.precTable = t),
        (this.elseToken = i),
        (this.data = typeof e == "string" ? gn(e) : e);
    }
    token(e, t) {
      let i = e.pos,
        s = 0;
      for (;;) {
        let r = e.next < 0,
          o = e.resolveOffset(1, 1);
        if (
          (zu(this.data, e, t, 0, this.data, this.precTable),
          e.token.value > -1)
        )
          break;
        if (this.elseToken == null) return;
        if ((r || s++, o == null)) break;
        e.reset(o, e.token);
      }
      s && (e.reset(i, e.token), e.acceptToken(this.elseToken, s));
    }
  };
  wi.prototype.contextual = Zt.prototype.fallback = Zt.prototype.extend = !1;
  var _t = class {
    constructor(e, t = {}) {
      (this.token = e),
        (this.contextual = !!t.contextual),
        (this.fallback = !!t.fallback),
        (this.extend = !!t.extend);
    }
  };
  function zu(n, e, t, i, s, r) {
    let o = 0,
      l = 1 << i,
      { dialect: a } = t.p.parser;
    e: for (; l & n[o]; ) {
      let h = n[o + 1];
      for (let d = o + 3; d < h; d += 2)
        if ((n[d + 1] & l) > 0) {
          let p = n[d];
          if (
            a.allows(p) &&
            (e.token.value == -1 ||
              e.token.value == p ||
              z0(p, e.token.value, s, r))
          ) {
            e.acceptToken(p);
            break;
          }
        }
      let c = e.next,
        f = 0,
        u = n[o + 2];
      if (e.next < 0 && u > f && n[h + u * 3 - 3] == 65535) {
        o = n[h + u * 3 - 1];
        continue e;
      }
      for (; f < u; ) {
        let d = (f + u) >> 1,
          p = h + d + (d << 1),
          g = n[p],
          m = n[p + 1] || 65536;
        if (c < g) u = d;
        else if (c >= m) f = d + 1;
        else {
          (o = n[p + 2]), e.advance();
          continue e;
        }
      }
      break;
    }
  }
  function Iu(n, e, t) {
    for (let i = e, s; (s = n[i]) != 65535; i++) if (s == t) return i - e;
    return -1;
  }
  function z0(n, e, t, i) {
    let s = Iu(t, i, e);
    return s < 0 || Iu(t, i, n) < s;
  }
  var We =
      typeof process < "u" && process.env && /\bparse\b/.test(process.env.LOG),
    Bl = null;
  function Lu(n, e, t) {
    let i = n.cursor(ee.IncludeAnonymous);
    for (i.moveTo(e); ; )
      if (!(t < 0 ? i.childBefore(e) : i.childAfter(e)))
        for (;;) {
          if ((t < 0 ? i.to < e : i.from > e) && !i.type.isError)
            return t < 0
              ? Math.max(0, Math.min(i.to - 1, e - 25))
              : Math.min(n.length, Math.max(i.from + 1, e + 25));
          if (t < 0 ? i.prevSibling() : i.nextSibling()) break;
          if (!i.parent()) return t < 0 ? 0 : n.length;
        }
  }
  var zl = class {
      constructor(e, t) {
        (this.fragments = e),
          (this.nodeSet = t),
          (this.i = 0),
          (this.fragment = null),
          (this.safeFrom = -1),
          (this.safeTo = -1),
          (this.trees = []),
          (this.start = []),
          (this.index = []),
          this.nextFragment();
      }
      nextFragment() {
        let e = (this.fragment =
          this.i == this.fragments.length ? null : this.fragments[this.i++]);
        if (e) {
          for (
            this.safeFrom = e.openStart
              ? Lu(e.tree, e.from + e.offset, 1) - e.offset
              : e.from,
              this.safeTo = e.openEnd
                ? Lu(e.tree, e.to + e.offset, -1) - e.offset
                : e.to;
            this.trees.length;

          )
            this.trees.pop(), this.start.pop(), this.index.pop();
          this.trees.push(e.tree),
            this.start.push(-e.offset),
            this.index.push(0),
            (this.nextStart = this.safeFrom);
        } else this.nextStart = 1e9;
      }
      nodeAt(e) {
        if (e < this.nextStart) return null;
        for (; this.fragment && this.safeTo <= e; ) this.nextFragment();
        if (!this.fragment) return null;
        for (;;) {
          let t = this.trees.length - 1;
          if (t < 0) return this.nextFragment(), null;
          let i = this.trees[t],
            s = this.index[t];
          if (s == i.children.length) {
            this.trees.pop(), this.start.pop(), this.index.pop();
            continue;
          }
          let r = i.children[s],
            o = this.start[t] + i.positions[s];
          if (o > e) return (this.nextStart = o), null;
          if (r instanceof ie) {
            if (o == e) {
              if (o < this.safeFrom) return null;
              let l = o + r.length;
              if (l <= this.safeTo) {
                let a = r.prop(W.lookAhead);
                if (!a || l + a < this.fragment.to) return r;
              }
            }
            this.index[t]++,
              o + r.length >= Math.max(this.safeFrom, e) &&
                (this.trees.push(r), this.start.push(o), this.index.push(0));
          } else this.index[t]++, (this.nextStart = o + r.length);
        }
      }
    },
    Gl = class {
      constructor(e, t) {
        (this.stream = t),
          (this.tokens = []),
          (this.mainToken = null),
          (this.actions = []),
          (this.tokens = e.tokenizers.map((i) => new bi()));
      }
      getActions(e) {
        let t = 0,
          i = null,
          { parser: s } = e.p,
          { tokenizers: r } = s,
          o = s.stateSlot(e.state, 3),
          l = e.curContext ? e.curContext.hash : 0,
          a = 0;
        for (let h = 0; h < r.length; h++) {
          if (!((1 << h) & o)) continue;
          let c = r[h],
            f = this.tokens[h];
          if (
            !(i && !c.fallback) &&
            ((c.contextual ||
              f.start != e.pos ||
              f.mask != o ||
              f.context != l) &&
              (this.updateCachedToken(f, c, e), (f.mask = o), (f.context = l)),
            f.lookAhead > f.end + 25 && (a = Math.max(f.lookAhead, a)),
            f.value != 0)
          ) {
            let u = t;
            if (
              (f.extended > -1 &&
                (t = this.addActions(e, f.extended, f.end, t)),
              (t = this.addActions(e, f.value, f.end, t)),
              !c.extend && ((i = f), t > u))
            )
              break;
          }
        }
        for (; this.actions.length > t; ) this.actions.pop();
        return (
          a && e.setLookAhead(a),
          !i &&
            e.pos == this.stream.end &&
            ((i = new bi()),
            (i.value = e.p.parser.eofTerm),
            (i.start = i.end = e.pos),
            (t = this.addActions(e, i.value, i.end, t))),
          (this.mainToken = i),
          this.actions
        );
      }
      getMainToken(e) {
        if (this.mainToken) return this.mainToken;
        let t = new bi(),
          { pos: i, p: s } = e;
        return (
          (t.start = i),
          (t.end = Math.min(i + 1, s.stream.end)),
          (t.value = i == s.stream.end ? s.parser.eofTerm : 0),
          t
        );
      }
      updateCachedToken(e, t, i) {
        let s = this.stream.clipPos(i.pos);
        if ((t.token(this.stream.reset(s, e), i), e.value > -1)) {
          let { parser: r } = i.p;
          for (let o = 0; o < r.specialized.length; o++)
            if (r.specialized[o] == e.value) {
              let l = r.specializers[o](this.stream.read(e.start, e.end), i);
              if (l >= 0 && i.p.parser.dialect.allows(l >> 1)) {
                l & 1 ? (e.extended = l >> 1) : (e.value = l >> 1);
                break;
              }
            }
        } else (e.value = 0), (e.end = this.stream.clipPos(s + 1));
      }
      putAction(e, t, i, s) {
        for (let r = 0; r < s; r += 3) if (this.actions[r] == e) return s;
        return (
          (this.actions[s++] = e),
          (this.actions[s++] = t),
          (this.actions[s++] = i),
          s
        );
      }
      addActions(e, t, i, s) {
        let { state: r } = e,
          { parser: o } = e.p,
          { data: l } = o;
        for (let a = 0; a < 2; a++)
          for (let h = o.stateSlot(r, a ? 2 : 1); ; h += 3) {
            if (l[h] == 65535)
              if (l[h + 1] == 1) h = ft(l, h + 2);
              else {
                s == 0 &&
                  l[h + 1] == 2 &&
                  (s = this.putAction(ft(l, h + 2), t, i, s));
                break;
              }
            l[h] == t && (s = this.putAction(ft(l, h + 1), t, i, s));
          }
        return s;
      }
    },
    Ul = class {
      constructor(e, t, i, s) {
        (this.parser = e),
          (this.input = t),
          (this.ranges = s),
          (this.recovering = 0),
          (this.nextStackID = 9812),
          (this.minStackPos = 0),
          (this.reused = []),
          (this.stoppedAt = null),
          (this.lastBigReductionStart = -1),
          (this.lastBigReductionSize = 0),
          (this.bigReductionCount = 0),
          (this.stream = new Nl(t, s)),
          (this.tokens = new Gl(e, this.stream)),
          (this.topTerm = e.top[1]);
        let { from: r } = s[0];
        (this.stacks = [Il.start(this, e.top[0], r)]),
          (this.fragments =
            i.length && this.stream.end - r > e.bufferLength * 4
              ? new zl(i, e.nodeSet)
              : null);
      }
      get parsedPos() {
        return this.minStackPos;
      }
      advance() {
        let e = this.stacks,
          t = this.minStackPos,
          i = (this.stacks = []),
          s,
          r;
        if (this.bigReductionCount > 300 && e.length == 1) {
          let [o] = e;
          for (
            ;
            o.forceReduce() &&
            o.stack.length &&
            o.stack[o.stack.length - 2] >= this.lastBigReductionStart;

          );
          this.bigReductionCount = this.lastBigReductionSize = 0;
        }
        for (let o = 0; o < e.length; o++) {
          let l = e[o];
          for (;;) {
            if (((this.tokens.mainToken = null), l.pos > t)) i.push(l);
            else {
              if (this.advanceStack(l, i, e)) continue;
              {
                s || ((s = []), (r = [])), s.push(l);
                let a = this.tokens.getMainToken(l);
                r.push(a.value, a.end);
              }
            }
            break;
          }
        }
        if (!i.length) {
          let o = s && G0(s);
          if (o)
            return (
              We && console.log("Finish with " + this.stackID(o)),
              this.stackToTree(o)
            );
          if (this.parser.strict)
            throw (
              (We &&
                s &&
                console.log(
                  "Stuck with token " +
                    (this.tokens.mainToken
                      ? this.parser.getName(this.tokens.mainToken.value)
                      : "none")
                ),
              new SyntaxError("No parse at " + t))
            );
          this.recovering || (this.recovering = 5);
        }
        if (this.recovering && s) {
          let o =
            this.stoppedAt != null && s[0].pos > this.stoppedAt
              ? s[0]
              : this.runRecovery(s, r, i);
          if (o)
            return (
              We && console.log("Force-finish " + this.stackID(o)),
              this.stackToTree(o.forceAll())
            );
        }
        if (this.recovering) {
          let o = this.recovering == 1 ? 1 : this.recovering * 3;
          if (i.length > o)
            for (i.sort((l, a) => a.score - l.score); i.length > o; ) i.pop();
          i.some((l) => l.reducePos > t) && this.recovering--;
        } else if (i.length > 1) {
          e: for (let o = 0; o < i.length - 1; o++) {
            let l = i[o];
            for (let a = o + 1; a < i.length; a++) {
              let h = i[a];
              if (
                l.sameState(h) ||
                (l.buffer.length > 500 && h.buffer.length > 500)
              )
                if (
                  (l.score - h.score || l.buffer.length - h.buffer.length) > 0
                )
                  i.splice(a--, 1);
                else {
                  i.splice(o--, 1);
                  continue e;
                }
            }
          }
          i.length > 12 && i.splice(12, i.length - 12);
        }
        this.minStackPos = i[0].pos;
        for (let o = 1; o < i.length; o++)
          i[o].pos < this.minStackPos && (this.minStackPos = i[o].pos);
        return null;
      }
      stopAt(e) {
        if (this.stoppedAt != null && this.stoppedAt < e)
          throw new RangeError("Can't move stoppedAt forward");
        this.stoppedAt = e;
      }
      advanceStack(e, t, i) {
        let s = e.pos,
          { parser: r } = this,
          o = We ? this.stackID(e) + " -> " : "";
        if (this.stoppedAt != null && s > this.stoppedAt)
          return e.forceReduce() ? e : null;
        if (this.fragments) {
          let h = e.curContext && e.curContext.tracker.strict,
            c = h ? e.curContext.hash : 0;
          for (let f = this.fragments.nodeAt(s); f; ) {
            let u =
              this.parser.nodeSet.types[f.type.id] == f.type
                ? r.getGoto(e.state, f.type.id)
                : -1;
            if (u > -1 && f.length && (!h || (f.prop(W.contextHash) || 0) == c))
              return (
                e.useNode(f, u),
                We &&
                  console.log(
                    o +
                      this.stackID(e) +
                      ` (via reuse of ${r.getName(f.type.id)})`
                  ),
                !0
              );
            if (
              !(f instanceof ie) ||
              f.children.length == 0 ||
              f.positions[0] > 0
            )
              break;
            let d = f.children[0];
            if (d instanceof ie && f.positions[0] == 0) f = d;
            else break;
          }
        }
        let l = r.stateSlot(e.state, 4);
        if (l > 0)
          return (
            e.reduce(l),
            We &&
              console.log(
                o +
                  this.stackID(e) +
                  ` (via always-reduce ${r.getName(l & 65535)})`
              ),
            !0
          );
        if (e.stack.length >= 8400)
          for (; e.stack.length > 6e3 && e.forceReduce(); );
        let a = this.tokens.getActions(e);
        for (let h = 0; h < a.length; ) {
          let c = a[h++],
            f = a[h++],
            u = a[h++],
            d = h == a.length || !i,
            p = d ? e : e.split(),
            g = this.tokens.mainToken;
          if (
            (p.apply(c, f, g ? g.start : p.pos, u),
            We &&
              console.log(
                o +
                  this.stackID(p) +
                  ` (via ${
                    c & 65536 ? `reduce of ${r.getName(c & 65535)}` : "shift"
                  } for ${r.getName(f)} @ ${s}${p == e ? "" : ", split"})`
              ),
            d)
          )
            return !0;
          p.pos > s ? t.push(p) : i.push(p);
        }
        return !1;
      }
      advanceFully(e, t) {
        let i = e.pos;
        for (;;) {
          if (!this.advanceStack(e, null, null)) return !1;
          if (e.pos > i) return _u(e, t), !0;
        }
      }
      runRecovery(e, t, i) {
        let s = null,
          r = !1;
        for (let o = 0; o < e.length; o++) {
          let l = e[o],
            a = t[o << 1],
            h = t[(o << 1) + 1],
            c = We ? this.stackID(l) + " -> " : "";
          if (
            l.deadEnd &&
            (r ||
              ((r = !0),
              l.restart(),
              We && console.log(c + this.stackID(l) + " (restarted)"),
              this.advanceFully(l, i)))
          )
            continue;
          let f = l.split(),
            u = c;
          for (
            let d = 0;
            f.forceReduce() &&
            d < 10 &&
            (We && console.log(u + this.stackID(f) + " (via force-reduce)"),
            !this.advanceFully(f, i));
            d++
          )
            We && (u = this.stackID(f) + " -> ");
          for (let d of l.recoverByInsert(a))
            We && console.log(c + this.stackID(d) + " (via recover-insert)"),
              this.advanceFully(d, i);
          this.stream.end > l.pos
            ? (h == l.pos && (h++, (a = 0)),
              l.recoverByDelete(a, h),
              We &&
                console.log(
                  c +
                    this.stackID(l) +
                    ` (via recover-delete ${this.parser.getName(a)})`
                ),
              _u(l, i))
            : (!s || s.score < l.score) && (s = l);
        }
        return s;
      }
      stackToTree(e) {
        return (
          e.close(),
          ie.build({
            buffer: _l.create(e),
            nodeSet: this.parser.nodeSet,
            topID: this.topTerm,
            maxBufferLength: this.parser.bufferLength,
            reused: this.reused,
            start: this.ranges[0].from,
            length: e.pos - this.ranges[0].from,
            minRepeatType: this.parser.minRepeatTerm,
          })
        );
      }
      stackID(e) {
        let t = (Bl || (Bl = new WeakMap())).get(e);
        return (
          t || Bl.set(e, (t = String.fromCodePoint(this.nextStackID++))), t + e
        );
      }
    };
  function _u(n, e) {
    for (let t = 0; t < e.length; t++) {
      let i = e[t];
      if (i.pos == n.pos && i.sameState(n)) {
        e[t].score < n.score && (e[t] = n);
        return;
      }
    }
    e.push(n);
  }
  var Fl = class {
      constructor(e, t, i) {
        (this.source = e), (this.flags = t), (this.disabled = i);
      }
      allows(e) {
        return !this.disabled || this.disabled[e] == 0;
      }
    },
    Vl = (n) => n,
    rr = class {
      constructor(e) {
        (this.start = e.start),
          (this.shift = e.shift || Vl),
          (this.reduce = e.reduce || Vl),
          (this.reuse = e.reuse || Vl),
          (this.hash = e.hash || (() => 0)),
          (this.strict = e.strict !== !1);
      }
    },
    or = class n extends li {
      constructor(e) {
        if ((super(), (this.wrappers = []), e.version != 14))
          throw new RangeError(
            `Parser version (${e.version}) doesn't match runtime version (14)`
          );
        let t = e.nodeNames.split(" ");
        this.minRepeatTerm = t.length;
        for (let l = 0; l < e.repeatNodeCount; l++) t.push("");
        let i = Object.keys(e.topRules).map((l) => e.topRules[l][1]),
          s = [];
        for (let l = 0; l < t.length; l++) s.push([]);
        function r(l, a, h) {
          s[l].push([a, a.deserialize(String(h))]);
        }
        if (e.nodeProps)
          for (let l of e.nodeProps) {
            let a = l[0];
            typeof a == "string" && (a = W[a]);
            for (let h = 1; h < l.length; ) {
              let c = l[h++];
              if (c >= 0) r(c, a, l[h++]);
              else {
                let f = l[h + -c];
                for (let u = -c; u > 0; u--) r(l[h++], a, f);
                h++;
              }
            }
          }
        (this.nodeSet = new Hi(
          t.map((l, a) =>
            ue.define({
              name: a >= this.minRepeatTerm ? void 0 : l,
              id: a,
              props: s[a],
              top: i.indexOf(a) > -1,
              error: a == 0,
              skipped: e.skippedNodes && e.skippedNodes.indexOf(a) > -1,
            })
          )
        )),
          e.propSources &&
            (this.nodeSet = this.nodeSet.extend(...e.propSources)),
          (this.strict = !1),
          (this.bufferLength = 1024);
        let o = gn(e.tokenData);
        (this.context = e.context),
          (this.specializerSpecs = e.specialized || []),
          (this.specialized = new Uint16Array(this.specializerSpecs.length));
        for (let l = 0; l < this.specializerSpecs.length; l++)
          this.specialized[l] = this.specializerSpecs[l].term;
        (this.specializers = this.specializerSpecs.map(Nu)),
          (this.states = gn(e.states, Uint32Array)),
          (this.data = gn(e.stateData)),
          (this.goto = gn(e.goto)),
          (this.maxTerm = e.maxTerm),
          (this.tokenizers = e.tokenizers.map((l) =>
            typeof l == "number" ? new Zt(o, l) : l
          )),
          (this.topRules = e.topRules),
          (this.dialects = e.dialects || {}),
          (this.dynamicPrecedences = e.dynamicPrecedences || null),
          (this.tokenPrecTable = e.tokenPrec),
          (this.termNames = e.termNames || null),
          (this.maxNode = this.nodeSet.types.length - 1),
          (this.dialect = this.parseDialect()),
          (this.top = this.topRules[Object.keys(this.topRules)[0]]);
      }
      createParse(e, t, i) {
        let s = new Ul(this, e, t, i);
        for (let r of this.wrappers) s = r(s, e, t, i);
        return s;
      }
      getGoto(e, t, i = !1) {
        let s = this.goto;
        if (t >= s[0]) return -1;
        for (let r = s[t + 1]; ; ) {
          let o = s[r++],
            l = o & 1,
            a = s[r++];
          if (l && i) return a;
          for (let h = r + (o >> 1); r < h; r++) if (s[r] == e) return a;
          if (l) return -1;
        }
      }
      hasAction(e, t) {
        let i = this.data;
        for (let s = 0; s < 2; s++)
          for (let r = this.stateSlot(e, s ? 2 : 1), o; ; r += 3) {
            if ((o = i[r]) == 65535)
              if (i[r + 1] == 1) o = i[(r = ft(i, r + 2))];
              else {
                if (i[r + 1] == 2) return ft(i, r + 2);
                break;
              }
            if (o == t || o == 0) return ft(i, r + 1);
          }
        return 0;
      }
      stateSlot(e, t) {
        return this.states[e * 6 + t];
      }
      stateFlag(e, t) {
        return (this.stateSlot(e, 0) & t) > 0;
      }
      validAction(e, t) {
        return !!this.allActions(e, (i) => (i == t ? !0 : null));
      }
      allActions(e, t) {
        let i = this.stateSlot(e, 4),
          s = i ? t(i) : void 0;
        for (let r = this.stateSlot(e, 1); s == null; r += 3) {
          if (this.data[r] == 65535)
            if (this.data[r + 1] == 1) r = ft(this.data, r + 2);
            else break;
          s = t(ft(this.data, r + 1));
        }
        return s;
      }
      nextStates(e) {
        let t = [];
        for (let i = this.stateSlot(e, 1); ; i += 3) {
          if (this.data[i] == 65535)
            if (this.data[i + 1] == 1) i = ft(this.data, i + 2);
            else break;
          if (!(this.data[i + 2] & 1)) {
            let s = this.data[i + 1];
            t.some((r, o) => o & 1 && r == s) || t.push(this.data[i], s);
          }
        }
        return t;
      }
      configure(e) {
        let t = Object.assign(Object.create(n.prototype), this);
        if ((e.props && (t.nodeSet = this.nodeSet.extend(...e.props)), e.top)) {
          let i = this.topRules[e.top];
          if (!i) throw new RangeError(`Invalid top rule name ${e.top}`);
          t.top = i;
        }
        return (
          e.tokenizers &&
            (t.tokenizers = this.tokenizers.map((i) => {
              let s = e.tokenizers.find((r) => r.from == i);
              return s ? s.to : i;
            })),
          e.specializers &&
            ((t.specializers = this.specializers.slice()),
            (t.specializerSpecs = this.specializerSpecs.map((i, s) => {
              let r = e.specializers.find((l) => l.from == i.external);
              if (!r) return i;
              let o = Object.assign(Object.assign({}, i), { external: r.to });
              return (t.specializers[s] = Nu(o)), o;
            }))),
          e.contextTracker && (t.context = e.contextTracker),
          e.dialect && (t.dialect = this.parseDialect(e.dialect)),
          e.strict != null && (t.strict = e.strict),
          e.wrap && (t.wrappers = t.wrappers.concat(e.wrap)),
          e.bufferLength != null && (t.bufferLength = e.bufferLength),
          t
        );
      }
      hasWrappers() {
        return this.wrappers.length > 0;
      }
      getName(e) {
        return this.termNames
          ? this.termNames[e]
          : String((e <= this.maxNode && this.nodeSet.types[e].name) || e);
      }
      get eofTerm() {
        return this.maxNode + 1;
      }
      get topNode() {
        return this.nodeSet.types[this.top[1]];
      }
      dynamicPrecedence(e) {
        let t = this.dynamicPrecedences;
        return t == null ? 0 : t[e] || 0;
      }
      parseDialect(e) {
        let t = Object.keys(this.dialects),
          i = t.map(() => !1);
        if (e)
          for (let r of e.split(" ")) {
            let o = t.indexOf(r);
            o >= 0 && (i[o] = !0);
          }
        let s = null;
        for (let r = 0; r < t.length; r++)
          if (!i[r])
            for (
              let o = this.dialects[t[r]], l;
              (l = this.data[o++]) != 65535;

            )
              (s || (s = new Uint8Array(this.maxTerm + 1)))[l] = 1;
        return new Fl(e, i, s);
      }
      static deserialize(e) {
        return new n(e);
      }
    };
  function ft(n, e) {
    return n[e] | (n[e + 1] << 16);
  }
  function G0(n) {
    let e = null;
    for (let t of n) {
      let i = t.p.stoppedAt;
      (t.pos == t.p.stream.end || (i != null && t.pos > i)) &&
        t.p.parser.stateFlag(t.state, 2) &&
        (!e || e.score < t.score) &&
        (e = t);
    }
    return e;
  }
  function Nu(n) {
    if (n.external) {
      let e = n.extend ? 1 : 0;
      return (t, i) => (n.external(t, i) << 1) | e;
    }
    return n.get;
  }
  var U0 = 309,
    Gu = 1,
    F0 = 2,
    H0 = 3,
    K0 = 310,
    J0 = 312,
    e1 = 313,
    t1 = 4,
    i1 = 5,
    n1 = 0,
    Kl = [
      9, 10, 11, 12, 13, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197,
      8198, 8199, 8200, 8201, 8202, 8232, 8233, 8239, 8287, 12288,
    ],
    Uu = 125,
    s1 = 59,
    Jl = 47,
    r1 = 42,
    o1 = 43,
    l1 = 45,
    a1 = 60,
    h1 = 44,
    c1 = new rr({
      start: !1,
      shift(n, e) {
        return e == t1 || e == i1 || e == J0 ? n : e == e1;
      },
      strict: !1,
    }),
    f1 = new _t(
      (n, e) => {
        let { next: t } = n;
        (t == Uu || t == -1 || e.context) && n.acceptToken(K0);
      },
      { contextual: !0, fallback: !0 }
    ),
    u1 = new _t(
      (n, e) => {
        let { next: t } = n,
          i;
        Kl.indexOf(t) > -1 ||
          (t == Jl && ((i = n.peek(1)) == Jl || i == r1)) ||
          (t != Uu && t != s1 && t != -1 && !e.context && n.acceptToken(U0));
      },
      { contextual: !0 }
    ),
    d1 = new _t(
      (n, e) => {
        let { next: t } = n;
        if ((t == o1 || t == l1) && (n.advance(), t == n.next)) {
          n.advance();
          let i = !e.context && e.canShift(Gu);
          n.acceptToken(i ? Gu : F0);
        }
      },
      { contextual: !0 }
    );
  function Hl(n, e) {
    return (
      (n >= 65 && n <= 90) ||
      (n >= 97 && n <= 122) ||
      n == 95 ||
      n >= 192 ||
      (!e && n >= 48 && n <= 57)
    );
  }
  var p1 = new _t((n, e) => {
      if (n.next != a1 || !e.dialectEnabled(n1) || (n.advance(), n.next == Jl))
        return;
      let t = 0;
      for (; Kl.indexOf(n.next) > -1; ) n.advance(), t++;
      if (Hl(n.next, !0)) {
        for (n.advance(), t++; Hl(n.next, !1); ) n.advance(), t++;
        for (; Kl.indexOf(n.next) > -1; ) n.advance(), t++;
        if (n.next == h1) return;
        for (let i = 0; ; i++) {
          if (i == 7) {
            if (!Hl(n.next, !0)) return;
            break;
          }
          if (n.next != "extends".charCodeAt(i)) break;
          n.advance(), t++;
        }
      }
      n.acceptToken(H0, -t);
    }),
    O1 = bs({
      "get set async static": O.modifier,
      "for while do if else switch try catch finally return throw break continue default case":
        O.controlKeyword,
      "in of await yield void typeof delete instanceof": O.operatorKeyword,
      "let var const using function class extends": O.definitionKeyword,
      "import export from": O.moduleKeyword,
      "with debugger as new": O.keyword,
      TemplateString: O.special(O.string),
      super: O.atom,
      BooleanLiteral: O.bool,
      this: O.self,
      null: O.null,
      Star: O.modifier,
      VariableName: O.variableName,
      "CallExpression/VariableName TaggedTemplateExpression/VariableName":
        O.function(O.variableName),
      VariableDefinition: O.definition(O.variableName),
      Label: O.labelName,
      PropertyName: O.propertyName,
      PrivatePropertyName: O.special(O.propertyName),
      "CallExpression/MemberExpression/PropertyName": O.function(
        O.propertyName
      ),
      "FunctionDeclaration/VariableDefinition": O.function(
        O.definition(O.variableName)
      ),
      "ClassDeclaration/VariableDefinition": O.definition(O.className),
      PropertyDefinition: O.definition(O.propertyName),
      PrivatePropertyDefinition: O.definition(O.special(O.propertyName)),
      UpdateOp: O.updateOperator,
      "LineComment Hashbang": O.lineComment,
      BlockComment: O.blockComment,
      Number: O.number,
      String: O.string,
      Escape: O.escape,
      ArithOp: O.arithmeticOperator,
      LogicOp: O.logicOperator,
      BitOp: O.bitwiseOperator,
      CompareOp: O.compareOperator,
      RegExp: O.regexp,
      Equals: O.definitionOperator,
      Arrow: O.function(O.punctuation),
      ": Spread": O.punctuation,
      "( )": O.paren,
      "[ ]": O.squareBracket,
      "{ }": O.brace,
      "InterpolationStart InterpolationEnd": O.special(O.brace),
      ".": O.derefOperator,
      ", ;": O.separator,
      "@": O.meta,
      TypeName: O.typeName,
      TypeDefinition: O.definition(O.typeName),
      "type enum interface implements namespace module declare":
        O.definitionKeyword,
      "abstract global Privacy readonly override": O.modifier,
      "is keyof unique infer": O.operatorKeyword,
      JSXAttributeValue: O.attributeValue,
      JSXText: O.content,
      "JSXStartTag JSXStartCloseTag JSXSelfCloseEndTag JSXEndTag":
        O.angleBracket,
      "JSXIdentifier JSXNameSpacedName": O.tagName,
      "JSXAttribute/JSXIdentifier JSXAttribute/JSXNameSpacedName":
        O.attributeName,
      "JSXBuiltin/JSXIdentifier": O.standard(O.tagName),
    }),
    m1 = {
      __proto__: null,
      export: 18,
      as: 23,
      from: 31,
      default: 34,
      async: 39,
      function: 40,
      extends: 52,
      this: 56,
      true: 64,
      false: 64,
      null: 76,
      void: 80,
      typeof: 84,
      super: 102,
      new: 136,
      delete: 152,
      yield: 161,
      await: 165,
      class: 170,
      public: 227,
      private: 227,
      protected: 227,
      readonly: 229,
      instanceof: 248,
      satisfies: 251,
      in: 252,
      const: 254,
      import: 286,
      keyof: 339,
      unique: 343,
      infer: 349,
      is: 385,
      abstract: 405,
      implements: 407,
      type: 409,
      let: 412,
      var: 414,
      using: 417,
      interface: 423,
      enum: 427,
      namespace: 433,
      module: 435,
      declare: 439,
      global: 443,
      for: 462,
      of: 471,
      while: 474,
      with: 478,
      do: 482,
      if: 486,
      else: 488,
      switch: 492,
      case: 498,
      try: 504,
      catch: 508,
      finally: 512,
      return: 516,
      throw: 520,
      break: 524,
      continue: 528,
      debugger: 532,
    },
    g1 = {
      __proto__: null,
      async: 123,
      get: 125,
      set: 127,
      declare: 187,
      public: 189,
      private: 189,
      protected: 189,
      static: 191,
      abstract: 193,
      override: 195,
      readonly: 201,
      accessor: 203,
      new: 389,
    },
    y1 = { __proto__: null, "<": 143 },
    Fu = or.deserialize({
      version: 14,
      states:
        "$<UO%TQ^OOO%[Q^OOO'_Q`OOP(lOWOOO*zQ08SO'#ChO+RO!bO'#CiO+aO#tO'#CiO+oO?MpO'#D^O.QQ^O'#DdO.bQ^O'#DoO%[Q^O'#DyO0fQ^O'#EROOQ07b'#EZ'#EZO1PQWO'#EWOOQO'#El'#ElOOQO'#Ie'#IeO1XQWO'#GmO1dQWO'#EkO1iQWO'#EkO3kQ08SO'#JiO6[Q08SO'#JjO6xQWO'#FZO6}Q&jO'#FqOOQ07b'#Fc'#FcO7YO,YO'#FcO7hQ7[O'#FxO9UQWO'#FwOOQ07b'#Jj'#JjOOQ07`'#Ji'#JiO9ZQWO'#GqOOQU'#KU'#KUO9fQWO'#IRO9kQ07hO'#ISOOQU'#JW'#JWOOQU'#IW'#IWQ`Q^OOO`Q^OOO%[Q^O'#DqO9sQ^O'#D}O9zQ^O'#EPO9aQWO'#GmO:RQ7[O'#CnO:aQWO'#EjO:lQWO'#EuO:qQ7[O'#FbO;`QWO'#GmOOQO'#KV'#KVO;eQWO'#KVO;sQWO'#GuO;sQWO'#GvO;sQWO'#GxO9aQWO'#G{O<jQWO'#HOO>RQWO'#CdO>cQWO'#H[O>kQWO'#HbO>kQWO'#HdO`Q^O'#HfO>kQWO'#HhO>kQWO'#HkO>pQWO'#HqO>uQ07iO'#HwO%[Q^O'#HyO?QQ07iO'#H{O?]Q07iO'#H}O9kQ07hO'#IPO?hQ08SO'#ChO@jQ`O'#DiQOQWOOO%[Q^O'#EPOAQQWO'#ESO:RQ7[O'#EjOA]QWO'#EjOAhQpO'#FbOOQU'#Cf'#CfOOQ07`'#Dn'#DnOOQ07`'#Jm'#JmO%[Q^O'#JmOOQO'#Jq'#JqOOQO'#Ib'#IbOBhQ`O'#EcOOQ07`'#Eb'#EbOCdQ07pO'#EcOCnQ`O'#EVOOQO'#Jp'#JpODSQ`O'#JqOEaQ`O'#EVOCnQ`O'#EcPEnO!0LbO'#CaPOOO)CDu)CDuOOOO'#IX'#IXOEyO!bO,59TOOQ07b,59T,59TOOOO'#IY'#IYOFXO#tO,59TO%[Q^O'#D`OOOO'#I['#I[OFgO?MpO,59xOOQ07b,59x,59xOFuQ^O'#I]OGYQWO'#JkOI[QrO'#JkO+}Q^O'#JkOIcQWO,5:OOIyQWO'#ElOJWQWO'#JyOJcQWO'#JxOJcQWO'#JxOJkQWO,5;YOJpQWO'#JwOOQ07f,5:Z,5:ZOJwQ^O,5:ZOLxQ08SO,5:eOMiQWO,5:mONSQ07hO'#JvONZQWO'#JuO9ZQWO'#JuONoQWO'#JuONwQWO,5;XON|QWO'#JuO!#UQrO'#JjOOQ07b'#Ch'#ChO%[Q^O'#ERO!#tQpO,5:rOOQO'#Jr'#JrOOQO-E<c-E<cO9aQWO,5=XO!$[QWO,5=XO!$aQ^O,5;VO!&dQ7[O'#EgO!'}QWO,5;VO!)mQ7[O'#DsO!)tQ^O'#DxO!*OQ`O,5;`O!*WQ`O,5;`O%[Q^O,5;`OOQU'#FR'#FROOQU'#FT'#FTO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aO%[Q^O,5;aOOQU'#FX'#FXO!*fQ^O,5;rOOQ07b,5;w,5;wOOQ07b,5;x,5;xO!,iQWO,5;xOOQ07b,5;y,5;yO%[Q^O'#IiO!,qQ07hO,5<eO!&dQ7[O,5;aO!-`Q7[O,5;aO%[Q^O,5;uO!-gQ&jO'#FgO!.dQ&jO'#J}O!.OQ&jO'#J}O!.kQ&jO'#J}OOQO'#J}'#J}O!/PQ&jO,5<POOOS,5<],5<]O!/bQ^O'#FsOOOS'#Ih'#IhO7YO,YO,5;}O!/iQ&jO'#FuOOQ07b,5;},5;}O!0YQMhO'#CuOOQ07b'#Cy'#CyO!0mQWO'#CyO!0rO?MpO'#C}O!1`Q7[O,5<bO!1gQWO,5<dO!3SQ!LQO'#GSO!3aQWO'#GTO!3fQWO'#GTO!3kQ!LQO'#GXO!4jQ`O'#G]OOQO'#Gh'#GhO!(SQ7[O'#GgOOQO'#Gj'#GjO!(SQ7[O'#GiO!5]QMhO'#JdOOQ07b'#Jd'#JdO!5gQWO'#JcO!5uQWO'#JbO!5}QWO'#CtOOQ07b'#Cw'#CwOOQ07b'#DR'#DROOQ07b'#DT'#DTO1SQWO'#DVO!(SQ7[O'#FzO!(SQ7[O'#F|O!6VQWO'#GOO!6[QWO'#GPO!3fQWO'#GVO!(SQ7[O'#G[O!6aQWO'#EmO!7OQWO,5<cOOQ07`'#Cq'#CqO!7WQWO'#EnO!8QQ`O'#EoOOQ07`'#Jw'#JwO!8XQ07hO'#KWO9kQ07hO,5=]O`Q^O,5>mOOQU'#J`'#J`OOQU,5>n,5>nOOQU-E<U-E<UO!:ZQ08SO,5:]O!<wQ08SO,5:iO%[Q^O,5:iO!?bQ08SO,5:kOOQO,5@q,5@qO!@RQ7[O,5=XO!@aQ07hO'#JaO9UQWO'#JaO!@rQ07hO,59YO!@}Q`O,59YO!AVQ7[O,59YO:RQ7[O,59YO!AbQWO,5;VO!AjQWO'#HZO!BOQWO'#KZO%[Q^O,5;zO!7{Q`O,5;|O!BWQWO,5=tO!B]QWO,5=tO!BbQWO,5=tO9kQ07hO,5=tO;sQWO,5=dOOQO'#Cu'#CuO!BpQ`O,5=aO!BxQ7[O,5=bO!CTQWO,5=dO!CYQpO,5=gO!CbQWO'#KVO>pQWO'#HQO9aQWO'#HSO!CgQWO'#HSO:RQ7[O'#HUO!ClQWO'#HUOOQU,5=j,5=jO!CqQWO'#HVO!DSQWO'#CnO!DXQWO,59OO!DcQWO,59OO!FhQ^O,59OOOQU,59O,59OO!FxQ07hO,59OO%[Q^O,59OO!ITQ^O'#H^OOQU'#H_'#H_OOQU'#H`'#H`O`Q^O,5=vO!IkQWO,5=vO`Q^O,5=|O`Q^O,5>OO!IpQWO,5>QO`Q^O,5>SO!IuQWO,5>VO!IzQ^O,5>]OOQU,5>c,5>cO%[Q^O,5>cO9kQ07hO,5>eOOQU,5>g,5>gO!NUQWO,5>gOOQU,5>i,5>iO!NUQWO,5>iOOQU,5>k,5>kO!NZQ`O'#D[O%[Q^O'#JmO!NxQ`O'#JmO# gQ`O'#DjO# xQ`O'#DjO#$ZQ^O'#DjO#$bQWO'#JlO#$jQWO,5:TO#$oQWO'#EpO#$}QWO'#JzO#%VQWO,5;ZO#%[Q`O'#DjO#%iQ`O'#EUOOQ07b,5:n,5:nO%[Q^O,5:nO#%pQWO,5:nO>pQWO,5;UO!@}Q`O,5;UO!AVQ7[O,5;UO:RQ7[O,5;UO#%xQWO,5@XO#%}Q$ISO,5:rOOQO-E<`-E<`O#'TQ07pO,5:}OCnQ`O,5:qO#'_Q`O,5:qOCnQ`O,5:}O!@rQ07hO,5:qOOQ07`'#Ef'#EfOOQO,5:},5:}O%[Q^O,5:}O#'lQ07hO,5:}O#'wQ07hO,5:}O!@}Q`O,5:qOOQO,5;T,5;TO#(VQ07hO,5:}POOO'#IV'#IVP#(kO!0LbO,58{POOO,58{,58{OOOO-E<V-E<VOOQ07b1G.o1G.oOOOO-E<W-E<WO#(vQpO,59zOOOO-E<Y-E<YOOQ07b1G/d1G/dO#({QrO,5>wO+}Q^O,5>wOOQO,5>},5>}O#)VQ^O'#I]OOQO-E<Z-E<ZO#)dQWO,5@VO#)lQrO,5@VO#)sQWO,5@dOOQ07b1G/j1G/jO%[Q^O,5@eO#){QWO'#IcOOQO-E<a-E<aO#)sQWO,5@dOOQ07`1G0t1G0tOOQ07f1G/u1G/uOOQ07f1G0X1G0XO%[Q^O,5@bO#*aQ07hO,5@bO#*rQ07hO,5@bO#*yQWO,5@aO9ZQWO,5@aO#+RQWO,5@aO#+aQWO'#IfO#*yQWO,5@aOOQ07`1G0s1G0sO!*OQ`O,5:tO!*ZQ`O,5:tOOQO,5:v,5:vO#,RQWO,5:vO#,ZQ7[O1G2sO9aQWO1G2sOOQ07b1G0q1G0qO#,iQ08SO1G0qO#-nQ08QO,5;ROOQ07b'#GR'#GRO#.[Q08SO'#JdO!$aQ^O1G0qO#0dQ7[O'#JnO#0nQWO,5:_O#0sQrO'#JoO%[Q^O'#JoO#0}QWO,5:dOOQ07b'#D['#D[OOQ07b1G0z1G0zO%[Q^O1G0zOOQ07b1G1d1G1dO#1SQWO1G0zO#3kQ08SO1G0{O#3rQ08SO1G0{O#6]Q08SO1G0{O#6dQ08SO1G0{O#8nQ08SO1G0{O#9UQ08SO1G0{O#<OQ08SO1G0{O#<VQ08SO1G0{O#>pQ08SO1G0{O#>wQ08SO1G0{O#@oQ08SO1G0{O#CoQ(CYO'#ChO#EmQ(CYO1G1^O#EtQ(CYO'#JjO!,lQWO1G1dO#FUQ08SO,5?TOOQ07`-E<g-E<gO#FxQ08SO1G0{OOQ07b1G0{1G0{O#ITQ08SO1G1aO#IwQ&jO,5<TO#JPQ&jO,5<UO#JXQ&jO'#FlO#JpQWO'#FkOOQO'#KO'#KOOOQO'#Ig'#IgO#JuQ&jO1G1kOOQ07b1G1k1G1kOOOS1G1v1G1vO#KWQ(CYO'#JiO#KbQWO,5<_O!*fQ^O,5<_OOOS-E<f-E<fOOQ07b1G1i1G1iO#KgQ`O'#J}OOQ07b,5<a,5<aO#KoQ`O,5<aOOQ07b,59e,59eO!&dQ7[O'#DPOOOO'#IZ'#IZO#KtO?MpO,59iOOQ07b,59i,59iO%[Q^O1G1|O!6[QWO'#IkO#LPQ7[O,5<uOOQ07b,5<r,5<rO!(SQ7[O'#InO#LoQ7[O,5=RO!(SQ7[O'#IpO#MbQ7[O,5=TO!&dQ7[O,5=VOOQO1G2O1G2OO#MlQpO'#CqO#NPQpO,5<nO#NWQWO'#KRO9aQWO'#KRO#NfQWO,5<pO!(SQ7[O,5<oO#NkQWO'#GUO#NvQWO,5<oO#N{QpO'#GRO$ YQpO'#KSO$ dQWO'#KSO!&dQ7[O'#KSO$ iQWO,5<sO$ nQ`O'#G^O!4eQ`O'#G^O$!PQWO'#G`O$!UQWO'#GbO!3fQWO'#GeO$!ZQ07hO'#ImO$!fQ`O,5<wOOQ07f,5<w,5<wO$!mQ`O'#G^O$!{Q`O'#G_O$#TQ`O'#G_O$#YQ7[O,5=RO$#jQ7[O,5=TOOQ07b,5=W,5=WO!(SQ7[O,5?}O!(SQ7[O,5?}O$#zQWO'#IrO$$VQWO,5?|O$$_QWO,59`O$%OQ7[O,59qOOQ07b,59q,59qO$%qQ7[O,5<fO$&dQ7[O,5<hO@bQWO,5<jOOQ07b,5<k,5<kO$&nQWO,5<qO$&sQ7[O,5<vO$'TQWO'#JuO!$aQ^O1G1}O$'YQWO1G1}O9ZQWO'#JxO9ZQWO'#EpO%[Q^O'#EpO9ZQWO'#ItO$'_Q07hO,5@rOOQU1G2w1G2wOOQU1G4X1G4XOOQ07b1G/w1G/wO!,iQWO1G/wO$)dQ08SO1G0TOOQU1G2s1G2sO!&dQ7[O1G2sO%[Q^O1G2sO#,^QWO1G2sO$+hQ7[O'#EgOOQ07`,5?{,5?{O$+rQ07hO,5?{OOQU1G.t1G.tO!@rQ07hO1G.tO!@}Q`O1G.tO!AVQ7[O1G.tO$,TQWO1G0qO$,YQWO'#ChO$,eQWO'#K[O$,mQWO,5=uO$,rQWO'#K[O$,wQWO'#K[O$-VQWO'#IzO$-eQWO,5@uO$-mQrO1G1fOOQ07b1G1h1G1hO9aQWO1G3`O@bQWO1G3`O$-tQWO1G3`O$-yQWO1G3`OOQU1G3`1G3`O!CTQWO1G3OO!&dQ7[O1G2{O$.OQWO1G2{OOQU1G2|1G2|O!&dQ7[O1G2|O$.TQWO1G2|O$.]Q`O'#GzOOQU1G3O1G3OO!4eQ`O'#IvO!CYQpO1G3ROOQU1G3R1G3ROOQU,5=l,5=lO$.eQ7[O,5=nO9aQWO,5=nO$!UQWO,5=pO9UQWO,5=pO!@}Q`O,5=pO!AVQ7[O,5=pO:RQ7[O,5=pO$.sQWO'#KYO$/OQWO,5=qOOQU1G.j1G.jO$/TQ07hO1G.jO@bQWO1G.jO$/`QWO1G.jO9kQ07hO1G.jO$1eQrO,5@wO$1uQWO,5@wO9ZQWO,5@wO$2QQ^O,5=xO$2XQWO,5=xOOQU1G3b1G3bO`Q^O1G3bOOQU1G3h1G3hOOQU1G3j1G3jO>kQWO1G3lO$2^Q^O1G3nO$6bQ^O'#HmOOQU1G3q1G3qO$6oQWO'#HsO>pQWO'#HuOOQU1G3w1G3wO$6wQ^O1G3wO9kQ07hO1G3}OOQU1G4P1G4POOQ07`'#GY'#GYO9kQ07hO1G4RO9kQ07hO1G4TO$;OQWO,5@XO!*fQ^O,5;[O9ZQWO,5;[O>pQWO,5:UO!*fQ^O,5:UO!@}Q`O,5:UO$;TQ(CYO,5:UOOQO,5;[,5;[O$;_Q`O'#I^O$;uQWO,5@WOOQ07b1G/o1G/oO$;}Q`O'#IdO$<XQWO,5@fOOQ07`1G0u1G0uO# xQ`O,5:UOOQO'#Ia'#IaO$<aQ`O,5:pOOQ07f,5:p,5:pO#%sQWO1G0YOOQ07b1G0Y1G0YO%[Q^O1G0YOOQ07b1G0p1G0pO>pQWO1G0pO!@}Q`O1G0pO!AVQ7[O1G0pOOQ07`1G5s1G5sO!@rQ07hO1G0]OOQO1G0i1G0iO%[Q^O1G0iO$<hQ07hO1G0iO$<sQ07hO1G0iO!@}Q`O1G0]OCnQ`O1G0]O$=RQ07hO1G0iOOQO1G0]1G0]O$=gQ08SO1G0iPOOO-E<T-E<TPOOO1G.g1G.gOOOO1G/f1G/fO$=qQpO,5<eO$=yQrO1G4cOOQO1G4i1G4iO%[Q^O,5>wO$>TQWO1G5qO$>]QWO1G6OO$>eQrO1G6PO9ZQWO,5>}O$>oQ08SO1G5|O%[Q^O1G5|O$?PQ07hO1G5|O$?bQWO1G5{O$?bQWO1G5{O9ZQWO1G5{O$?jQWO,5?QO9ZQWO,5?QOOQO,5?Q,5?QO$@OQWO,5?QO$'TQWO,5?QOOQO-E<d-E<dOOQO1G0`1G0`OOQO1G0b1G0bO!,lQWO1G0bOOQU7+(_7+(_O!&dQ7[O7+(_O%[Q^O7+(_O$@^QWO7+(_O$@iQ7[O7+(_O$@wQ08SO,5=RO$CSQ08SO,5=TO$E_Q08SO,5=RO$GpQ08SO,5=TO$JRQ08SO,59qO$LZQ08SO,5<fO$NfQ08SO,5<hO%!qQ08SO,5<vOOQ07b7+&]7+&]O%%SQ08SO7+&]O%%vQ7[O'#I_O%&QQWO,5@YOOQ07b1G/y1G/yO%&YQ^O'#I`O%&gQWO,5@ZO%&oQrO,5@ZOOQ07b1G0O1G0OO%&yQWO7+&fOOQ07b7+&f7+&fO%'OQ(CYO,5:eO%[Q^O7+&xO%'YQ(CYO,5:]O%'gQ(CYO,5:iO%'qQ(CYO,5:kOOQ07b7+'O7+'OOOQO1G1o1G1oOOQO1G1p1G1pO%'{QtO,5<WO!*fQ^O,5<VOOQO-E<e-E<eOOQ07b7+'V7+'VOOOS7+'b7+'bOOOS1G1y1G1yO%(WQWO1G1yOOQ07b1G1{1G1{O%(]QpO,59kOOOO-E<X-E<XOOQ07b1G/T1G/TO%(dQ08SO7+'hOOQ07b,5?V,5?VO%)WQpO,5?VOOQ07b1G2a1G2aP!&dQ7[O'#IkPOQ07b-E<i-E<iO%)vQ7[O,5?YOOQ07b-E<l-E<lO%*iQ7[O,5?[OOQ07b-E<n-E<nO%*sQpO1G2qOOQ07b1G2Y1G2YO%*zQWO'#IjO%+YQWO,5@mO%+YQWO,5@mO%+bQWO,5@mO%+mQWO,5@mOOQO1G2[1G2[O%+{Q7[O1G2ZO!(SQ7[O1G2ZO%,]Q!LQO'#IlO%,mQWO,5@nO!&dQ7[O,5@nO%,uQpO,5@nOOQ07b1G2_1G2_OOQ07`,5<x,5<xOOQ07`,5<y,5<yO$'TQWO,5<yOC_QWO,5<yO!@}Q`O,5<xOOQO'#Ga'#GaO%-PQWO,5<zOOQ07`,5<|,5<|O$'TQWO,5=POOQO,5?X,5?XOOQO-E<k-E<kOOQ07f1G2c1G2cO!4eQ`O,5<xO%-XQWO,5<yO$!PQWO,5<zO!4eQ`O,5<yO!(SQ7[O'#InO%-{Q7[O1G2mO!(SQ7[O'#IpO%.nQ7[O1G2oO%.xQ7[O1G5iO%/SQ7[O1G5iOOQO,5?^,5?^OOQO-E<p-E<pOOQO1G.z1G.zO!7{Q`O,59sO%[Q^O,59sO%/aQWO1G2UO!(SQ7[O1G2]O%/fQ08SO7+'iOOQ07b7+'i7+'iO!$aQ^O7+'iO%0YQWO,5;[OOQ07`,5?`,5?`OOQ07`-E<r-E<rOOQ07b7+%c7+%cO%0_QpO'#KTO#%sQWO7+(_O%0iQrO7+(_O$@aQWO7+(_O%0pQ08QO'#ChO%1TQ08QO,5<}O%1uQWO,5<}OOQ07`1G5g1G5gOOQU7+$`7+$`O!@rQ07hO7+$`O!@}Q`O7+$`O!$aQ^O7+&]O%1zQWO'#IyO%2cQWO,5@vOOQO1G3a1G3aO9aQWO,5@vO%2cQWO,5@vO%2kQWO,5@vOOQO,5?f,5?fOOQO-E<x-E<xOOQ07b7+'Q7+'QO%2pQWO7+(zO9kQ07hO7+(zO9aQWO7+(zO@bQWO7+(zOOQU7+(j7+(jO%2uQ08QO7+(gO!&dQ7[O7+(gO%3PQpO7+(hOOQU7+(h7+(hO!&dQ7[O7+(hO%3WQWO'#KXO%3cQWO,5=fOOQO,5?b,5?bOOQO-E<t-E<tOOQU7+(m7+(mO%4rQ`O'#HTOOQU1G3Y1G3YO!&dQ7[O1G3YO%[Q^O1G3YO%4yQWO1G3YO%5UQ7[O1G3YO9kQ07hO1G3[O$!UQWO1G3[O9UQWO1G3[O!@}Q`O1G3[O!AVQ7[O1G3[O%5dQWO'#IxO%5xQWO,5@tO%6QQ`O,5@tOOQ07`1G3]1G3]OOQU7+$U7+$UO@bQWO7+$UO9kQ07hO7+$UO%6]QWO7+$UO%[Q^O1G6cO%[Q^O1G6dO%6bQ07hO1G6cO%6lQ^O1G3dO%6sQWO1G3dO%6xQ^O1G3dOOQU7+(|7+(|O9kQ07hO7+)WO`Q^O7+)YOOQU'#K_'#K_OOQU'#I{'#I{O%7PQ^O,5>XOOQU,5>X,5>XO%[Q^O'#HnO%7^QWO'#HpOOQU,5>_,5>_O9ZQWO,5>_OOQU,5>a,5>aOOQU7+)c7+)cOOQU7+)i7+)iOOQU7+)m7+)mOOQU7+)o7+)oO%7cQ`O1G5sO%7wQ(CYO1G0vO%8RQWO1G0vOOQO1G/p1G/pO%8^Q(CYO1G/pO>pQWO1G/pO!*fQ^O'#DjOOQO,5>x,5>xOOQO-E<[-E<[OOQO,5?O,5?OOOQO-E<b-E<bO!@}Q`O1G/pOOQO-E<_-E<_OOQ07f1G0[1G0[OOQ07b7+%t7+%tO#%sQWO7+%tOOQ07b7+&[7+&[O>pQWO7+&[O!@}Q`O7+&[OOQO7+%w7+%wO$=gQ08SO7+&TOOQO7+&T7+&TO%[Q^O7+&TO%8hQ07hO7+&TO!@rQ07hO7+%wO!@}Q`O7+%wO%8sQ07hO7+&TO%9RQ08SO7++hO%[Q^O7++hO%9cQWO7++gO%9cQWO7++gOOQO1G4l1G4lO9ZQWO1G4lO%9kQWO1G4lOOQO7+%|7+%|O#%sQWO<<KyO%0iQrO<<KyO%9yQWO<<KyOOQU<<Ky<<KyO!&dQ7[O<<KyO%[Q^O<<KyO%:RQWO<<KyO%:^Q08SO,5?YO%<iQ08SO,5?[O%>tQ08SO1G2ZO%AVQ08SO1G2mO%CbQ08SO1G2oO%EmQ7[O,5>yOOQO-E<]-E<]O%EwQrO,5>zO%[Q^O,5>zOOQO-E<^-E<^O%FRQWO1G5uOOQ07b<<JQ<<JQO%FZQ(CYO1G0qO%HeQ(CYO1G0{O%HlQ(CYO1G0{O%JpQ(CYO1G0{O%JwQ(CYO1G0{O%LlQ(CYO1G0{O%MSQ(CYO1G0{O& gQ(CYO1G0{O& nQ(CYO1G0{O&#rQ(CYO1G0{O&#yQ(CYO1G0{O&%qQ(CYO1G0{O&&UQ08SO<<JdO&'ZQ(CYO1G0{O&)PQ(CYO'#JdO&+SQ(CYO1G1aO&+aQ(CYO1G0TO!*fQ^O'#FnOOQO'#KP'#KPOOQO1G1r1G1rO&+kQWO1G1qO&+pQ(CYO,5?TOOOS7+'e7+'eOOOO1G/V1G/VOOQ07b1G4q1G4qO!(SQ7[O7+(]O&+zQWO,5?UO9aQWO,5?UOOQO-E<h-E<hO&,YQWO1G6XO&,YQWO1G6XO&,bQWO1G6XO&,mQ7[O7+'uO&,}QpO,5?WO&-XQWO,5?WO!&dQ7[O,5?WOOQO-E<j-E<jO&-^QpO1G6YO&-hQWO1G6YOOQ07`1G2e1G2eO$'TQWO1G2eOOQ07`1G2d1G2dO&-pQWO1G2fO!&dQ7[O1G2fOOQ07`1G2k1G2kO!@}Q`O1G2dOC_QWO1G2eO&-uQWO1G2fO&-}QWO1G2eO&.qQ7[O,5?YOOQ07b-E<m-E<mO&/dQ7[O,5?[OOQ07b-E<o-E<oO!(SQ7[O7++TOOQ07b1G/_1G/_O&/nQWO1G/_OOQ07b7+'p7+'pO&/sQ7[O7+'wO&0TQ08SO<<KTOOQ07b<<KT<<KTO&0wQWO1G0vO!&dQ7[O'#IsO&0|QWO,5@oO!&dQ7[O1G2iOOQU<<Gz<<GzO!@rQ07hO<<GzO&1UQ08SO<<IwOOQ07b<<Iw<<IwOOQO,5?e,5?eO&1xQWO,5?eO&1}QWO,5?eOOQO-E<w-E<wO&2]QWO1G6bO&2]QWO1G6bO9aQWO1G6bO@bQWO<<LfOOQU<<Lf<<LfO&2eQWO<<LfO9kQ07hO<<LfOOQU<<LR<<LRO%2uQ08QO<<LROOQU<<LS<<LSO%3PQpO<<LSO&2jQ`O'#IuO&2uQWO,5@sO!*fQ^O,5@sOOQU1G3Q1G3QO&2}Q^O'#JmOOQO'#Iw'#IwO9kQ07hO'#IwO&3XQ`O,5=oOOQU,5=o,5=oO&3`Q`O'#EcO&3tQWO7+(tO&3yQWO7+(tOOQU7+(t7+(tO!&dQ7[O7+(tO%[Q^O7+(tO&4RQWO7+(tOOQU7+(v7+(vO9kQ07hO7+(vO$!UQWO7+(vO9UQWO7+(vO!@}Q`O7+(vO&4^QWO,5?dOOQO-E<v-E<vOOQO'#HW'#HWO&4iQWO1G6`O9kQ07hO<<GpOOQU<<Gp<<GpO@bQWO<<GpO&4qQWO7++}O&4vQWO7+,OO%[Q^O7++}O%[Q^O7+,OOOQU7+)O7+)OO&4{QWO7+)OO&5QQ^O7+)OO&5XQWO7+)OOOQU<<Lr<<LrOOQU<<Lt<<LtOOQU-E<y-E<yOOQU1G3s1G3sO&5^QWO,5>YOOQU,5>[,5>[O&5cQWO1G3yO9ZQWO7+&bO!*fQ^O7+&bOOQO7+%[7+%[O&5hQ(CYO1G6PO>pQWO7+%[OOQ07b<<I`<<I`OOQ07b<<Iv<<IvO>pQWO<<IvOOQO<<Io<<IoO$=gQ08SO<<IoO%[Q^O<<IoOOQO<<Ic<<IcO!@rQ07hO<<IcO&5rQ07hO<<IoO&5}Q08SO<= SO&6_QWO<= ROOQO7+*W7+*WO9ZQWO7+*WOOQUANAeANAeO&6gQWOANAeO!&dQ7[OANAeO#%sQWOANAeO%0iQrOANAeO%[Q^OANAeO&6oQ08SO7+'uO&9QQ08SO,5?YO&;]Q08SO,5?[O&=hQ08SO7+'wO&?yQrO1G4fO&@TQ(CYO7+&]O&BXQ(CYO,5=RO&D`Q(CYO,5=TO&DpQ(CYO,5=RO&EQQ(CYO,5=TO&EbQ(CYO,59qO&GeQ(CYO,5<fO&IhQ(CYO,5<hO&KkQ(CYO,5<vO&MaQ(CYO7+'hO&MnQ(CYO7+'iO&M{QWO,5<YOOQO7+']7+']O&NQQ7[O<<KwOOQO1G4p1G4pO&NXQWO1G4pO&NdQWO1G4pO&NrQWO7++sO&NrQWO7++sO!&dQ7[O1G4rO&NzQpO1G4rO' UQWO7++tOOQ07`7+(P7+(PO$'TQWO7+(QO' ^QpO7+(QOOQ07`7+(O7+(OO$'TQWO7+(PO' eQWO7+(QO!&dQ7[O7+(QOC_QWO7+(PO' jQ7[O<<NoOOQ07b7+$y7+$yO' tQpO,5?_OOQO-E<q-E<qO'!OQ08QO7+(TOOQUAN=fAN=fO9aQWO1G5POOQO1G5P1G5PO'!`QWO1G5PO'!eQWO7++|O'!eQWO7++|O9kQ07hOANBQO@bQWOANBQOOQUANBQANBQOOQUANAmANAmOOQUANAnANAnO'!mQWO,5?aOOQO-E<s-E<sO'!xQ(CYO1G6_O'%YQrO'#ChOOQO,5?c,5?cOOQO-E<u-E<uOOQU1G3Z1G3ZO&2}Q^O,5<zOOQU<<L`<<L`O!&dQ7[O<<L`O&3tQWO<<L`O'%dQWO<<L`O%[Q^O<<L`OOQU<<Lb<<LbO9kQ07hO<<LbO$!UQWO<<LbO9UQWO<<LbO'%lQ`O1G5OO'%wQWO7++zOOQUAN=[AN=[O9kQ07hOAN=[OOQU<= i<= iOOQU<= j<= jO'&PQWO<= iO'&UQWO<= jOOQU<<Lj<<LjO'&ZQWO<<LjO'&`Q^O<<LjOOQU1G3t1G3tO>pQWO7+)eO'&gQWO<<I|O'&rQ(CYO<<I|OOQO<<Hv<<HvOOQ07bAN?bAN?bOOQOAN?ZAN?ZO$=gQ08SOAN?ZOOQOAN>}AN>}O%[Q^OAN?ZOOQO<<Mr<<MrOOQUG27PG27PO!&dQ7[OG27PO#%sQWOG27PO'&|QWOG27PO%0iQrOG27PO''UQ(CYO<<JdO''cQ(CYO1G2ZO')XQ(CYO,5?YO'+[Q(CYO,5?[O'-_Q(CYO1G2mO'/bQ(CYO1G2oO'1eQ(CYO<<KTO'1rQ(CYO<<IwOOQO1G1t1G1tO!(SQ7[OANAcOOQO7+*[7+*[O'2PQWO7+*[O'2[QWO<= _O'2dQpO7+*^OOQ07`<<Kl<<KlO$'TQWO<<KlOOQ07`<<Kk<<KkO'2nQpO<<KlO$'TQWO<<KkOOQO7+*k7+*kO9aQWO7+*kO'2uQWO<= hOOQUG27lG27lO9kQ07hOG27lO!*fQ^O1G4{O'2}QWO7++yO&3tQWOANAzOOQUANAzANAzO!&dQ7[OANAzO'3VQWOANAzOOQUANA|ANA|O9kQ07hOANA|O$!UQWOANA|OOQO'#HX'#HXOOQO7+*j7+*jOOQUG22vG22vOOQUANETANETOOQUANEUANEUOOQUANBUANBUO'3_QWOANBUOOQU<<MP<<MPO!*fQ^OAN?hOOQOG24uG24uO$=gQ08SOG24uO#%sQWOLD,kOOQULD,kLD,kO!&dQ7[OLD,kO'3dQWOLD,kO'3lQ(CYO7+'uO'5bQ(CYO,5?YO'7eQ(CYO,5?[O'9hQ(CYO7+'wO';^Q7[OG26}OOQO<<Mv<<MvOOQ07`ANAWANAWO$'TQWOANAWOOQ07`ANAVANAVOOQO<<NV<<NVOOQULD-WLD-WO';nQ(CYO7+*gOOQUG27fG27fO&3tQWOG27fO!&dQ7[OG27fOOQUG27hG27hO9kQ07hOG27hOOQUG27pG27pO';xQ(CYOG25SOOQOLD*aLD*aOOQU!$(!V!$(!VO#%sQWO!$(!VO!&dQ7[O!$(!VO'<SQ08SOG26}OOQ07`G26rG26rOOQULD-QLD-QO&3tQWOLD-QOOQULD-SLD-SOOQU!)9Eq!)9EqO#%sQWO!)9EqOOQU!$(!l!$(!lOOQU!.K;]!.K;]O'>eQ(CYOG26}O!*fQ^O'#DyO1PQWO'#EWO'@ZQrO'#JiO!*fQ^O'#DqO'@bQ^O'#D}O'@iQrO'#ChO'CPQrO'#ChO!*fQ^O'#EPO'CaQ^O,5;VO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O,5;aO!*fQ^O'#IiO'EdQWO,5<eO'ElQ7[O,5;aO'GVQ7[O,5;aO!*fQ^O,5;uO!&dQ7[O'#GgO'ElQ7[O'#GgO!&dQ7[O'#GiO'ElQ7[O'#GiO1SQWO'#DVO1SQWO'#DVO!&dQ7[O'#FzO'ElQ7[O'#FzO!&dQ7[O'#F|O'ElQ7[O'#F|O!&dQ7[O'#G[O'ElQ7[O'#G[O!*fQ^O,5:iO!*fQ^O,5@eO'CaQ^O1G0qO'G^Q(CYO'#ChO!*fQ^O1G1|O!&dQ7[O'#InO'ElQ7[O'#InO!&dQ7[O'#IpO'ElQ7[O'#IpO!&dQ7[O,5<oO'ElQ7[O,5<oO'CaQ^O1G1}O!*fQ^O7+&xO!&dQ7[O1G2ZO'ElQ7[O1G2ZO!&dQ7[O'#InO'ElQ7[O'#InO!&dQ7[O'#IpO'ElQ7[O'#IpO!&dQ7[O1G2]O'ElQ7[O1G2]O'CaQ^O7+'iO'CaQ^O7+&]O!&dQ7[OANAcO'ElQ7[OANAcO'GhQWO'#EkO'GmQWO'#EkO'GuQWO'#FZO'GzQWO'#EuO'HPQWO'#JyO'H[QWO'#JwO'HgQWO,5;VO'HlQ7[O,5<bO'HsQWO'#GTO'HxQWO'#GTO'H}QWO,5<cO'IVQWO,5;VO'I_Q(CYO1G1^O'IfQWO,5<oO'IkQWO,5<oO'IpQWO,5<qO'IuQWO,5<qO'IzQWO1G1}O'JPQWO1G0qO'JUQ7[O<<KwO'J]Q7[O<<KwO7hQ7[O'#FxO9UQWO'#FwOA]QWO'#EjO!*fQ^O,5;rO!3fQWO'#GTO!3fQWO'#GTO!3fQWO'#GVO!3fQWO'#GVO!(SQ7[O7+(]O!(SQ7[O7+(]O%*sQpO1G2qO%*sQpO1G2qO!&dQ7[O,5=VO!&dQ7[O,5=V",
      stateData:
        "'Ka~O'tOS'uOSSOS'vRQ~OPYOQYORfOX!VO`qOczOdyOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![XO!fuO!kZO!nYO!oYO!pYO!rvO!twO!wxO!{]O#s!PO$T|O%b}O%d!QO%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO%s!UO&P!WO&V!XO&X!YO&Z!ZO&]![O&`!]O&f!^O&l!_O&n!`O&p!aO&r!bO&t!cO'{SO'}TO(QUO(XVO(g[O(tiO~OVtO~P`OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~O`!vOo!nO!P!oO!_!xO!`!uO!a!uO!{:dO#P!pO#Q!pO#R!wO#S!pO#T!pO#W!yO#X!yO'|!lO'}TO(QUO([!mO(g!sO~O'v!zO~OP[XZ[X`[Xn[X|[X}[X!P[X!Y[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X'r[X(X[X(h[X(o[X(p[X~O!d$|X~P(qO^!|O'}#OO(O!|O(P#OO~O^#PO(P#OO(Q#OO(R#PO~Ot#RO!R#SO(Y#SO(Z#UO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{:hO'}TO(QUO(XVO(g[O(tiO~O!X#YO!Y#VO!V(_P!V(lP~P+}O!Z#bO~P`OPYOQYORfOc!jOd!iOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'}TO(QUO(XVO(g[O(tiO~Ol#lO!X#hO!{]O#e#kO#f#hO'{:iO!j(iP~P.iO!k#nO'{#mO~O!w#rO!{]O%b#sO~O#g#tO~O!d#uO#g#tO~OP$]OZ$dOn$QO|#yO}#zO!P#{O!Y$aO!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O`(]X'r(]X'p(]X!j(]X!V(]X![(]X%c(]X!d(]X~P1qO#[$eO$O$eOP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#r(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X![(^X%c(^X~O`(^X!i(^X'r(^X'p(^X!V(^X!j(^Xr(^X!d(^X~P4XO#[$eO~O$Y$gO$[$fO$c$lO~ORfO![$mO$f$nO$h$pO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz%ZO!P${O![$|O!f%`O!k$xO#f%aO$T%^O$o%[O$q%]O$t%_O'{$rO'}TO(QUO(X$uO(o$}O(p%POf(UP~O!k%bO~O!P%eO![%fO'{%dO~O!d%jO~O`%kO'r%kO~O'|!lO~P%[O%h%rO~P%[Og%VO!k%bO'{%dO'|!lO~Od%yO!k%bO'{%dO~O#r$SO~O|&OO![%{O!k%}O%d&RO'{%dO'|!lO'}TO(QUO_(}P~O!w#rO~O%m&TO!P(yX![(yX'{(yX~O'{&UO~O!t&ZO#s!PO%d!QO%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO~Oc&`Od&_O!w&]O%b&^O%u&[O~P;xOc&cOdyO![&bO!t&ZO!wxO!{]O#s!PO%b}O%f!OO%g!OO%h!OO%k!RO%m!SO%p!TO%q!TO%s!UO~Oa&fO#[&iO%d&dO'|!lO~P<}O!k&jO!t&nO~O!k#nO~O![XO~O`%kO'q&vO'r%kO~O`%kO'q&yO'r%kO~O`%kO'q&{O'r%kO~O'p[X!V[Xr[X!j[X&T[X![[X%c[X!d[X~P(qO!_'YO!`'RO!a'RO'|!lO'}TO(QUO~Oo'PO!P'OO!X'SO([&}O!Z(`P!Z(nP~P@UOj']O!['ZO'{%dO~Od'bO!k%bO'{%dO~O|&OO!k%}O~Oo!nO!P!oO!{:dO#P!pO#Q!pO#S!pO#T!pO'|!lO'}TO(QUO([!mO(g!sO~O!_'hO!`'gO!a'gO#R!pO#W'iO#X'iO~PApO`%kOg%VO!d#uO!k%bO'r%kO(h'kO~O!o'oO#['mO~PCOOo!nO!P!oO'}TO(QUO([!mO(g!sO~O![XOo(eX!P(eX!_(eX!`(eX!a(eX!{(eX#P(eX#Q(eX#R(eX#S(eX#T(eX#W(eX#X(eX'|(eX'}(eX(Q(eX([(eX(g(eX~O!`'gO!a'gO'|!lO~PCnO'w'sO'x'sO'y'uO~O^!|O'}'wO(O!|O(P'wO~O^#PO(P'wO(Q'wO(R#PO~Ot#RO!R#SO(Y#SO(Z'{O~O!X'}O!V'PX!V'VX!Y'PX!Y'VX~P+}O!Y(PO!V(_X~OP$]OZ$dOn$QO|#yO}#zO!P#{O!Y(PO!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O!V(_X~PGbO!V(UO~O!V(kX!Y(kX!d(kX!j(kX(h(kX~O#[(kX#g#`X!Z(kX~PIhO#[(VO!V(mX!Y(mX~O!Y(WO!V(lX~O!V(ZO~O#[$eO~PIhO!Z([O~P`O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!maZ!man!ma!Y!ma!h!ma!o!ma#j!ma#k!ma#l!ma#m!ma#n!ma#o!ma#p!ma#q!ma#r!ma#t!ma#v!ma#x!ma#y!ma(h!ma(o!ma(p!ma~O`!ma'r!ma'p!ma!V!ma!j!mar!ma![!ma%c!ma!d!ma~PKOO!j(]O~O!d#uO#[(^O(h'kO!Y(jX`(jX'r(jX~O!j(jX~PMnO!P%eO![%fO!{]O#e(cO#f(bO'{%dO~O!Y(dO!j(iX~O!j(fO~O!P%eO![%fO#f(bO'{%dO~OP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!i(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#r(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X~O!d#uO!j(^X~P! [O|(gO}(hO!i#wO!k#xO!{!za!P!za~O!w!za%b!za![!za#e!za#f!za'{!za~P!#`O!w(lO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![XO!fuO!kZO!nYO!oYO!pYO!rvO!t!gO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~O#g(rO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz%ZO!P${O![$|O!f%`O!k$xO#f%aO$T%^O$o%[O$q%]O$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~Of(bP~P!(SO!X(vO!j(cP~P%[O([(xO(g[O~O!P(zO!k#xO([(xO(g[O~OP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![!eO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'{)YO'}TO(QUO(XVO(g[O(t<YO~O})]O!k#xO~O!Y$aO`$ma'r$ma'p$ma!j$ma!V$ma![$ma%c$ma!d$ma~O#s)aO~P!&dO|)dO!d)cO![$ZX$W$ZX$Y$ZX$[$ZX$c$ZX~O!d)cO![(qX$W(qX$Y(qX$[(qX$c(qX~O|)dO~P!.OO|)dO![(qX$W(qX$Y(qX$[(qX$c(qX~O![)fO$W)jO$Y)eO$[)eO$c)kO~O!X)nO~P!*fO$Y$gO$[$fO$c)rO~Oj$uX|$uX!P$uX!i$uX(o$uX(p$uX~OfiXf$uXjiX!YiX#[iX~P!/tOo)tO~Ot)uO(Y)vO(Z)xO~Oj*RO|)zO!P){O(o$}O(p%PO~Of)yO~P!0}Of*SO~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'}TO(QUO(X$uO(o$}O(p%PO~O!X*WO'{*TO!j(uP~P!1lO#g*YO~O!k*ZO~O!X*`O'{*]O!V(vP~P!1lOn*lO!P*dO!_*jO!`*cO!a*cO!k*ZO#W*kO%Y*fO'|!lO([!mO~O!Z*iO~P!3xO!i#wOj(WX|(WX!P(WX(o(WX(p(WX!Y(WX#[(WX~Of(WX#|(WX~P!4qOj*qO#[*pOf(VX!Y(VX~O!Y*rOf(UX~O'{&UOf(UP~O!k*yO~O'{(pO~Ol*}O!P%eO!X#hO![%fO!{]O#e#kO#f#hO'{%dO!j(iP~O!d#uO#g+OO~O!P%eO!X+QO!Y(WO![%fO'{%dO!V(lP~Oo'VO!P+SO!X+RO'}TO(QUO([(xO~O!Z(nP~P!7lO!Y+TO`(zX'r(zX~OP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO#y$YO(XVO(h$ZO(o#|O(p#}O~O`!ea!Y!ea'r!ea'p!ea!V!ea!j!ear!ea![!ea%c!ea!d!ea~P!8dO|#yO}#zO!P#{O!i#wO!k#xO(XVOP!qaZ!qan!qa!Y!qa!h!qa!o!qa#j!qa#k!qa#l!qa#m!qa#n!qa#o!qa#p!qa#q!qa#r!qa#t!qa#v!qa#x!qa#y!qa(h!qa(o!qa(p!qa~O`!qa'r!qa'p!qa!V!qa!j!qar!qa![!qa%c!qa!d!qa~P!:}O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!saZ!san!sa!Y!sa!h!sa!o!sa#j!sa#k!sa#l!sa#m!sa#n!sa#o!sa#p!sa#q!sa#r!sa#t!sa#v!sa#x!sa#y!sa(h!sa(o!sa(p!sa~O`!sa'r!sa'p!sa!V!sa!j!sar!sa![!sa%c!sa!d!sa~P!=hOg%VOj+^O!['ZO%c+]O~O!d+`O`(TX![(TX'r(TX!Y(TX~O`%kO![XO'r%kO~Og%VO!k%bO~Og%VO!k%bO'{%dO~O!d#uO#g(rO~Oa+kO%d+lO'{+hO'}TO(QUO!Z)OP~O!Y+mO_(}X~OZ+qO~O_+rO~O![%{O'{%dO'|!lO_(}P~Og%VO#[+wO~Og%VOj+zO![$|O~O![+|O~O|,OO![XO~O%h%rO~O!w,TO~Od,YO~Oa,ZO'{#mO'}TO(QUO!Z(|P~Od%yO~O%d!QO'{&UO~P<}OZ,`O_,_O~OPYOQYORfOczOdyOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO!fuO!kZO!nYO!oYO!pYO!rvO!wxO!{]O%b}O'}TO(QUO(XVO(g[O(tiO~O![!eO!t!gO$T!kO'{!dO~P!DkO_,_O`%kO'r%kO~OPYOQYORfOc!jOd!iOlkOnYOokOpkOvkOxYOzYO!PWO!TkO!UkO![!eO!fuO!kZO!nYO!oYO!pYO!rvO!w!hO$T!kO'{!dO'}TO(QUO(XVO(g[O(tiO~O`,eO!twO#s!OO%f!OO%g!OO%h!OO~P!GTO!k&jO~O&V,kO~O![,mO~O&h,oO&j,pOP&eaQ&eaR&eaX&ea`&eac&ead&eal&ean&eao&eap&eav&eax&eaz&ea!P&ea!T&ea!U&ea![&ea!f&ea!k&ea!n&ea!o&ea!p&ea!r&ea!t&ea!w&ea!{&ea#s&ea$T&ea%b&ea%d&ea%f&ea%g&ea%h&ea%k&ea%m&ea%p&ea%q&ea%s&ea&P&ea&V&ea&X&ea&Z&ea&]&ea&`&ea&f&ea&l&ea&n&ea&p&ea&r&ea&t&ea'p&ea'{&ea'}&ea(Q&ea(X&ea(g&ea(t&ea!Z&ea&^&eaa&ea&c&ea~O'{,uO~Og!bX!Y!OX!Y!bX!Z!OX!Z!bX!d!OX!d!bX!k!bX#[!OX~O!d,zO#[,yOg(aX!Y#dX!Y(aX!Z#dX!Z(aX!d(aX!k(aX~Og%VO!d,|O!k%bO!Y!^X!Z!^X~Oo!nO!P!oO'}TO(QUO([!mO~OP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![!eO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'}TO(QUO(XVO(g[O(t<YO~O'{;]O~P#!ZO!Y-QO!Z(`X~O!Z-SO~O!d,zO#[,yO!Y#dX!Z#dX~O!Y-TO!Z(nX~O!Z-VO~O!`-WO!a-WO'|!lO~P# xO!Z-ZO~P'_Oj-^O!['ZO~O!V-cO~Oo!za!_!za!`!za!a!za#P!za#Q!za#R!za#S!za#T!za#W!za#X!za'|!za'}!za(Q!za([!za(g!za~P!#`O!o-hO#[-fO~PCOO!`-jO!a-jO'|!lO~PCnO`%kO#[-fO'r%kO~O`%kO!d#uO#[-fO'r%kO~O`%kO!d#uO!o-hO#[-fO'r%kO(h'kO~O'w'sO'x'sO'y-oO~Or-pO~O!V'Pa!Y'Pa~P!8dO!X-tO!V'PX!Y'PX~P%[O!Y(PO!V(_a~O!V(_a~PGbO!Y(WO!V(la~O!P%eO!X-xO![%fO'{%dO!V'VX!Y'VX~O#[-zO!Y(ja!j(ja`(ja'r(ja~O!d#uO~P#*aO!Y(dO!j(ia~O!P%eO![%fO#f.OO'{%dO~Ol.TO!P%eO!X.QO![%fO!{]O#e.SO#f.QO'{%dO!Y'YX!j'YX~O}.XO!k#xO~Og%VOj.[O!['ZO%c.ZO~O`#_i!Y#_i'r#_i'p#_i!V#_i!j#_ir#_i![#_i%c#_i!d#_i~P!8dOj<fO|)zO!P){O(o$}O(p%PO~O#g#Za`#Za#[#Za'r#Za!Y#Za!j#Za![#Za!V#Za~P#-]O#g(WXP(WXZ(WX`(WXn(WX}(WX!h(WX!k(WX!o(WX#j(WX#k(WX#l(WX#m(WX#n(WX#o(WX#p(WX#q(WX#r(WX#t(WX#v(WX#x(WX#y(WX'r(WX(X(WX(h(WX!j(WX!V(WX'p(WXr(WX![(WX%c(WX!d(WX~P!4qO!Y.iOf(bX~P!0}Of.kO~O!Y.lO!j(cX~P!8dO!j.oO~O!V.qO~OP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O(XVOZ#ii`#iin#ii!Y#ii!h#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O#j#ii~P#1XO#j$OO~P#1XOP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO(XVOZ#ii`#ii!Y#ii!h#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~On#ii~P#3yOn$QO~P#3yOP$]On$QO|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO(XVO`#ii!Y#ii#t#ii#v#ii#x#ii#y#ii'r#ii(h#ii(o#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~OZ#ii!h#ii#o#ii#p#ii#q#ii#r#ii~P#6kOZ$dO!h$SO#o$SO#p$SO#q$cO#r$SO~P#6kOP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO(XVO`#ii!Y#ii#v#ii#x#ii#y#ii'r#ii(h#ii(p#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O(o#ii~P#9lO(o#|O~P#9lOP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO(XVO(o#|O`#ii!Y#ii#x#ii#y#ii'r#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~O(p#ii~P#<^O(p#}O~P#<^OP$]OZ$dOn$QO|#yO}#zO!P#{O!h$SO!i#wO!k#xO!o$]O#j$OO#k$PO#l$PO#m$PO#n$RO#o$SO#p$SO#q$cO#r$SO#t$TO#v$VO#x$XO(XVO(o#|O(p#}O~O`#ii!Y#ii#y#ii'r#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~P#?OOP[XZ[Xn[X|[X}[X!P[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X!Y[X!Z[X~O#|[X~P#AiOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO#v:sO#x:uO#y:vO(XVO(h$ZO(o#|O(p#}O~O#|.sO~P#CvO#[:{O$O:{O#|(^X!Z(^X~P! [O`']a!Y']a'r']a'p']a!j']a!V']ar']a![']a%c']a!d']a~P!8dOP#iiZ#ii`#iin#ii}#ii!Y#ii!h#ii!i#ii!k#ii!o#ii#j#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii'r#ii(X#ii(h#ii'p#ii!V#ii!j#iir#ii![#ii%c#ii!d#ii~P#-]O`#}i!Y#}i'r#}i'p#}i!V#}i!j#}ir#}i![#}i%c#}i!d#}i~P!8dO$Y.xO$[.xO~O$Y.yO$[.yO~O!d)cO#[.zO![$`X$W$`X$Y$`X$[$`X$c$`X~O!X.{O~O![)fO$W.}O$Y)eO$[)eO$c/OO~O!Y:wO!Z(]X~P#CvO!Z/PO~O!d)cO$c(qX~O$c/RO~Ot)uO(Y)vO(Z/UO~O!V/YO~P!&dO(o$}Oj%Za|%Za!P%Za(p%Za!Y%Za#[%Za~Of%Za#|%Za~P#LWO(p%POj%]a|%]a!P%]a(o%]a!Y%]a#[%]a~Of%]a#|%]a~P#LyO!YeX!deX!jeX!j$uX(heX~P!/tO!j/bO~P#-]O!Y/cO!d#uO(h'kO!j(uX~O!j/hO~O!X*WO'{%dO!j(uP~O#g/jO~O!V$uX!Y$uX!d$|X~P!/tO!Y/kO!V(vX~P#-]O!d/mO~O!V/oO~Og%VOn/sO!d#uO!k%bO(h'kO~O'{/uO~O!d+`O~O`%kO!Y/yO'r%kO~O!Z/{O~P!3xO!`/|O!a/|O'|!lO([!mO~O!P0OO([!mO~O#W0PO~Of%Za!Y%Za#[%Za#|%Za~P!0}Of%]a!Y%]a#[%]a#|%]a~P!0}O'{&UOf'fX!Y'fX~O!Y*rOf(Ua~Of0YO~O|0ZO}0ZO!P0[Ojya(oya(pya!Yya#[ya~Ofya#|ya~P$$dO|)zO!P){Oj$na(o$na(p$na!Y$na#[$na~Of$na#|$na~P$%YO|)zO!P){Oj$pa(o$pa(p$pa!Y$pa#[$pa~Of$pa#|$pa~P$%{O#g0^O~Of%Oa!Y%Oa#[%Oa#|%Oa~P!0}O!d#uO~O#g0aO~O!Y+TO`(za'r(za~O|#yO}#zO!P#{O!i#wO!k#xO(XVOP!qiZ!qin!qi!Y!qi!h!qi!o!qi#j!qi#k!qi#l!qi#m!qi#n!qi#o!qi#p!qi#q!qi#r!qi#t!qi#v!qi#x!qi#y!qi(h!qi(o!qi(p!qi~O`!qi'r!qi'p!qi!V!qi!j!qir!qi![!qi%c!qi!d!qi~P$'jOg%VOn$tOo$sOp$sOv%XOx%YOz;QO!P${O![$|O!f<`O!k$xO#f;WO$T%^O$o;SO$q;UO$t%_O'}TO(QUO(X$uO(o$}O(p%PO~Ol0kO'{0jO~P$*TO!d+`O`(Ta![(Ta'r(Ta!Y(Ta~O#g0qO~OZ[X!YeX!ZeX~O!Y0rO!Z)OX~O!Z0tO~OZ0uO~Oa0wO'{+hO'}TO(QUO~O![%{O'{%dO_'nX!Y'nX~O!Y+mO_(}a~O!j0zO~P!8dOZ0}O~O_1OO~O#[1RO~Oj1UO![$|O~O([(xO!Z({P~Og%VOj1_O![1[O%c1^O~OZ1iO!Y1gO!Z(|X~O!Z1jO~O_1lO`%kO'r%kO~O'{#mO'}TO(QUO~O#[$eO$O$eOP(^XZ(^Xn(^X|(^X}(^X!P(^X!Y(^X!h(^X!k(^X!o(^X#j(^X#k(^X#l(^X#m(^X#n(^X#o(^X#p(^X#q(^X#t(^X#v(^X#x(^X#y(^X(X(^X(h(^X(o(^X(p(^X~O#r1oO&T1pO`(^X!i(^X~P$/kO#[$eO#r1oO&T1pO~O`1rO~P%[O`1tO~O&^1wOP&[iQ&[iR&[iX&[i`&[ic&[id&[il&[in&[io&[ip&[iv&[ix&[iz&[i!P&[i!T&[i!U&[i![&[i!f&[i!k&[i!n&[i!o&[i!p&[i!r&[i!t&[i!w&[i!{&[i#s&[i$T&[i%b&[i%d&[i%f&[i%g&[i%h&[i%k&[i%m&[i%p&[i%q&[i%s&[i&P&[i&V&[i&X&[i&Z&[i&]&[i&`&[i&f&[i&l&[i&n&[i&p&[i&r&[i&t&[i'p&[i'{&[i'}&[i(Q&[i(X&[i(g&[i(t&[i!Z&[ia&[i&c&[i~Oa1}O!Z1{O&c1|O~P`O![XO!k2PO~O&j,pOP&eiQ&eiR&eiX&ei`&eic&eid&eil&ein&eio&eip&eiv&eix&eiz&ei!P&ei!T&ei!U&ei![&ei!f&ei!k&ei!n&ei!o&ei!p&ei!r&ei!t&ei!w&ei!{&ei#s&ei$T&ei%b&ei%d&ei%f&ei%g&ei%h&ei%k&ei%m&ei%p&ei%q&ei%s&ei&P&ei&V&ei&X&ei&Z&ei&]&ei&`&ei&f&ei&l&ei&n&ei&p&ei&r&ei&t&ei'p&ei'{&ei'}&ei(Q&ei(X&ei(g&ei(t&ei!Z&ei&^&eia&ei&c&ei~O!V2VO~O!Y!^a!Z!^a~P#CvOo!nO!P!oO!X2]O([!mO!Y'QX!Z'QX~P@UO!Y-QO!Z(`a~O!Y'WX!Z'WX~P!7lO!Y-TO!Z(na~O!Z2dO~P'_O`%kO#[2mO'r%kO~O`%kO!d#uO#[2mO'r%kO~O`%kO!d#uO!o2qO#[2mO'r%kO(h'kO~O`%kO'r%kO~P!8dO!Y$aOr$ma~O!V'Pi!Y'Pi~P!8dO!Y(PO!V(_i~O!Y(WO!V(li~O!V(mi!Y(mi~P!8dO!Y(ji!j(ji`(ji'r(ji~P!8dO#[2sO!Y(ji!j(ji`(ji'r(ji~O!Y(dO!j(ii~O!P%eO![%fO!{]O#e2xO#f2wO'{%dO~O!P%eO![%fO#f2wO'{%dO~Oj3PO!['ZO%c3OO~Og%VOj3PO!['ZO%c3OO~O#g%ZaP%ZaZ%Za`%Zan%Za}%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za'r%Za(X%Za(h%Za!j%Za!V%Za'p%Zar%Za![%Za%c%Za!d%Za~P#LWO#g%]aP%]aZ%]a`%]an%]a}%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a'r%]a(X%]a(h%]a!j%]a!V%]a'p%]ar%]a![%]a%c%]a!d%]a~P#LyO#g%ZaP%ZaZ%Za`%Zan%Za}%Za!Y%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za'r%Za(X%Za(h%Za!j%Za!V%Za'p%Za#[%Zar%Za![%Za%c%Za!d%Za~P#-]O#g%]aP%]aZ%]a`%]an%]a}%]a!Y%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a'r%]a(X%]a(h%]a!j%]a!V%]a'p%]a#[%]ar%]a![%]a%c%]a!d%]a~P#-]O#gyaPyaZya`yanya!hya!iya!kya!oya#jya#kya#lya#mya#nya#oya#pya#qya#rya#tya#vya#xya#yya'rya(Xya(hya!jya!Vya'pyarya![ya%cya!dya~P$$dO#g$naP$naZ$na`$nan$na}$na!h$na!i$na!k$na!o$na#j$na#k$na#l$na#m$na#n$na#o$na#p$na#q$na#r$na#t$na#v$na#x$na#y$na'r$na(X$na(h$na!j$na!V$na'p$nar$na![$na%c$na!d$na~P$%YO#g$paP$paZ$pa`$pan$pa}$pa!h$pa!i$pa!k$pa!o$pa#j$pa#k$pa#l$pa#m$pa#n$pa#o$pa#p$pa#q$pa#r$pa#t$pa#v$pa#x$pa#y$pa'r$pa(X$pa(h$pa!j$pa!V$pa'p$par$pa![$pa%c$pa!d$pa~P$%{O#g%OaP%OaZ%Oa`%Oan%Oa}%Oa!Y%Oa!h%Oa!i%Oa!k%Oa!o%Oa#j%Oa#k%Oa#l%Oa#m%Oa#n%Oa#o%Oa#p%Oa#q%Oa#r%Oa#t%Oa#v%Oa#x%Oa#y%Oa'r%Oa(X%Oa(h%Oa!j%Oa!V%Oa'p%Oa#[%Oar%Oa![%Oa%c%Oa!d%Oa~P#-]O`#_q!Y#_q'r#_q'p#_q!V#_q!j#_qr#_q![#_q%c#_q!d#_q~P!8dOf'RX!Y'RX~P!(SO!Y.iOf(ba~O!X3ZO!Y'SX!j'SX~P%[O!Y.lO!j(ca~O!Y.lO!j(ca~P!8dO!V3^O~O#|!ma!Z!ma~PKOO#|!ea!Y!ea!Z!ea~P#CvO#|!qa!Z!qa~P!:}O#|!sa!Z!sa~P!=hORfO![3pO$a3qO~O!Z3uO~Or3vO~P#-]O`$jq!Y$jq'r$jq'p$jq!V$jq!j$jqr$jq![$jq%c$jq!d$jq~P!8dO!V3wO~P#-]O|)zO!P){O(p%POj'ba(o'ba!Y'ba#['ba~Of'ba#|'ba~P%)_O|)zO!P){Oj'da(o'da(p'da!Y'da#['da~Of'da#|'da~P%*QO(h$ZO~P#-]O!X3zO'{%dO!Y'^X!j'^X~O!Y/cO!j(ua~O!Y/cO!d#uO!j(ua~O!Y/cO!d#uO(h'kO!j(ua~Of$wi!Y$wi#[$wi#|$wi~P!0}O!X4SO'{*]O!V'`X!Y'`X~P!1lO!Y/kO!V(va~O!Y/kO!V(va~P#-]O!d#uO#r4[O~On4_O!d#uO(h'kO~O(o$}Oj%Zi|%Zi!P%Zi(p%Zi!Y%Zi#[%Zi~Of%Zi#|%Zi~P%-dO(p%POj%]i|%]i!P%]i(o%]i!Y%]i#[%]i~Of%]i#|%]i~P%.VOf(Vi!Y(Vi~P!0}O#[4fOf(Vi!Y(Vi~P!0}O!j4iO~O`$kq!Y$kq'r$kq'p$kq!V$kq!j$kqr$kq![$kq%c$kq!d$kq~P!8dO!V4mO~O!Y4nO![(wX~P#-]O!i#wO~P4XO`$uX![$uX%W[X'r$uX!Y$uX~P!/tO%W4pO`kXjkX|kX!PkX![kX'rkX(okX(pkX!YkX~O%W4pO~Oa4vO%d4wO'{+hO'}TO(QUO!Y'mX!Z'mX~O!Y0rO!Z)Oa~OZ4{O~O_4|O~O`%kO'r%kO~P#-]O![$|O~P#-]O!Y5UO#[5WO!Z({X~O!Z5XO~Oo!nO!P5YO!_!xO!`!uO!a!uO!{:dO#P!pO#Q!pO#R!pO#S!pO#T!pO#W5_O#X!yO'|!lO'}TO(QUO([!mO(g!sO~O!Z5^O~P%3hOj5dO![1[O%c5cO~Og%VOj5dO![1[O%c5cO~Oa5kO'{#mO'}TO(QUO!Y'lX!Z'lX~O!Y1gO!Z(|a~O'}TO(QUO([5mO~O_5qO~O#r5tO&T5uO~PMnO!j5vO~P%[O`5xO~O`5xO~P%[Oa1}O!Z5}O&c1|O~P`O!d6PO~O!d6ROg(ai!Y(ai!Z(ai!d(ai!k(ai~O!Y#di!Z#di~P#CvO#[6SO!Y#di!Z#di~O!Y!^i!Z!^i~P#CvO`%kO#[6]O'r%kO~O`%kO!d#uO#[6]O'r%kO~O!Y(jq!j(jq`(jq'r(jq~P!8dO!Y(dO!j(iq~O!P%eO![%fO#f6dO'{%dO~O!['ZO%c6gO~Oj6jO!['ZO%c6gO~O#g'baP'baZ'ba`'ban'ba}'ba!h'ba!i'ba!k'ba!o'ba#j'ba#k'ba#l'ba#m'ba#n'ba#o'ba#p'ba#q'ba#r'ba#t'ba#v'ba#x'ba#y'ba'r'ba(X'ba(h'ba!j'ba!V'ba'p'bar'ba!['ba%c'ba!d'ba~P%)_O#g'daP'daZ'da`'dan'da}'da!h'da!i'da!k'da!o'da#j'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#t'da#v'da#x'da#y'da'r'da(X'da(h'da!j'da!V'da'p'dar'da!['da%c'da!d'da~P%*QO#g$wiP$wiZ$wi`$win$wi}$wi!Y$wi!h$wi!i$wi!k$wi!o$wi#j$wi#k$wi#l$wi#m$wi#n$wi#o$wi#p$wi#q$wi#r$wi#t$wi#v$wi#x$wi#y$wi'r$wi(X$wi(h$wi!j$wi!V$wi'p$wi#[$wir$wi![$wi%c$wi!d$wi~P#-]O#g%ZiP%ZiZ%Zi`%Zin%Zi}%Zi!h%Zi!i%Zi!k%Zi!o%Zi#j%Zi#k%Zi#l%Zi#m%Zi#n%Zi#o%Zi#p%Zi#q%Zi#r%Zi#t%Zi#v%Zi#x%Zi#y%Zi'r%Zi(X%Zi(h%Zi!j%Zi!V%Zi'p%Zir%Zi![%Zi%c%Zi!d%Zi~P%-dO#g%]iP%]iZ%]i`%]in%]i}%]i!h%]i!i%]i!k%]i!o%]i#j%]i#k%]i#l%]i#m%]i#n%]i#o%]i#p%]i#q%]i#r%]i#t%]i#v%]i#x%]i#y%]i'r%]i(X%]i(h%]i!j%]i!V%]i'p%]ir%]i![%]i%c%]i!d%]i~P%.VOf'Ra!Y'Ra~P!0}O!Y'Sa!j'Sa~P!8dO!Y.lO!j(ci~O#|#_i!Y#_i!Z#_i~P#CvOP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O(XVOZ#iin#ii!h#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~O#j#ii~P%FhO#j:lO~P%FhOP$]O|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO(XVOZ#ii!h#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~On#ii~P%HsOn:nO~P%HsOP$]On:nO|#yO}#zO!P#{O!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO(XVO#t#ii#v#ii#x#ii#y#ii#|#ii(h#ii(o#ii(p#ii!Y#ii!Z#ii~OZ#ii!h#ii#o#ii#p#ii#q#ii#r#ii~P%KOOZ:zO!h:pO#o:pO#p:pO#q:yO#r:pO~P%KOOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO(XVO#v#ii#x#ii#y#ii#|#ii(h#ii(p#ii!Y#ii!Z#ii~O(o#ii~P%MjO(o#|O~P%MjOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO#v:sO(XVO(o#|O#x#ii#y#ii#|#ii(h#ii!Y#ii!Z#ii~O(p#ii~P& uO(p#}O~P& uOP$]OZ:zOn:nO|#yO}#zO!P#{O!h:pO!i#wO!k#xO!o$]O#j:lO#k:mO#l:mO#m:mO#n:oO#o:pO#p:pO#q:yO#r:pO#t:qO#v:sO#x:uO(XVO(o#|O(p#}O~O#y#ii#|#ii(h#ii!Y#ii!Z#ii~P&$QO`#zy!Y#zy'r#zy'p#zy!V#zy!j#zyr#zy![#zy%c#zy!d#zy~P!8dOj<gO|)zO!P){O(o$}O(p%PO~OP#iiZ#iin#ii}#ii!h#ii!i#ii!k#ii!o#ii#j#ii#k#ii#l#ii#m#ii#n#ii#o#ii#p#ii#q#ii#r#ii#t#ii#v#ii#x#ii#y#ii#|#ii(X#ii(h#ii!Y#ii!Z#ii~P&&xO!i#wOP(WXZ(WXj(WXn(WX|(WX}(WX!P(WX!h(WX!k(WX!o(WX#j(WX#k(WX#l(WX#m(WX#n(WX#o(WX#p(WX#q(WX#r(WX#t(WX#v(WX#x(WX#y(WX#|(WX(X(WX(h(WX(o(WX(p(WX!Y(WX!Z(WX~O#|#}i!Y#}i!Z#}i~P#CvO#|!qi!Z!qi~P$'jO!Z6|O~O!Y']a!Z']a~P#CvO!d#uO(h'kO!Y'^a!j'^a~O!Y/cO!j(ui~O!Y/cO!d#uO!j(ui~Of$wq!Y$wq#[$wq#|$wq~P!0}O!V'`a!Y'`a~P#-]O!d7TO~O!Y/kO!V(vi~P#-]O!Y/kO!V(vi~O!V7XO~O!d#uO#r7^O~On7_O!d#uO(h'kO~O|)zO!P){O(p%POj'ca(o'ca!Y'ca#['ca~Of'ca#|'ca~P&.YO|)zO!P){Oj'ea(o'ea(p'ea!Y'ea#['ea~Of'ea#|'ea~P&.{O!V7aO~Of$yq!Y$yq#[$yq#|$yq~P!0}O`$ky!Y$ky'r$ky'p$ky!V$ky!j$kyr$ky![$ky%c$ky!d$ky~P!8dO!d6RO~O!Y4nO![(wa~O`#_y!Y#_y'r#_y'p#_y!V#_y!j#_yr#_y![#_y%c#_y!d#_y~P!8dOZ7fO~Oa7hO'{+hO'}TO(QUO~O!Y0rO!Z)Oi~O_7lO~O([(xO!Y'iX!Z'iX~O!Y5UO!Z({a~OlkO'{7sO~P.iO!Z7vO~P%3hOo!nO!P7wO'}TO(QUO([!mO(g!sO~O![1[O~O![1[O%c7yO~Oj7|O![1[O%c7yO~OZ8RO!Y'la!Z'la~O!Y1gO!Z(|i~O!j8VO~O!j8WO~O!j8ZO~O!j8ZO~P%[O`8]O~O!d8^O~O!j8_O~O!Y(mi!Z(mi~P#CvO`%kO#[8gO'r%kO~O!Y(jy!j(jy`(jy'r(jy~P!8dO!Y(dO!j(iy~O!['ZO%c8jO~O#g$wqP$wqZ$wq`$wqn$wq}$wq!Y$wq!h$wq!i$wq!k$wq!o$wq#j$wq#k$wq#l$wq#m$wq#n$wq#o$wq#p$wq#q$wq#r$wq#t$wq#v$wq#x$wq#y$wq'r$wq(X$wq(h$wq!j$wq!V$wq'p$wq#[$wqr$wq![$wq%c$wq!d$wq~P#-]O#g'caP'caZ'ca`'can'ca}'ca!h'ca!i'ca!k'ca!o'ca#j'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#t'ca#v'ca#x'ca#y'ca'r'ca(X'ca(h'ca!j'ca!V'ca'p'car'ca!['ca%c'ca!d'ca~P&.YO#g'eaP'eaZ'ea`'ean'ea}'ea!h'ea!i'ea!k'ea!o'ea#j'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#t'ea#v'ea#x'ea#y'ea'r'ea(X'ea(h'ea!j'ea!V'ea'p'ear'ea!['ea%c'ea!d'ea~P&.{O#g$yqP$yqZ$yq`$yqn$yq}$yq!Y$yq!h$yq!i$yq!k$yq!o$yq#j$yq#k$yq#l$yq#m$yq#n$yq#o$yq#p$yq#q$yq#r$yq#t$yq#v$yq#x$yq#y$yq'r$yq(X$yq(h$yq!j$yq!V$yq'p$yq#[$yqr$yq![$yq%c$yq!d$yq~P#-]O!Y'Si!j'Si~P!8dO#|#_q!Y#_q!Z#_q~P#CvO(o$}OP%ZaZ%Zan%Za}%Za!h%Za!i%Za!k%Za!o%Za#j%Za#k%Za#l%Za#m%Za#n%Za#o%Za#p%Za#q%Za#r%Za#t%Za#v%Za#x%Za#y%Za#|%Za(X%Za(h%Za!Y%Za!Z%Za~Oj%Za|%Za!P%Za(p%Za~P&@bO(p%POP%]aZ%]an%]a}%]a!h%]a!i%]a!k%]a!o%]a#j%]a#k%]a#l%]a#m%]a#n%]a#o%]a#p%]a#q%]a#r%]a#t%]a#v%]a#x%]a#y%]a#|%]a(X%]a(h%]a!Y%]a!Z%]a~Oj%]a|%]a!P%]a(o%]a~P&BiOj<gO|)zO!P){O(p%PO~P&@bOj<gO|)zO!P){O(o$}O~P&BiO|0ZO}0ZO!P0[OPyaZyajyanya!hya!iya!kya!oya#jya#kya#lya#mya#nya#oya#pya#qya#rya#tya#vya#xya#yya#|ya(Xya(hya(oya(pya!Yya!Zya~O|)zO!P){OP$naZ$naj$nan$na}$na!h$na!i$na!k$na!o$na#j$na#k$na#l$na#m$na#n$na#o$na#p$na#q$na#r$na#t$na#v$na#x$na#y$na#|$na(X$na(h$na(o$na(p$na!Y$na!Z$na~O|)zO!P){OP$paZ$paj$pan$pa}$pa!h$pa!i$pa!k$pa!o$pa#j$pa#k$pa#l$pa#m$pa#n$pa#o$pa#p$pa#q$pa#r$pa#t$pa#v$pa#x$pa#y$pa#|$pa(X$pa(h$pa(o$pa(p$pa!Y$pa!Z$pa~OP%OaZ%Oan%Oa}%Oa!h%Oa!i%Oa!k%Oa!o%Oa#j%Oa#k%Oa#l%Oa#m%Oa#n%Oa#o%Oa#p%Oa#q%Oa#r%Oa#t%Oa#v%Oa#x%Oa#y%Oa#|%Oa(X%Oa(h%Oa!Y%Oa!Z%Oa~P&&xO#|$jq!Y$jq!Z$jq~P#CvO#|$kq!Y$kq!Z$kq~P#CvO!Z8vO~O#|8wO~P!0}O!d#uO!Y'^i!j'^i~O!d#uO(h'kO!Y'^i!j'^i~O!Y/cO!j(uq~O!V'`i!Y'`i~P#-]O!Y/kO!V(vq~O!V8}O~P#-]O!V8}O~Of(Vy!Y(Vy~P!0}O!Y'ga!['ga~P#-]O`%Vq![%Vq'r%Vq!Y%Vq~P#-]OZ9SO~O!Y0rO!Z)Oq~O#[9WO!Y'ia!Z'ia~O!Y5UO!Z({i~P#CvOP[XZ[Xn[X|[X}[X!P[X!V[X!Y[X!h[X!i[X!k[X!o[X#[[X#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X~O!d%TX#r%TX~P'#SO![1[O%c9[O~O'}TO(QUO([9aO~O!Y1gO!Z(|q~O!j9dO~O!j9eO~O!j9fO~O!j9fO~P%[O#[9iO!Y#dy!Z#dy~O!Y#dy!Z#dy~P#CvO!['ZO%c9nO~O#|#zy!Y#zy!Z#zy~P#CvOP$wiZ$win$wi}$wi!h$wi!i$wi!k$wi!o$wi#j$wi#k$wi#l$wi#m$wi#n$wi#o$wi#p$wi#q$wi#r$wi#t$wi#v$wi#x$wi#y$wi#|$wi(X$wi(h$wi!Y$wi!Z$wi~P&&xO|)zO!P){O(p%POP'baZ'baj'ban'ba}'ba!h'ba!i'ba!k'ba!o'ba#j'ba#k'ba#l'ba#m'ba#n'ba#o'ba#p'ba#q'ba#r'ba#t'ba#v'ba#x'ba#y'ba#|'ba(X'ba(h'ba(o'ba!Y'ba!Z'ba~O|)zO!P){OP'daZ'daj'dan'da}'da!h'da!i'da!k'da!o'da#j'da#k'da#l'da#m'da#n'da#o'da#p'da#q'da#r'da#t'da#v'da#x'da#y'da#|'da(X'da(h'da(o'da(p'da!Y'da!Z'da~O(o$}OP%ZiZ%Zij%Zin%Zi|%Zi}%Zi!P%Zi!h%Zi!i%Zi!k%Zi!o%Zi#j%Zi#k%Zi#l%Zi#m%Zi#n%Zi#o%Zi#p%Zi#q%Zi#r%Zi#t%Zi#v%Zi#x%Zi#y%Zi#|%Zi(X%Zi(h%Zi(p%Zi!Y%Zi!Z%Zi~O(p%POP%]iZ%]ij%]in%]i|%]i}%]i!P%]i!h%]i!i%]i!k%]i!o%]i#j%]i#k%]i#l%]i#m%]i#n%]i#o%]i#p%]i#q%]i#r%]i#t%]i#v%]i#x%]i#y%]i#|%]i(X%]i(h%]i(o%]i!Y%]i!Z%]i~O#|$ky!Y$ky!Z$ky~P#CvO#|#_y!Y#_y!Z#_y~P#CvO!d#uO!Y'^q!j'^q~O!Y/cO!j(uy~O!V'`q!Y'`q~P#-]O!V9wO~P#-]O!Y0rO!Z)Oy~O!Y5UO!Z({q~O![1[O%c:OO~O!j:RO~O!['ZO%c:WO~OP$wqZ$wqn$wq}$wq!h$wq!i$wq!k$wq!o$wq#j$wq#k$wq#l$wq#m$wq#n$wq#o$wq#p$wq#q$wq#r$wq#t$wq#v$wq#x$wq#y$wq#|$wq(X$wq(h$wq!Y$wq!Z$wq~P&&xO|)zO!P){O(p%POP'caZ'caj'can'ca}'ca!h'ca!i'ca!k'ca!o'ca#j'ca#k'ca#l'ca#m'ca#n'ca#o'ca#p'ca#q'ca#r'ca#t'ca#v'ca#x'ca#y'ca#|'ca(X'ca(h'ca(o'ca!Y'ca!Z'ca~O|)zO!P){OP'eaZ'eaj'ean'ea}'ea!h'ea!i'ea!k'ea!o'ea#j'ea#k'ea#l'ea#m'ea#n'ea#o'ea#p'ea#q'ea#r'ea#t'ea#v'ea#x'ea#y'ea#|'ea(X'ea(h'ea(o'ea(p'ea!Y'ea!Z'ea~OP$yqZ$yqn$yq}$yq!h$yq!i$yq!k$yq!o$yq#j$yq#k$yq#l$yq#m$yq#n$yq#o$yq#p$yq#q$yq#r$yq#t$yq#v$yq#x$yq#y$yq#|$yq(X$yq(h$yq!Y$yq!Z$yq~P&&xOf%_!Z!Y%_!Z#[%_!Z#|%_!Z~P!0}O!Y'iq!Z'iq~P#CvO!Y#d!Z!Z#d!Z~P#CvO#g%_!ZP%_!ZZ%_!Z`%_!Zn%_!Z}%_!Z!Y%_!Z!h%_!Z!i%_!Z!k%_!Z!o%_!Z#j%_!Z#k%_!Z#l%_!Z#m%_!Z#n%_!Z#o%_!Z#p%_!Z#q%_!Z#r%_!Z#t%_!Z#v%_!Z#x%_!Z#y%_!Z'r%_!Z(X%_!Z(h%_!Z!j%_!Z!V%_!Z'p%_!Z#[%_!Zr%_!Z![%_!Z%c%_!Z!d%_!Z~P#-]OP%_!ZZ%_!Zn%_!Z}%_!Z!h%_!Z!i%_!Z!k%_!Z!o%_!Z#j%_!Z#k%_!Z#l%_!Z#m%_!Z#n%_!Z#o%_!Z#p%_!Z#q%_!Z#r%_!Z#t%_!Z#v%_!Z#x%_!Z#y%_!Z#|%_!Z(X%_!Z(h%_!Z!Y%_!Z!Z%_!Z~P&&xOr(]X~P1qO'|!lO~P!*fO!VeX!YeX#[eX~P'#SOP[XZ[Xn[X|[X}[X!P[X!Y[X!YeX!h[X!i[X!k[X!o[X#[[X#[eX#geX#j[X#k[X#l[X#m[X#n[X#o[X#p[X#q[X#r[X#t[X#v[X#x[X#y[X$O[X(X[X(h[X(o[X(p[X~O!deX!j[X!jeX(heX~P'@vOP:cOQ:cORfOc<[Od!iOlkOn:cOokOpkOvkOx:cOz:cO!PWO!TkO!UkO![XO!f:fO!kZO!n:cO!o:cO!p:cO!r:gO!t:jO!w!hO$T!kO'{)YO'}TO(QUO(XVO(g[O(t<YO~O!Y:wO!Z$ma~Og%VOl%WOn$tOo$sOp$sOv%XOx%YOz;RO!P${O![$|O!f<aO!k$xO#f;XO$T%^O$o;TO$q;VO$t%_O'{(pO'}TO(QUO(X$uO(o$}O(p%PO~O#s)aO~P'ElO!Z[X!ZeX~P'@vO#g:kO~O!d#uO#g:kO~O#[:{O~O#r:pO~O#[;ZO!Y(mX!Z(mX~O#[:{O!Y(kX!Z(kX~O#g;[O~Of;^O~P!0}O#g;cO~O#g;dO~O!d#uO#g;eO~O!d#uO#g;[O~O#|;fO~P#CvO#g;gO~O#g;hO~O#g;mO~O#g;nO~O#g;oO~O#g;pO~O#|;qO~P!0}O#|;rO~P!0}O!i#P#Q#S#T#W#e#f#q(t$o$q$t%W%b%c%d%k%m%p%q%s%u~'vS#k!U't'|#lo#j#mn|'u$Y'u'{$[([~",
      goto: "$2p)SPPPPP)TPP)WP)iP*x.|PPPP5pPP6WPP<S?gP?zP?zPPP?zPAxP?zP?zP?zPA|PPBRPBlPGdPPPGhPPPPGhJiPPPJoKjPGhPMxPPPP!!WGhPPPGhPGhP!$fGhP!'z!(|!)VP!)y!)}!)yPPPPP!-Y!(|PP!-v!.pP!1dGhGh!1i!4s!9Y!9Y!=OPPP!=VGhPPPPPPPPPPP!@dP!AuPPGh!CSPGhPGhGhGhGhPGh!DfP!GnP!JrP!Jv!KQ!KU!KUP!GkP!KY!KYP!N^P!NbGhGh!Nh##k?zP?zP?z?zP#$v?z?z#'O?z#)k?z#+m?z?z#,[#.f#.f#.j#.r#.f#.zP#.fP?z#/d?z#3R?z?z5pPPP#6vPPP#7a#7aP#7aP#7w#7aPP#7}P#7tP#7t#8b#7t#8|#9S5m)W#9V)WP#9^#9^#9^P)WP)WP)WP)WPP)WP#9d#9gP#9g)WP#9kP#9nP)WP)WP)WP)WP)WP)W)WPP#9t#9z#:V#:]#:c#:i#:o#:}#;T#;Z#;e#;k#;u#<U#<[#<|#=`#=f#=l#=z#>a#@O#@^#@d#Ax#BW#Cr#DQ#DW#D^#Dd#Dn#Dt#Dz#EU#Eh#EnPPPPPPPPPP#EtPPPPPPP#Fi#Ip#KP#KW#K`PPPP$!d$%Z$+r$+u$+x$,q$,t$,w$-O$-WPP$-^$-b$.Y$/X$/]$/qPP$/u$/{$0PP$0S$0W$0Z$1P$1h$2P$2T$2W$2Z$2a$2d$2h$2lR!{RoqOXst!Z#c%j&m&o&p&r,h,m1w1zY!uQ'Z-Y1[5]Q%pvQ%xyQ&P|Q&e!VS'R!e-QQ'a!iS'g!r!xS*c$|*hQ+f%yQ+s&RQ,X&_Q-W'YQ-b'bQ-j'hQ/|*jQ1f,YR;Y:g%OdOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S,e,h,m-^-f-t-z.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3Z5Y5d5t5u5x6]7w7|8]8gS#p]:d!r)[$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q*u%ZQ+k%{Q,Z&bQ,b&jQ.c;QQ0h+^Q0l+`Q0w+lQ1n,`Q2{.[Q4v0rQ5k1gQ6i3PQ6u;RQ7h4wR8m6j&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]t!nQ!r!u!x!y'R'Y'Z'g'h'i-Q-W-Y-j1[5]5_$v$si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gQ&S|Q'P!eS'V%f-TQ+k%{Q,Z&bQ0]*yQ0w+lQ0|+rQ1m,_Q1n,`Q4v0rQ5P1OQ5k1gQ5n1iQ5o1lQ7h4wQ7k4|Q8U5qQ9V7lR9b8RrnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zR,]&f&v^OPXYstuvwz!Z!`!g!j!o#R#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O']'m(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<[<][#[WZ#V#Y'S'}!S%gm#g#h#k%b%e(W(b(c(d+Q+R+T,d,z-x.O.P.Q.S2P2w2x6R6dQ%sxQ%wyS%||&RQ&Y!TQ'^!hQ'`!iQ(k#rS*V$x*ZS+e%x%yQ+i%{Q,S&]Q,W&_S-a'a'bQ.^(lQ/g*WQ0p+fQ0v+lQ0x+mQ0{+qQ1a,TS1e,X,YQ2i-bQ3y/cQ4u0rQ4y0uQ5O0}Q5j1fQ7Q3zQ7g4wQ7j4{Q9R7fR9y9S!O$zi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c!S%uy!i!t%w%x%y'Q'`'a'b'f'p*b+e+f,}-a-b-i/t0p2b2i2p4^Q+_%sQ+x&VQ+{&WQ,V&_Q.](kQ1`,SU1d,W,X,YQ3Q.^Q5e1aS5i1e1fQ8Q5j#W<^#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<go<_:y:z:};P;T;V;X;`;b;d;h;j;l;n;rW%Ti%V*r<YS&V!Q&dQ&W!RQ&X!SR+v&T$w%Si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gT)v$u)wV*v%Z;Q;RU'V!e%f-TS(y#y#zQ+p&OS.V(g(hQ1V+|Q4g0ZR7p5U&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]$i$`c#X#d%n%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.t.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PT#SV#T&}kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q'T!eR2^-Qv!nQ!e!r!u!x!y'R'Y'Z'g'h'i-Q-W-Y-j1[5]5_S*b$|*hS/t*c*jQ/}*kQ1X,OQ4^/|R4a0PnqOXst!Z#c%j&m&o&p&r,h,m1w1zQ&t!^Q'q!wS(m#t:kQ+c%vQ,Q&YQ,R&[Q-_'_Q-l'jS.g(r;[S0`+O;eQ0n+dQ1Z,PQ2O,oQ2Q,pQ2Y,{Q2g-`Q2j-dS4l0a;oQ4q0oS4t0q;pQ6T2[Q6X2hQ6^2oQ7e4rQ8b6VQ8c6YQ8f6_R9h8_$d$_c#X#d%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PS(j#o'dU*o%R(q3mS+Y%n.tQ2|0hQ6f2{Q8l6iR9o8m$d$^c#X#d%o%q'|(S(n(u(})O)P)Q)R)S)T)U)V)W)X)Z)^)b)l+Z+o-O-m-r-w-y.h.n.r.u.v/V0_2W2Z2k2r3Y3_3`3a3b3c3d3e3f3g3h3i3j3k3n3o3t4k4s6U6[6a6o6p6y6z7r8a8e8n8t8u9k9{:S:e<PS(i#o'dS({#z$_S+X%n.tS.W(h(jQ.w)]Q0e+YR2y.X&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]S#p]:dQ&o!XQ&p!YQ&r![Q&s!]R1v,kQ'[!hQ+[%sQ-]'^S.Y(k+_Q2e-[W2}.].^0g0iQ6W2fU6e2z2|3QS8i6f6hS9m8k8lS:U9l9oQ:^:VR:a:_U!vQ'Z-YT5Z1[5]!Q_OXZ`st!V!Z#c#g%b%j&d&f&m&o&p&r(d,h,m.P1w1z]!pQ!r'Z-Y1[5]T#p]:d%Y{OPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gS(y#y#zS.V(g(h!s;v$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Y!tQ'Z-Y1[5]Q'f!rS'p!u!xS'r!y5_S-i'g'hQ-k'iR2p-jQ'o!tS(`#f1qS-h'f'rQ/f*VQ/r*bQ2q-kQ4O/gS4X/s/}Q7P3yS7[4_4aQ8y7QR9Q7_Q#vbQ'n!tS(_#f1qS(a#l*}Q+P%cQ+a%tQ+g%zU-g'f'o'rQ-{(`Q/e*VQ/q*bQ/w*eQ0m+bQ1b,US2n-h-kQ2v.TS3}/f/gS4W/r/}Q4Z/vQ4]/xQ5g1cQ6`2qQ7O3yQ7S4OS7W4X4aQ7]4`Q8O5hS8x7P7QQ8|7XQ9O7[Q9_8PQ9u8yQ9v8}Q9x9QQ:Q9`Q:Y9wQ;y;tQ<U;}R<V<OV!vQ'Z-Y%YaOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gS#vz!j!r;s$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]R;y<[%YbOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gQ%cj!S%ty!i!t%w%x%y'Q'`'a'b'f'p*b+e+f,}-a-b-i/t0p2b2i2p4^S%zz!jQ+b%uQ,U&_W1c,V,W,X,YU5h1d1e1fS8P5i5jQ9`8Q!r;t$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q;}<ZR<O<[$|eOPXYstuvw!Z!`!g!o#R#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8gY#aWZ#V#Y'}!S%gm#g#h#k%b%e(W(b(c(d+Q+R+T,d,z-x.O.P.Q.S2P2w2x6R6dQ,c&j!p;u$[$m)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]R;x'SS'W!e%fR2`-T%OdOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S,e,h,m-^-f-t-z.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3Z5Y5d5t5u5x6]7w7|8]8g!r)[$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]Q,b&jQ0h+^Q2{.[Q6i3PR8m6j!f$Uc#X%n'|(S(n(u)U)V)W)X)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:e!T:r)Z)l-O.t2W2Z3_3g3h3i3j3n3t6U6p6y6z7r8a8n8t8u9{:S<P!b$Wc#X%n'|(S(n(u)W)X)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:e!P:t)Z)l-O.t2W2Z3_3i3j3n3t6U6p6y6z7r8a8n8t8u9{:S<P!^$[c#X%n'|(S(n(u)^)b+o-m-r-w-y.h.n/V0_2k2r3Y3k4k4s6[6a6o8e9k:eQ3x/az<])Z)l-O.t2W2Z3_3n3t6U6p6y6z7r8a8n8t8u9{:S<PQ<b<dR<c<e&|kOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]S$nh$oR3q.z'TgOPWXYZhstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m$o%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.z.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]T$jf$pQ$hfS)e$k)iR)q$pT$if$pT)g$k)i'ThOPWXYZhstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$[$a$e$m$o%j%p%}&f&i&j&m&o&p&r&v'O'S']'m'}(P(V(^(r(v(z)n)y+O+S+^,e,h,m,y,|-^-f-t-z.[.l.s.z.{0[0a0q1_1o1p1r1t1w1z1|2]2m2s3P3Z3p5W5Y5d5t5u5x6S6]6j7w7|8]8g9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]T$nh$oQ$qhR)p$o%YjOPWXYZstuvw!Z!`!g!o#R#V#Y#c#n#t#x#{$O$P$Q$R$S$T$U$V$W$X$Y$a$e%j%p%}&f&i&j&m&o&p&r&v'O']'m'}(P(V(^(r(v(z)y+O+S+^,e,h,m-^-f-t-z.[.l.s0[0a0q1_1o1p1r1t1w1z1|2m2s3P3Z5Y5d5t5u5x6]6j7w7|8]8g!s<Z$[$m'S)n,y,|.{2]3p5W6S9W9i:c:f:g:j:k:l:m:n:o:p:q:r:s:t:u:v:w:{;Y;Z;[;^;e;f;o;p<]#clOPXZst!Z!`!o#R#c#n#{$m%j&f&i&j&m&o&p&r&v'O'](z)n+S+^,e,h,m-^.[.{0[1_1o1p1r1t1w1z1|3P3p5Y5d5t5u5x6j7w7|8]!O%Ri#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c#W(q#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gQ*z%_Q/W)zo3m:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!O$yi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cQ*[$zS*e$|*hQ*{%`Q/x*f#W;{#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn;|:y:z:};P;T;V;X;`;b;d;h;j;l;n;rQ<Q<^Q<R<_Q<S<`R<T<a!O%Ri#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<c#W(q#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<go3m:y:z:};P;T;V;X;`;b;d;h;j;l;n;rnoOXst!Z#c%j&m&o&p&r,h,m1w1zQ*_${Q,v&yQ,w&{R4R/k$v%Si#u#w$c$d$x${%O%Q%[%]%a)u){)}*P*R*Y*`*p*q+]+`+w+z.Z.i/Z/j/k/m0Q0S0^1R1U1^3O3x4S4[4f4n4p5c6g7T7^7y8j8w9[9n:O:W:y:z:|:};O;P;S;T;U;V;W;X;_;`;a;b;c;d;g;h;i;j;k;l;m;n;q;r<Y<b<c<f<gQ+y&WQ1T+{Q5S1SR7o5TT*g$|*hS*g$|*hT5[1[5]S/v*d5YT4`0O7wQ+a%tQ/w*eQ0m+bQ1b,UQ5g1cQ8O5hQ9_8PR:Q9`!O%Oi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cr)}$v(s*O*n*|/i0U0V3W4P4j6}7`9t;z<W<XS0Q*m0R#W:|#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn:}:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!^;_(o)`*U*^._.b.f/S/X/a/n0f1Q1S3T4Q4U5R5T6k6n7U7Y7b7d8{9P:X<d<e`;`3l6q6t6x8o9p9s:bS;i.a3UT;j6s8r!O%Qi#w%O%Q%[%]%a)}*P*Y*p*q.i/j0Q0S0^3x4f8w<Y<b<cv*P$v(s*Q*m*|/]/i0U0V3W4P4b4j6}7`9t;z<W<XS0S*n0T#W;O#u$c$d$x${)u){*R*`+]+`+w+z.Z/Z/k/m1R1U1^3O4S4[4n4p5c6g7T7^7y8j9[9n:O:W:|;O;S;U;W;_;a;c;g;i;k;m;q<f<gn;P:y:z:};P;T;V;X;`;b;d;h;j;l;n;r!b;a(o)`*U*^.`.a.f/S/X/a/n0f1Q1S3R3T4Q4U5R5T6k6l6n7U7Y7b7d8{9P:X<d<ed;b3l6r6s6x8o8p9p9q9s:bS;k.b3VT;l6t8srnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zQ&a!UR,e&jrnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zR&a!UQ+}&XR1P+vsnOXst!V!Z#c%j&d&m&o&p&r,h,m1w1zQ1],SS5b1`1aU7x5`5a5eS9Z7z7{S9|9Y9]Q:Z9}R:`:[Q&h!VR,^&dR5n1iS%||&RR0x+mQ&m!WR,h&nR,n&sT1x,m1zR,r&tQ,q&tR2R,rQ't!zR-n'tSsOtQ#cXT%ms#cQ!}TR'v!}Q#QUR'x#QQ)w$uR/T)wQ#TVR'z#TQ#WWU(Q#W(R-uQ(R#XR-u(SQ-R'TR2_-RQ.j(sR3X.jQ.m(uS3[.m3]R3].nQ-Y'ZR2c-YY!rQ'Z-Y1[5]R'e!rS#^W%eU(X#^(Y-vQ(Y#_R-v(TQ-U'WR2a-Ut`OXst!V!Z#c%j&d&f&m&o&p&r,h,m1w1zS#gZ%bU#q`#g.PR.P(dQ(e#iQ-|(aW.U(e-|2t6bQ2t-}R6b2uQ)i$kR.|)iQ$ohR)o$oQ$bcU)_$b-q:xQ-q:eR:x)lQ/d*VW3{/d3|7R8zU3|/e/f/gS7R3}4OR8z7S$X)|$v(o(s)`*U*^*m*n*w*x*|.a.b.d.e.f/S/X/]/_/a/i/n0U0V0f1Q1S3R3S3T3W3l4P4Q4U4b4d4j5R5T6k6l6m6n6s6t6v6w6x6}7U7Y7`7b7d8o8p8q8{9P9p9q9r9s9t:X:b;z<W<X<d<eQ/l*^U4T/l4V7VQ4V/nR7V4UQ*h$|R/z*hr*O$v(s*m*n*|/i0U0V3W4P4j6}7`9t;z<W<X!^._(o)`*U*^.a.b.f/S/X/a/n0f1Q1S3T4Q4U5R5T6k6n7U7Y7b7d8{9P:X<d<eU/^*O._6qa6q3l6s6t6x8o9p9s:bQ0R*mQ3U.aU4c0R3U8rR8r6sv*Q$v(s*m*n*|/]/i0U0V3W4P4b4j6}7`9t;z<W<X!b.`(o)`*U*^.a.b.f/S/X/a/n0f1Q1S3R3T4Q4U5R5T6k6l6n7U7Y7b7d8{9P:X<d<eU/`*Q.`6re6r3l6s6t6x8o8p9p9q9s:bQ0T*nQ3V.bU4e0T3V8sR8s6tQ*s%UR0X*sQ4o0fR7c4oQ+U%hR0d+UQ5V1VS7q5V9XR9X7rQ,P&YR1Y,PQ5]1[R7u5]Q1h,ZS5l1h8SR8S5nQ0s+iW4x0s4z7i9TQ4z0vQ7i4yR9T7jQ+n%|R0y+nQ1z,mR5|1zYrOXst#cQ&q!ZQ+W%jQ,g&mQ,i&oQ,j&pQ,l&rQ1u,hS1x,m1zR5{1wQ%lpQ&u!_Q&x!aQ&z!bQ&|!cQ'l!tQ+V%iQ+c%vQ+u&SQ,]&hQ,t&wW-e'f'n'o'rQ-l'jQ/y*gQ0n+dS1k,^,aQ2S,sQ2T,vQ2U,wQ2j-dW2l-g-h-k-mQ4q0oQ4}0|Q5Q1QQ5f1bQ5p1mQ5z1vU6Z2k2n2qQ6^2oQ7e4rQ7m5PQ7n5RQ7t5[Q7}5gQ8T5oS8d6[6`Q8f6_Q9U7kQ9^8OQ9c8UQ9j8eQ9z9VQ:P9_Q:T9kR:]:QQ%vyQ'_!iQ'j!tU+d%w%x%yQ,{'QU-`'`'a'bS-d'f'pQ/p*bS0o+e+fQ2[,}S2h-a-bQ2o-iQ4Y/tQ4r0pQ6V2bQ6Y2iQ6_2pR7Z4^S$wi<YR*t%VU%Ui%V<YR0W*rQ$viS(o#u+`Q(s#wS)`$c$dQ*U$xQ*^${Q*m%OQ*n%QQ*w%[Q*x%]Q*|%aQ.a:|Q.b;OQ.d;SQ.e;UQ.f;WQ/S)uS/X){/ZQ/])}Q/_*PQ/a*RQ/i*YQ/n*`Q0U*pQ0V*qh0f+].Z1^3O5c6g7y8j9[9n:O:WQ1Q+wQ1S+zQ3R;_Q3S;aQ3T;cQ3W.iS3l:y:zQ4P/jQ4Q/kQ4U/mQ4b0QQ4d0SQ4j0^Q5R1RQ5T1UQ6k;gQ6l;iQ6m;kQ6n;mQ6s:}Q6t;PQ6v;TQ6w;VQ6x;XQ6}3xQ7U4SQ7Y4[Q7`4fQ7b4nQ7d4pQ8o;dQ8p;`Q8q;bQ8{7TQ9P7^Q9p;hQ9q;jQ9r;lQ9s;nQ9t8wQ:X;qQ:b;rQ;z<YQ<W<bQ<X<cQ<d<fR<e<gnpOXst!Z#c%j&m&o&p&r,h,m1w1zQ!fPS#eZ#nQ&w!`U'c!o5Y7wQ'y#RQ(|#{Q)m$mS,a&f&iQ,f&jQ,s&vQ,x'OQ-[']Q.p(zQ/Q)nQ0b+SQ0i+^Q1s,eQ2f-^Q2|.[Q3s.{Q4h0[Q5a1_Q5r1oQ5s1pQ5w1rQ5y1tQ6O1|Q6f3PQ6{3pQ7{5dQ8X5tQ8Y5uQ8[5xQ8l6jQ9]7|R9g8]#WcOPXZst!Z!`!o#c#n#{%j&f&i&j&m&o&p&r&v'O'](z+S+^,e,h,m-^.[0[1_1o1p1r1t1w1z1|3P5Y5d5t5u5x6j7w7|8]Q#XWQ#dYQ%nuQ%ovS%qw!gS'|#V(PQ(S#YQ(n#tQ(u#xQ(}$OQ)O$PQ)P$QQ)Q$RQ)R$SQ)S$TQ)T$UQ)U$VQ)V$WQ)W$XQ)X$YQ)Z$[Q)^$aQ)b$eW)l$m)n.{3pQ+Z%pQ+o%}S-O'S2]Q-m'mS-r'}-tQ-w(VQ-y(^Q.h(rQ.n(vQ.r:cQ.t:fQ.u:gQ.v:jQ/V)yQ0_+OQ2W,yQ2Z,|Q2k-fQ2r-zQ3Y.lQ3_:kQ3`:lQ3a:mQ3b:nQ3c:oQ3d:pQ3e:qQ3f:rQ3g:sQ3h:tQ3i:uQ3j:vQ3k.sQ3n:{Q3o;YQ3t:wQ4k0aQ4s0qQ6U;ZQ6[2mQ6a2sQ6o3ZQ6p;[Q6y;^Q6z;eQ7r5WQ8a6SQ8e6]Q8n;fQ8t;oQ8u;pQ9k8gQ9{9WQ:S9iQ:e#RR<P<]R#ZWR'U!eY!tQ'Z-Y1[5]S'Q!e-QQ'f!rS'p!u!xS'r!y5_S,}'R'YS-i'g'hQ-k'iQ2b-WR2p-jR(t#wR(w#xQ!fQT-X'Z-Y]!qQ!r'Z-Y1[5]Q#o]R'd:dT#jZ%bS#iZ%bS%hm,dU(a#g#h#kS-}(b(cQ.R(dQ0c+TQ2u.OU2v.P.Q.SS6c2w2xR8h6d`#]W#V#Y%e'}(W+Q-xr#fZm#g#h#k%b(b(c(d+T.O.P.Q.S2w2x6dQ1q,dQ2X,zQ6Q2PQ8`6RT;w'S+RT#`W%eS#_W%eS(O#V(WS(T#Y+QS-P'S+RT-s'}-xT'X!e%fQ$kfR)s$pT)h$k)iR3r.zT*X$x*ZR*a${Q0g+]Q2z.ZQ5`1^Q6h3OQ7z5cQ8k6gQ9Y7yQ9l8jQ9}9[Q:V9nQ:[:OR:_:WnqOXst!Z#c%j&m&o&p&r,h,m1w1zQ&g!VR,]&dtmOXst!U!V!Z#c%j&d&m&o&p&r,h,m1w1zR,d&jT%im,dR1W+|R,[&bQ&Q|R+t&RR+j%{T&k!W&nT&l!W&nT1y,m1z",
      nodeNames:
        "\u26A0 ArithOp ArithOp JSXStartTag LineComment BlockComment Script Hashbang ExportDeclaration export Star as VariableName String Escape from ; default FunctionDeclaration async function VariableDefinition > < TypeParamList TypeDefinition extends ThisType this LiteralType ArithOp Number BooleanLiteral TemplateType InterpolationEnd Interpolation InterpolationStart NullType null VoidType void TypeofType typeof MemberExpression . ?. PropertyName [ TemplateString Escape Interpolation super RegExp ] ArrayExpression Spread , } { ObjectExpression Property async get set PropertyDefinition Block : NewExpression new TypeArgList CompareOp < ) ( ArgList UnaryExpression delete LogicOp BitOp YieldExpression yield AwaitExpression await ParenthesizedExpression ClassExpression class ClassBody MethodDeclaration Decorator @ MemberExpression PrivatePropertyName CallExpression declare Privacy static abstract override PrivatePropertyDefinition PropertyDeclaration readonly accessor Optional TypeAnnotation Equals StaticBlock FunctionExpression ArrowFunction ParamList ParamList ArrayPattern ObjectPattern PatternProperty Privacy readonly Arrow MemberExpression BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp instanceof satisfies in const CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression TaggedTemplateExpression DynamicImport import ImportMeta JSXElement JSXSelfCloseEndTag JSXSelfClosingTag JSXIdentifier JSXBuiltin JSXIdentifier JSXNamespacedName JSXMemberExpression JSXSpreadAttribute JSXAttribute JSXAttributeValue JSXEscape JSXEndTag JSXOpenTag JSXFragmentTag JSXText JSXEscape JSXStartCloseTag JSXCloseTag PrefixCast ArrowFunction TypeParamList SequenceExpression KeyofType keyof UniqueType unique ImportType InferredType infer TypeName ParenthesizedType FunctionSignature ParamList NewSignature IndexedType TupleType Label ArrayType ReadonlyType ObjectType MethodType PropertyType IndexSignature PropertyDefinition CallSignature TypePredicate is NewSignature new UnionType LogicOp IntersectionType LogicOp ConditionalType ParameterizedType ClassDeclaration abstract implements type VariableDeclaration let var using TypeAliasDeclaration InterfaceDeclaration interface EnumDeclaration enum EnumBody NamespaceDeclaration namespace module AmbientDeclaration declare GlobalDeclaration global ClassDeclaration ClassBody AmbientFunctionDeclaration ExportGroup VariableName VariableName ImportDeclaration ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try CatchClause catch FinallyClause finally ReturnStatement return ThrowStatement throw BreakStatement break ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement SingleExpression SingleClassItem",
      maxTerm: 371,
      context: c1,
      nodeProps: [
        [
          "group",
          -26,
          8,
          16,
          18,
          65,
          201,
          205,
          209,
          210,
          212,
          215,
          218,
          228,
          230,
          236,
          238,
          240,
          242,
          245,
          251,
          257,
          259,
          261,
          263,
          265,
          267,
          268,
          "Statement",
          -32,
          12,
          13,
          28,
          31,
          32,
          38,
          48,
          51,
          52,
          54,
          59,
          67,
          75,
          79,
          81,
          83,
          84,
          106,
          107,
          116,
          117,
          134,
          137,
          139,
          140,
          141,
          142,
          144,
          145,
          164,
          165,
          167,
          "Expression",
          -23,
          27,
          29,
          33,
          37,
          39,
          41,
          168,
          170,
          172,
          173,
          175,
          176,
          177,
          179,
          180,
          181,
          183,
          184,
          185,
          195,
          197,
          199,
          200,
          "Type",
          -3,
          87,
          99,
          105,
          "ClassItem",
        ],
        [
          "openedBy",
          22,
          "<",
          34,
          "InterpolationStart",
          53,
          "[",
          57,
          "{",
          72,
          "(",
          157,
          "JSXStartCloseTag",
        ],
        [
          "closedBy",
          23,
          ">",
          36,
          "InterpolationEnd",
          47,
          "]",
          58,
          "}",
          73,
          ")",
          162,
          "JSXEndTag",
        ],
      ],
      propSources: [O1],
      skippedNodes: [0, 4, 5, 271],
      repeatNodeCount: 37,
      tokenData:
        "$Fj(CSR!bOX%ZXY+gYZ-yZ[+g[]%Z]^.c^p%Zpq+gqr/mrs3cst:_tuEruvJSvwLkwx! Yxy!'iyz!(sz{!)}{|!,q|}!.O}!O!,q!O!P!/Y!P!Q!9j!Q!R#8g!R![#:v![!]#Gv!]!^#IS!^!_#J^!_!`#Ns!`!a$#_!a!b$(l!b!c$,k!c!}Er!}#O$-u#O#P$/P#P#Q$4h#Q#R$5r#R#SEr#S#T$7P#T#o$8Z#o#p$<k#p#q$=a#q#r$>q#r#s$?}#s$f%Z$f$g+g$g#BYEr#BY#BZ$AX#BZ$ISEr$IS$I_$AX$I_$I|Er$I|$I}$Dd$I}$JO$Dd$JO$JTEr$JT$JU$AX$JU$KVEr$KV$KW$AX$KW&FUEr&FU&FV$AX&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$AX?HUOEr(n%d_$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&j&hT$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c&j&zP;=`<%l&c'|'U]$f&j(R!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!b(SU(R!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!b(iP;=`<%l'}'|(oP;=`<%l&}'[(y]$f&j(OpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rp)wU(OpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)rp*^P;=`<%l)r'[*dP;=`<%l(r#S*nX(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g#S+^P;=`<%l*g(n+dP;=`<%l%Z(CS+rq$f&j(Op(R!b't(;dOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p$f%Z$f$g+g$g#BY%Z#BY#BZ+g#BZ$IS%Z$IS$I_+g$I_$JT%Z$JT$JU+g$JU$KV%Z$KV$KW+g$KW&FU%Z&FU&FV+g&FV;'S%Z;'S;=`+a<%l?HT%Z?HT?HU+g?HUO%Z(CS.ST(P#S$f&j'u(;dO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c(CS.n_$f&j(Op(R!b'u(;dOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#`/x`$f&j!o$Ip(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S1V`#t$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`2X!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S2d_#t$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/|3l_'}$(n$f&j(R!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k(^4r_$f&j(R!bOY4kYZ5qZr4krs7nsw4kwx5qx!^4k!^!_8p!_#O4k#O#P5q#P#o4k#o#p8p#p;'S4k;'S;=`:X<%lO4k&z5vX$f&jOr5qrs6cs!^5q!^!_6y!_#o5q#o#p6y#p;'S5q;'S;=`7h<%lO5q&z6jT$a`$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c`6|TOr6yrs7]s;'S6y;'S;=`7b<%lO6y`7bO$a``7eP;=`<%l6y&z7kP;=`<%l5q(^7w]$a`$f&j(R!bOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!r8uZ(R!bOY8pYZ6yZr8prs9hsw8pwx6yx#O8p#O#P6y#P;'S8p;'S;=`:R<%lO8p!r9oU$a`(R!bOY'}Zw'}x#O'}#P;'S'};'S;=`(f<%lO'}!r:UP;=`<%l8p(^:[P;=`<%l4k#%|:hh$f&j(Op(R!bOY%ZYZ&cZq%Zqr<Srs&}st%ZtuCruw%Zwx(rx!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr(r<__VS$f&j(Op(R!bOY<SYZ&cZr<Srs=^sw<Swx@nx!^<S!^!_Bm!_#O<S#O#P>`#P#o<S#o#pBm#p;'S<S;'S;=`Cl<%lO<S(Q=g]VS$f&j(R!bOY=^YZ&cZw=^wx>`x!^=^!^!_?q!_#O=^#O#P>`#P#o=^#o#p?q#p;'S=^;'S;=`@h<%lO=^&n>gXVS$f&jOY>`YZ&cZ!^>`!^!_?S!_#o>`#o#p?S#p;'S>`;'S;=`?k<%lO>`S?XSVSOY?SZ;'S?S;'S;=`?e<%lO?SS?hP;=`<%l?S&n?nP;=`<%l>`!f?xWVS(R!bOY?qZw?qwx?Sx#O?q#O#P?S#P;'S?q;'S;=`@b<%lO?q!f@eP;=`<%l?q(Q@kP;=`<%l=^'`@w]VS$f&j(OpOY@nYZ&cZr@nrs>`s!^@n!^!_Ap!_#O@n#O#P>`#P#o@n#o#pAp#p;'S@n;'S;=`Bg<%lO@ntAwWVS(OpOYApZrAprs?Ss#OAp#O#P?S#P;'SAp;'S;=`Ba<%lOAptBdP;=`<%lAp'`BjP;=`<%l@n#WBvYVS(Op(R!bOYBmZrBmrs?qswBmwxApx#OBm#O#P?S#P;'SBm;'S;=`Cf<%lOBm#WCiP;=`<%lBm(rCoP;=`<%l<S#%|C}i$f&j(g!L^(Op(R!bOY%ZYZ&cZr%Zrs&}st%ZtuCruw%Zwx(rx!Q%Z!Q![Cr![!^%Z!^!_*g!_!c%Z!c!}Cr!}#O%Z#O#P&c#P#R%Z#R#SCr#S#T%Z#T#oCr#o#p*g#p$g%Z$g;'SCr;'S;=`El<%lOCr#%|EoP;=`<%lCr(CSFRk$f&j(Op(R!b$Y#t'{&;d([!LYOY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr+dHRk$f&j(Op(R!b$Y#tOY%ZYZ&cZr%Zrs&}st%ZtuGvuw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Gv![!^%Z!^!_*g!_!c%Z!c!}Gv!}#O%Z#O#P&c#P#R%Z#R#SGv#S#T%Z#T#oGv#o#p*g#p$g%Z$g;'SGv;'S;=`Iv<%lOGv+dIyP;=`<%lGv(CSJPP;=`<%lEr%#SJ_`$f&j(Op(R!b#l$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#SKl_$f&j$O$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&COLva(p&;`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sv%ZvwM{wx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#SNW`$f&j#x$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/|! c_(Q$)`$f&j(OpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b'l!!i_$f&j(OpOY!!bYZ!#hZr!!brs!#hsw!!bwx!$xx!^!!b!^!_!%z!_#O!!b#O#P!#h#P#o!!b#o#p!%z#p;'S!!b;'S;=`!'c<%lO!!b&z!#mX$f&jOw!#hwx6cx!^!#h!^!_!$Y!_#o!#h#o#p!$Y#p;'S!#h;'S;=`!$r<%lO!#h`!$]TOw!$Ywx7]x;'S!$Y;'S;=`!$l<%lO!$Y`!$oP;=`<%l!$Y&z!$uP;=`<%l!#h'l!%R]$a`$f&j(OpOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(r!Q!&PZ(OpOY!%zYZ!$YZr!%zrs!$Ysw!%zwx!&rx#O!%z#O#P!$Y#P;'S!%z;'S;=`!']<%lO!%z!Q!&yU$a`(OpOY)rZr)rs#O)r#P;'S)r;'S;=`*Z<%lO)r!Q!'`P;=`<%l!%z'l!'fP;=`<%l!!b(*Q!'t_!k(!b$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'l!)O_!jM|$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+h!*[b$f&j(Op(R!b'|#)d#m$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rxz%Zz{!+d{!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S!+o`$f&j(Op(R!b#j$IdOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&-O!,|`$f&j(Op(R!bn&%`OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&C[!.Z_!Y&;l$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS!/ec$f&j(Op(R!b|'<nOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!0p!P!Q%Z!Q![!3Y![!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'d!0ya$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!2O!P!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z!'d!2Z_!XMt$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!3eg$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!3Y![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S!3Y#S#X%Z#X#Y!4|#Y#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!5Vg$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx{%Z{|!6n|}%Z}!O!6n!O!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!6wc$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l!8_c$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![!8S![!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S!8S#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS!9uf$f&j(Op(R!b#k$IdOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpxz!;Zz{#,f{!P!;Z!P!Q#-{!Q!^!;Z!^!_#'Z!_!`#5k!`!a#7Q!a!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(r!;fb$f&j(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(Q!<w`$f&j(R!b!USOY!<nYZ&cZw!<nwx!=yx!P!<n!P!Q!Eb!Q!^!<n!^!_!GY!_!}!<n!}#O!Ja#O#P!Dj#P#o!<n#o#p!GY#p;'S!<n;'S;=`!Kj<%lO!<n&n!>Q^$f&j!USOY!=yYZ&cZ!P!=y!P!Q!>|!Q!^!=y!^!_!@Y!_!}!=y!}#O!Bw#O#P!Dj#P#o!=y#o#p!@Y#p;'S!=y;'S;=`!E[<%lO!=y&n!?Ta$f&j!USO!^&c!_#Z&c#Z#[!>|#[#]&c#]#^!>|#^#a&c#a#b!>|#b#g&c#g#h!>|#h#i&c#i#j!>|#j#m&c#m#n!>|#n#o&c#p;'S&c;'S;=`&w<%lO&cS!@_X!USOY!@YZ!P!@Y!P!Q!@z!Q!}!@Y!}#O!Ac#O#P!Bb#P;'S!@Y;'S;=`!Bq<%lO!@YS!APU!US#Z#[!@z#]#^!@z#a#b!@z#g#h!@z#i#j!@z#m#n!@zS!AfVOY!AcZ#O!Ac#O#P!A{#P#Q!@Y#Q;'S!Ac;'S;=`!B[<%lO!AcS!BOSOY!AcZ;'S!Ac;'S;=`!B[<%lO!AcS!B_P;=`<%l!AcS!BeSOY!@YZ;'S!@Y;'S;=`!Bq<%lO!@YS!BtP;=`<%l!@Y&n!B|[$f&jOY!BwYZ&cZ!^!Bw!^!_!Ac!_#O!Bw#O#P!Cr#P#Q!=y#Q#o!Bw#o#p!Ac#p;'S!Bw;'S;=`!Dd<%lO!Bw&n!CwX$f&jOY!BwYZ&cZ!^!Bw!^!_!Ac!_#o!Bw#o#p!Ac#p;'S!Bw;'S;=`!Dd<%lO!Bw&n!DgP;=`<%l!Bw&n!DoX$f&jOY!=yYZ&cZ!^!=y!^!_!@Y!_#o!=y#o#p!@Y#p;'S!=y;'S;=`!E[<%lO!=y&n!E_P;=`<%l!=y(Q!Eki$f&j(R!b!USOY&}YZ&cZw&}wx&cx!^&}!^!_'}!_#O&}#O#P&c#P#Z&}#Z#[!Eb#[#]&}#]#^!Eb#^#a&}#a#b!Eb#b#g&}#g#h!Eb#h#i&}#i#j!Eb#j#m&}#m#n!Eb#n#o&}#o#p'}#p;'S&};'S;=`(l<%lO&}!f!GaZ(R!b!USOY!GYZw!GYwx!@Yx!P!GY!P!Q!HS!Q!}!GY!}#O!Ic#O#P!Bb#P;'S!GY;'S;=`!JZ<%lO!GY!f!HZb(R!b!USOY'}Zw'}x#O'}#P#Z'}#Z#[!HS#[#]'}#]#^!HS#^#a'}#a#b!HS#b#g'}#g#h!HS#h#i'}#i#j!HS#j#m'}#m#n!HS#n;'S'};'S;=`(f<%lO'}!f!IhX(R!bOY!IcZw!Icwx!Acx#O!Ic#O#P!A{#P#Q!GY#Q;'S!Ic;'S;=`!JT<%lO!Ic!f!JWP;=`<%l!Ic!f!J^P;=`<%l!GY(Q!Jh^$f&j(R!bOY!JaYZ&cZw!Jawx!Bwx!^!Ja!^!_!Ic!_#O!Ja#O#P!Cr#P#Q!<n#Q#o!Ja#o#p!Ic#p;'S!Ja;'S;=`!Kd<%lO!Ja(Q!KgP;=`<%l!Ja(Q!KmP;=`<%l!<n'`!Ky`$f&j(Op!USOY!KpYZ&cZr!Kprs!=ys!P!Kp!P!Q!L{!Q!^!Kp!^!_!Ns!_!}!Kp!}#O##z#O#P!Dj#P#o!Kp#o#p!Ns#p;'S!Kp;'S;=`#%T<%lO!Kp'`!MUi$f&j(Op!USOY(rYZ&cZr(rrs&cs!^(r!^!_)r!_#O(r#O#P&c#P#Z(r#Z#[!L{#[#](r#]#^!L{#^#a(r#a#b!L{#b#g(r#g#h!L{#h#i(r#i#j!L{#j#m(r#m#n!L{#n#o(r#o#p)r#p;'S(r;'S;=`*a<%lO(rt!NzZ(Op!USOY!NsZr!Nsrs!@Ys!P!Ns!P!Q# m!Q!}!Ns!}#O#!|#O#P!Bb#P;'S!Ns;'S;=`##t<%lO!Nst# tb(Op!USOY)rZr)rs#O)r#P#Z)r#Z#[# m#[#])r#]#^# m#^#a)r#a#b# m#b#g)r#g#h# m#h#i)r#i#j# m#j#m)r#m#n# m#n;'S)r;'S;=`*Z<%lO)rt##RX(OpOY#!|Zr#!|rs!Acs#O#!|#O#P!A{#P#Q!Ns#Q;'S#!|;'S;=`##n<%lO#!|t##qP;=`<%l#!|t##wP;=`<%l!Ns'`#$R^$f&j(OpOY##zYZ&cZr##zrs!Bws!^##z!^!_#!|!_#O##z#O#P!Cr#P#Q!Kp#Q#o##z#o#p#!|#p;'S##z;'S;=`#$}<%lO##z'`#%QP;=`<%l##z'`#%WP;=`<%l!Kp(r#%fk$f&j(Op(R!b!USOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#Z%Z#Z#[#%Z#[#]%Z#]#^#%Z#^#a%Z#a#b#%Z#b#g%Z#g#h#%Z#h#i%Z#i#j#%Z#j#m%Z#m#n#%Z#n#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#W#'d](Op(R!b!USOY#'ZZr#'Zrs!GYsw#'Zwx!Nsx!P#'Z!P!Q#(]!Q!}#'Z!}#O#)w#O#P!Bb#P;'S#'Z;'S;=`#*w<%lO#'Z#W#(fe(Op(R!b!USOY*gZr*grs'}sw*gwx)rx#O*g#P#Z*g#Z#[#(]#[#]*g#]#^#(]#^#a*g#a#b#(]#b#g*g#g#h#(]#h#i*g#i#j#(]#j#m*g#m#n#(]#n;'S*g;'S;=`+Z<%lO*g#W#*OZ(Op(R!bOY#)wZr#)wrs!Icsw#)wwx#!|x#O#)w#O#P!A{#P#Q#'Z#Q;'S#)w;'S;=`#*q<%lO#)w#W#*tP;=`<%l#)w#W#*zP;=`<%l#'Z(r#+W`$f&j(Op(R!bOY#*}YZ&cZr#*}rs!Jasw#*}wx##zx!^#*}!^!_#)w!_#O#*}#O#P!Cr#P#Q!;Z#Q#o#*}#o#p#)w#p;'S#*};'S;=`#,Y<%lO#*}(r#,]P;=`<%l#*}(r#,cP;=`<%l!;Z(CS#,sb$f&j(Op(R!b'v(;d!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z(CS#.W_$f&j(Op(R!bS(;dOY#-{YZ&cZr#-{rs#/Vsw#-{wx#2gx!^#-{!^!_#4f!_#O#-{#O#P#0X#P#o#-{#o#p#4f#p;'S#-{;'S;=`#5e<%lO#-{(Bb#/`]$f&j(R!bS(;dOY#/VYZ&cZw#/Vwx#0Xx!^#/V!^!_#1j!_#O#/V#O#P#0X#P#o#/V#o#p#1j#p;'S#/V;'S;=`#2a<%lO#/V(AO#0`X$f&jS(;dOY#0XYZ&cZ!^#0X!^!_#0{!_#o#0X#o#p#0{#p;'S#0X;'S;=`#1d<%lO#0X(;d#1QSS(;dOY#0{Z;'S#0{;'S;=`#1^<%lO#0{(;d#1aP;=`<%l#0{(AO#1gP;=`<%l#0X(<v#1qW(R!bS(;dOY#1jZw#1jwx#0{x#O#1j#O#P#0{#P;'S#1j;'S;=`#2Z<%lO#1j(<v#2^P;=`<%l#1j(Bb#2dP;=`<%l#/V(Ap#2p]$f&j(OpS(;dOY#2gYZ&cZr#2grs#0Xs!^#2g!^!_#3i!_#O#2g#O#P#0X#P#o#2g#o#p#3i#p;'S#2g;'S;=`#4`<%lO#2g(<U#3pW(OpS(;dOY#3iZr#3irs#0{s#O#3i#O#P#0{#P;'S#3i;'S;=`#4Y<%lO#3i(<U#4]P;=`<%l#3i(Ap#4cP;=`<%l#2g(=h#4oY(Op(R!bS(;dOY#4fZr#4frs#1jsw#4fwx#3ix#O#4f#O#P#0{#P;'S#4f;'S;=`#5_<%lO#4f(=h#5bP;=`<%l#4f(CS#5hP;=`<%l#-{%#W#5xb$f&j$O$Id(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z+h#7_b$W#t$f&j(Op(R!b!USOY!;ZYZ&cZr!;Zrs!<nsw!;Zwx!Kpx!P!;Z!P!Q#%Z!Q!^!;Z!^!_#'Z!_!}!;Z!}#O#*}#O#P!Dj#P#o!;Z#o#p#'Z#p;'S!;Z;'S;=`#,`<%lO!;Z$/l#8rp$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#:v![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#:v#S#U%Z#U#V#>Q#V#X%Z#X#Y!4|#Y#b%Z#b#c#<v#c#d#AY#d#l%Z#l#m#D[#m#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#;Rk$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P!3Y!P!Q%Z!Q![#:v![!^%Z!^!_*g!_!g%Z!g!h!4|!h#O%Z#O#P&c#P#R%Z#R#S#:v#S#X%Z#X#Y!4|#Y#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#=R_$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#>Zd$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#?i!R!S#?i!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#?i#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#?tf$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!R#?i!R!S#?i!S!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#?i#S#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Acc$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#Bn!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#Bn#S#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Bye$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q!Y#Bn!Y!^%Z!^!_*g!_#O%Z#O#P&c#P#R%Z#R#S#Bn#S#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#Deg$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#E|![!^%Z!^!_*g!_!c%Z!c!i#E|!i#O%Z#O#P&c#P#R%Z#R#S#E|#S#T%Z#T#Z#E|#Z#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z$/l#FXi$f&j(Op(R!bo$'|OY%ZYZ&cZr%Zrs&}sw%Zwx(rx!Q%Z!Q![#E|![!^%Z!^!_*g!_!c%Z!c!i#E|!i#O%Z#O#P&c#P#R%Z#R#S#E|#S#T%Z#T#Z#E|#Z#b%Z#b#c#<v#c#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%Gh#HT_!d$b$f&j#|%<f(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z)[#I__`l$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(@^#Jk^g!*v!h'.r(Op(R!b(tSOY*gZr*grs'}sw*gwx)rx!P*g!P!Q#Kg!Q!^*g!^!_#L]!_!`#M}!`#O*g#P;'S*g;'S;=`+Z<%lO*g(n#KpX$h&j(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#LfZ#n$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx!_*g!_!`#MX!`#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#MbX$O$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g$Kh#NWX#o$Id(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g%Gh$ Oa#[%?x$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`0z!`!a$!T!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#W$!`_#g$Ih$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%Gh$#nafBf#o$Id$c#|$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`$$s!`!a$%}!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$%O_#o$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$&Ya#n$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`!a$'_!a#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$'j`#n$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+h$(wc(h$Ip$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!O%Z!O!P$*S!P!^%Z!^!_*g!_!a%Z!a!b$+^!b#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z'+`$*__}'#p$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$+i`$f&j#y$Id(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z#&^$,v_!{!Ln$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(@^$.Q_!P(8n$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(n$/UZ$f&jO!^$/w!^!_$0_!_#i$/w#i#j$0d#j#l$/w#l#m$2V#m#o$/w#o#p$0_#p;'S$/w;'S;=`$4b<%lO$/w(n$0OT^#S$f&jO!^&c!_#o&c#p;'S&c;'S;=`&w<%lO&c#S$0dO^#S(n$0i[$f&jO!Q&c!Q![$1_![!^&c!_!c&c!c!i$1_!i#T&c#T#Z$1_#Z#o&c#o#p$3u#p;'S&c;'S;=`&w<%lO&c(n$1dZ$f&jO!Q&c!Q![$2V![!^&c!_!c&c!c!i$2V!i#T&c#T#Z$2V#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$2[Z$f&jO!Q&c!Q![$2}![!^&c!_!c&c!c!i$2}!i#T&c#T#Z$2}#Z#o&c#p;'S&c;'S;=`&w<%lO&c(n$3SZ$f&jO!Q&c!Q![$/w![!^&c!_!c&c!c!i$/w!i#T&c#T#Z$/w#Z#o&c#p;'S&c;'S;=`&w<%lO&c#S$3xR!Q![$4R!c!i$4R#T#Z$4R#S$4US!Q![$4R!c!i$4R#T#Z$4R#q#r$0_(n$4eP;=`<%l$/w!2r$4s_!V!+S$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z%#S$5}`#v$Id$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z&,v$7[_$f&j(Op(R!b(X&%WOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS$8jk$f&j(Op(R!b'{&;d$[#t([!LYOY%ZYZ&cZr%Zrs&}st%Ztu$8Zuw%Zwx(rx}%Z}!O$:_!O!Q%Z!Q![$8Z![!^%Z!^!_*g!_!c%Z!c!}$8Z!}#O%Z#O#P&c#P#R%Z#R#S$8Z#S#T%Z#T#o$8Z#o#p*g#p$g%Z$g;'S$8Z;'S;=`$<e<%lO$8Z+d$:jk$f&j(Op(R!b$[#tOY%ZYZ&cZr%Zrs&}st%Ztu$:_uw%Zwx(rx}%Z}!O$:_!O!Q%Z!Q![$:_![!^%Z!^!_*g!_!c%Z!c!}$:_!}#O%Z#O#P&c#P#R%Z#R#S$:_#S#T%Z#T#o$:_#o#p*g#p$g%Z$g;'S$:_;'S;=`$<_<%lO$:_+d$<bP;=`<%l$:_(CS$<hP;=`<%l$8Z!5p$<tX![!3l(Op(R!bOY*gZr*grs'}sw*gwx)rx#O*g#P;'S*g;'S;=`+Z<%lO*g&CO$=la(o&;`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_!`Ka!`#O%Z#O#P&c#P#o%Z#o#p*g#p#q$+^#q;'S%Z;'S;=`+a<%lO%Z%#`$?O_!Z$I`r`$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(r$@Y_!pS$f&j(Op(R!bOY%ZYZ&cZr%Zrs&}sw%Zwx(rx!^%Z!^!_*g!_#O%Z#O#P&c#P#o%Z#o#p*g#p;'S%Z;'S;=`+a<%lO%Z(CS$Aj|$f&j(Op(R!b't(;d$Y#t'{&;d([!LYOX%ZXY+gYZ&cZ[+g[p%Zpq+gqr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$f%Z$f$g+g$g#BYEr#BY#BZ$AX#BZ$ISEr$IS$I_$AX$I_$JTEr$JT$JU$AX$JU$KVEr$KV$KW$AX$KW&FUEr&FU&FV$AX&FV;'SEr;'S;=`I|<%l?HTEr?HT?HU$AX?HUOEr(CS$Duk$f&j(Op(R!b'u(;d$Y#t'{&;d([!LYOY%ZYZ&cZr%Zrs&}st%ZtuEruw%Zwx(rx}%Z}!OGv!O!Q%Z!Q![Er![!^%Z!^!_*g!_!c%Z!c!}Er!}#O%Z#O#P&c#P#R%Z#R#SEr#S#T%Z#T#oEr#o#p*g#p$g%Z$g;'SEr;'S;=`I|<%lOEr",
      tokenizers: [
        u1,
        d1,
        p1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        f1,
        new wi(
          "$S~RRtu[#O#Pg#S#T#|~_P#o#pb~gOt~~jVO#i!P#i#j!U#j#l!P#l#m!q#m;'S!P;'S;=`#v<%lO!P~!UO!R~~!XS!Q![!e!c!i!e#T#Z!e#o#p#Z~!hR!Q![!q!c!i!q#T#Z!q~!tR!Q![!}!c!i!}#T#Z!}~#QR!Q![!P!c!i!P#T#Z!P~#^R!Q![#g!c!i#g#T#Z#g~#jS!Q![#g!c!i#g#T#Z#g#q#r!P~#yP;=`<%l!P~$RO(Z~~",
          141,
          332
        ),
        new wi("j~RQYZXz{^~^O'x~~aP!P!Qd~iO'y~~", 25, 315),
      ],
      topRules: {
        Script: [0, 6],
        SingleExpression: [1, 269],
        SingleClassItem: [2, 270],
      },
      dialects: { jsx: 0, ts: 14602 },
      dynamicPrecedences: { 69: 1, 79: 1, 81: 1, 165: 1, 193: 1 },
      specialized: [
        { term: 319, get: (n) => m1[n] || -1 },
        { term: 334, get: (n) => g1[n] || -1 },
        { term: 70, get: (n) => y1[n] || -1 },
      ],
      tokenPrec: 14626,
    });
  var ed = [
      we("function ${name}(${params}) {\n	${}\n}", {
        label: "function",
        detail: "definition",
        type: "keyword",
      }),
      we("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n	${}\n}", {
        label: "for",
        detail: "loop",
        type: "keyword",
      }),
      we("for (let ${name} of ${collection}) {\n	${}\n}", {
        label: "for",
        detail: "of loop",
        type: "keyword",
      }),
      we("do {\n	${}\n} while (${})", {
        label: "do",
        detail: "loop",
        type: "keyword",
      }),
      we("while (${}) {\n	${}\n}", {
        label: "while",
        detail: "loop",
        type: "keyword",
      }),
      we(
        `try {
	\${}
} catch (\${error}) {
	\${}
}`,
        { label: "try", detail: "/ catch block", type: "keyword" }
      ),
      we("if (${}) {\n	${}\n}", {
        label: "if",
        detail: "block",
        type: "keyword",
      }),
      we(
        `if (\${}) {
	\${}
} else {
	\${}
}`,
        { label: "if", detail: "/ else block", type: "keyword" }
      ),
      we(
        `class \${name} {
	constructor(\${params}) {
		\${}
	}
}`,
        { label: "class", detail: "definition", type: "keyword" }
      ),
      we('import {${names}} from "${module}"\n${}', {
        label: "import",
        detail: "named",
        type: "keyword",
      }),
      we('import ${name} from "${module}"\n${}', {
        label: "import",
        detail: "default",
        type: "keyword",
      }),
    ],
    b1 = ed.concat([
      we("interface ${name} {\n	${}\n}", {
        label: "interface",
        detail: "definition",
        type: "keyword",
      }),
      we("type ${name} = ${type}", {
        label: "type",
        detail: "definition",
        type: "keyword",
      }),
      we("enum ${name} {\n	${}\n}", {
        label: "enum",
        detail: "definition",
        type: "keyword",
      }),
    ]),
    Hu = new ps(),
    td = new Set([
      "Script",
      "Block",
      "FunctionExpression",
      "FunctionDeclaration",
      "ArrowFunction",
      "MethodDeclaration",
      "ForStatement",
    ]);
  function yn(n) {
    return (e, t) => {
      let i = e.node.getChild("VariableDefinition");
      return i && t(i, n), !0;
    };
  }
  var w1 = ["FunctionDeclaration"],
    S1 = {
      FunctionDeclaration: yn("function"),
      ClassDeclaration: yn("class"),
      ClassExpression: () => !0,
      EnumDeclaration: yn("constant"),
      TypeAliasDeclaration: yn("type"),
      NamespaceDeclaration: yn("namespace"),
      VariableDefinition(n, e) {
        n.matchContext(w1) || e(n, "variable");
      },
      TypeDefinition(n, e) {
        e(n, "type");
      },
      __proto__: null,
    };
  function id(n, e) {
    let t = Hu.get(e);
    if (t) return t;
    let i = [],
      s = !0;
    function r(o, l) {
      let a = n.sliceString(o.from, o.to);
      i.push({ label: a, type: l });
    }
    return (
      e.cursor(ee.IncludeAnonymous).iterate((o) => {
        if (s) s = !1;
        else if (o.name) {
          let l = S1[o.name];
          if ((l && l(o, r)) || td.has(o.name)) return !1;
        } else if (o.to - o.from > 8192) {
          for (let l of id(n, o.node)) i.push(l);
          return !1;
        }
      }),
      Hu.set(e, i),
      i
    );
  }
  var Ku = /^[\w$\xa1-\uffff][\w$\d\xa1-\uffff]*$/,
    nd = [
      "TemplateString",
      "String",
      "RegExp",
      "LineComment",
      "BlockComment",
      "VariableDefinition",
      "TypeDefinition",
      "Label",
      "PropertyDefinition",
      "PropertyName",
      "PrivatePropertyDefinition",
      "PrivatePropertyName",
      ".",
      "?.",
    ];
  function x1(n) {
    let e = te(n.state).resolveInner(n.pos, -1);
    if (nd.indexOf(e.name) > -1) return null;
    let t =
      e.name == "VariableName" ||
      (e.to - e.from < 20 && Ku.test(n.state.sliceDoc(e.from, e.to)));
    if (!t && !n.explicit) return null;
    let i = [];
    for (let s = e; s; s = s.parent)
      td.has(s.name) && (i = i.concat(id(n.state.doc, s)));
    return { options: i, from: t ? e.from : n.pos, validFor: Ku };
  }
  var ut = ws.define({
      name: "javascript",
      parser: Fu.configure({
        props: [
          tl.add({
            IfStatement: Ps({ except: /^\s*({|else\b)/ }),
            TryStatement: Ps({ except: /^\s*({|catch\b|finally\b)/ }),
            LabeledStatement: zc,
            SwitchBody: (n) => {
              let e = n.textAfter,
                t = /^\s*\}/.test(e),
                i = /^\s*(case|default)\b/.test(e);
              return n.baseIndent + (t ? 0 : i ? 1 : 2) * n.unit;
            },
            Block: _c({ closing: "}" }),
            ArrowFunction: (n) => n.baseIndent + n.unit,
            "TemplateString BlockComment": () => null,
            "Statement Property": Ps({ except: /^{/ }),
            JSXElement(n) {
              let e = /^\s*<\//.test(n.textAfter);
              return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
            },
            JSXEscape(n) {
              let e = /\s*\}/.test(n.textAfter);
              return n.lineIndent(n.node.from) + (e ? 0 : n.unit);
            },
            "JSXOpenTag JSXSelfClosingTag"(n) {
              return n.column(n.node.from) + n.unit;
            },
          }),
          il.add({
            "Block ClassBody SwitchBody EnumBody ObjectExpression ArrayExpression ObjectType":
              Uc,
            BlockComment(n) {
              return { from: n.from + 2, to: n.to - 2 };
            },
          }),
        ],
      }),
      languageData: {
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
        indentOnInput: /^\s*(?:case |default:|\{|\}|<\/)$/,
        wordChars: "$",
      },
    }),
    sd = {
      test: (n) => /^JSX/.test(n.name),
      facet: el({ commentTokens: { block: { open: "{/*", close: "*/}" } } }),
    },
    k1 = ut.configure({ dialect: "ts" }, "typescript"),
    Q1 = ut.configure({
      dialect: "jsx",
      props: [Qs.add((n) => (n.isTop ? [sd] : void 0))],
    }),
    v1 = ut.configure(
      { dialect: "jsx ts", props: [Qs.add((n) => (n.isTop ? [sd] : void 0))] },
      "typescript"
    ),
    rd = (n) => ({ label: n, type: "keyword" }),
    od =
      "break case const continue default delete export extends false finally in instanceof let new return static super switch this throw true typeof var yield"
        .split(" ")
        .map(rd),
    P1 = od.concat(
      ["declare", "implements", "private", "protected", "public"].map(rd)
    );
  function ld(n = {}) {
    let e = n.jsx ? (n.typescript ? v1 : Q1) : n.typescript ? k1 : ut,
      t = n.typescript ? b1.concat(P1) : ed.concat(od);
    return new Ss(e, [
      ut.data.of({ autocomplete: bu(nd, Yl(t)) }),
      ut.data.of({ autocomplete: x1 }),
      n.jsx ? C1 : [],
    ]);
  }
  function $1(n) {
    for (;;) {
      if (
        n.name == "JSXOpenTag" ||
        n.name == "JSXSelfClosingTag" ||
        n.name == "JSXFragmentTag"
      )
        return n;
      if (n.name == "JSXEscape" || !n.parent) return null;
      n = n.parent;
    }
  }
  function Ju(n, e, t = n.length) {
    for (let i = e?.firstChild; i; i = i.nextSibling)
      if (
        i.name == "JSXIdentifier" ||
        i.name == "JSXBuiltin" ||
        i.name == "JSXNamespacedName" ||
        i.name == "JSXMemberExpression"
      )
        return n.sliceString(i.from, Math.min(i.to, t));
    return "";
  }
  var Z1 =
      typeof navigator == "object" && /Android\b/.test(navigator.userAgent),
    C1 = v.inputHandler.of((n, e, t, i, s) => {
      if (
        (Z1 ? n.composing : n.compositionStarted) ||
        n.state.readOnly ||
        e != t ||
        (i != ">" && i != "/") ||
        !ut.isActiveAt(n.state, e, -1)
      )
        return !1;
      let r = s(),
        { state: o } = r,
        l = o.changeByRange((a) => {
          var h;
          let { head: c } = a,
            f = te(o).resolveInner(c - 1, -1),
            u;
          if (
            (f.name == "JSXStartTag" && (f = f.parent),
            !(
              o.doc.sliceString(c - 1, c) != i ||
              (f.name == "JSXAttributeValue" && f.to > c)
            ))
          ) {
            if (i == ">" && f.name == "JSXFragmentTag")
              return { range: a, changes: { from: c, insert: "</>" } };
            if (i == "/" && f.name == "JSXStartCloseTag") {
              let d = f.parent,
                p = d.parent;
              if (
                p &&
                d.from == c - 2 &&
                ((u = Ju(o.doc, p.firstChild, c)) ||
                  ((h = p.firstChild) === null || h === void 0
                    ? void 0
                    : h.name) == "JSXFragmentTag")
              ) {
                let g = `${u}>`;
                return {
                  range: w.cursor(c + g.length, -1),
                  changes: { from: c, insert: g },
                };
              }
            } else if (i == ">") {
              let d = $1(f);
              if (
                d &&
                !/^\/?>|^<\//.test(o.doc.sliceString(c, c + 2)) &&
                (u = Ju(o.doc, d, c))
              )
                return { range: a, changes: { from: c, insert: `</${u}>` } };
            }
          }
          return { range: a };
        });
      return l.changes.empty
        ? !1
        : (n.dispatch([
            r,
            o.update(l, { userEvent: "input.complete", scrollIntoView: !0 }),
          ]),
          !0);
    });
  var T1 = "#e5c07b",
    ad = "#e06c75",
    A1 = "#56b6c2",
    R1 = "#ffffff",
    lr = "#abb2bf",
    ta = "#7d8799",
    Y1 = "#61afef",
    W1 = "#98c379",
    hd = "#d19a66",
    X1 = "#c678dd",
    M1 = "#21252b",
    cd = "#2c313a",
    fd = "#282c34",
    ea = "#353a42",
    E1 = "#3E4451",
    ud = "#528bff";
  var D1 = v.theme(
      {
        "&": { color: lr, backgroundColor: fd },
        ".cm-content": { caretColor: ud },
        ".cm-cursor, .cm-dropCursor": { borderLeftColor: ud },
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
          { backgroundColor: E1 },
        ".cm-panels": { backgroundColor: M1, color: lr },
        ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
        ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
        ".cm-searchMatch": {
          backgroundColor: "#72a1ff59",
          outline: "1px solid #457dff",
        },
        ".cm-searchMatch.cm-searchMatch-selected": {
          backgroundColor: "#6199ff2f",
        },
        ".cm-activeLine": { backgroundColor: "#6699ff0b" },
        ".cm-selectionMatch": { backgroundColor: "#aafe661a" },
        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket":
          { backgroundColor: "#bad0f847" },
        ".cm-gutters": { backgroundColor: fd, color: ta, border: "none" },
        ".cm-activeLineGutter": { backgroundColor: cd },
        ".cm-foldPlaceholder": {
          backgroundColor: "transparent",
          border: "none",
          color: "#ddd",
        },
        ".cm-tooltip": { border: "none", backgroundColor: ea },
        ".cm-tooltip .cm-tooltip-arrow:before": {
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
        },
        ".cm-tooltip .cm-tooltip-arrow:after": {
          borderTopColor: ea,
          borderBottomColor: ea,
        },
        ".cm-tooltip-autocomplete": {
          "& > ul > li[aria-selected]": { backgroundColor: cd, color: lr },
        },
      },
      { dark: !0 }
    ),
    j1 = ci.define([
      { tag: O.keyword, color: X1 },
      {
        tag: [O.name, O.deleted, O.character, O.propertyName, O.macroName],
        color: ad,
      },
      { tag: [O.function(O.variableName), O.labelName], color: Y1 },
      { tag: [O.color, O.constant(O.name), O.standard(O.name)], color: hd },
      { tag: [O.definition(O.name), O.separator], color: lr },
      {
        tag: [
          O.typeName,
          O.className,
          O.number,
          O.changed,
          O.annotation,
          O.modifier,
          O.self,
          O.namespace,
        ],
        color: T1,
      },
      {
        tag: [
          O.operator,
          O.operatorKeyword,
          O.url,
          O.escape,
          O.regexp,
          O.link,
          O.special(O.string),
        ],
        color: A1,
      },
      { tag: [O.meta, O.comment], color: ta },
      { tag: O.strong, fontWeight: "bold" },
      { tag: O.emphasis, fontStyle: "italic" },
      { tag: O.strikethrough, textDecoration: "line-through" },
      { tag: O.link, color: ta, textDecoration: "underline" },
      { tag: O.heading, fontWeight: "bold", color: ad },
      { tag: [O.atom, O.bool, O.special(O.variableName)], color: hd },
      { tag: [O.processingInstruction, O.string, O.inserted], color: W1 },
      { tag: O.invalid, color: R1 },
    ]),
    dd = [D1, Zs(j1)];
  var pd = () =>
    `
floppy({
  fullscreen: true,
  antialias: false
});

function init () {
  color = 0
  x = CENTERX
  y = CENTERY
}

function update (dt) {
  color = ELAPSED * 32 % 16

  if (TAPPED) {
    x = TAPX
    y = TAPY
    sfx(7)
  }

  radius = rand() * y
}

function draw () {
  clear(0)
  circ(x, y, radius, color)
}
`.trim() +
    `
`;
  var Od = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Floppy Editor</title>
    <style>
      html, body {height: 100%}
      body {margin: 0}
      #err {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: blue;
        color: white;
        font-weight: bold;
        font-family: monospace;
        padding: 1em;
        font-size: 2em;
        z-index: 1000;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div id="err" style="display:none"></div>
    <script>
      // catch errors
      const err = document.getElementById('err')
      window.addEventListener('error', (ev) => {
        err.textContent = ev.message + ' in line ' + (ev.lineno - 38)
        err.style.display = 'block'
      })
    <\/script>
    <script>{library}<\/script>
    <script>{game}<\/script>
  </body>
</html>`.trim();
  function ia(n) {
    let e = n.matchBefore(/\w*/);
    return e.from == e.to && !n.explicit
      ? null
      : {
          from: e.from,
          options: [
            {
              label: "CANVAS",
              type: "constant",
              info: "game canvas HTML element",
            },
            {
              label: "PARENT",
              type: "constant",
              info: "the parent element of the game canvas",
            },
            {
              label: "WIDTH",
              type: "variable",
              info: "width of the game screen",
            },
            {
              label: "HEIGHT",
              type: "variable",
              info: "height of the game screen",
            },
            {
              label: "TAPPED",
              type: "variable",
              info: "true when the game screen is tapped",
            },
            {
              label: "TAPPING",
              type: "variable",
              info: "true when the game screen is holding the mouse/touch",
            },
            { label: "TAPX", type: "variable", info: "position X of the tap" },
            { label: "TAPY", type: "variable", info: "position Y of the tap" },
            {
              label: "ELAPSED",
              type: "variable",
              info: "seconds since the game started",
            },
            { label: "FPS", type: "variable", info: "frames per second" },
            {
              label: "CENTERX",
              type: "variable",
              info: "middle X of the game screen",
            },
            {
              label: "CENTERY",
              type: "variable",
              info: "middle Y of the game screen",
            },
            {
              label: "CANVAS.ctx",
              type: "constant",
              info: "canvas rendering 2d context",
            },
            {
              label: "clear",
              type: "function",
              apply: "clear(",
              detail: "(color = null)",
              info: "clear the game screen",
            },
            {
              label: "rect",
              type: "function",
              apply: "rect(",
              detail: "(x, y, width, height, color = 0)",
            },
            {
              label: "rectfill",
              type: "function",
              apply: "rectfill(",
              detail: "(x, y, width, height, color = 0)",
            },
            {
              label: "circle",
              type: "function",
              apply: "circ(",
              detail: "(x, y, radius, color = 0)",
            },
            {
              label: "circlefill",
              type: "function",
              apply: "circfill(",
              detail: "(x, y, radius, color = 0)",
            },
            {
              label: "oval",
              type: "function",
              apply: "oval(",
              detail: "(x, y, rx, ry, color = 0)",
            },
            {
              label: "ovalfill",
              type: "function",
              apply: "ovalfill(",
              detail: "(x, y, rx, ry, color = 0)",
            },
            {
              label: "triangle",
              type: "function",
              apply: "triangle(",
              detail: "(x1, y1, x2, y2, x3, y3, color = 0)",
            },
            {
              label: "trianglefill",
              type: "function",
              apply: "trianglefill(",
              detail: "(x1, y1, x2, y2, x3, y3, color = 0)",
            },
            {
              label: "poly",
              type: "function",
              apply: "poly([",
              detail: "(points, color = 0)",
            },
            {
              label: "polyfill",
              type: "function",
              apply: "polyfill([",
              detail: "(points, color = 0)",
            },
            {
              label: "line",
              type: "function",
              apply: "line(",
              detail: "(x, y, rx, ry, color = 0)",
            },
            {
              label: "linestyle",
              type: "function",
              apply: "linestyle(",
              detail: "(lineWidth, lineJoin, lineDash)",
            },
            {
              label: "text",
              type: "function",
              apply: "text(",
              detail:
                "(x, y, text, color = 0, size = null, font = 'monospace')",
            },
            {
              label: "textalign",
              type: "function",
              apply: "textalign(",
              detail: "(align = 'left', baseline = 'top')",
            },
            {
              label: "image",
              type: "function",
              apply: "image(",
              detail: "(x, y, image)",
            },
            {
              label: "paint",
              type: "function",
              apply: "paint(",
              detail: "(width, height, draw)",
              info: "Creates a offscreen canvas to draw on it",
            },
            {
              label: "transform",
              type: "function",
              apply: "transform(",
              detail: "(translateX, translateY, scale = 1, angle = 0)",
            },
            {
              label: "push",
              type: "function",
              apply: "push()",
              detail: "",
              info: "save the rendering context",
            },
            {
              label: "pop",
              type: "function",
              apply: "pop()",
              detail: "",
              info: "restore the rendering context",
            },
            {
              label: "sfx",
              type: "function",
              apply: "sfx(0)",
              detail: "(sound = 0, volume = 1, pitch = 0, randomness = 0)",
            },
            {
              label: "rand",
              type: "function",
              apply: "rand()",
              detail: "",
            },
            {
              label: "randi",
              type: "function",
              apply: "randi()",
              detail: "(min = 1, max = 100)",
            },
            {
              label: "clamp",
              type: "function",
              apply: "clamp(",
              detail: "(value, min, max)",
            },
            {
              label: "lerp",
              type: "function",
              apply: "lerp(",
              detail: "(a, b, t)",
              info: "Calculates a linear (interpolation) value from 'a' to 'b' over 't'.",
            },
            {
              label: "deg2rad",
              type: "function",
              apply: "deg2rad(",
              detail: "(degrees)",
            },
            {
              label: "rad2deg",
              type: "function",
              apply: "rad2deg(",
              detail: "(radians)",
            },
            {
              label: "sin",
              type: "function",
              apply: "sin(",
              detail: "(radians)",
            },
            {
              label: "cos",
              type: "function",
              apply: "cos(",
              detail: "(radians)",
            },
            {
              label: "abs",
              type: "function",
              apply: "abs(",
              detail: "(value)",
            },
          ],
        };
  }
  function na(n) {
    let e = 0,
      t = 0,
      i = n.dom.parentNode,
      s = [
        {
          name: "indent",
          label:
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>',
          callback: Ms,
        },
        { name: "toggle comment", label: "//", callback: al },
        {
          name: "undo",
          label:
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>',
          callback: Rs,
        },
        {
          name: "redo",
          label:
            '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>',
          callback: an,
        },
      ],
      r = document.createElement("div");
    r.classList.add("mobile-buttons"), (r.style.display = "none");
    for (let f of s) {
      let u = document.createElement("button"),
        d = f.focus == null ? !0 : f.focus;
      (u.innerHTML = f.label),
        u.setAttribute("title", f.name),
        u.setAttribute("aria-label", f.name),
        u.setAttribute("data-focus", d ? "true" : "false"),
        u.addEventListener("click", (p) => {
          p.preventDefault(), f.callback(n), d && n.contentDOM.focus();
        }),
        r.appendChild(u);
    }
    i.appendChild(r), requestAnimationFrame(l);
    function o(f) {
      t && cancelAnimationFrame(t), (t = requestAnimationFrame(l));
    }
    visualViewport.addEventListener("resize", o),
      visualViewport.addEventListener("scroll", o);
    function l() {
      clearTimeout(e), (t = !1), (viewport = window.visualViewport);
      let f = a(),
        u = r.getBoundingClientRect(),
        d = 1 / viewport.scale;
      (x = viewport.offsetLeft),
        (y = viewport.height + viewport.offsetTop - u.height),
        (r.style.transform = `translate(${x}px, ${y}px) scale(${d})`),
        viewport.height < f.height && d >= 0.98 ? c() : h();
    }
    n.contentDOM.addEventListener("click", () => {
      c();
    }),
      n.contentDOM.addEventListener("focus", () => {
        c();
      });
    function a() {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      };
    }
    function h() {
      r.style.display = "none";
    }
    function c() {
      r.style.display = "";
    }
  }
  var q1 = new URL(location);
  q1.searchParams.get("reset") !== null &&
    (N1(), (window.location = location.origin));
  var md = [],
    gd = document.querySelector(".code"),
    yd = document.querySelector(".game"),
    ra = document.querySelector(".play"),
    B1 = document.querySelector(".stop"),
    bd = document.querySelector("#frame"),
    wd = innerWidth < 1024,
    V1 = navigator.userAgent.match(/android|iphone|ipad/i) !== null,
    sa = null;
  ra.style.display = "none";
  fetch("floppy.js")
    .then((n) => n.text())
    .then((n) => {
      (sa = n), (ra.style.display = ""), wd || ar();
    });
  ra.addEventListener("click", () => {
    ar(), (gd.style.display = "none"), (yd.style.display = "block");
  });
  B1.addEventListener("click", Sd);
  document.addEventListener("backbutton", Sd);
  function Sd(n) {
    n.preventDefault(),
      (gd.style.display = "block"),
      (yd.style.display = "none"),
      (bd.srcdoc = "");
  }
  function ar() {
    if (!sa) return;
    let n = codeEditor.state.doc.toString(),
      e = Od.replace(/{game}/, n);
    (e = e.replace(/{library}/, sa)), (bd.srcdoc = e);
  }
  if (!wd) {
    let t = function (i) {
        i.docChanged &&
          (n && (clearTimeout(n), (n = 0)), (n = setTimeout(ar, e)));
      },
      n = 0,
      e = 1e3;
    md.push(v.updateListener.of(t));
  }
  var I1 = V.create({
    doc: _1() || pd(),
    extensions: [
      Bu,
      bt.of([
        Hf,
        {
          key: "Ctrl-s",
          run() {
            return ar(), !0;
          },
        },
      ]),
      dd,
      ld(),
      ut.data.of({ autocomplete: ia }),
      v.theme({
        "&": { height: "100%" },
        ".cm-scroller": { overflow: "auto" },
      }),
      v.lineWrapping,
      ...md,
    ],
  });
  window.codeEditor = new v({
    state: I1,
    parent: document.querySelector(".code"),
  });
  var L1 = 5e3;
  setInterval(() => {
    localStorage.setItem("floppy_code", codeEditor.state.doc.toString());
  }, L1);
  function _1() {
    return localStorage.getItem("floppy_code");
  }
  function N1() {
    localStorage.clear();
  }
  "serviceWorker" in navigator &&
    (location.hostname !== "127.0.0.1" ||
      location.search.includes("debug_sw")) &&
    navigator.serviceWorker.register("sw.js");
  V1 && na(codeEditor);
})();
