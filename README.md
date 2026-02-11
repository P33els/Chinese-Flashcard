# 📚 Chinese Flashcard - HSK Vocabulary

แอปพลิเคชันเว็บสำหรับท่องศัพท์ภาษาจีน HSK พร้อมระบบ Spaced Repetition (SRS) และ UX/UI ที่เป็นมืออาชีพ

![Chinese Flashcard](https://img.shields.io/badge/HSK-Vocabulary-red)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-3.1.0-green)

**Created by PRNXT**

---

## 🆕 Patch Update v3.1.0 (Feb 12, 2026)

### 🙈 Blur Study Mode
- ✅ **Blur Dropdown** - เลือกเบลอตัวจีน, พินอิน, หรือคำแปลแยกกันได้
- ✅ **Multi-select** - เบลอหลายคอลัมน์พร้อมกัน
- ✅ **Mobile Tap** - แตะเปิดดู แตะซ้ำเบลอกลับ
- ✅ **Desktop Hover** - เลื่อนเมาส์เปิดดูอัตโนมัติ

### 🎨 Warm Crimson + Charcoal Theme
- ✅ **Crimson Accent** - สีแดง Crimson (#f87171) สำหรับ accent หลัก
- ✅ **Purple Pinyin** - สีม่วง (#a78bfa) สำหรับพินอิน
- ✅ **Eye-Friendly Hanzi** - สีครีมอุ่น (#f5f0e8) สำหรับตัวจีนทุกหน้า
- ✅ **Charcoal Background** - พื้นหลัง Zinc (#18181b) สะอาดตา
- ✅ **Dark & Light Mode** - รองรับทั้งสองโหมด

### 🧹 Data Cleanup
- ✅ **Deduplication** - ลบคำศัพท์ซ้ำ 110 คำ (1,231 → 1,121)
- ✅ **A-Z Sorting** - เรียงตามพินอินอัตโนมัติ

### 📱 Mobile Fixes
- ✅ **Tap Highlight Removed** - ลบสีฟ้าเมื่อแตะบนมือถือ
- ✅ **Blur Touch Fix** - แก้เบลอค้างบน touch devices

### Previous Updates

#### v3.0.0 (Feb 11, 2026)
- 🔍 **Search Modal** - ค้นหาคำศัพท์แบบ Modal (Ctrl+K)
- 📋 **Vocabulary Table** - หน้าตารางคำศัพท์ทั้งหมด
- 🎨 **UI Redesign v3.0** - Premium UI, Inter Font, Glassmorphism
- 🌗 **Dark/Light Theme** - ระบบธีมสว่าง/มืด + localStorage

#### v2.1.0 (Jan 18, 2026)

### UX/UI Improvements
- ✅ **Loading Screen** - เพิ่ม loading animation พร้อม spinner แบบมืออาชีพ
- ✅ **Focus States** - ทุกปุ่มมี focus ring สำหรับ keyboard navigation (Accessibility)
- ✅ **ARIA Labels** - เพิ่ม labels สำหรับ screen readers รองรับผู้พิการ
- ✅ **Visual Hierarchy** - ปุ่มตอบคำถามขนาด 96px พร้อม emoji และ shortcut display
- ✅ **Smooth Transitions** - ใช้ cubic-bezier easing สำหรับ animations ที่ลื่นไหล
- ✅ **8px Grid System** - spacing และ padding ที่สม่ำเสมอ
- ✅ **Color Contrast** - ปรับสีให้มีความคมชัดและมีความหมาย:
  - 🔴 จำไม่ได้: #c41e3a (แดงเข้ม)
  - 🟡 ไม่แน่ใจ: #d4af37 (ทอง)
  - 🟢 จำได้: #2d7a3e (เขียวเข้ม)
- ✅ **Enhanced Button States**:
  - Shimmer effect บน hover
  - Scale feedback บน active
  - 3px focus outline rings
  - Gradient backgrounds
- ✅ **Keyboard Shortcuts Enhancement**:
  - เพิ่ม Enter key สำหรับพลิกการ์ด
  - preventDefault() ป้องกัน browser default
  - ป้องกันการทำงานเมื่อพิมพ์ใน input/textarea

### Previous Updates

#### v2.0.0 (Jan 2026)
- 🧠 **Spaced Repetition System (SM-2)** - อัลกอริทึม SuperMemo-2
- 📱 **Mobile Responsive** - รองรับ tablet (768px), mobile (480px), landscape
- 👆 **Touch Gestures** - swipe ซ้าย/ขวาเพื่อเปลี่ยนการ์ด
- 💾 **Session Persistence** - จำตำแหน่งและ filter หลัง refresh
- 🎯 **Touch-Friendly** - ปุ่มขนาดใหญ่ 60px, touch targets 48x48px
- 🐛 **Bug Fixes**:
  - แก้ rapid clicking bug ด้วย isProcessing flag
  - แก้ progress bar NaN issue
  - เพิ่ม DOM element validation

---

## ✨ ฟีเจอร์หลัก

### 🀄 Flashcard แบบพลิกได้
- **ด้านหน้า**: แสดงตัวอักษรจีน (汉字)
- **ด้านหลัง**: พินอิน, ความหมาย, ตัวอย่างประโยค และหมายเหตุ

### 🧠 ระบบ Spaced Repetition (SRS)
- **SM-2 Algorithm** - อัลกอริทึมจาก SuperMemo-2
- **🆕 คำใหม่** - ยังไม่เคยทบทวน
- **⏰ ถึงเวลา** - ต้องทบทวนวันนี้ (pulse animation)
- **📅 เร็วๆ นี้** - จะถึงเวลาใน 2 วัน
- **✅ อนาคต** - กำหนดทบทวนในอนาคต
- **Auto-advance** - เปลี่ยนการ์ดอัตโนมัติหลังตอบ (800ms)

### 🔊 ระบบเสียง
- ฟังเสียงอ่านภาษาจีนผ่าน Web Speech API
- รองรับเสียงภาษาจีนกลาง (Mandarin)

### 📝 ดูลำดับขีด (Stroke Order)
- แสดงลำดับการเขียนตัวอักษรจีนด้วย HanziWriter
- คลิกที่ตัวอักษรเพื่อดูแอนิเมชันซ้ำได้

### 📊 ระบบติดตามความจำ
- **✅ จำได้** - คำที่จำได้แม่น (สีเขียว)
- **🤔 ไม่แน่ใจ** - คำที่ยังไม่มั่นใจ (สีเหลือง)
- **❌ จำไม่ได้** - คำที่ต้องทบทวน (สีแดง)
- สถิติถูกบันทึกใน localStorage (ไม่หายแม้ปิดเบราว์เซอร์)
- **Progress Bar** - แสดง % ของแต่ละสถานะแบบ real-time

### 📱 Mobile Responsive
- **Responsive Design** - รองรับ tablet (768px) และ mobile (480px)
- **Touch Gestures** - swipe ซ้าย/ขวาเพื่อเปลี่ยนการ์ด (threshold 50px)
- **Touch-Friendly** - ปุ่มขนาดใหญ่ 60px, minimum touch targets 48x48px
- **Active States** - feedback animation เมื่อแตะ (scale 0.95)
- **Native App Feel** - -webkit-tap-highlight และ smooth scrolling

### 🔀 ฟีเจอร์เพิ่มเติม
- **สุ่มลำดับการ์ด** - shuffle ด้วยปุ่มหรือ keyboard
- **กรองตามสถานะ** - แสดงเฉพาะจำได้/ไม่แน่ใจ/จำไม่ได้/ทั้งหมด
- **รีเซ็ตสถิติ** - ล้างข้อมูลและเริ่มต้นใหม่
- **Session Persistence** - จำตำแหน่งการ์ดและ filter หลัง refresh

## ⌨️ ปุ่มลัด

| ปุ่ม | การทำงาน |
|------|----------|
| `Space` / `Enter` | พลิกการ์ด |
| `←` / `ArrowLeft` | การ์ดก่อนหน้า |
| `→` / `ArrowRight` | การ์ดถัดไป |
| `1` | 🔴 จำไม่ได้ |
| `2` | 🟡 ไม่แน่ใจ |
| `3` | 🟢 จำได้ |
| `D` | ⭐ ทำเครื่องหมายคำยาก |
| `S` | 🔊 ฟังเสียง |

> **หมายเหตุ**: Keyboard shortcuts ไม่ทำงานเมื่อกำลังพิมพ์ใน input/select/textarea

## 🚀 วิธีใช้งาน

### วิธีที่ 1: เปิดไฟล์โดยตรง
เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้เลย

### วิธีที่ 2: ใช้ Live Server (แนะนำ)
```bash
# ติดตั้ง Live Server extension ใน VS Code
# คลิกขวาที่ index.html แล้วเลือก "Open with Live Server"
```

### วิธีที่ 3: ใช้ Python HTTP Server
```bash
cd flashcard
python -m http.server 8000
# เปิด http://localhost:8000
```

## 📁 โครงสร้างไฟล์

```
flashcard/
├── index.html      # หน้าเว็บหลัก (Home + Search Modal)
├── flashcard.html  # หน้า Flashcard
├── vocab.html      # หน้า Vocabulary Table + Blur Mode
├── grammar.html    # หน้า Grammar Quiz
├── listening.html  # หน้า Listening Practice
├── styles.css      # สไตล์และธีม (CSS Variables)
├── theme.js        # ระบบสลับ Dark/Light theme
├── app.js          # โลจิกของ Flashcard
├── words.js        # ข้อมูลคำศัพท์ 1,121 คำ
└── README.md       # ไฟล์นี้
```

## 📖 รูปแบบข้อมูลคำศัพท์

```json
{
  "hanzi": "你好",
  "pinyin": "nǐ hǎo",
  "meaning": "สวัสดี",
  "type": "คำทักทาย",
  "example_cn": "你好，很高兴认识你。",
  "example_th": "Nǐ hǎo, hěn gāoxìng rènshi nǐ. (สวัสดี ยินดีที่ได้รู้จัก)",
  "note": "ใช้ทักทายได้ทุกเวลา"
}
```

## 🎨 เทคโนโลยีที่ใช้

### Frontend
- **HTML5** - โครงสร้างหน้าเว็บ + ARIA labels
- **CSS3** - สไตล์และแอนิเมชัน (Flexbox, Grid, Animations)
- **JavaScript (Vanilla)** - โลจิกแอปพลิเคชัน (ES6+)

### APIs & Libraries
- **Web Speech API** - ระบบอ่านออกเสียงภาษาจีน
- **HanziWriter** - แสดงลำดับขีดตัวอักษรจีน (CDN)
- **Google Fonts** - Noto Serif SC, Noto Sans Thai

### Storage & Algorithms
- **LocalStorage** - บันทึกข้อมูล 3 keys:
  - `flashcardStats` - สถิติการจำคำ
  - `flashcardSRS` - ข้อมูล Spaced Repetition
  - `flashcardSession` - ตำแหน่งและ filter ปัจจุบัน
- **SM-2 Algorithm** - Spaced Repetition (SuperMemo-2)
  - Interval: 1 day → 6 days → exponential growth
  - Ease Factor: ปรับตามคุณภาพการจำ (3=remember, 2=not-sure, 1=forgot)

### UX/UI Design
- **8px Grid System** - spacing consistency
- **Cubic-Bezier Easing** - smooth transitions
- **Focus Management** - accessibility support
- **Touch Optimization** - 48x48px minimum targets

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Chrome Mobile | Android 8+ | ✅ Full |

### Required Features
- ES6+ JavaScript (arrow functions, destructuring, etc.)
- CSS3 (flexbox, grid, animations, transforms)
- LocalStorage API
- Web Speech API (optional - for audio)
- Touch Events API (optional - for gestures)

## ⚡ Performance

- **Loading Time**: < 1 second (with loading screen animation)
- **Bundle Size**: ~80KB (uncompressed, including 1,121 words)
- **No External Dependencies**: Vanilla JavaScript only
- **Offline Ready**: Works with `file://` protocol
- **Memory Efficient**: LocalStorage-based persistence

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 Contributing

ยินดีรับ contributions! หากต้องการปรับปรุง:

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

### Development Guidelines
- ใช้ Vanilla JavaScript (ไม่ใช้ frameworks)
- ทดสอบบน Chrome, Firefox, Safari
- รักษา code style ที่มีอยู่
- เพิ่ม comments สำหรับ logic ที่ซับซ้อน
- อัพเดท README เมื่อเพิ่มฟีเจอร์

## 📋 Changelog

### v3.1.0 (2026-02-12)
- 🙈 **Vocab**: ระบบ Blur Study Mode (เลือกเบลอคอลัมน์ได้)
- 🎨 **Theme**: Warm Crimson + Charcoal + Eye-Friendly Hanzi
- 🧹 **Data**: Dedup 1,231 → 1,121 คำ + A-Z sort
- 📱 **Mobile**: แก้ tap highlight + blur touch fix

### v3.0.0 (2026-02-11)
- 🔍 Search Modal (Ctrl+K) + Vocabulary Table
- 🎨 UI Redesign v3.0 (Premium, Glassmorphism)
- 🌗 Dark/Light Theme System

### v2.2.0 (2026-01-19)
- ⭐ **Flashcard**: ระบบทำเครื่องหมายคำยาก (Difficult Words)
- 📝 **Grammar**: เพิ่มรูปแบบคำถามให้หลากหลาย (Fill blank, Choose meaning, Arrange sentence)
- 🎧 **Listening**: แยกโหมด Word/Sentence + ปรับเป็นรูปแบบ HSK3 (ไม่มี pinyin)

### v2.1.0 (2026-01-18)
- ✨ เพิ่ม Loading screen พร้อม spinner animation
- ♿ เพิ่ม Focus states และ ARIA labels (Accessibility)
- 🎨 ปรับปรุง Visual hierarchy และ Button states
- ⌨️ ปรับปรุง Keyboard shortcuts (Enter key, preventDefault)
- 🎯 ใช้ 8px Grid System และ Cubic-bezier transitions
- 🌈 ปรับ Color contrast ให้ดีขึ้น

### v2.0.0 (2026-01-01)
- 🧠 เพิ่ม Spaced Repetition System (SM-2 Algorithm)
- 📱 Mobile responsive design (768px, 480px breakpoints)
- 👆 Touch gestures (swipe navigation)
- 💾 Session persistence (position + filter)
- 🐛 แก้ rapid clicking และ progress bar bugs
- 🗑️ ลบ Statistics modal ออก

### v1.0.0 (2025-12-01)
- 🀄 Flashcard พื้นฐาน
- 🔊 Web Speech API integration
- 📝 Stroke order display
- 📊 Basic statistics tracking
- ⌨️ Keyboard shortcuts

## 🙏 ขอบคุณ

- [HanziWriter](https://hanziwriter.org/) - ไลบรารีแสดงลำดับขีด
- [Google Fonts](https://fonts.google.com/) - ฟอนต์ภาษาจีนและไทย
- [SuperMemo](https://www.supermemo.com/) - SM-2 Algorithm

---

<div align="center">

**Made with ❤️ for Chinese learners by PRNXT**

[Report Bug](https://github.com/yourusername/flashcard/issues) · [Request Feature](https://github.com/yourusername/flashcard/issues)

</div>
