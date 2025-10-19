# ⚙️ Vault CLI

**Vault** — Node.js + TypeScript tabanlı, SQLite destekli bir **komut geçmişi yöneticisi**.  
Terminalde çalıştırdığın komutları kaydeder, geçmişi listeler ve dilediğin komutu tekrar çalıştırmanı sağlar.  
Kısacası: kişisel komut geçmişi asistanın. 🚀

---

## 📦 Özellikler

- 💾 Çalıştırılan tüm komutları SQLite veritabanına kaydeder  
- 📜 `vault history` ile geçmişi listeler  
- 🔁 `vault run <id>` ile geçmişteki komutu yeniden çalıştırır  
- 🧹 `vault clear` ile geçmişi temizler  
- 👤 Her kullanıcı için ayrı geçmiş tutar (`os.username` tabanlı)  
- 🧠 TypeScript + better-sqlite3 + Clean Architecture yapısında geliştirilmiştir  

---

## 🧰 Kurulum

### 1️⃣ Depoyu klonla
```bash
git clone https://github.com/ouzsrcm/vault-cli.git
cd vault-cli
