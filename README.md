# 📦 Proje Yapısı
## MarketReader

**MarketReader**, websocket üzerinden alınan veriyi **price / time (tick) data** formatıyla izleyip parite bazlı .db veritabanı ile saklayan Chrome eklentisidir.

API_KEY yok.
Ekstra istek yok.
OCR yok.
Sunucu, sadece browser görür.

---

## 🚀 Ne yapar?

- Açık browser sayfasına **mevcut WebSocket baplantılara** hook ile bağlanır
- **Tick data** verisini alır (fiyat, timestamp, parite)
- Veriyi **pair. dosyası** şeklinde kaydeder.
- Arayüz popup'ında **live echo** satırı gösterir
- Alınan veri **harici programlarda** kullanılmak üzere saklanır.

---

## 🧠 Neden MarketReader?

API'ler:
- Sınırlı
- Gecikmeli
- İzinli veya engelli
- Tutarsız
olabilirler.

MarketReader:
- Veriyi API'den değil **browserdan** alır
- Fazladan **network footprint** eklemez
- OCR verisine göre çok daha güvenilir.
- Tasarım olarak **broker-agnostic** yapıdadır.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## 📦 Project Structure

# MarketReader

MarketReader is a Chrome extension that passively listens to WebSocket traffic on trading platforms and extracts **price / time (tick) data** in a browser-native way.

No API keys.
No extra requests.
No OCR.
Just the browser behaving like a browser.

---

## 🚀 What does it do?

- Hooks into **existing WebSocket connections** opened by the webpage
- Extracts **tick data** (price, timestamp, pair)
- Saves data into **per-pair databases**
- Displays a **live echo** in the popup UI
- Designed for **external processing** (Python, candle builders, quant tools)

---

## 🧠 Why MarketReader?

APIs can be:
- Rate-limited
- Delayed
- Restricted or blocked
- Inconsistent across brokers

MarketReader:
- Uses the same data the browser already receives
- Adds **zero additional network footprint**
- Is more reliable than OCR-based solutions
- Is broker-agnostic by design

---
