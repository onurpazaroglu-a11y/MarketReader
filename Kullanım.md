## 🧭Chrome Extensions sayfasını aç

Adres çubuğuna şunu yaz:
chrome://extensions
Enter.

## 🛠 Developer Mode’u aç

Sağ üst köşede:
Developer mode → ON
Bu olmadan “Load unpacked” görünmez.

## 📦 Load unpacked (en kritik adım)

Sol üstte Load unpacked butonuna tıkla
MarketReader klasörünü seç
içindeki manifest.json görünen klasör
❌ background/ veya popup/ seçme
✅ MarketReader/

## ✅ Kurulum tamam

Eğer her şey doğruysa:
MarketReader kartı görünür
Hata yok
Sağ üstte puzzle (🧩) ikonunda listelenir

### 🧪 Çalıştığını test et

A) Test edilecek siteyi aç
Örn:
PocketOption (demo veya real fark etmez)

B) Popup’ı aç
🧩 → MarketReader
Pair gir:
eur_usd
Start tıkla

C) Kontrol et
Popup’ta tick satırları akmaya başlar
Console’da (isteğe bağlı):
Site tabında → window.__marketReaderWSHooked === true

### 🔍 Sorun giderme (altın değerinde)
❌ Tick gelmiyorsa:
Sayfayı yenile (çok önemli)
WS erken açılmış olabilir
document_start bu yüzden var
❌ Extension görünmüyorsa:
Yanlış klasör seçilmiş
manifest.json kökte değil
❌ Console hatası varsa:
background.js → type: module var mı?
Import path’ler doğru mu?

### 🧠 Hatırlatma (önemli)

Extension kapalıyken veri almaz
Tab açık kalmalı
Plugin WebSocket açmaz, sadece dinler